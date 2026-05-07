import React from 'react';
import { DeleteIcon, EditIcon, InfoIcon } from '../../../../Components/utils/Icons';
import { Link } from 'react-router-dom';

interface WorkerCardProps {
  worker: any;
  onEdit: (worker: any) => void;
  onDelete: (worker: any) => void;
}

const WorkerCard = ({ worker, onEdit, onDelete }: WorkerCardProps) => {
  const { user, branch, restaurant } = worker;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        {/* Placeholder Avatar */}
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl uppercase">
          {user?.username?.[0] || 'W'}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg leading-tight">{user?.full_name || user?.['Full Name'] || 'No Name'}</h3>
          <p className="text-gray-500 text-sm">@{user?.username}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span className="font-medium">Email:</span>
          <span>{user?.email || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Role:</span>
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold capitalize">
            {user?.role || 'Worker'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Branch:</span>
          <span>{branch?.name || branch || 'N/A'}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-50 mt-auto">
        <Link 
          to={`${worker.id}`} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Details"
        >
          <InfoIcon />
        </Link>
        <button 
          onClick={() => onEdit(worker)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Edit"
        >
          <EditIcon />
        </button>
        <button 
          onClick={() => onDelete(worker)}
          className="p-2 rounded-full hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default WorkerCard;
