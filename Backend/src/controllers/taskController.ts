import { Request, Response } from "express";
import TaskService from "../services/taskServices";

const taskController = {
  getTasks: async (req: any, res: Response) => {
    try {
      const taskService = new TaskService();
      const tasks = await taskService.getTasks(req?.userDetails.id);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error?.message });
    }
  },

  createTask: async (req: any, res: Response) => {
    const { title, description, status } = req.body;
    try {
      const taskService = new TaskService();
      const task = await taskService.createTask(
        title,
        description,
        status,
        req.userDetails?.id
      );
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  getTaskById: async (req: Request, res: Response) => {
    const { id } = req?.params;
    try {
      const taskService = new TaskService();

      const task = await taskService.getTaskById(id);
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  updateTask: async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    try {
      const taskService = new TaskService();
      const task = await taskService.updateTask(id, updates);
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ message: error?.message });
    }
  },

  deleteTask: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const taskService = new TaskService();

      await taskService.deleteTask(id);
      res.json({ message: "Task deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default taskController
