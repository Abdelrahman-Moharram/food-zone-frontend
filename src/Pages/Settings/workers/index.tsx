import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetWorkersQuery, useDeleteWorkerMutation } from '../../../redux/api/restaurantsApi';
import WorkerCard from './components/WorkerCard';
import WorkerForm from './forms/WorkerForm';
import Paginition from '../../../Components/ui/Lists/Paginition';
import DeleteModal from '../../../Components/ui/Modals/DeleteModal';
import { AddIcon } from '../../../Components/utils/Icons';
import { toast } from 'react-toastify';

const WorkersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const size = Number(searchParams.get('size')) || 10;
  const search = searchParams.get('search') || '';

  const { data: workersResponse, isLoading } = useGetWorkersQuery({ page, size, search });
  const [deleteWorker, { isLoading: isDeleting }] = useDeleteWorkerMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState<any>(null);

  const workers = workersResponse?.data || [];
  const totalPages = workersResponse?.total_pages || 1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      searchParams.set('search', val);
      searchParams.set('page', '1'); // reset page on search
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const handleCreate = () => {
    setSelectedWorker(null);
    setFormOpen(true);
  };

  const handleEdit = (worker: any) => {
    setSelectedWorker(worker);
    setFormOpen(true);
  };

  const handleDeletePrompt = (worker: any) => {
    setWorkerToDelete(worker);
    setDeleteModalOpen(true);
  };

  const handleDeleteAction = async (id: string) => {
    try {
      await deleteWorker(id).unwrap();
      toast.success("Worker deleted successfully");
      setDeleteModalOpen(false);
      setWorkerToDelete(null);
    } catch (err) {
      toast.error("Failed to delete worker");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Workers</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
        >
          <AddIcon />
          Add Worker
        </button>
      </div>

      <div className="flex items-center justify-between">
        <input 
          type="text" 
          placeholder="Search workers by name, email or username..." 
          value={search}
          onChange={handleSearch}
          className="w-full max-w-md px-4 py-2 border rounded-lg outline-none focus:border-primary"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {workers.map((worker: any) => (
            <WorkerCard 
              key={worker.id} 
              worker={worker} 
              onEdit={handleEdit} 
              onDelete={handleDeletePrompt} 
            />
          ))}
          {workers.length === 0 && (
            <div className="col-span-full text-center p-10 text-gray-500">
              No workers found.
            </div>
          )}
        </div>
      )}

      <Paginition totalPages={totalPages} />

      {/* Forms Overlay */}
      {formOpen && (
        <WorkerForm 
          open={formOpen} 
          handleClose={() => setFormOpen(false)} 
          workerData={selectedWorker} 
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <DeleteModal 
          open={deleteModalOpen} 
          handleClose={() => setDeleteModalOpen(false)} 
          deleteAction={() => handleDeleteAction(workerToDelete?.id)} 
          isLoading={isDeleting} 
          id={workerToDelete?.id} 
          title="Delete Worker"
        >
          Are you sure you want to delete <strong>{workerToDelete?.user?.username}</strong>?
          <br /><br />
          <strong>WARNING:</strong> If the worker is deleted, there is no going back anymore.
        </DeleteModal>
      )}
    </div>
  );
};

export default WorkersPage;
