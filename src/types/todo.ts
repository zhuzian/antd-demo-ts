export interface Todos {
  status: string
  entities: {
    [todoId: number]: Todo
  }
}

export interface Todo {
  id: number
  text: string
  completed: boolean
  color: string
}
