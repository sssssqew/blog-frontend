import { createAction, handleActions } from "redux-actions";
import { takeLatest } from "redux-saga/effects";
import * as authAPI from '../lib/api/auth'
import createRequestSaga, {createRequestActionTypes} from "../lib/createRequestSaga";

const TEMP_SET_USER = 'user/TEMP_SET_USER' // 새로고침 이후 임시 로그인 처리 
const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] = createRequestActionTypes('user/CHECK')

// 사용자가 외부에서 발생시키는 액션함수
export const tempSetUser = createAction(TEMP_SET_USER, user => user)
export const check = createAction(CHECK)

const checkSaga = createRequestSaga(CHECK, authAPI.check)
export function* userSaga(){
  yield takeLatest(CHECK, checkSaga) // 사용자가 발생시킨 액션에 대한 처리 
}

const initialState = {
  user: null,
  checkError: null 
}

// user : { _id, username }
export default handleActions(
  {
    [TEMP_SET_USER]: (state, { payload: user }) => ({
      ...state,
      user 
    }),
    [CHECK_SUCCESS]: (state, { payload: user }) => ({
      ...state,
      user,
      checkError: null 
    }),
    [CHECK_FAILURE]: (state, { payload: error }) => ({ // 서버요청 에러
      ...state,
      user: null,
      checkError: error 
    })
  },
  initialState
)