import { createAsyncThunk } from "@reduxjs/toolkit"
import { Todolist } from "../api/todolistsApi.types"
import { todolistsApi } from "../api/todolistsApi"
import { createAppSlice } from "@/common/utils/createAppSlice"
import { setAppStatusAC } from "@/app/app-slice"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.rejected, (state, action) => {})
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(changeTodolistTitleTC.rejected, (state, action) => {})
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all" })
      })
      .addCase(createTodolistTC.rejected, (state, action) => {})
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
      .addCase(deleteTodolistTC.rejected, (state, action) => {})
  },
  reducers: (create) => ({
    fetchTodolistsTC: create.asyncThunk(
      async (_payload, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.getTodolists()
          dispatch(setAppStatusAC({ status: "succeede" }))
          return { todolists: res.data }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (_state, action) => action.payload.todolists.map((tl) => ({ ...tl, filter: "all" })),
      },
    ),
    createTodolistTC: create.asyncThunk(),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
  }),
})

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (payload: { id: string; title: string }, thunkApi) => {
    try {
      await todolistsApi.changeTodolistTitle(payload)
      return payload
    } catch (error) {
      return thunkApi.rejectWithValue(null)
    }
  },
)
export const createTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/createTodolistTC`,
  async (title: string, thunkApi) => {
    try {
      const res = await todolistsApi.createTodolist(title)
      return { todolist: res.data.data.item }
    } catch (error) {
      return thunkApi.rejectWithValue(null)
    }
  },
)
export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolistTC`,
  async (id: string, thunkApi) => {
    try {
      await todolistsApi.deleteTodolist(id)
      return { id }
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  },
)

export const { changeTodolistFilterAC, fetchTodolistsTC } = todolistsSlice.actions

export const todolistsReducer = todolistsSlice.reducer

export const { selectTodolists } = todolistsSlice.selectors

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
