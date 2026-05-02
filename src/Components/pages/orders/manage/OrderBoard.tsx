import { useEffect, useRef, useState, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useDispatch } from 'react-redux';
import OrderColumn from './OrderColumn';
import EditOrderOverlay from './EditOrderOverlay';
import DeleteModal from '../../../ui/Modals/DeleteModal';
import {
  useListOrdersQuery,
  useUpdateOrderStateMutation,
  useDeleteOrderMutation,
  ordersApiSlice,
} from '../../../../redux/api/ordersApi';
import { toast } from 'react-toastify';
import { OrderData } from './types';


// ---------------------------------------------------------------------------
// Default Sounds (Fallback if no custom sound is uploaded in Admin)
// ---------------------------------------------------------------------------
const DEFAULT_SOUNDS = {
  add:    'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3', // Kitchen Bell
  update: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Soft Pop
  delete: 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3', // Low interface thud
};

// ---------------------------------------------------------------------------
// Sound helper — plays a URL audio file. Falls back to default if no URL provided.
// ---------------------------------------------------------------------------
const playSound = (url: string | null | undefined, type?: keyof typeof DEFAULT_SOUNDS) => {
  try {
    let finalUrl = url;
    
    if (!finalUrl && type) {
      finalUrl = DEFAULT_SOUNDS[type];
    }

    if (!finalUrl) return;

    let baseUrl = import.meta.env.VITE_BASE_URL || '';
    baseUrl = baseUrl.replace(/^['"]|['"]$/g, '').replace(/\/$/, '');
    
    const audioUrl = finalUrl.startsWith('/') ? `${baseUrl}${finalUrl}` : finalUrl;
    
    const audio = new Audio(audioUrl);
    audio.volume = 0.6;
    audio.play().catch(err => console.error('Audio play blocked:', err));
  } catch (err) {
    console.error('Audio error:', err);
  }
};


const OrderBoard = () => {
  const { data: board } = useListOrdersQuery(undefined);
  const [updateOrderState]  = useUpdateOrderStateMutation();
  const [deleteOrder, { isLoading: deleteLoading }] = useDeleteOrderMutation();
  const dispatch = useDispatch();

  // Edit overlay state
  const [editingOrder, setEditingOrder] = useState<OrderData | null>(null);

  // Delete modal state
  const [deletingOrder, setDeletingOrder] = useState<OrderData | null>(null);

  // Track orders this user already optimistically updated, to skip WS echo
  const pendingUpdates = useRef<Set<string>>(new Set());

  // ---------------------------------------------------------------------------
  // WebSocket — real-time updates from other clients
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = import.meta.env.VITE_BASE_URL
      ? import.meta.env.VITE_BASE_URL.replace(/^http(s?):\/\//, '')
      : window.location.host;

    const ws = new WebSocket(`${wsProtocol}//${wsHost}/ws/orders/board/`);


    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { action, data, id } = message;

        // Skip echo of own actions
        const eventId = data?.id || id;
        if (eventId && pendingUpdates.current.has(eventId)) {
          pendingUpdates.current.delete(eventId);
          return;
        }

        // Update RTK Query cache
        dispatch(ordersApiSlice.util.updateQueryData('listOrders', undefined, (draft: any) => {
          if (!draft) return;

          if (action === 'add' && data) {
            const targetCol = draft.find((c: any) => c.state.id === data.state);
            if (targetCol && !targetCol.orders.find((o: any) => o.id === data.id)) {
              targetCol.orders.unshift(data);
            }
            // Play the sound of the target state (first state = new order)
            if (targetCol) playSound(targetCol.state.sound, 'add');
          }
          else if (action === 'update' && data) {
            // Remove from all, add to destination
            draft.forEach((col: any) => {
              col.orders = col.orders.filter((o: any) => o.id !== data.id);
            });
            const targetCol = draft.find((c: any) => c.state.id === data.state);
            if (targetCol) {
              targetCol.orders.unshift(data);
              playSound(targetCol.state.sound, 'update');
            }
          }
          else if (action === 'delete' && id) {
            draft.forEach((col: any) => {
              col.orders = col.orders.filter((o: any) => o.id !== id);
            });
            // For delete, play first-state sound (it signals a removal from the board)
            const firstCol = draft.find((c: any) => c.state.default);
            if (firstCol) playSound(firstCol.state.sound, 'delete');
          }
        }));

      } catch (err) {
        console.error('WS message error', err);
      }
    };

    ws.onclose = () => console.log('OrderBoard WS disconnected');
    return () => ws.close();
  }, [dispatch]);


  // ---------------------------------------------------------------------------
  // Drag & Drop
  // ---------------------------------------------------------------------------
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    pendingUpdates.current.add(draggableId);

    const movedOrder = board?.find((col: any) => col.state.id === source.droppableId)
      ?.orders.find((o: any) => o.id === draggableId);
    const destCol = board?.find((col: any) => col.state.id === destination.droppableId);

    // Optimistic cache update
    const patchResult = dispatch(
      ordersApiSlice.util.updateQueryData('listOrders', undefined, (draft: any) => {
        const srcCol  = draft.find((c: any) => c.state.id === source.droppableId);
        const dstCol  = draft.find((c: any) => c.state.id === destination.droppableId);
        if (srcCol && dstCol) {
          const [moved] = srcCol.orders.splice(source.index, 1);
          moved.state = destination.droppableId;
          dstCol.orders.splice(destination.index, 0, moved);
        }
      })
    );

    // Play sound for the acting user too (they moved it themselves)
    if (destCol) playSound(destCol.state.sound, 'update');

    try {
      await updateOrderState({ order_id: draggableId, state: destination.droppableId }).unwrap();
      if (movedOrder) {
        toast.success(`Order #${movedOrder.code || draggableId.slice(-4)} → ${destCol?.state.name}`);
      }
    } catch {
      toast.error('Failed to update order. Reverting…');
      patchResult.undo();
      pendingUpdates.current.delete(draggableId);
    }
  };


  // ---------------------------------------------------------------------------
  // Delete handler
  // ---------------------------------------------------------------------------
  const handleDeleteConfirm = useCallback(async (id: string) => {
    if (!deletingOrder) return;

    pendingUpdates.current.add(id);

    // Optimistic removal
    dispatch(
      ordersApiSlice.util.updateQueryData('listOrders', undefined, (draft: any) => {
        draft.forEach((col: any) => {
          col.orders = col.orders.filter((o: any) => o.id !== id);
        });
      })
    );

    try {
      await deleteOrder({ order_id: id }).unwrap();
      toast.success(`Order #${deletingOrder.code} deleted`);
      // Play sound locally
      const firstCol = board?.find((c: any) => c.state.default);
      if (firstCol) playSound(firstCol.state.sound, 'delete');
    } catch {
      toast.error('Failed to delete order');
      pendingUpdates.current.delete(id);
      // Refetch to restore
      dispatch(ordersApiSlice.util.invalidateTags(['orders']));
    } finally {
      setDeletingOrder(null);
    }
  }, [deletingOrder, deleteOrder, dispatch]);


  const totalOrders = board?.reduce((sum: number, col: any) => sum + (col.orders?.length || 0), 0);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Board header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-black text-neutral-900">Order Management</h1>
            <p className="text-sm text-neutral-500 mt-1 font-medium">
              Drag orders between columns to update their status
            </p>
          </div>
          <div className="px-4 py-2 bg-white border border-neutral-200 rounded-xl shadow-sm text-sm font-black text-neutral-500">
            {totalOrders} order{totalOrders !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {board?.map((col: any) => (
            <OrderColumn
              key={col.state.id}
              stateObj={col.state}
              orders={col.orders}
              colSpan={col?.cols}
              onEdit={setEditingOrder}
              onDelete={setDeletingOrder}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Edit overlay */}
      {editingOrder && (
        <EditOrderOverlay
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
        />
      )}

      {/* Delete confirmation modal */}
      <DeleteModal
        open={!!deletingOrder}
        handleClose={() => setDeletingOrder(null)}
        title={`Delete Order #${deletingOrder?.code}`}
        id={deletingOrder?.id ?? ''}
        deleteAction={handleDeleteConfirm}
        isLoading={deleteLoading}
      >
        Are you sure you want to delete this order? This action cannot be undone.
      </DeleteModal>
    </>
  );
};

export default OrderBoard;
