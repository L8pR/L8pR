import moment from 'moment'
import { get } from 'lodash'

export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type]
        return reducer ? reducer(state, action.payload) : state
    }
}

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    }

    const error = new Error(response.statusText)
    error.response = response
    throw error
}

export function parseJSON(response) {
    return response.json()
}

export function getDuration(items) {
    let duration
    if (Array.isArray(items)) {
        duration = items.reduce((r, i) => (r + get(i, 'duration', 0)), 0)
    } else {
        duration = items.duration
    }
    if (duration === 0) {
        return null
    }
    return moment.duration(duration, 's').humanize()
}
