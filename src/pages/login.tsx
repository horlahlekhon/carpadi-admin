import styled from 'styled-components'
import {t} from '../styles/theme'
import {
    Card,
    FormControl,
    IconButton,
    InputLabel,
    Input,
    InputAdornment,
    CardContent,
    Checkbox,
    TextField,
    Typography
} from '@material-ui/core'
import {Visibility, VisibilityOff} from '@material-ui/icons'
import Image from 'next/image'
import classes from '../styles/Auth.module.css'
import ReCAPTCHA from 'react-google-recaptcha'
import {useState} from 'react'
import Button from '../components/shared/Button'
import {authService} from '../services/auth'
import {useRouter} from "next/router";
import {Toaster, toast} from "react-hot-toast";

function LoginPage() {
    const router = useRouter();
    const [values, setValues] = useState({
        showPassword: false,
        password: null,
        username: null,
        isLoading: false
    })

    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value})
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
        console.log('Captcha value:', value)
    }

    const loginUser = () => {
        setValues({...values, "isLoading": true})
        return authService.login(values.username, values.password)
            .then((data) => {
                if (data.status) {
                    const returnUrl = router.query.returnUrl || '/';
                    // @ts-ignore
                    router.push(returnUrl);
                } else {
                    toast.error(data?.data || "An error occurred")
                }
                setValues({...values, "isLoading": false})
            })
            .catch(error => {
                toast.error(error)
                setValues({...values, "isLoading": false})
            });
    }

    return (
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
                    <Typography className={classes.title}>
                        Admin Portal
                    </Typography>
                    <Card
                        variant="outlined"
                        className={classes.card}
                    >
                        <CardContent className={classes.centered}>
                            <Image
                                src={'/logos/blue-full.png'}
                                width="300px"
                                height="114px"
                            ></Image>

                            <TextField
                                id="standard-basic"
                                label="Email Address"
                                variant="standard"
                                type="email"
                                fullWidth
                                value={values.username}
                                onChange={handleChange('username')}
                                style={{marginTop: '20px', width: '372px'}}
                            />

                            <FormControl
                                style={{width: '372px', marginTop: '41px'}}
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
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {values.showPassword ? (
                                                    <VisibilityOff/>
                                                ) : (
                                                    <Visibility/>
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
                            <ReCAPTCHA
                                sitekey="6LcIFiAgAAAAAO5J1kPxk306OqFVPaUUiDesLsG5"
                                onChange={onCaptchaChange}
                                size="normal"
                            />
                            <Button width="372px" marginTop="32px" text={values.isLoading ? "Loading..." : "Login"}
                                    onClick={loginUser}/>
                        </CardContent>
                    </Card>
                </div>
            </FormContainer>
        </Container>
    )
}

export default LoginPage

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${t.liteGrey};
  display: flex;
  flex-direction: row;
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
