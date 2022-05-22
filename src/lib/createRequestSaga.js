import { call, put } from 'redux-saga/effects' // put : 액션 디스패치, call : 함수 실행 
import { startLoading, finishLoading } from '../modules/loading'

export const createRequestActionTypes = type => {
  const SUCCESS = `${type}_SUCCESS`
  const FAILURE = `${type}_FAILURE`
  return [type, SUCCESS, FAILURE]
}

// type : 'auth/REGISTER' 혹은 'auth/LOGIN'
// request : lib/api/auth 파일의 register 혹은 login 함수 => 파라미터: { username, password }
export default function createRequestSaga(type, request){ 
  const SUCCESS = `${type}_SUCCESS` 
  const FAILURE = `${type}_FAILURE` 

  // REGISTER/LOGIN 액션이 발생하면 createRequestSaga 이 반환하는 제너레이터 함수가 실행됨(단계 4)
  return function*(action){
    yield put(startLoading(type))
    try{
      // call(request, action.payload) : register({ username, password }) 실행 혹은 login({ username, password }) 실행됨(단계 5)
      const response = yield call(request, action.payload) // action.payload : { username, password }
      yield put({
        type: SUCCESS,
        payload: response.data 
      })
    }catch(e){
      yield put({
        type: FAILURE,
        payload: e,
        error: true 
      })
    }
    yield put(finishLoading(type))
  }
}