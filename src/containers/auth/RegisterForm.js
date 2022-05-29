import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm, register } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";
import { check } from '../../modules/user'
import { withRouter } from "react-router-dom";

const RegisterForm = ({ history }) => {
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
    if(password !== passwordConfirm){
      // TODO: 오류 처리 
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
    }
  }, [history, user])

  return (
    <AuthForm type='register' form={form} onChange={onChange} onSubmit={onSubmit}/>
  )
}

export default withRouter(RegisterForm)