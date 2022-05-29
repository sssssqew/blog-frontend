import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from '@redux-saga/core';
import rootReducer, { rootSaga } from './modules';
import { tempSetUser, check } from './modules/user';

const sagaMiddleware = createSagaMiddleware() 

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))

function loadUser(){
  try{
    const user = localStorage.getItem('user')
    if(!user) return 

    store.dispatch(tempSetUser(JSON.parse(user))) // 로컬스토리지에 사용자 정보가 존재하면 해당 정보를 스토어에 넣어줌
    store.dispatch(check()) // 진짜 로그인 상태인지 재차 확인하기 위해 서버에 요청함 - 로컬스토리지에 사용자 정보가 존재하더라도 토큰 기간이 만료되면 다시 로그인하도록 로컬스토리지와 스토어의 사용자 정보를 초기화해줘야 함
  }catch(e){
    console.log('localStorage is not working')
  }
}

sagaMiddleware.run(rootSaga) // 사용자 액션이 들어올때마다 처리함 (사용자 액션을 기다림)
loadUser()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
