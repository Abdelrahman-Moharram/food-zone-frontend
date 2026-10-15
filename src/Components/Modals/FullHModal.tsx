import React from 'react';



interface Props{
    children: React.ReactNode;
    handleToggler:()=>void;
    open: boolean;
}
export default function FullHModal({children, open, handleToggler}:Props) {


  return (
    <>
    {
      open?
        <>
          <div 
            onClick={handleToggler}
            className="fixed top-0 bottom-0 right-0 left-0 bg-black/20 z-[4]"
          >
          </div>
          <div className=" w-fit h-max max-h-full overflow-y-auto rounded-md shadow-md bg-container z-[5] min-w-[50%] max-w-[80%] fixed left-1/2 -translate-x-1/2 top-0">
                {children}
          </div>
        </>

      :null
    }
    </>
  );
}
