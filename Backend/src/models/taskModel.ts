import { Document, Schema, model } from "mongoose";
import { Task } from "./types/taskModelType";

const taskSchema = new Schema<Task>(
  {
    title: { type: String, required: true, default: "" },
    description: { type: String, defaule: "" },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const TaskModel = model<Task>("Task", taskSchema);

export default TaskModel;
