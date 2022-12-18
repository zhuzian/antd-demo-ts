import {ThunkDispatch} from 'redux-thunk'
import {IState} from 'types/store'
import {AnyAction} from 'redux'

export type AppDispatch = ThunkDispatch<IState, any, AnyAction>
