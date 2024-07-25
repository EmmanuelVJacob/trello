import express from "express";
import {
  validateCreateTask,
  validateUpdateTask,
  validateSingleTask,
} from "../middleware/express-validator";
import taskController from "../controllers/taskController";
import verifyJwtToken from "../middleware/jwtVerifyUser";

const taskRouter = express.Router();

taskRouter.post(
  "/addTask",
  validateCreateTask,
  verifyJwtToken,
  taskController.createTask
);

taskRouter.put(
  "/updateTask/:id",
  validateUpdateTask,
  verifyJwtToken,
  taskController.updateTask
);

taskRouter.get("/getAllTask", verifyJwtToken, taskController.getTasks);

taskRouter.get(
  "/getSingleTask/:id",
  validateSingleTask,
  taskController.getTaskById
);

taskRouter.delete(
  "/removeTask/:id",
  validateSingleTask,
  verifyJwtToken,
  taskController.deleteTask
);

export default taskRouter;
