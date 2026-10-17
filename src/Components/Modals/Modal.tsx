import React from 'react'
import BaseModal from './BaseModal'
import { IoClose } from 'react-icons/io5';

interface Props{
    children    : React.ReactNode;
    handleOpen  : ()=>void;
    open        : boolean;
    title?      : string
}

const Modal = ({children, title, open, handleOpen}:Props) => {
  return (
    <BaseModal
      open       = {open}
      handleOpen = {handleOpen}
    >
        
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/70 bg-card text-color select-none">
        <div className="font-bold text-base text-color tracking-wide">{title}</div>

        <button 
            className="p-1.5 rounded-xl bg-container hover:bg-gray-200/80 text-gray-500 hover:text-color active:scale-95 transition-all duration-200 border border-border/60 text-base flex items-center justify-center"
            onClick={handleOpen}
        >
            <IoClose />
        </button>
      </div>
      <div className="px-6 py-6 overflow-y-auto flex-1">
        {children}
      </div>
    </BaseModal>
  )
}

export default Modal
