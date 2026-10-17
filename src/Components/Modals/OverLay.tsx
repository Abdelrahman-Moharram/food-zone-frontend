import { IoClose } from "react-icons/io5";


const OverLay = ({open, title, handleOpen, children}:{open:boolean, title?:string, handleOpen:()=>void, children:React.ReactNode}) => {

  return (
    <div className={`OverLayDetailsContainer z-50 rounded-2xl border border-border/80 shadow-2xl bg-container transition-all duration-300 ${open ? 'showOverLayDetails' : 'hideOverLayDetails'}`} >
      <div className="flex justify-between items-center pb-3 mb-4 border-b border-border/60">
        <h4 className="text-lg font-bold text-color tracking-tight">{title}</h4>
        <button 
          className="p-1.5 rounded-xl bg-card hover:bg-gray-200/80 text-gray-500 hover:text-color border border-border/50 transition-all active:scale-95 text-base flex items-center justify-center"
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