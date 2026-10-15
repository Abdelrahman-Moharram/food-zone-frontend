import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface Props {
  title: string
  icon: React.ReactNode
  path: string
}

const SideNavDropDownItem = ({ title, icon, path }: Props) => {
  const { pathname } = useLocation()

  const isActive =
    !path
      ? pathname === '/'
      : pathname.startsWith(path)

  return (
    <Link to={path} className="flex flex-col items-center gap-1 group">
      <div
        className={`
          p-[6px]
          rounded-md
          transition-[background-color,transform,box-shadow,color]
          duration-200
          ease-out
          group-hover:bg-container
          group-hover:text-primary
          group-hover:scale-105
          ${isActive ? 'bg-container text-primary scale-105 shadow-sm' : 'bg-transparent'}
        `}
      >
        {icon}
      </div>

      <div className="text-xs max-w-[50px] text-center font-medium">
        {title}
      </div>
    </Link>
  )
}

export default SideNavDropDownItem
