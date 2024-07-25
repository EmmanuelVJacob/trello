import React, { FC, useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/router";
import TaskColumns from "./taskColumns";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import AddButton from "./addButton";

interface TaskProps {
  title: string;
  description?: string;
  createdAt: string;
  status: "To Do" | "In Progress" | "Done";
  _id: number;
}

const TrelloMain: FC = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [toDo, setToDo] = useState<TaskProps[]>([]);
  const [inProgress, setInProgress] = useState<TaskProps[]>([]);
  const [done, setDone] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [randomNum, setRandomNum] = useState(1234);

  const router = useRouter();

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await axiosInstance.put(`/task/updateTask/${id}`, {
        status: status,
      });
      if (res.status === 200) {
        setRandomNum(Math.floor(Math.random() * 100));
      }
    } catch (error) {
      console.log(error)
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    console.log(result, "this is the res");
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      return;
    }
    updateStatus(draggableId, destination.droppableId);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/signin");
    }
  });

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        setLoading(false);
        const res = await axiosInstance.get("/task/getAllTask");

        if (res?.status === 200) {
          const fetchedCards = res.data;

          if (Array.isArray(fetchedCards)) {
            setTasks(fetchedCards);
            setToDo(
              fetchedCards.filter((task: TaskProps) => task.status === "To Do")
            );
            setInProgress(
              fetchedCards.filter(
                (task: TaskProps) => task.status === "In Progress"
              )
            );
            setDone(
              fetchedCards.filter((task: TaskProps) => task.status === "Done")
            );
          }
        } else {
          console.error("Unexpected response status:", res.status);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };
    fetchAllTasks();
  }, [randomNum]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <AddButton setRandom={setRandomNum} />
        <div className="flex flex-col md:flex-row items-start justify-center h-screen p-4 gap-4">
          <TaskColumns
            taskColumns={toDo}
            randomNum={setRandomNum}
            columnId="To_Do"
            toDo={toDo}
            setToDo={setToDo}
            inProgress={inProgress}
            setInProgress={setInProgress}
            done={done}
            setDone={setDone}
          />

          {/* <div className="w-full md:w-1/3 bg-yellow-100 p-4 rounded-lg shadow-md h-1/3 md:h-full overflow-hidden">
          <h2 className="text-center font-bold mb-4">In Progress</h2>
          <div className="overflow-y-auto h-full scrollbar-hide">
            <TaskColumns
              taskColumns={inProgress}
              randomNum={setRandomNum}
              columnId="In_Progress"
            />
          </div>
        </div>
        <div className="w-full md:w-1/3 bg-green-100 p-4 rounded-lg shadow-md h-1/3 md:h-full overflow-hidden">
          <h2 className="text-center font-bold mb-4">Done</h2>
          <div className="overflow-y-auto h-full scrollbar-hide">
            <TaskColumns
              taskColumns={done}
              randomNum={setRandomNum}
              columnId="Done"
            />
          </div>
        </div> */}
        </div>
      </DragDropContext>
    </>
  );
};

export default TrelloMain;
