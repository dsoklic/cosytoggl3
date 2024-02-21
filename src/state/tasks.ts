import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import { TaskData } from "../model/togglModels";
import {
  startOfMonth,
  endOfMonth,
  startOfISOWeek,
  endOfISOWeek,
} from "date-fns";
import { sendGetRequest, sendPatchRequest } from "../utils/leakyBucketClient";
import { getTicketInfo } from "../utils/utils";
import {
  TasksState,
  UpdateTaskData,
  SpreadDesiredAmount,
  SingleRTTicketData,
} from "../model/types";

const initialState: TasksState = {
  mappedTasks: {},
  unmappedTasks: {},
  selectedDateRange: {
    from: startOfMonth(new Date()).toISOString(),
    to: endOfMonth(new Date()).toISOString(),
  },
  tokenModalShown: false,
  spreadModalShown: true,
};

const toBase64 = (input: string) => {
  return Base64.stringify(Utf8.parse(input));
};

export const getTasks = createAsyncThunk(
  "Tasks/getTasks",
  async (arg, { getState }) => {
    const state = getState() as { tasks: TasksState };
    const togglToken = localStorage.getItem("token");

    if (togglToken === null) return [];
    if (
      state.tasks.selectedDateRange.from === undefined ||
      state.tasks.selectedDateRange.to === undefined
    )
      return [];

    const { data, status } = await sendGetRequest<TaskData[]>("/time_entries", {
      baseURL: "https://api.track.toggl.com/api/v9/me/",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + toBase64(togglToken + ":api_token"),
      },
      params: {
        start_date: state.tasks.selectedDateRange?.from ?? "",
        end_date: state.tasks.selectedDateRange?.to ?? "",
      },
    });

    return data;
  }
);

export const updateTasks = createAsyncThunk<boolean, UpdateTaskData[]>(
  "Tasks/updateTasks",
  async (arg) => {
    const togglToken = localStorage.getItem("token");

    const results = arg.map(async (task) => {
      const { data, status } = await sendPatchRequest<TaskData[]>(
        `https://api.track.toggl.com/api/v9/workspaces/${
          task.workspace
        }/time_entries/${task.ids.join(",")}`,
        [
          {
            op: "replace",
            path: "/description",
            value: `RT#${task.newRt}: ${task.desc}`,
          },
        ],
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + toBase64(togglToken + ":api_token"),
          },
        }
      );

      return status === 200;
    });

    return results.every(async (x) => await x);
  }
);

export const spreadTasksOverTickets = createAsyncThunk<
  boolean,
  SpreadDesiredAmount[]
>("Tasks/spreadTasksOverTickets", async (arg) => {
  return true;
});

const extractMappedTasks = (state: TasksState, taskData: TaskData[]) => {
  const parsedData = taskData.reduce<{
    [rt: number]: SingleRTTicketData;
  }>((acc, cur) => {
    const { rt, desc } = getTicketInfo(cur.description);

    if (rt !== undefined) {
      if (rt in acc) {
        acc[rt].timeS += cur.duration;
      } else {
        acc[rt] = {
          description: desc,
          timeS: cur.duration,
          comment: "",
          toCommit: false,
          workspace: cur.workspace_id,
        };
      }
    }

    return acc;
  }, {});

  state.mappedTasks = parsedData;
};

const extractUnmappedTasks = (state: TasksState, taskData: TaskData[]) => {
  const parsedData = taskData.reduce<{
    [d: string]: {
      ids: number[];
      totalTimeS: number;
      desc: string;
      workspace: number;
      data: TaskData[];
    };
  }>((acc, cur) => {
    const { rt, desc } = getTicketInfo(cur.description);

    if (rt !== undefined) return acc;

    if (!(desc in acc)) {
      acc[desc] = {
        ids: [cur.id],
        totalTimeS: cur.duration,
        desc: desc,
        workspace: cur.workspace_id,
        data: [cur],
      };
    } else {
      acc[desc].ids.push(cur.id);
      acc[desc].totalTimeS += cur.duration;
      acc[desc].data.push(cur);
    }

    return acc;
  }, {});

  state.unmappedTasks = Object.values(parsedData).reduce<
    TasksState["unmappedTasks"]
  >((acc, cur) => {
    acc[cur.ids.join("")] = {
      ids: cur.ids,
      totalTimeS: cur.totalTimeS,
      desc: cur.desc,
      workspace: cur.workspace,
      data: cur.data,
    };

    return acc;
  }, {});
};

const TasksSlice = createSlice({
  name: "Tasks",
  initialState,
  reducers: {
    setSelectedDateRange: (
      state,
      action: PayloadAction<{
        from: string | undefined;
        to: string | undefined;
      }>
    ) => {
      state.selectedDateRange.from = action.payload.from;
      state.selectedDateRange.to = action.payload.to;
    },

    markAllToCommit: (state, action: PayloadAction<boolean>) => {
      Object.values(state.mappedTasks).forEach(
        (x) => (x.toCommit = action.payload)
      );
    },
    toggleToCommit: (state, action: PayloadAction<number>) => {
      const task = state.mappedTasks[action.payload];
      task.toCommit = !task.toCommit;
    },
    setTaskComment: (
      state,
      action: PayloadAction<{ rt: number; comment: string }>
    ) => {
      const task = state.mappedTasks[action.payload.rt];
      task.comment = action.payload.comment;
    },
    changeUnmappedTaskDescription: (
      state,
      action: PayloadAction<{ id: string; new: string }>
    ) => {
      state.unmappedTasks[action.payload.id].desc = action.payload.new;
    },
    setTokenModalShown: (state, action: PayloadAction<boolean>) => {
      state.tokenModalShown = action.payload;
    },
    setSpreadModalShown: (state, action: PayloadAction<boolean>) => {
      state.spreadModalShown = action.payload;
    },
    setThisWeek: (state) => {
      state.selectedDateRange = {
        from: startOfISOWeek(new Date()).toISOString(),
        to: endOfISOWeek(new Date()).toISOString(),
      };
    },
    setThisMonth: (state) => {
      state.selectedDateRange = {
        from: startOfMonth(new Date()).toISOString(),
        to: endOfMonth(new Date()).toISOString(),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.fulfilled, (state, action) => {
        const taskData = action.payload;
        extractMappedTasks(state, taskData);
        extractUnmappedTasks(state, taskData);
      })
      .addCase(updateTasks.fulfilled, (state, action) => {
        // TODO dispatch get tasks
      });
  },
});

export const {
  setSelectedDateRange,
  markAllToCommit,
  toggleToCommit,
  setTaskComment,
  changeUnmappedTaskDescription,
  setTokenModalShown,
  setSpreadModalShown,
  setThisWeek,
  setThisMonth,
} = TasksSlice.actions;

export default TasksSlice.reducer;
