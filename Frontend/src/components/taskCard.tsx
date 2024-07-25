import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

interface TaskCardProps {
  id: number;
  title: string;
  createdAt: string;
  description?: string;
  status: "To Do" | "In Progress" | "Done";
  onEdit: () => void;
  onDelete: () => void;
  onMarkAsDone: () => void;
  index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  status,
  createdAt,
  onEdit,
  onDelete,
  onMarkAsDone,
  index,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "To Do":
        return "bg-yellow-200 text-yellow-800";
      case "In Progress":
        return "bg-blue-200 text-blue-800";
      case "Done":
        return "bg-green-200 text-green-800";
      default:
        return "";
    }
  };

  // Format createdAt date and time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided) => (
        <div
          className="bg-white p-4 rounded-lg shadow-md flex justify-between items-start space-x-4 my-1 relative"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex-grow">
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
            <span
              className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor()}`}
            >
              {status}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onMarkAsDone}
              className="text-green-600 hover:text-green-800"
              title="Mark as Done"
            >
              <FaEye />
            </button>

            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800"
              title="Edit"
            >
              <FaEdit />
            </button>
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-800"
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {formatDate(createdAt)}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
