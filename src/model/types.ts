import { TaskData } from "./togglModels";

export type SingleRTTicketData = {
  description: string;
  timeS: number;
  comment: string;
  toCommit: boolean;
  workspace: number;
};
export type AllTicketData = { [rt: number]: SingleRTTicketData };

export type UpdateTaskData = {
  ids: number[];
  totalTimeS: number;
  desc: string;
  workspace: number;
  newRt: string;
};

export type UnmappedTasks = {
  [id: string]: {
    ids: number[];
    totalTimeS: number;
    desc: string;
    workspace: number;
    data: TaskData[];
  };
};

export type TasksState = {
  mappedTasks: AllTicketData;
  unmappedTasks: UnmappedTasks;
  selectedDateRange: {
    from: string | undefined;
    to: string | undefined;
  };
  tokenModalShown: boolean;
  spreadModalShown: boolean;
};

export type SpreadDesiredAmount = {
  rt: string;
  amountMin: number;
  amountPercentage: number;
};
