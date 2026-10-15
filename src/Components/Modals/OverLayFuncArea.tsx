import React from 'react'

const OverLayFuncArea = ({children, open}:{children:React.ReactNode, open:boolean}) => {
  return (
    <div className={`flex left-20 right-20 p-5 drop-shadow-md fixed rounded-lg bg-container transition-all duration-500 ease-linear delay-300 gap-3 mx-0 overlay-fn-keys ${open?'top-[78%]':'top-[110%]'}`}>
      {children}
    </div>
  )
}

export default OverLayFuncArea
