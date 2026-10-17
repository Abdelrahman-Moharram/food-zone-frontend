import React from 'react';



interface Props{
    children: React.ReactNode;
    handleOpen:()=>void;
    open: boolean;
}
export default function FullHModal({children, open, handleOpen}:Props) {


  return (
    <>
    {
      open?
        <>
          <div 
            onClick={handleOpen}
            className="fixed inset-0 bg-black/45 backdrop-blur-xs z-40 animate-overlay-in transition-opacity duration-300 ease-out"
          >
          </div>
          <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl shadow-2xl border border-border/80 bg-container animate-modal-in transition-all duration-300 ease-out">
                {children}
          </div>
        </>

      :null
    }
    </>
  );
}
