import { createAction, handleActions } from "redux-actions";

const START_LOADING = 'loading/START_LOADING'
const FINISH_LOADING = 'loading/FINISH_LOADING'

// createRequestSaga 함수가 반환하는 제너레이터 함수에 의해서 디스패치되는 액션 
export const startLoading = createAction(START_LOADING, requestType => requestType) // requestType : 'auth/REGISTER' 혹은 'auth/LOGIN'
export const finishLoading = createAction(FINISH_LOADING, requestType => requestType)

const initialState = {}


// START_LOADING : { 'auth/REGISTER' : true } 혹은 { 'auth/LOGIN': true }
// FINISH_LOADING: { 'auth/REGISTER' : false } 혹은 { 'auth/LOGIN': false }
const loading = handleActions(
  {
    [START_LOADING]: (state, action) => ({
      ...state,
      [action.payload]: true // action.payload : requestType : 'auth/REGISTER' 혹은 'auth/LOGIN'
    }),
    [FINISH_LOADING]: (state, action) => ({
      ...state,
      [action.payload]: false 
    })
  },
  initialState
)

export default loading