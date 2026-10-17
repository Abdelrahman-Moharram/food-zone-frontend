import React from 'react';
import BaseOverlay from './BaseOverlay';



interface Props{
    children    : React.ReactNode;
    handleOpen  : ()=>void;
    open        : boolean;
}
export default function BaseModal({children, open, handleOpen}:Props) {


  return (
    <div className="">
    {
      open?
        <>
          <BaseOverlay
            handleOpen={handleOpen}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-none">
            <div className="pointer-events-auto w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-border/80 overflow-hidden bg-container animate-modal-in transition-all duration-300 ease-out">
                {children}
            </div>
          </div>
        </>

      :null
    }
    </div>
  );
}
