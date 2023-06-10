import {
  Avatar,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Typography
} from '@material-ui/core'
import { DateParse } from '../../shared/date'
import styled from 'styled-components'
import { SearchOutlined } from '@material-ui/icons'
import { t } from '../../../styles/theme'
import { authService } from '../../../services/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { allowedSearchModules } from '../../../lib/constants'

function TopBar() {
  const router = useRouter()
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });
  const currentDate = new Date().toISOString().split('T')[0];

  // const currentUser = authService.userValue
  const [currentUser, setCurrentUser] = useState(null);
  const [query, setQuery] = useState('')
  const [cRoute, setCRoute] = useState('')

  const handleNavigation = (action: string) => {
    router.push(`${action}`).then(() => {})
  }

  const handleSearch = () => {
    const paths = router.route.split('/')
    let path = allowedSearchModules.includes(paths[1])
      ? paths[1] !== 'search'
        ? paths[1]
        : localStorage.getItem('recentSearchModule')
      : paths[1]
    handleNavigation(`/search?type=${path}&searchTerm=${query}`)
  }


  useEffect(() => {
    // Fetch the user data on the client side
    const fetchUser = async () => {
      const user = await authService.userValue
      setCurrentUser(user);
    };

    fetchUser();
  }, []);


  useEffect(() => {
    setCRoute(router.route.split('/')[1])
  }, [router])

  return (
    <Header>
      <Typography component={'div'}>
        <div>
          {currentTime} 
          <span style={{ marginRight: '3px', marginLeft: '3px' }}>-</span>
          {currentDate}

        </div>
        {/* <DateGroup>
          <div>{currentDate.split('T')[1].substring(0, 5)}</div>
          
          <DateParse dateString={currentDate.split('T')[0]}></DateParse>
        </DateGroup> */}
      </Typography>
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
          disabled={!allowedSearchModules.includes(cRoute)}
          value={query}
          onChange={(e) => {
            if (
              e.target.value === '' ||
              e.target.value === undefined ||
              e.target.value === null
            ) {
              setQuery('')
            } else {
              setQuery(e.target.value)
            }
          }}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault()
              handleSearch()
            }
          }}
        />
      </FormControl>
      <User onClick={() => router.push('/user-profile')}>
      {/* {currentUser?.profile_picture ? (
              <img
                loading="lazy"
                className="image"
                src="/images/Big-Default-Car.png"
                alt="James Dalles"
              />
            ) : (
              <Avatar
                className="image"
                style={{ backgroundColor: t.primaryDeepBlue }}
              >
                {String(currentUser?.first_name).slice(0, 1) +
                  String(currentUser?.last_name).slice(0, 1)}
              </Avatar>
            )} */}
        {currentUser?.profile_picture && (
          <img
            loading="lazy"
            className="image"
            src="/images/Big-Default-Car.png"
            alt="James Dalles"
          />
        )}
        {!currentUser?.profile_picture && (
          <Avatar
            className="image"
            style={{ backgroundColor: t.primaryDeepBlue }}
          >
            {String(currentUser?.first_name).slice(0, 1) +
              String(currentUser?.last_name).slice(0, 1)}
          </Avatar>
        )}
        <div className="text">
          {!!currentUser
            ? `${currentUser.first_name} ${currentUser.last_name}`
            : 'N/A'}
        </div>
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
