import React from 'react'
import MealCard from './MealCard'
import SectionHeader from './SectionHeader';
import { PageHeader } from '../../../ui/Shared';
import { useGetValidMenuDetailsQuery } from '../../../../redux/api/menusApi';
import { Loading } from '../../../ui/Common/ImageSkeleton';
import { BiSolidFoodMenu } from 'react-icons/bi';

const MenuSectionsList = () => {
    
  const { data: menu, isLoading } = useGetValidMenuDetailsQuery(undefined, { refetchOnMountOrArgChange: true });
    
  return (
    <div className='flex-1'>
        <PageHeader
            title="Create Order"
            subtitle={`Explore our menu and select your favorites from "${menu?.name || 'Menu'}"`}
            searchPlaceholder="Search items..."
        />
        <div className="space-y-12 mt-8">
        {
            isLoading?
                <Loading />
            :
                !menu?.sections?.length ?
                    <div className="py-12 text-center">
                        <div className="bg-neutral-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <BiSolidFoodMenu size={24} className="text-neutral-300" />
                        </div>
                        <p className="text-neutral-400">Menu is empty</p>
                    </div>
                :
                    menu?.sections?.map((section: any) => (
                        <div key={section.id} className="space-y-6">
                            
                            <SectionHeader 
                                title={section.name}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {section.meals.map((meal: any) => (
                                    
                                    <MealCard 
                                        key={meal.id}
                                        id={meal.id}
                                        name={meal.name}
                                        description={meal.description}
                                        prices={meal.prices}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
        </div>
    </div>
  )
}

export default MenuSectionsList
