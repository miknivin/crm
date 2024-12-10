import { Contact } from '../contact/contact';

export interface IContact {
  _id: string;
}

export interface IStage {
  //added _id on 24-11-24
  _id?: string;
  name: string;
  contacts?: Contact[];
}

export interface AddStage {
  name: string;
  contacts?: Contact[];
}

export interface AddPipeLine {
  name: string;
  notes?: string;
  stages: AddStage[];
  user: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPipeline {
  _id?: string;
  name: string;
  notes?: string;
  stages: IStage[];
  user: string;
  createdAt?: string;
  updatedAt?: string;
}
