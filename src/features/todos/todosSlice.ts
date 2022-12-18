import {AppDispatch} from 'app/hooks'
import {createSelector} from 'reselect'
import {IAction} from 'types/actions'
import {IState} from 'types/store'
import {Todo, Todos} from 'types/todo'
import {client} from '../../api/client'
import {StatusFilters} from '../filters/filtersSlice'

interface ColorSelectedPayload {
  color: string
  todoId: number
}

const initialState: Todos = {
  status: 'idle',
  entities: {},
}

// Reducer
const todosReducer = (
  state = initialState,
  action: IAction<number | Todo | Todo[] | ColorSelectedPayload>
): Todos => {
  switch (action.type) {
    case 'todos/todoAdded': {
      const todo = action.payload as Todo
      return {
        ...state,
        entities: {
          ...state.entities,
          [todo.id]: todo,
        },
      }
    }
    case 'todos/todoToggled': {
      const todoId = action.payload as number
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            completed: !todo.completed,
          },
        },
      }
    }
    case 'todos/colorSelected': {
      const {color, todoId} = action.payload as ColorSelectedPayload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          [todoId]: {
            ...todo,
            color,
          },
        },
      }
    }
    case 'todos/todoDeleted': {
      const newEntities = {...state.entities}
      delete newEntities[action.payload as number]
      return {
        ...state,
        entities: newEntities,
      }
    }
    case 'todos/allCompleted': {
      const newEntities = {...state.entities}
      Object.values(newEntities).forEach(todo => {
        newEntities[todo.id] = {
          ...todo,
          completed: true,
        }
      })
      return {
        ...state,
        entities: newEntities,
      }
    }
    case 'todos/completedCleared': {
      const newEntities = {...state.entities}
      Object.values(newEntities).forEach(todo => {
        if (todo.completed) {
          delete newEntities[todo.id]
        }
      })
      return {
        ...state,
        entities: newEntities,
      }
    }
    case 'todos/todosLoading': {
      return {
        ...state,
        status: 'loading',
      }
    }
    case 'todos/todosLoaded': {
      const newEntities = {}
      ;(action.payload as Todo[]).forEach(todo => {
        newEntities[todo.id] = todo
      })
      return {
        ...state,
        status: 'idle',
        entities: newEntities,
      }
    }
    default:
      return state
  }
}

// Action Creators
export const todoAdded = (todo: Todo): IAction<Todo> => ({type: 'todos/todoAdded', payload: todo})

export const todoToggled = (todoId: number): IAction<number> => ({
  type: 'todos/todoToggled',
  payload: todoId,
})

export const todoColorSelected = (
  todoId: number,
  color: string
): IAction<ColorSelectedPayload> => ({
  type: 'todos/colorSelected',
  payload: {todoId, color},
})

export const todoDeleted = (todoId: number): IAction<number> => ({
  type: 'todos/todoDeleted',
  payload: todoId,
})

export const allTodosCompleted = (): IAction<undefined> => ({type: 'todos/allCompleted'})

export const completedTodosCleared = (): IAction<undefined> => ({type: 'todos/completedCleared'})

export const todosLoading = (): IAction<undefined> => ({type: 'todos/todosLoading'})

export const todosLoaded = (todos: Todo[]): IAction<Todo[]> => ({
  type: 'todos/todosLoaded',
  payload: todos,
})

// Thunk Action Creators
export const fetchTodos = () => async (dispatch: AppDispatch) => {
  dispatch(todosLoading())
  const response = await client.get('/fakeApi/todos')
  console.log(response)

  dispatch(todosLoaded(response.todos))
}

export const saveNewTodo = (text: string) => async (dispatch: AppDispatch) => {
  const initialTodo = {text}
  const response = await client.post('/fakeApi/todos', {todo: initialTodo})
  dispatch(todoAdded(response.todo))
}

//Selectors
const selectTodoEntities = (state: IState) => state.todos.entities

export const selectTodos = createSelector(selectTodoEntities, entities => Object.values(entities))

export const selectTodoById = (state: IState, todoId: number) => {
  return selectTodoEntities(state)[todoId]
}

export const selectTodoIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectTodos,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  todos => todos.map(todo => todo.id)
)

export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
  // Second input selector: all filter values
  (state: IState) => state.filters,
  // Output selector: receives both values
  (todos, filters) => {
    const {status, colors} = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      return todos
    }

    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed todos based on filter
    return todos.filter(todo => {
      const statusMatches = showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  filteredTodos => filteredTodos.map(todo => todo.id)
)

export default todosReducer
