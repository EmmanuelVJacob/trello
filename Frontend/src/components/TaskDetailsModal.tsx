import React from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa'; // Import close icon

Modal.setAppElement('#__next'); // Set app element for accessibility

interface TaskDetailsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  task: {
    title: string;
    createdAt: string;
    description?: string;
    status: string;
  };
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ isOpen, onRequestClose, task }) => {
  const formattedDate = new Date(task.createdAt).toLocaleString();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full relative">
        {/* Close icon */}
        <button
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-4">Task Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Title</h3>
            <p className="text-gray-700">{task.title}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Description</h3>
            <p className="text-gray-700">{task.description || 'No description'}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Status</h3>
            <p className="text-gray-700">{task.status}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Created At</h3>
            <p className="text-gray-700">{formattedDate}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailsModal;
