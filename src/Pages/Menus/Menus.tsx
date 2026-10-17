import React from 'react'
import { useGetMenuDetailsQuery } from '../../redux/api/menusApi'
import { useSearchParams } from 'react-router-dom'
import Header from './components/Header'



const Menus = () => {
  const [sp, setSp]         = useSearchParams()
  const { data, isLoading } = useGetMenuDetailsQuery({menu: sp.get('menu') || undefined})

  
  return (
    <div>
      <Header
        menu={data}
      />
    </div>
  )
}

export default Menus