import React, { ChangeEvent, useEffect, useState } from 'react';
import OverLay from '../../../../Components/ui/Modals/OverLay';
import UserForm from './UserForm';
import SelectInput from '../../../../Components/ui/Forms/SelectInput';
import Button from '../../../../Components/ui/Common/Button';
import { useGetRestaurantBranchesByCityQuery, useAddWorkerMutation, useUpdateWorkerMutation } from '../../../../redux/api/restaurantsApi';
import { toast } from 'react-toastify';

interface WorkerFormProps {
  open: boolean;
  handleClose: () => void;
  workerData?: any;
}

const WorkerForm = ({ open, handleClose, workerData }: WorkerFormProps) => {
  const isUpdate = !!workerData;
  const [formData, setFormData] = useState<any>({ user: {} });
  const [errors, setErrors] = useState<any>({});

  const { data: branchesData } = useGetRestaurantBranchesByCityQuery({});
  // If the API returns a standard Django paginated list, we might need to access branchesData.data or similar.
  // Assuming it returns an array or an object with 'data' array based on standard practice.
  const branches = Array.isArray(branchesData) ? branchesData : (branchesData?.data || []);

  const [addWorker, { isLoading: isAdding }] = useAddWorkerMutation();
  const [updateWorker, { isLoading: isUpdating }] = useUpdateWorkerMutation();

  useEffect(() => {
    if (workerData) {
      setFormData({
        branch: workerData.branch?.id || workerData.branch || '',
        user: {
          username: workerData.user?.username || '',
          email: workerData.user?.email || '',
          full_name: workerData.user?.full_name || workerData.user?.['Full Name'] || '',
          role: workerData.user?.role || '',
        }
      });
    } else {
      setFormData({ user: {} });
    }
    setErrors({});
  }, [workerData, open]);

  const handleUserChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      user: { ...prev.user, [id]: value }
    }));
  };

  const handleBranchChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      branch: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      if (isUpdate) {
        await updateWorker({ id: workerData.id, data: formData }).unwrap();
        toast.success("Worker updated successfully");
      } else {
        await addWorker(formData).unwrap();
        toast.success("Worker created successfully");
      }
      handleClose();
    } catch (err: any) {
      if (err.data) {
        setErrors(err.data);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  return (
    <OverLay open={open} handleOpen={handleClose} title={isUpdate ? "Edit Worker" : "Add Worker"}>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4 pb-20">
        
        {/* Render User Fields */}
        <UserForm 
          data={formData.user} 
          onChange={handleUserChange} 
          errors={errors.user || errors} 
          isUpdate={isUpdate} 
        />

        <div className="border-t my-4 pt-4 border-gray-200">
          <h4 className="font-bold text-gray-700 mb-2">Worker Assignment</h4>
          <SelectInput
            labelId="branch"
            label="Branch"
            value={formData.branch || ''}
            onChange={handleBranchChange}
            errors={errors.branch}
          >
            {branches.map((b: any) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </SelectInput>
        </div>

        <div className="pt-6 grid grid-cols-2 gap-2">
          <Button 
            submit 
            variant='primary'
            disabled={isAdding || isUpdating}
            title={isUpdate ? 'Update' : 'Save'} 
            isLoading={isAdding || isUpdating} 
          />
          <button 
            type="button"
            onClick={handleClose} 
            className='w-full py-2 rounded-lg border border-secondary text-center hover:bg-secondary hover:text-white transition-all font-bold'
          >
            Cancel
          </button>
        </div>
      </form>
    </OverLay>
  );
};

export default WorkerForm;
