import { Schema } from "mongoose";

export interface Task {
    title: string;
    description?: string;
    status: 'To Do' | 'In Progress' | 'Done';
    user: Schema.Types.ObjectId; 
    createdAt?: Date;
    updatedAt?: Date;
  }