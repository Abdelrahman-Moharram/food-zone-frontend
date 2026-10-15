import React from 'react';
import BaseOverlay from './BaseOverlay';



interface Props{
    children: React.ReactNode;
    handleToggler:()=>void;
    open: boolean;
}
export default function BaseModal({children, open, handleToggler}:Props) {


  return (
    <div className="">
    {
      open?
        <>
          <BaseOverlay
            handleToggler={handleToggler}
          />
          <div className="min-w-[50%] z-20 flex items-center pt-10 justify-center absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-full h-full rounded-md shadow-md overflow-hidden bg-container z-3 ">
                {children}
            </div>
          </div>
        </>

      :null
    }
    </div>
  );
}
