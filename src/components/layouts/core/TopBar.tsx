import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Typography
} from '@material-ui/core'
import { DateParse, TimeParse } from '../../shared/date'
import styled from 'styled-components'
import { SearchOutlined } from '@material-ui/icons'

function TopBar() {
  const currentDate = new Date().toISOString()
  return (
    <Header>
      <div>&nbsp;</div>
      <FormControl
        style={{ width: '372px', height: '58px' }}
        variant="standard"
      >
        <InputLabel htmlFor="standard-adornment-password">Search</InputLabel>
        <Input
          id="standard-adornment-password"
          type="text"
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility">
                <SearchOutlined />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Typography component={"div"}>
        <DateGroup>
          <TimeParse dateString={currentDate}></TimeParse> &nbsp; - &nbsp;
          <DateParse dateString={currentDate}></DateParse>
        </DateGroup>
      </Typography>
    </Header>
  )
}

export default TopBar

const DateGroup = styled.div`
  margin-right: 27px;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  height: 68px;
  width: 100%;
`
