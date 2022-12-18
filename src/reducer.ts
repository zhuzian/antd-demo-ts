import todosReducer from 'features/todos/todosSlice'
import filtersReducer from 'features/filters/filtersSlice'
import {combineReducers} from 'redux'
import {IState} from 'types/store'

const rootReducer = combineReducers<IState>({
  todos: todosReducer,
  filters: filtersReducer,
})

export default rootReducer
