import {
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    Typography
} from '@material-ui/core'
import {DateParse, TimeParse} from '../../shared/date'
import styled from 'styled-components'
import {SearchOutlined} from '@material-ui/icons'
import {t} from '../../../styles/theme'

function TopBar() {
    return (
        <Header>
            <div>&nbsp;</div>
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
            <Typography component={"div"}>
                <DateGroup>
                    <div>{new Date().toISOString().split('T')[1].substring(0, 5)}</div>
                    <div style={{marginRight: "3px", marginLeft: "3px"}}>-</div>
                    <DateParse dateString={new Date().toISOString().split('T')[0]}></DateParse>
                </DateGroup>
            </Typography>
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
`
