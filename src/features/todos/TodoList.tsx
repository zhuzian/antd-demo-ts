import {AppDispatch} from 'app/hooks'
import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {IState} from 'types/store'
import TodoListItem from './TodoListItem'

import {fetchTodos, selectFilteredTodoIds} from './todosSlice'

const TodoList = () => {
  const dispatch: AppDispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchTodos())
  }, [])
  const todoIds = useSelector(selectFilteredTodoIds)
  const loadingStatus = useSelector((state: IState) => state.todos.status)

  if (loadingStatus === 'loading') {
    return (
      <div className="todo-list">
        <div className="loader" />
      </div>
    )
  }

  const renderedListItems = todoIds.map(todoId => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
