import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import OrderColumn from './OrderColumn';
import { useUpdateOrderStateMutation } from '../../../../redux/api/ordersApi';
import { toast } from 'react-toastify';
import { BoardColumnData } from './types';

interface Props {
  initialData: BoardColumnData[];
}

const OrderBoard: React.FC<Props> = ({ initialData }) => {
  const [board, setBoard] = useState<BoardColumnData[]>(initialData || []);
  const [updateOrderState] = useUpdateOrderStateMutation();

  useEffect(() => {
    setBoard(initialData || []);
  }, [initialData]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColIndex  = board.findIndex(col => col.state.id === source.droppableId);
    const destColIndex    = board.findIndex(col => col.state.id === destination.droppableId);

    if (sourceColIndex === -1 || destColIndex === -1) return;

    const newBoard = [...board];
    const sourceCol = { ...newBoard[sourceColIndex], orders: [...newBoard[sourceColIndex].orders] };
    const destCol = sourceColIndex === destColIndex 
      ? sourceCol 
      : { ...newBoard[destColIndex], orders: [...newBoard[destColIndex].orders] };

    const [movedOrder] = sourceCol.orders.splice(source.index, 1);

    const updatedOrder = { 
      ...movedOrder, 
      state: destCol.state.id 
    };

    destCol.orders.splice(destination.index, 0, updatedOrder);

    newBoard[sourceColIndex] = sourceCol;
    if (sourceColIndex !== destColIndex) {
      newBoard[destColIndex] = destCol;
    }

    setBoard(newBoard);

    try {
      await updateOrderState({ order_id: draggableId, state: destCol.state.id }).unwrap();
      toast.success(`Order #${movedOrder.code || draggableId.slice(-4)} → ${destCol.state.name}`);
    } catch {
      toast.error('Failed to update order. Reverting…');
      setBoard(initialData || []);
    }
  };

  const totalOrders = board.reduce((sum, col) => sum + (col.orders?.length || 0), 0);

  return (
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
        {board.map((col) => (
          <OrderColumn
            key={col.state.id}
            stateObj={col.state}
            orders={col.orders}
            colSpan={col?.cols}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default OrderBoard;
