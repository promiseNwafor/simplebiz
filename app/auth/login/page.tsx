import AuthWrapper from '@/components/auth/AuthWrapper'
import LoginContainer from '@/components/auth/LoginContainer'

const LoginPage = () => {
  return (
    <AuthWrapper imageSrc='/images/invoice-bill-for-payment-of-utility.png'>
      <LoginContainer />
    </AuthWrapper>
  )
}

export default LoginPage
