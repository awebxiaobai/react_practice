import { combineReducers } from 'redux'
import storageUtils from '../utils/storageUtils'

import { RECEIVE_USER, RESET_USER, SET_HEAD_TITLE, SHOW_ERROR_MSG } from './action-types'

const initHeadTitle = ''
function headTitle(state = initHeadTitle, action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}
const initUser = storageUtils.getUser()
function user(state = initUser, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR_MSG:
            const errorMsg=action.errorMsg
            return {...state,errorMsg}
        case RESET_USER:
            return {}
        default:
            return state
    }
}

export default combineReducers({
    headTitle,
    user
})