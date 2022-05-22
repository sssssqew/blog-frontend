import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";

const RegisterForm = () => {
  const dispatch = useDispatch()
  const { form } = useSelector(({ auth })=> ({
    form: auth.register // form : { username: '', password: '', passwordConfirm: '' }
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
    // 구현예정 
  }
  useEffect(()=>{
    dispatch(initializeForm('register'))
  }, [dispatch])

  return (
    <AuthForm type='register' form={form} onChange={onChange} onSubmit={onSubmit}/>
  )
}

export default RegisterForm