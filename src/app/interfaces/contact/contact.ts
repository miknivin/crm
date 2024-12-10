export interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  assignedTo?: {
    user: string;
    time: Date;
  }[];
  pipelinesActive?: {
    user: string;
    pipelineName?: string;
    currentStage?: string;
  }[];
  tags?: {
    user: string;
    name: string;
    comment: string;
  }[];
  user?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
