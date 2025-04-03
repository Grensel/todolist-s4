import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"
import { createAppSlice } from "@/common/utils/createAppSlice"
import { tasksApi } from "../api/tasksApi"
import { TaskStatus } from "@/common/enums"
import { UpdateTaskModel } from "../api/tasksApi.types"
import { RootState } from "@/app/store"
import { setAppStatusAC } from "@/app/app-slice"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  reducers: (create) => ({
    fetchTaskTC: create.asyncThunk(
      async (todolistId: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.getTasks(todolistId)
          dispatch(setAppStatusAC({ status: "succeede" }))
          return { todolistId, tasks: res.data.items }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.createTask(payload)
          dispatch(setAppStatusAC({ status: "succeede" }))
          return { tusk: res.data.data.item }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.tusk.todoListId].unshift(action.payload.tusk)
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          await tasksApi.deleteTask(payload)
          dispatch(setAppStatusAC({ status: "succeede" }))
          return payload
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),
    changeTaskStatusTC: create.asyncThunk(
      async (
        payload: { todolistId: string; taskId: string; status: TaskStatus },
        { dispatch, rejectWithValue, getState },
      ) => {
        const { todolistId, status, taskId } = payload

        const allTodolistTasks = (getState() as RootState).tasks[todolistId]
        const task = allTodolistTasks.find((task) => task.id === taskId)

        if (!task) {
          return rejectWithValue(null)
        }

        const model: UpdateTaskModel = {
          description: task.description,
          title: task.title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status,
        }

        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.updateTask({ todolistId, taskId, model })
          dispatch(setAppStatusAC({ status: "succeede" }))
          return { task: res.data.data.item }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
          if (task) {
            task.status = action.payload.task.status
          }
        },
      },
    ),
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

export const { fetchTaskTC, createTaskTC, deleteTaskTC, changeTaskStatusTC, changeTaskTitleAC } = tasksSlice.actions

export const tasksReducer = tasksSlice.reducer

export const { selectTasks } = tasksSlice.selectors

export type TasksState = Record<string, Task[]>
