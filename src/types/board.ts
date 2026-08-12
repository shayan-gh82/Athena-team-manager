export interface BoardColumn {
  id: string
  projectId: string
  title: string
  order: number
  color?: string
  isCompletedColumn: boolean
}
