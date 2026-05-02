import { useState } from 'react';
import { X, Plus, Minus, Trash2, Save, ShoppingBag } from 'lucide-react';
import { useGetValidMenuDetailsQuery } from '../../../../redux/api/menusApi';
import { useUpdateOrderItemsMutation } from '../../../../redux/api/ordersApi';
import { OrderData, OrderMeal } from './types';
import { toast } from 'react-toastify';


interface EditableItem {
  id: string;          // empty string = new item
  meal_id: string;
  meal_name: string;
  size_id: string;
  size_name: string;
  size_price: number;
  count: number;
  comment: string;
  is_new: boolean;
  to_delete: boolean;
  available_sizes: { id: string; name: string; price: number }[];
}

interface Props {
  order: OrderData;
  onClose: () => void;
}

const EditOrderOverlay = ({ order, onClose }: Props) => {
  const { data: menuData } = useGetValidMenuDetailsQuery(undefined);
  const [updateOrderItems, { isLoading }] = useUpdateOrderItemsMutation();

  // Initialise editable items from current order meals
  const [items, setItems] = useState<EditableItem[]>(
    order.meals.map((m: OrderMeal) => ({
      id:             String(m.id),
      meal_id:        m.meal.id,
      meal_name:      m.meal.name,
      size_id:        m.size.id,
      size_name:      m.size.name,
      size_price:     m.size.price,
      count:          m.count,
      comment:        m.comment || '',
      is_new:         false,
      to_delete:      false,
      available_sizes: [],     // filled lazily from menu
    }))
  );

  // Flatten all meals from the menu for the "Add Meal" picker
  const allMeals: any[] = menuData?.sections?.flatMap((section: any) => section.meals) ?? [];

  const setItem = (idx: number, patch: Partial<EditableItem>) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, ...patch } : it));
  };

  const addMeal = (meal: any) => {
    if (!meal.prices || meal.prices.length === 0) return;
    const first = meal.prices[0];
    setItems(prev => [
      ...prev,
      {
        id:              '',
        meal_id:         meal.id,
        meal_name:       meal.name,
        size_id:         first.id,
        size_name:       first.name,
        size_price:      first.price,
        count:           1,
        comment:         '',
        is_new:          true,
        to_delete:       false,
        available_sizes: meal.prices,
      }
    ]);
  };

  const handleSave = async () => {
    const items_update = items
      .filter(it => !it.is_new && !it.to_delete)
      .map(it => ({ id: it.id, count: it.count, size: it.size_id, comment: it.comment }));

    const items_delete = items
      .filter(it => !it.is_new && it.to_delete)
      .map(it => it.id);

    const items_add = items
      .filter(it => it.is_new && !it.to_delete)
      .map(it => ({ meal: it.meal_id, size: it.size_id, count: it.count, comment: it.comment }));

    try {
      await updateOrderItems({ order_id: order.id, items_update, items_delete, items_add }).unwrap();
      toast.success('Order updated successfully');
      onClose();
    } catch {
      toast.error('Failed to update order');
    }
  };

  const visibleItems = items.filter(it => !it.to_delete);
  const total = visibleItems.reduce((sum, it) => sum + it.size_price * it.count, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-700" />
            </div>
            <div>
              <h2 className="font-black text-neutral-900 text-lg">Edit Order #{order.code}</h2>
              <p className="text-xs text-neutral-400 font-medium">First step only — changes broadcast in real-time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Current items */}
          <div className="px-6 py-4">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-3">
              Order Items ({visibleItems.length})
            </h3>

            <div className="space-y-3">
              {visibleItems.map((item, rawIdx) => {
                // map back to the real index in `items`
                const realIdx = items.findIndex((it, i) =>
                  it === item || (it.id === item.id && items[i] === item)
                );
                // get sizes: prefer already-fetched, fall back to menu data
                const menuMeal = allMeals.find(m => m.id === item.meal_id);
                const sizes = item.available_sizes.length > 0
                  ? item.available_sizes
                  : (menuMeal?.prices ?? [{ id: item.size_id, name: item.size_name, price: item.size_price }]);

                return (
                  <div
                    key={`${item.id}-${rawIdx}`}
                    className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100"
                  >
                    {/* Meal name + trash */}
                    <div className="flex items-start justify-between mb-3">
                      <span className="font-bold text-neutral-800 text-sm">{item.meal_name}</span>
                      <button
                        onClick={() => setItem(realIdx, { to_delete: true })}
                        className="p-1 text-neutral-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Size selector */}
                    {sizes.length > 1 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {sizes.map((s: any) => (
                          <button
                            key={s.id}
                            onClick={() => setItem(realIdx, { size_id: s.id, size_name: s.name, size_price: s.price })}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              item.size_id === s.id
                                ? 'bg-primary-600 text-white'
                                : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary-400'
                            }`}
                          >
                            {s.name} · {s.price} EGP
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Count */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 bg-white rounded-xl border border-neutral-200 p-1">
                        <button
                          onClick={() => item.count > 1 && setItem(realIdx, { count: item.count - 1 })}
                          disabled={item.count <= 1}
                          className="p-1.5 hover:bg-neutral-50 rounded-lg disabled:opacity-40 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-neutral-500" />
                        </button>
                        <span className="w-7 text-center text-sm font-bold text-neutral-800">{item.count}</span>
                        <button
                          onClick={() => setItem(realIdx, { count: item.count + 1 })}
                          className="p-1.5 hover:bg-neutral-50 rounded-lg transition-colors"
                        >
                          <Plus className="w-3 h-3 text-neutral-500" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-neutral-400">
                        {(item.size_price * item.count).toFixed(0)} EGP
                      </span>
                    </div>

                    {/* Comment */}
                    <textarea
                      value={item.comment}
                      onChange={e => setItem(realIdx, { comment: e.target.value })}
                      placeholder="Special note (optional)..."
                      rows={1}
                      className="w-full text-xs text-neutral-600 bg-white border border-neutral-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-primary-400 transition-colors"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add meal section */}
          <div className="px-6 py-4 border-t border-neutral-100">
            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-3">Add Meals</h3>
            {allMeals.length === 0 ? (
              <p className="text-sm text-neutral-400">Loading menu…</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                {allMeals.map((meal: any) => (
                  <button
                    key={meal.id}
                    onClick={() => addMeal(meal)}
                    className="flex items-center justify-between px-4 py-3 bg-neutral-50 hover:bg-primary-50 border border-neutral-100 hover:border-primary-200 rounded-xl text-left transition-all"
                  >
                    <div>
                      <div className="text-sm font-bold text-neutral-800">{meal.name}</div>
                      {meal.description && (
                        <div className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{meal.description}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-xs font-bold text-primary-600">
                        {meal.prices?.[0]?.price ?? '–'} EGP
                      </span>
                      <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Plus className="w-4 h-4 text-primary-700" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-neutral-500 font-semibold">Total</span>
            <span className="text-lg font-black text-neutral-900">{total.toFixed(0)} EGP</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

export default EditOrderOverlay;
