import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm, register } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";
import { check } from '../../modules/user'
import { withRouter } from "react-router-dom";

const RegisterForm = ({ history }) => {
  const [error,setError] = useState(null)
  const dispatch = useDispatch()
  const { form, auth, authError, user } = useSelector(({ auth, user })=> ({
    form: auth.register, // form : { username: '', password: '', passwordConfirm: '' }
    auth: auth.auth, // auth: { _id, username } // 서버응답
    authError: auth.authError,
    user: user.user 
  }))
  const onChange = e => {
    const { name, value } = e.target 
    dispatch(changeField({
      form: 'register',
      key: name,
      value 
    }))
  }
  const onSubmit = e => {
    e.preventDefault() // form 의 새로고침 방지 
    const { username, password, passwordConfirm } = form 
    if([username, password, passwordConfirm].includes('')){ // 입력창이 하나라도 비어있는 경우
      setError('빈 칸을 모두 입력하세요.')
      return 
    }
    if(password !== passwordConfirm){ // 비밀번호가 일치하지 않는 경우 
      setError('비밀번호가 일치하지 않습니다.')
      dispatch(changeField({ form: 'register', key: 'password', value: ''}))
      dispatch(changeField({ form: 'register', key: 'passwordConfirm', value: ''}))
      return 
    }
    dispatch(register({ username, password }))
  }
  useEffect(()=>{
    dispatch(initializeForm('register'))
  }, [dispatch])

  // 회원가입 성공/실패 처리
  // submit 버튼을 눌러서 서버에서 응답받아서 state 가 변경되면 모든 컴포넌트가 리렌더링되면서 useEffect 를 실행함
  useEffect(() => {
    if(authError){
      console.log('오류 발생')
      console.log(authError)
      if(authError.response.status === 409){ // 이미 계정이 존재하는 경우
        setError('이미 존재하는 계정명입니다.')
        return 
      }
      // 서버오류
      setError('회원가입 실패')
      return 
    }
    if(auth){
      console.log('회원가입 성공')
      console.log(auth)
      dispatch(check()) // user : { _id, username } 정보 가져오기 
    }
  }, [auth, authError, dispatch])

  // user 정보를 제대로 가져왔는지 확인하기 - dispatch(check()) 실행후 user 상태가 스토어에서 변경되면 컴포넌트가 리렌더링되면서 useEffect 가 실행됨
  useEffect(() => {
    if(user){
      console.log('check API 성공')
      console.log(user)
      history.push('/') // user 정보가 존재하면 홈으로 이동하기
      try{ // 로그인 정보를 로컬 스토리지에 저장하기 
        localStorage.setItem('user', JSON.stringify(user))
      }catch(e){
        console.log('local storage is not working !')
      }
    }
  }, [history, user])

  return (
    <AuthForm type='register' form={form} onChange={onChange} onSubmit={onSubmit} error={error}/>
  )
}

export default withRouter(RegisterForm)