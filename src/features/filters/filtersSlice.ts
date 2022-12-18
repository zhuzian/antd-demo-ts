import {IAction} from 'types/actions'
import {Filters} from 'types/filters'

export const StatusFilters = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
}

interface ColorFilterChangedPayload {
  color: string
  changeType: string
}

const initialState: Filters = {
  status: StatusFilters.All,
  colors: [],
}

// Reducer
const filtersReducer = (
  state = initialState,
  action: IAction<string | ColorFilterChangedPayload>
): Filters => {
  switch (action.type) {
    case 'filters/statusFilterChanged': {
      return {
        ...state,
        status: action.payload as string,
      }
    }
    case 'filters/colorFilterChanged': {
      let {color, changeType} = action.payload as ColorFilterChangedPayload
      const {colors} = state

      switch (changeType) {
        case 'added': {
          if (colors.includes(color)) {
            return state
          }
          return {
            ...state,
            colors: state.colors.concat(color),
          }
        }
        case 'removed': {
          return {
            ...state,
            colors: state.colors.filter(existingColor => existingColor !== color),
          }
        }
        default:
          return state
      }
    }
    default:
      return state
  }
}

// Action Creators
export const statusFilterChanged = (status: string): IAction<string> => ({
  type: 'filters/statusFilterChanged',
  payload: status,
})

export const colorFilterChanged = (
  color: string,
  changeType: string
): IAction<ColorFilterChangedPayload> => {
  return {
    type: 'filters/colorFilterChanged',
    payload: {color, changeType},
  }
}

export default filtersReducer
