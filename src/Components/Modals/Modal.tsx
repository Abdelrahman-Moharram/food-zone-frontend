import React from 'react'
import BaseModal from './BaseModal'
import { IoClose } from 'react-icons/io5';

interface Props{
    children: React.ReactNode;
    handleToggler:()=>void;
    open: boolean;
    title?:string
}

const Modal = ({children, title, open, handleToggler}:Props) => {
  return (
    <BaseModal
        open={open}
        handleToggler={handleToggler}
    >
        
      <div className='flex justify-between bg-secondary text-negative-color py-3 px-4'>
        <div>{title}</div>

        <button 
            className="p-1 rounded-full bg-gray-200 text-color hover:scale-105 transition-all"
            onClick={handleToggler}
        >
            <IoClose />
        </button>
      </div>
      <div className="px-4 py-8">
        {children}
      </div>
    </BaseModal>
  )
}

export default Modal
