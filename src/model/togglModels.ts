export interface TaskData {
  id: number
  workspace_id: number
  project_id?: number
  task_id: any
  billable: boolean
  start: string
  stop: string
  duration: number
  description: string
  tags: any[]
  tag_ids: any[]
  duronly: boolean
  at: string
  server_deleted_at: any
  user_id: number
  uid: number
  wid: number
  pid?: number
}
