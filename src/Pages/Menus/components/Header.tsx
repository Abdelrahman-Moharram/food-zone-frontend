import React, { useState } from 'react'
import { useGetMenusListQuery } from '../../../redux/api/menusApi'
import { BaseMenuType } from './Types'
import { RadioButton } from '../../../Components/Forms/ui'
import { useSearchParams } from 'react-router-dom'
import { Badge } from '../../../Components/Common/Badges'
import { useTranslation } from 'react-i18next'
import { FaStar } from 'react-icons/fa'
import { BiSolidDownArrow } from 'react-icons/bi'
import { AddIcon } from '../../../Components/utils/Icons'
import { Modal } from '../../../Components/Modals'
import AddMenuForm from './AddMenuForm'

const Header = ({ menu }: { menu: BaseMenuType }) => {
  const { t }                       = useTranslation()
  const [_, setSp]                  = useSearchParams()
  const { data }                    = useGetMenusListQuery(undefined)
  const [open, setOpen]             = useState(false)
  const [modal, setModal]           = useState(false)


  const handleChange = () => {
    setOpen(!open)
  }
  
  const handleChangeModal = () => {
    setModal(!modal)
  }
  
  return (
    <>
        <Modal
            open            = {modal}
            handleOpen      = {handleChangeModal}
            title           = {t('Add a new Menu')}
        >
            <AddMenuForm 
                action = {handleChangeModal}
            />
        </Modal>

        <div className="">
            <div className="relative p-3">
                <div
                    onClick={handleChange}
                    className="group p-4 w-fit min-w-[25%] cursor-pointer flex justify-between items-center gap-4 rounded-xl bg-container border border-border/70 hover:border-primary/50 shadow-xs shadow-md active:scale-[0.99] transition-all duration-200 select-none"
                >
                    <div className="flex items-center gap-2.5">
                    <p className="font-semibold text-copy-primary">{menu?.title}</p>
                    {menu?.is_default && (
                        <Badge variant="warning">
                        <div className="flex items-center gap-1.5 text-yellow-600">
                            <span>{t('default')}</span>
                            <FaStar className="text-[11px]" />
                        </div>
                        </Badge>
                    )}
                    </div>
                    <BiSolidDownArrow
                    className={`text-xs text-copy-secondary transition-transform duration-300 ease-in-out group-hover:text-primary ${
                        open ? 'rotate-180 text-primary' : 'rotate-0'
                    }`}
                    />
                </div>

                <div
                    className={`grid transition-all duration-300 ease-in-out ${
                    open
                        ? 'grid-rows-[1fr] opacity-100 translate-y-0 my-1 pointer-events-auto'
                        : 'grid-rows-[0fr] opacity-0 -translate-y-1 pointer-events-none'
                    }`}
                >
                    <div className="overflow-hidden">
                        <div className="w-fit min-w-[25%] space-y-2 p-3 rounded-xl bg-card border border-border/70 ">
                            {data?.map((item) => (
                            <RadioButton
                                label={item.title}
                                labelId={item.slug}
                                name={'menu'}
                                onChange={() => setSp({ menu: item.slug })}
                                checked={menu?.slug === item.slug}
                                key={item.slug}
                                description={item.description}
                            />
                            ))}
                            
                            <button  
                                onClick   = {handleChangeModal}
                                className = "mt-5 text-sm flex items-center gap-2 border rounded-lg w-full py-2 px-3"
                            >
                                <AddIcon />
                                {t('Add a new Menu')} ...
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Header