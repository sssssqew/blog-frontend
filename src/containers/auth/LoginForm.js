import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";

const LoginForm = () => {
  const dispatch = useDispatch()
  const { form } = useSelector(({ auth })=> ({
    form: auth.login // form : { username: '', password: '' }
  }))
  const onChange = e => {
    const { name, value } = e.target 
    dispatch(changeField({
      form: 'login',
      key: name,
      value 
    }))
  }
  const onSubmit = e => {
    e.preventDefault() // form 의 새로고침 방지 
    // 구현예정 
  }
  useEffect(()=>{
    dispatch(initializeForm('login'))
  }, [dispatch])

  return (
    <AuthForm type='login' form={form} onChange={onChange} onSubmit={onSubmit}/>
  )
}

export default LoginForm