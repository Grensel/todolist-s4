import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"
import { DomainTask } from "@/features/todolists/api/tasksApi.types"
import { TaskStatus } from "@/common/enums"
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi"
import { createTaskModel } from "@/features/todolists/lib/utils"
import { DomainTodolist } from "@/features/todolists/model/todolists-slice"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
  disabled: boolean
}

export const TaskItem = ({ task, todolist, disabled }: Props) => {
  const [deleteTasks] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const deleteTaskHandler = () => {
    deleteTasks({ todolistId: todolist.id, taskId: task.id })
  }
  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const model = createTaskModel(task, { status })
    updateTask({ taskId: task.id, todolistId: todolist.id, model })
  }

  const changeTaskTitleHandler = (title: string) => {
    const model = createTaskModel(task, { title })
    updateTask({ taskId: task.id, todolistId: todolist.id, model })
  }

  const isTaskCompleted = task.status === TaskStatus.Completed

  return (
    <ListItem sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatusHandler} disabled={disabled} />
        <EditableSpan value={task.title} onChange={changeTaskTitleHandler} disabled={disabled} />
      </div>
      <span>{new Date(task.addedDate).toLocaleDateString()}</span>
      <IconButton onClick={deleteTaskHandler} disabled={disabled}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
