import React, { useState } from "react";
import CustomModal from "./addTaskModal";

interface AddButtonProps {
  setRandom: React.Dispatch<React.SetStateAction<number>>;
}

const AddButton: React.FC<AddButtonProps> = ({ setRandom }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setRandom(Math.floor(Math.random() * 1000));
  };
  return (
    <div>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Add
      </button>

      <CustomModal isOpen={isModalOpen} onRequestClose={closeModal} />
    </div>
  );
};

export default AddButton;
