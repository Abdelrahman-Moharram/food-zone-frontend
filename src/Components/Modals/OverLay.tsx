import { IoClose } from "react-icons/io5";


const OverLay = ({open, title, handleOpen, children}:{open:boolean, title?:string, handleOpen:()=>void, children:React.ReactNode}) => {

  return (
    <div className={`OverLayDetailsContainer z-20 ${open ? 'showOverLayDetails':'hideOverLayDetails'}`} >
      <div className="flex justify-between items-center my-3">
        <h4 className="text-[20px] font-bold">{title}</h4>
        <button 
          className="p-3 rounded-full hover:bg-gray-200 transition-all"
          onClick={handleOpen}
        >
          <IoClose />
        </button>
      </div>
      {children}
    </div>
  )
}

export default OverLay