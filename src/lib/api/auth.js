import client from './client'

// REGISTER/LOGIN 액션에 대해 결과적으로 실행되는 함수(단계 6) - 실질적인 서버요청을 수행
export const login = ({ username, password }) => client.post('/api/auth/login', { username, password })

export const register = ({ username, password }) => client.post('/api/auth/register', { username, password })

export const check = () => client.get('/api/auth/check')

export const logout = () => client.post('/api/auth/logout')

