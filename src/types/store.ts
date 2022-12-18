import {Filters} from './filters'
import {Todos} from './todo'

export interface IState {
  todos: Todos
  filters: Filters
}
