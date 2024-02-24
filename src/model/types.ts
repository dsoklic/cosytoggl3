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
  tasksLoading: boolean;
  mappedTasks: AllTicketData;
  unmappedTasks: UnmappedTasks;
  selectedDateRange: {
    from: string | undefined;
    to: string | undefined;
  };
  tokenModalShown: boolean;
  spreadModalShown: boolean;
  notificationShown: boolean;
  notificationTitle: string;
  notificationMessage: string;
};

export type SpreadDesiredAmount = {
  rt: string;
  description: string;
  amountMin: number;
  amountPercentage: number;
};

export type SpreadTasksOverTicketsReducerInput = {
  desiredAmounts: SpreadDesiredAmount[];
  taskToOverwrite: UnmappedTasks[number]
}
