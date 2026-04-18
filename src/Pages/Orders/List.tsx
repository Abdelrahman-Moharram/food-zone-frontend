import { useListOrdersQuery } from '../../redux/api/ordersApi'
import { Loading } from '../../Components/ui/Common/ImageSkeleton';
import OrderBoard from '../../Components/pages/orders/manage/OrderBoard';
import { useState } from 'react';
import Button from '../../Components/ui/Common/Button';
import { useTranslation } from 'react-i18next';
import { AddIcon } from '../../Components/utils/Icons';
import { OverLay } from '../../Components/ui/Modals';
import { CreateOrder } from '.';

const List = () => {
  const { data, isLoading } = useListOrdersQuery(undefined)
  const {t}                 = useTranslation()
  const [open, setOpen]     = useState(false)

  const handleOpen = ()  =>{
    setOpen(!open)
  }
  
  return (
    <>
      <OverLay
       open={open}
       handleOpen={handleOpen}
       title='Order' 
      >
        <CreateOrder />
      </OverLay>
      <div className="p-6 md:p-10 min-h-screen bg-neutral-50/50">
        <div className="flex justify-end">
          <div className="">
            <Button 
              title={t('Create Order')}
              variant='primary'
              icon={<AddIcon />}
              onClick={handleOpen}
            />
          </div>
        </div>
        {isLoading
          ? <Loading />
          : <OrderBoard initialData={data || []} />
        }
      </div>
    </>
  )
}

export default List
