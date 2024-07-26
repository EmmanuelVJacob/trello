import axiosInstance from "../utils/axiosInstance";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import React from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa"; 

Modal.setAppElement('#__next');

interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const addTask = async (values: { title: string; description: string; status: string }) => {
    try {
      const res = await axiosInstance.post("/task/addTask", values);
      if (res?.status === 200) {
        toast.success("Task added successfully", { autoClose: 3000 });
        onRequestClose(); 
      } else {
        toast.error('Task not added', { autoClose: 3000 });
      }
    } catch (error: any) {
      toast.error('Task not added', { autoClose: 3000 });
    }
  };

  const taskValidationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title is too short")
      .required("Title is required"),
    description: Yup.string().optional(),
    status: Yup.string()
      .oneOf(["To Do", "In Progress", "Done"], "Invalid status")
      .required("Status is required"),
  });

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

        <h2 className="text-2xl font-semibold mb-4">Add Task</h2>
        <Formik
          initialValues={{
            title: "",
            description: "",
            status: "",
          }}
          validationSchema={taskValidationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true); // Disable button while submitting
            await addTask(values); // Await task addition
            setSubmitting(false); // Re-enable button after API call
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Title
                </label>

                <Field
                  type="text"
                  name="title"
                  id="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Title"
                />

                <div className="text-red-500">
                  <ErrorMessage name="title" component="div" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>

                <Field
                  as="textarea"
                  name="description"
                  id="description"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 h-24 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Description"
                />

                <div className="text-red-500">
                  <ErrorMessage name="description" component="div" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Status
                </label>

                <Field
                  as="select"
                  name="status"
                  id="status"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Select a status</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </Field>

                <div className="text-red-500">
                  <ErrorMessage name="status" component="div" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-black dark:text-black 
                    bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={isSubmitting}
              >
                Add Task
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default CustomModal;
