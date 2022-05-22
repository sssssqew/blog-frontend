import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import { takeLatest } from "redux-saga/effects";
import createRequestSaga, { createRequestActionTypes } from '../lib/createRequestSaga'
import * as authAPI from '../lib/api/auth'

const CHANGE_FIELD = 'auth/CHANGE_FIELD'
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM'

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes('auth/REGISTER')
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes('auth/LOGIN')

// 컴포넌트에서 사용자가 발생시키는 액션 (단계 1)
export const changeField = createAction(CHANGE_FIELD, ({ form, key, value }) => ({ form, key, value }))
export const initializeForm = createAction(INITIALIZE_FORM, form => form)

export const register = createAction(REGISTER, ({ username, password }) => ({
  username, password // action.payload 
}))
export const login = createAction(LOGIN, ({ username, password }) => ({
  username, password 
}))

const registerSaga = createRequestSaga(REGISTER, authAPI.register) // 사용자가 발생시킨 액션에 대한 처리로직(단계 3)
const loginSaga = createRequestSaga(LOGIN, authAPI.login)
export function* authSaga(){
  yield takeLatest(REGISTER, registerSaga) // 사용자가 발생시킨 액션에 대한 처리로직(단계 2)
  yield takeLatest(LOGIN, loginSaga)
}


const initialState = {
  // 사용자 입력에 관련된 상태
  register: {
    username: '',
    password: '',
    passwordConfirm: ''
  },
  login: {
    username: '',
    password: ''
  },
  // 회원가입/로그인에 관련된 상태 
  auth: null,
  authError: null 
}

const auth = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: { form, key, value }}) => produce(state, draft => {
      draft[form][key] = value // form => register/login , key => username/password/passwordConfirm
    }),
    [INITIALIZE_FORM]: (state, { payload: form }) => ({
      ...state,
      [form]: initialState[form]
    }),
    // auth : { _id, username }
    [REGISTER_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      auth,
      authError: null 
    }),
    [REGISTER_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error
    }),
    [LOGIN_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      auth,
      authError: null 
    }),
    [LOGIN_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error
    })
  },
  initialState
)

export default auth 