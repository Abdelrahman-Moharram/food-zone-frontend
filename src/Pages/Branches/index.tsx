import React from 'react';
import { PageHeader } from '../../Components/ui/Shared';
import { ResourceCard } from '../../Components/ui/Cards';
import { IoLocationOutline, IoCallOutline, IoMailOutline } from 'react-icons/io5';
import { useGetRestaurantBranchesByCityQuery } from '../../redux/api/restaurantsApi';
import { Loading } from '../../Components/ui/Common/ImageSkeleton';

interface City {
  id: number;
  name: string;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  city: City;
  image?: string;
  state: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  is_active: boolean;
}

interface CityGroup {
  city: City;
  branches: Branch[];
}

const Branches = () => {
  const { data, isLoading } = useGetRestaurantBranchesByCityQuery({}, { refetchOnFocus: true });
  const citiesData = (data as CityGroup[]) || [];

  const handleEdit = (id: string) => console.log('Edit branch:', id);
  const handleDelete = (id: string) => console.log('Delete branch:', id);
  // const handleSettings = (id: string) => console.log('Open settings for branch:', id);
  const handleAddBranch = () => console.log('Add new branch');

  return (
    <div className="min-h-screen bg-neutral-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          title="Branches"
          subtitle="Manage your restaurant branches and their settings"
          searchPlaceholder="Search branches..."
          addLabel="Add Branch"
          onSearch={() => {}} // Backend filter logic not yet implemented
          onAdd={handleAddBranch} 
        />
        
        {isLoading ? (
          <Loading />
        ) : (
          <div className="space-y-12 mt-8">
            {citiesData.map((cityGroup) => (
              <div key={cityGroup.city.id} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-neutral-800">
                    {cityGroup.city.name}
                  </h2>
                  <div className="h-px flex-1 bg-neutral-200"></div>
                  <span className="text-neutral-500 text-sm font-medium bg-neutral-100 px-3 py-1 rounded-full">
                    {cityGroup.branches.length} {cityGroup.branches.length === 1 ? 'Branch' : 'Branches'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cityGroup.branches.map((branch) => (
                    <ResourceCard 
                      key={branch.id} 
                      id={branch.id}
                      name={branch.name}
                      image={branch?.image ?? 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1000'}
                      status={branch.is_active ? 'active' : 'inactive'}
                      details={[
                        { 
                          icon: <IoLocationOutline />, 
                          text: (
                            <a 
                              href={`https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {`${branch.city.name}, ${branch.state}`}
                            </a>
                          )
                        },
                        { 
                          icon: <IoCallOutline />, 
                          text: (
                            <a href={`tel:${branch.phone}`} className="text-primary hover:underline">
                              {branch.phone}
                            </a>
                          ) 
                        },
                        { 
                          icon: <IoMailOutline />, 
                          text: (
                            <a href={`mailto:${branch.email}`} className="text-primary hover:underline">
                              {branch.email}
                            </a>
                          ) 
                        },
                      ]}
                      actions={{
                        onEdit: handleEdit, 
                        onDelete: handleDelete,
                        // onSettings: handleSettings
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}

            {citiesData.length === 0 && (
              <div className="py-20 text-center">
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-dashed border-neutral-300 inline-block">
                  <p className="text-neutral-500 text-lg">No branches found</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Branches;

