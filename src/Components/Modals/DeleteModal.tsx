import React from 'react'
import BaseModal from './BaseModal'
import { FaTrash } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { Spinner } from '../Loaders';

interface Props{
    open: boolean
    handleClose:()=>void;
    children: React.ReactNode;
    deleteAction: (id:string)=>void;
    isLoading:boolean,
    id: string,
    title: string
}

const DeleteModal = ({title, open, handleClose, children, deleteAction, isLoading, id}:Props) => {
  return (
    <BaseModal open={open} handleOpen={handleClose}  >
        <div className="flex justify-between items-center px-6 py-4 border-b border-border/70 bg-card">
            <h3 className="font-bold text-base text-color tracking-wide">{title}</h3>
            <div onClick={handleClose} className="cursor-pointer p-1.5 rounded-xl text-gray-500 hover:text-color hover:bg-container border border-border/50 transition-all duration-150 active:scale-95 flex items-center justify-center text-base"><IoClose /></div>
        </div>
        <p className="px-6 py-5 text-sm text-gray-600 leading-relaxed font-normal">
            {children}
        </p>
        <button
            onClick={()=>deleteAction(id)}
            className="w-[calc(100%-3rem)] mx-6 mb-6 justify-center flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-rose-600/20"
        >
            
            {isLoading ?  
                <div className='flex items-center gap-1'>
                    <Spinner sm /> 
                    Delete
                </div>
            : 
            <>
                <FaTrash />
                Delete
            </>
            }
        </button>
    </BaseModal>
  )
}

export default DeleteModal
