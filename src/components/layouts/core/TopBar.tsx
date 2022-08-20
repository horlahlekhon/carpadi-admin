import {
    Avatar,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    Typography
} from '@material-ui/core'
import {DateParse} from '../../shared/date'
import styled from 'styled-components'
import {SearchOutlined} from '@material-ui/icons'
import {t} from '../../../styles/theme'
import {authService} from "../../../services/auth"
import {useRouter} from "next/router";

function TopBar() {
    const router = useRouter()
    const currentDate = new Date().toISOString();
    const currentUser = authService.userValue;

    return (
        <Header>
            <Typography component={'div'}>
                <DateGroup>
                    <div>{currentDate.split('T')[1].substring(0, 5)}</div>
                    <div style={{marginRight: '3px', marginLeft: '3px'}}>-</div>
                    <DateParse dateString={currentDate.split('T')[0]}></DateParse>
                </DateGroup>
            </Typography>
            <FormControl
                style={{width: '372px', height: '58px'}}
                variant="standard"
            >
                <InputLabel htmlFor="standard-adornment-password">Search</InputLabel>
                <Input
                    id="standard-adornment-password"
                    type="text"
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton aria-label="toggle password visibility">
                                <SearchOutlined/>
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <User onClick={() => router.push('/user-profile')}>
                {currentUser?.profile_picture && <img
                    className="image"
                    src="/images/Big-Default-Car.png"
                    alt="James Dalles"
                />}
                {!currentUser?.profile_picture && <Avatar className='image'>{currentUser?.first_name.slice(0,1)+currentUser?.last_name.slice(0,1)}</Avatar>}
                <div
                    className="text">{!!currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "N/A"}</div>
            </User>
        </Header>
    )
}

export default TopBar

const DateGroup = styled.div`
  margin-right: 27px;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${t.grey};
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  height: 68px;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
`

const User = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  .image {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 8px;
  }

  .text {
    font-weight: bold;
  }
`
