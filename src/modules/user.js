import { createAction, handleActions } from "redux-actions";
import { takeLatest, call } from "redux-saga/effects";
import * as authAPI from '../lib/api/auth'
import createRequestSaga, {createRequestActionTypes} from "../lib/createRequestSaga";

const TEMP_SET_USER = 'user/TEMP_SET_USER' // 새로고침 이후 임시 로그인 처리 
const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] = createRequestActionTypes('user/CHECK')
const LOGOUT = 'user/LOGOUT'

// 사용자가 외부에서 발생시키는 액션함수
export const tempSetUser = createAction(TEMP_SET_USER, user => user)
export const check = createAction(CHECK)
export const logout = createAction(LOGOUT)

const checkSaga = createRequestSaga(CHECK, authAPI.check)
function checkFailureSaga(){ // 로그인한 사용자 정보가 서버에 존재하지 않는 경우 로컬스토리지에 저장된 사용자 정보 초기화
  try{
    localStorage.removeItem('user')
  }catch(e){
    console.log('localStorage is not working')
  }
}
function* logoutSaga(){
  try{
    yield call(authAPI.logout) // logout API 호출하기 - 쿠키에 저장된 access_token 이 삭제됨
    localStorage.removeItem('user')
  }catch(e){
    console.log(e)
  }
}
export function* userSaga(){
  yield takeLatest(CHECK, checkSaga) // 사용자가 발생시킨 액션에 대한 처리 
  yield takeLatest(CHECK_FAILURE, checkFailureSaga)
  yield takeLatest(LOGOUT, logoutSaga)
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
      user: null, // 로그인한 사용자 정보가 서버에 존재하지 않는 경우 스토어의 사용자 정보 초기화
      checkError: error 
    }),
    [LOGOUT]: state => ({
      ...state,
      user: null // 로그아웃되면 스토어에 저장된 user 정보도 초기화해줌
    })
  },
  initialState
)