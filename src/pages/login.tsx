import styled from 'styled-components'
import { t } from '../styles/theme'
import {
  Card,
  CardContent,
  Checkbox,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Typography
} from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import Image from 'next/image'
import classes from '../styles/Auth.module.css'
import { useState } from 'react'
import Button from '../components/shared/Button'
import { authService } from '../services/auth'
import { verifyCapcha } from '../services/user'
import { useRouter } from 'next/router'
import { toast, Toaster } from 'react-hot-toast'
import getConfig from 'next/config'
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha
} from 'react-google-recaptcha-v3'

function LoginPage() {
  const router = useRouter()
  const [values, setValues] = useState({
    showPassword: false,
    password: '',
    username: '',
    isLoading: false
  })
  const [isVerified, setIsVerified] = useState(false)
  const { publicRuntimeConfig } = getConfig()

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!isVerified) {
        toast.error('Please verify captcha')
      } else if (values.username !== '' && values.password !== '') {
        loginUser()
      } else {
        toast.error('Please fill all fields')
      }
    }
  }

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword
    })
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const onCaptchaChange = (value) => {
    verifyCapcha(value)
      .then((res) => {
        if (res.data?.error) {
          toast.success(res.data?.error?.data || 'Captcha verification failed')
          setIsVerified(false)
        } else {
          toast.error('Captcha verification success')
          setIsVerified(true)
        }
      })
      .catch((err) => {
        toast.error('Captcha verification failed')
      })
  }

  const loginUser = () => {
    setValues({ ...values, isLoading: true })
    return authService
      .login(values.username, values.password)
      .then((data) => {
        if (data.status) {
          const returnUrl = router.query.returnUrl || '/'
          // @ts-ignore
          router.push(returnUrl)
        } else {
          toast.error(data?.data || 'An error occurred')
        }
        setValues({ ...values, isLoading: false })
      })
      .catch((error) => {
        toast.error(error)
        setValues({ ...values, isLoading: false })
      })
  }

  return (
    <>
      <Container>
        <ImageBg>
          <PhoneImage src={'/auth/phone.png'}></PhoneImage>
        </ImageBg>
        <FormContainer>
          <div>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  border: '1px solid #243773',
                  padding: '16px',
                  fontWeight: 'bold',
                  color: '#243773'
                },
                iconTheme: {
                  primary: '#243773',
                  secondary: '#FFFAEE'
                }
              }}
            />
          </div>
          <div>
            <Typography className={classes.title}>Admin Portal</Typography>
            <Card variant="outlined" className={classes.card}>
              <CardContent className={classes.centered}>
                <Image
                  src={'/logos/blue-full.png'}
                  width={300}
                  height={114}
                  alt=""
                />

                <TextField
                  id="standard-basic"
                  label="Email Address"
                  variant="standard"
                  type="email"
                  fullWidth
                  value={values.username}
                  onChange={handleChange('username')}
                  onKeyDown={handleKeyDown}
                  style={{ marginTop: '20px', width: '372px' }}
                />

                <FormControl
                  style={{ width: '372px', marginTop: '41px' }}
                  variant="standard"
                >
                  <InputLabel htmlFor="standard-adornment-password">
                    Password
                  </InputLabel>
                  <Input
                    id="standard-adornment-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
                    onKeyDown={handleKeyDown}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <RememberMe>
                  <Checkbox></Checkbox>
                  <Typography>Remember Me</Typography>
                </RememberMe>
                {/* <GoogleReCaptchaProvider
                  reCaptchaKey={publicRuntimeConfig.captchaKey}
                >
                  <GoogleReCaptcha onVerify={onCaptchaChange} />
                </GoogleReCaptchaProvider> */}
                <Button
                  width="372px"
                  marginTop="32px"
                  text={values.isLoading ? 'Loading...' : 'Login'}
                  disabled={
                    values.password === '' ||
                    values.username === ''
                  }
                  onClick={loginUser}
                />
              </CardContent>
            </Card>
          </div>
        </FormContainer>
      </Container>
      <NoView>
        <div>
          <Typography
            variant={'h5'}
            style={{ height: 'fit-content', fontWeight: 'bold' }}
          >
            Sorry, you cannot access this app on mobile.
          </Typography>
          <Typography
            variant={'body1'}
            style={{ height: 'fit-content', marginTop: '20px' }}
          >
            Try accessing it from your PC or a tablet.
          </Typography>
        </div>
      </NoView>
    </>
  )
}

export default LoginPage

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${t.liteGrey};
  display: flex;
  flex-direction: row;

  @media only screen and (max-width: 1079px) {
    display: none;
  }
`

const NoView = styled.div`
  display: none;
  @media only screen and (max-width: 1079px) {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    text-align: center;
    background: #243773;
    color: whitesmoke;
  }
`

const PhoneImage = styled.img`
  height: 759px;
  width: 441px;
  margin: auto;
`

const ImageBg = styled.div`
  width: 48%;
  height: 100%;
  background: white;
  background-image: url('/auth/vector.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const FormContainer = styled.div`
  width: 52%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const RememberMe = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${t.lightGrey};
  justify-content: start;
  margin-top: 18px;
  margin-bottom: 32px;
`
