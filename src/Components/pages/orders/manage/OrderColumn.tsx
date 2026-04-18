import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import OrderCard from './OrderCard';
import classNames from 'classnames';
import { OrderStateDef, OrderData } from './types';
import { getVariantClasses } from './utils';

interface Props {
  stateObj  : OrderStateDef;
  orders    : OrderData[];
  colSpan?  : string
}

const OrderColumn = ({ stateObj, orders, colSpan }: Props) => {
  const { headerColor, dotColor } = getVariantClasses(stateObj.variant);
  console.log({ headerColor, dotColor }, stateObj.variant);
  
  return (
    <div className={`flex flex-col rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 shadow-sm col-span-${colSpan}`}>
      {/* Column header */}
      <div className={classNames('px-5 py-4 flex items-center gap-3 border-b border-neutral-200', headerColor)}>
        <span className={classNames('w-2.5 h-2.5 rounded-full shrink-0', dotColor)} />
        <span className="font-black text-sm tracking-wide">{stateObj.name}</span>
        <span className="ml-auto text-xs font-black px-2.5 py-1 bg-white/60 rounded-full border border-white/80 text-neutral-600">
          {orders.length}
        </span>
      </div>

      {/* Droppable zone */}
      <Droppable droppableId={stateObj.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={classNames(
              'flex-1 p-4 min-h-[500px] transition-colors duration-200',
              snapshot.isDraggingOver ? 'bg-primary-50/40' : 'bg-transparent'
            )}
          >
            {orders.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-neutral-400">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center">
                  <span className="text-lg">📋</span>
                </div>
                <span className="text-xs font-semibold">No orders yet</span>
              </div>
            )}
            {orders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} stateObj={stateObj} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default OrderColumn;
