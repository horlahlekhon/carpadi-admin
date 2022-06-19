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
import { t } from '../styles/theme'
import {
  ChevronRight,
  CreditCard,
  Visibility,
  VisibilityOff
} from '@material-ui/icons'
import { useState } from 'react'
import { useRouter } from 'next/router'

function SettingsPage() {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState('payment-setup')
  const [bankAccount, setBankAccount] = useState('')
  const [values, setValues] = useState({
    showPassword: false,
    password: null
  })

  const handleNavigation = (action: string) => {
    router.replace(`${action}`)
  }

  const saveChanges = () => {
    if (currentTab === 'payment-setup') {
      return
    } else if (currentTab === 'fee-management') {
      return
    } else if (currentTab === 'security') {
      return
    } else {
      return
    }
  }

  const handlePasswordChange = (prop) => (event) => {
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

  return (
    <Container>
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
                  <CreditCard />
                </div>
                <div className="text">Payment Setup</div>
              </div>
              <div className="bottom">Carpadi bank account details</div>
            </div>
            <div className="arrow">
              <ChevronRight />
            </div>
          </NavTab>
          <NavTab
            className={currentTab === 'fee-management' ? 'active' : ''}
            onClick={() => setCurrentTab('fee-management')}
          >
            <div className="main">
              <div className="top">
                <div className="icon">
                  <CreditCard />
                </div>
                <div className="text">Fee Management</div>
              </div>
              <div className="bottom">Manage user fees</div>
            </div>
            <div className="arrow">
              <ChevronRight />
            </div>
          </NavTab>
          <NavTab
            className={currentTab === 'security' ? 'active' : ''}
            onClick={() => setCurrentTab('security')}
          >
            <div className="main">
              <div className="top">
                <div className="icon">
                  <CreditCard />
                </div>
                <div className="text">Security</div>
              </div>
              <div className="bottom">Update password</div>
            </div>
            <div className="arrow">
              <ChevronRight />
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
              <FormControl style={{ width: 370, marginTop: 30 }}>
                <Select
                  value={bankAccount}
                  onChange={(event) =>
                    setBankAccount(String(event.target.value))
                  }
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
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
                style={{ width: 370, marginTop: 24 }}
              />
              <TextField
                label="Account Name"
                style={{ width: 370, marginTop: 24 }}
              />

              <Typography
                variant="body1"
                style={{ color: t.lightGrey, marginTop: 40 }}
              >
                Approve Changes
              </Typography>
              <FormControl
                style={{ width: 370, marginTop: 20 }}
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
                          <VisibilityOff />
                        ) : (
                          <Visibility />
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
              <FlexRow style={{ marginTop: 30 }}>
                <span>Transfer Fee</span>
                <FlexRow style={{ width: 220 }}>
                  <div className="box">%</div>
                  <TextField
                    placeholder="Enter Fee"
                    style={{ width: 400 }}
                  ></TextField>
                </FlexRow>
              </FlexRow>
              <FlexRow style={{ marginTop: 30 }}>
                <span>Close Trade Fee</span>
                <FlexRow style={{ width: 220 }}>
                  <div className="box">%</div>
                  <TextField
                    placeholder="Enter Fee"
                    style={{ width: 400 }}
                  ></TextField>
                </FlexRow>
              </FlexRow>

              <Typography
                variant="body1"
                style={{ color: t.lightGrey, marginTop: 40 }}
              >
                Approve Changes
              </Typography>
              <FormControl
                style={{ width: 370, marginTop: 20 }}
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
                          <VisibilityOff />
                        ) : (
                          <Visibility />
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
                style={{ width: 370, marginTop: 20 }}
                variant="standard"
              >
                <InputLabel htmlFor="standard-adornment-password">
                  Current Password
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
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl
                style={{ width: 370, marginTop: 20 }}
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
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl
                style={{ width: 370, marginTop: 20 }}
                variant="standard"
              >
                <InputLabel htmlFor="standard-adornment-password">
                  Confirm Password
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
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </>
          )}
          <div className="submit">
            <Button text="Save Changes" width={372} />
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
