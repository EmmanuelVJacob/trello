import React, { useState } from "react";
import TaskCard from "./taskCard";
import { Droppable } from "react-beautiful-dnd";
import TaskDetailsModal from "./TaskDetailsModal"; // Import the TaskDetailsModal
import EditTaskModal from "./editTaskModal"; // Import the EditTaskModal
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
interface TaskProps {
  title: string;
  createdAt: string;
  description?: string;
  status: "To Do" | "In Progress" | "Done";
  _id: number;
}

interface TaskColumnsProps {
  taskColumns: TaskProps[];
  columnId: string;
  randomNum: React.Dispatch<React.SetStateAction<number>>;
}

const TaskColumns: React.FC<TaskColumnsProps> = ({
  taskColumns,
  columnId,
  randomNum,
}) => {
  const [selectedTask, setSelectedTask] = useState<TaskProps | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleTaskDetailView = (task: TaskProps) => {
    setSelectedTask(task); // Set the selected task
    setIsDetailsModalOpen(true); // Open the details modal
  };

  const handleDelete = async (id: number, title: string) => {
    try {
      const result = await Swal.fire({
        title: `Do you want to Delete ${title}`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      });
      if (!result?.isConfirmed) {
        return;
      }
      const res = await axiosInstance.delete(`/task/removeTask/${id}`);
      if (res.status === 200) {
        toast.success(res?.data?.message);
        randomNum(Math.floor(Math.random() * 100));
      } else {
        toast.error(res?.data?.message);
        randomNum(Math.floor(Math.random() * 100));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = (task: TaskProps) => {
    setSelectedTask(task); // Set the selected task
    setIsEditModalOpen(true); // Open the edit modal
  };

  const closeModals = () => {
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedTask(null); // Clear the selected task
    randomNum(Math.floor(Math.random() * 100));
  };


  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          className="bg-white p-4 rounded-lg shadow-md h-full overflow-y-auto"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {taskColumns.map((item, index) => (
            <TaskCard
              key={item._id}
              id={item._id}
              createdAt={item.createdAt}
              title={item.title}
              description={item.description}
              status={item.status}
              onEdit={() => openEditModal(item)} // Pass item to openEditModal
              onDelete={() => handleDelete(item._id, item?.title)}
              onMarkAsDone={() => handleTaskDetailView(item)}
              index={index}
            />
          ))}
          {provided.placeholder}

          {/* Task Details Modal */}
          {selectedTask && (
            <TaskDetailsModal
              isOpen={isDetailsModalOpen}
              onRequestClose={closeModals}
              task={selectedTask}
            />
          )}

          {/* Edit Task Modal */}
          {selectedTask && (
            <EditTaskModal
              isOpen={isEditModalOpen}
              onRequestClose={closeModals}
              task={selectedTask}
            />
          )}
        </div>
      )}
    </Droppable>
  );
};

export default TaskColumns;
