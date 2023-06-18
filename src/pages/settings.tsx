import MainLayout from '../components/layouts/MainLayout'
import styled from 'styled-components'
import {
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    Select,
    TextField,
    Typography
} from '@material-ui/core'
import Button from '../components/shared/Button'
import {t} from '../styles/theme'
import {
    ChevronRight,
    CreditCard,
    Visibility,
    VisibilityOff,
    MonetizationOn,
    Lock
} from '@material-ui/icons'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {toast} from 'react-hot-toast'
import CPToast from "../components/shared/CPToast";
import {updateUserPassword} from "../services/user";
import {retrieveSettings, updateSetting} from "../services/setting";


function SettingsPage() {
    const router = useRouter()
    const [currentTab, setCurrentTab] = useState('payment-setup')
    const [bankAccount, setBankAccount] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [values, setValues] = useState({
        showOldPassword: false,
        showConfirmPassword: false,
        showPassword: false,
        password: '',
        oldPassword: '',
        confirmPassword: ''
    })

    const [fees, setFees] = useState({
        "id": null,
        "created": null,
        "modified": null,
        "carpadi_trade_rot_percentage": 0,
        "merchant_trade_rot_percentage": 0,
        "transfer_fee": 0,
        "close_trade_fee": 0,
        "carpadi_commision": 0,
        "bonus_percentage": 0
    })


    const saveChanges = () => {
        setLoading(true)
        if (currentTab === 'payment-setup') {
            return
        } else if (currentTab === 'fee-management') {
            if (fees.merchant_trade_rot_percentage > 0 && fees.carpadi_commision > 0 && fees.transfer_fee > 0 && fees.close_trade_fee > 0) {
                updateSetting(fees.id, fees)
                    .then((res) => {
                        if (res.status) {
                            toast.success('Saved!')
                        } else {
                            toast.error(res.data)
                        }
                    })
                    .catch((error) => {
                        toast.error(error)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            } else {
                toast.error("You have some invalid inputs, please review!")
                setLoading(false)
                return;
            }
        } else if (currentTab === 'security') {
            if ((values.password !== values.confirmPassword) || (values.password === values.oldPassword)) {
                toast.error("You have some invalid inputs, please review!")
                setLoading(false)
                return;
            }
            updateUserPassword({old_password: values.oldPassword, new_password: values.password})
                .then((res) => {
                    if (res.status) {
                        toast.success('Saved!')
                    } else {
                        toast.error(res.data)
                    }
                })
                .catch((error) => {
                    toast.error(error)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            return
            setLoading(false)
        }
    }

    const handlePasswordChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value})
    }

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword
        })
    }
    const handleClickShowOldPassword = () => {
        setValues({
            ...values,
            showOldPassword: !values.showOldPassword
        })
    }
    const handleClickShowConfirmPassword = () => {
        setValues({
            ...values,
            showConfirmPassword: !values.showConfirmPassword
        })
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    const handleFeeChange = (field, value) => {
        let obj = {...fees}
        obj[field] = value
        setFees(obj)
    }

    useEffect(() => {
        retrieveSettings()
            .then((res) => {
                if (res.status) {
                    if (res.data?.results.length > 0) {
                        setFees(res.data.results[0])
                    }
                } else {
                    toast.error(res.data)
                }
            })
            .catch((error) => {
                toast.error(error)
            })
    }, [])

    return (
        <Container>
            <CPToast/>
            <Header>
                <Typography variant="h4">
                    <b>Settings</b>
                </Typography>
            </Header>
            <MainCard>
                <div className="nav">
                    <NavTab
                        className={currentTab === 'payment-setup' ? 'active' : ''}
                        onClick={() => setCurrentTab('payment-setup')}
                    >
                        <div className="main">
                            <div className="top">
                                <div className="icon">
                                    <CreditCard/>
                                </div>
                                <div className="text">Payment Setup</div>
                            </div>
                            <div className="bottom">Carpadi bank account details</div>
                        </div>
                        <div className="arrow">
                            <ChevronRight/>
                        </div>
                    </NavTab>
                    <NavTab
                        className={currentTab === 'fee-management' ? 'active' : ''}
                        onClick={() => setCurrentTab('fee-management')}
                    >
                        <div className="main">
                            <div className="top">
                                <div className="icon">
                                    <MonetizationOn/>
                                </div>
                                <div className="text">Fee Management</div>
                            </div>
                            <div className="bottom">Manage user fees</div>
                        </div>
                        <div className="arrow">
                            <ChevronRight/>
                        </div>
                    </NavTab>
                    <NavTab
                        className={currentTab === 'security' ? 'active' : ''}
                        onClick={() => setCurrentTab('security')}
                    >
                        <div className="main">
                            <div className="top">
                                <div className="icon">
                                    <Lock/>
                                </div>
                                <div className="text">Security</div>
                            </div>
                            <div className="bottom">Update password</div>
                        </div>
                        <div className="arrow">
                            <ChevronRight/>
                        </div>
                    </NavTab>
                </div>
                <div className="content">
                    {currentTab === 'payment-setup' && (
                        <>
                            <Typography variant="h6">Payment Setup</Typography>
                            <Typography variant="body1" color="secondary">
                                Carpadi bank account details
                            </Typography>
                            <FormControl style={{width: 370, marginTop: 30}}>
                                <Select
                                    value={bankAccount}
                                    onChange={(event) =>
                                        setBankAccount(String(event.target.value))
                                    }
                                    displayEmpty
                                    inputProps={{'aria-label': 'Without label'}}
                                >
                                    <option value="" disabled>
                                        Bank Account
                                    </option>
                                    <option value={'One'}>One</option>
                                    <option value={'Two'}>Two</option>
                                    <option value={'Three'}>Three</option>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Account Number"
                                style={{width: 370, marginTop: 24}}
                            />
                            <TextField
                                label="Account Name"
                                style={{width: 370, marginTop: 24}}
                            />

                            <Typography
                                variant="body1"
                                style={{color: t.lightGrey, marginTop: 40}}
                            >
                                Approve Changes
                            </Typography>
                            <FormControl
                                style={{width: 370, marginTop: 20}}
                                variant="standard"
                            >
                                <InputLabel htmlFor="standard-adornment-password">
                                    Enter Password
                                </InputLabel>
                                <Input
                                    id="standard-adornment-password"
                                    type={values.showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    onChange={handlePasswordChange('password')}
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
                        </>
                    )}
                    {currentTab === 'fee-management' && (
                        <>
                            <Typography variant="h6">Fee Management</Typography>
                            <Typography variant="body1" color="secondary">
                                Manage users fees
                            </Typography>
                            <FlexRow style={{marginTop: 30}}>
                                <span>Transfer Fee</span>
                                <FlexRow style={{width: 220}}>
                                    <div className="box">%</div>
                                    <TextField
                                        placeholder="Enter Fee"
                                        style={{width: 400}}
                                        type='text'
                                        value={fees?.transfer_fee}
                                        onChange={(e) => handleFeeChange('transfer_fee', e.target.value)}
                                    ></TextField>
                                </FlexRow>
                            </FlexRow>
                            <FlexRow style={{marginTop: 30}}>
                                <span>Close Trade Fee</span>
                                <FlexRow style={{width: 220}}>
                                    <div className="box">%</div>
                                    <TextField
                                        placeholder="Enter Fee"
                                        style={{width: 400}}
                                        type='text'
                                        value={fees?.close_trade_fee}
                                        onChange={(e) => handleFeeChange('close_trade_fee', e.target.value)}
                                    ></TextField>
                                </FlexRow>
                            </FlexRow>
                            <FlexRow style={{marginTop: 30}}>
                                <span>Traders ROT per slot</span>
                                <FlexRow style={{width: 220}}>
                                    <div className="box">%</div>
                                    <TextField
                                        placeholder="Enter Percentage"
                                        style={{width: 400}}
                                        type='text'
                                        value={fees?.merchant_trade_rot_percentage}
                                        onChange={(e) => handleFeeChange('merchant_trade_rot_percentage', e.target.value)}
                                    ></TextField>
                                </FlexRow>
                            </FlexRow>
                            <FlexRow style={{marginTop: 30}}>
                                <span>Carpadi ROT per slot</span>
                                <FlexRow style={{width: 220}}>
                                    <div className="box">%</div>
                                    <TextField
                                        placeholder="Enter Percentage"
                                        style={{width: 400}}
                                        type='text'
                                        value={fees?.carpadi_commision}
                                        onChange={(e) => handleFeeChange('carpadi_commision', e.target.value)}
                                    ></TextField>
                                </FlexRow>
                            </FlexRow>

                            <Typography
                                variant="body1"
                                style={{color: t.lightGrey, marginTop: 40}}
                            >
                                Approve Changes
                            </Typography>
                            <FormControl
                                style={{width: 370, marginTop: 20}}
                                variant="standard"
                            >
                                <InputLabel htmlFor="standard-adornment-password">
                                    Enter Password
                                </InputLabel>
                                <Input
                                    id="standard-adornment-password"
                                    type={values.showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    onChange={handlePasswordChange('password')}
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
                        </>
                    )}
                    {currentTab === 'security' && (
                        <>
                            <Typography variant="h6">Security</Typography>
                            <Typography variant="body1" color="secondary">
                                Update Password
                            </Typography>

                            <FormControl
                                style={{width: 370, marginTop: 20}}
                                variant="standard"
                            >
                                <InputLabel htmlFor="standard-adornment-password">
                                    Current Password
                                </InputLabel>
                                <Input
                                    id="standard-adornment-password"
                                    type={values.showOldPassword ? 'text' : 'password'}
                                    value={values.oldPassword}
                                    onChange={handlePasswordChange('oldPassword')}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowOldPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {values.showOldPassword ? (
                                                    <VisibilityOff/>
                                                ) : (
                                                    <Visibility/>
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            <FormControl
                                style={{width: 370, marginTop: 20}}
                                variant="standard"
                            >
                                <InputLabel htmlFor="standard-adornment-password">
                                    New Password
                                </InputLabel>
                                <Input
                                    id="standard-adornment-password"
                                    type={values.showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    onChange={handlePasswordChange('password')}
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
                            <FormControl
                                style={{width: 370, marginTop: 20}}
                                variant="standard"
                            >
                                <InputLabel htmlFor="standard-adornment-password">
                                    Confirm Password
                                </InputLabel>
                                <Input
                                    id="standard-adornment-password"
                                    type={values.showConfirmPassword ? 'text' : 'password'}
                                    value={values.confirmPassword}
                                    onChange={handlePasswordChange('confirmPassword')}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowConfirmPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {values.showConfirmPassword ? (
                                                    <VisibilityOff/>
                                                ) : (
                                                    <Visibility/>
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </>
                    )}
                    <div className="submit">
                        <Button
                            text={isLoading ? "Saving ..." : "Save Changes"}
                            width={372}
                            disabled={isLoading}
                            onClick={() => saveChanges()}
                        />
                    </div>
                </div>
            </MainCard>
        </Container>
    )
}

export default SettingsPage

SettingsPage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`

const MainCard = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${t.white};
  border-radius: 12px;
  padding: 30px;
  width: 100%;
  height: calc(100vh - 180px);

  .nav {
    width: 40%;
  }

  .content {
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .submit {
      margin-top: auto;
      justify-content: flex-end;
      align-self: end;
      width: fit-content;
    }
  }
`

const NavTab = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  margin-right: 40px;
  border-bottom: 1px solid ${t.extraLiteGrey};
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &.active {
    color: ${t.primaryBlue};
  }

  .main {
    display: flex;
    flex-direction: column;

    .top {
      display: flex;
      flex-direction: row;
      align-items: center;

      .icon {
        height: 20px;
        width: 20px;
        margin-right: 16px;
      }

      .text {
        font-size: 18px;
        font-weight: 700;
      }
    }

    .bottom {
      margin-left: 35px;
      margin-top: 6px;
      margin-bottom: 6px;
    }
  }

  .arrow {
    height: 20px;
  }
`
const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  .box {
    height: 27px;
    width: 27px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${t.lightGrey};
    background: transparent;
    margin-right: 10px;
    font-weight: 700;
    font-size: 16px;
  }
`
