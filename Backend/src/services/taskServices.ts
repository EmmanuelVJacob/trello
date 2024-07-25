import taskModel from '../models/taskModel';
import { Task } from '../models/types/taskModelType';

class TaskService {
  async createTask(
    title: string,
    description: string,
    status: string,
    userId: string
  ): Promise<Task | undefined> {
    try {
      const newTask = new taskModel({ title, description, status, user: userId });
      const savedTask = await newTask.save();
      return savedTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  }

  async getTasks(userId: string): Promise<Task[] | undefined> {
    try {
      console.log(userId,'this is the userId')
      const tasks = await taskModel.find({ user: userId }) .sort({ createdAt: -1 });
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    try {
      const task = await taskModel.findById(id);
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw new Error('Failed to fetch task');
    }
  }

  async updateTask(
    id: string,
    updates: Partial<Task>
  ): Promise<Task | undefined> {
    try {
      const updatedTask = await taskModel.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedTask) {
        throw new Error('Task not found');
      }
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  }

  async deleteTask(id: string): Promise<string | undefined> {
    try {
      await taskModel.findByIdAndDelete(id);
      return 'Task deleted successfully!';
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  }
}

export default TaskService;
