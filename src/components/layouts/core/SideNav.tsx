import Image from 'next/image'
import styles from '../../../styles/SideNav.module.css'
import styled from 'styled-components'
import { t } from '../../../styles/theme'
import {
  Collapse,
  createStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { authService } from '../../../services/auth'
import { ExpandLess, ExpandMore, StarBorder, Inbox } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper
    },
    nested: {
      paddingLeft: theme.spacing(4),
      color: '#111',
    }
  })
)

function SideNav() {
  const router = useRouter()
  const [isFullNav, setIsFullNav] = useState(true)
  const [open, setOpen] = useState(false)

  const classes = useStyles()

  const handleClick = () => {
    setOpen(!open)
  }

  const toggleNav = () => {
    setIsFullNav(!isFullNav)
  }

  const handleResize = () => {
    if (window.innerWidth <= 1200) {
      setIsFullNav(false)
    } else {
      setIsFullNav(true)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
  })

  const logout = () => {
    authService.logout()
  }

  const Hamburger = styled.div`
    width: ${isFullNav ? '' : 'fit-content'};
    height: 48px;
    padding: 16px 25px;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 4px;
    margin-left: ${!isFullNav ? 'auto' : '0'};
    margin-right: ${!isFullNav ? 'auto' : '0'};
  `

  const NotificationCount = styled.span`
    height: 20px;
    width: 20px;
    background: ${t.alertError};
    color: ${t.white};
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: ${isFullNav ? '40px' : 'auto'};
  `

  return (
    <div className={isFullNav ? styles.main : styles.main__small}>
      <div className={isFullNav ? styles.logo : styles.logo__small}>
        <Image
          src={isFullNav ? '/logos/white-full.png' : '/logos/white-no-text.png'}
          width={isFullNav ? 244 : 56}
          height={isFullNav ? 93 : 56}
          alt=""
        />
      </div>
      {isFullNav && (
        <Pill>
          <Typography component={'span'}>Super Admin</Typography>
        </Pill>
      )}
      <Hamburger>
        <Image
          src={
            isFullNav ? '/icons/Collapse-White.svg' : '/icons/Extend-White.svg'
          }
          width={isFullNav ? 24 : 24}
          height={isFullNav ? 24 : 24}
          alt=""
          className={styles.pointer}
          onClick={toggleNav}
        />
      </Hamburger>
      <Nav>
          <NavItem onClick={() => router.push('/')} className={router.pathname == '/' ? 'active' : ''}>
            <Image src="/icons/Home-White.svg" width={18} height={21.5} alt=""/>
            <p
              className={`${styles.navitem__text} ${
                isFullNav ? '' : styles.hidden
              }`}
            >
              <Typography component={'span'}>Dashboard</Typography>
            </p>
            {router.pathname == '/' && <ActiveNavItem>&nbsp;</ActiveNavItem>}
          </NavItem>
          <NavItem
          onClick={() => router.push('/notifications')}
            className={
              router.pathname.startsWith('/notifications') ? 'active' : ''
            }
          >
            <Image
              src="/icons/Notification-White.svg"
              width={18}
              height={21.5}
              alt=''
            />
            <p
              className={`${styles.navitem__text} ${
                isFullNav ? '' : styles.hidden
              }`}
            >
              <Typography component={'span'}>Notification</Typography>
            </p>
            {/*<NotificationCount>5</NotificationCount>*/}
            {router.pathname.startsWith('/notifications') && (
              <ActiveNavItem>&nbsp;</ActiveNavItem>
            )}
          </NavItem>
          <NavItem
           onClick={() => router.push('/trade')}
            className={router.pathname.startsWith('/trade') ? 'active' : ''}
          >
            <Image src="/icons/Trade-White.svg" width={18} height={21.5} alt=""/>
            <p
              className={`${styles.navitem__text} ${
                isFullNav ? '' : styles.hidden
              }`}
            >
              <Typography component={'span'}>Trade</Typography>
            </p>
            {router.pathname.startsWith('/trade') && (
              <ActiveNavItem>&nbsp;</ActiveNavItem>
            )}
          </NavItem>
          <>
            <NavItem
              className={router.pathname.startsWith('/sales') ? 'active' : ''}
              onClick={handleClick}
            >
              <Image src="/icons/Sales-White.svg" width={18} height={21.5} alt=""/>
              <p
                className={`${styles.navitem__text} ${
                  isFullNav ? '' : styles.hidden
                }`}
              >
                <Typography component={'span'} className="sales">
                  Sales Platform {open ? <ExpandLess /> : <ExpandMore />}
                </Typography>
              </p>
              {router.pathname.startsWith('/sales') && (
                <ActiveNavItem>&nbsp;</ActiveNavItem>
              )}
            </NavItem>
            <Collapse
              in={open}
              timeout="auto"
              unmountOnExit
              style={{ margin: '0 24px' }}
            >
              <List style={{ borderRadius: '5px', height: '100px', position:'relative', zIndex: '10000', background: '#FAFAFA' }} component="div" disablePadding>
                <Link href="/sales">
                  <ListItem button className={classes.nested}>
                    <ListItemText primary={!isFullNav ? 'Sell' : 'Selling'} />
                  </ListItem>
                </Link>
                <Link href="/sales/buying">
                  <ListItem button className={classes.nested}>
                    <ListItemText primary={!isFullNav ? 'Buy' : 'Buying'} />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
          </>
          <NavItem
                    onClick={() => router.push('/inventory')}
            className={router.pathname.startsWith('/inventory') ? 'active' : ''}
          >
            <Image src="/icons/Inventory-White.svg" width={18} height={21.5} alt=""/>
            <p
              className={`${styles.navitem__text} ${
                isFullNav ? '' : styles.hidden
              }`}
            >
              <Typography component={'span'}>Inventory</Typography>
            </p>
            {router.pathname.startsWith('/inventory') && (
              <ActiveNavItem>&nbsp;</ActiveNavItem>
            )}
          </NavItem>
          <NavItem
           onClick={() => router.push('/users')}
            className={router.pathname.startsWith('/users') ? 'active' : ''}
          >
            <Image src="/icons/Users-White.svg" width={18} height={21.5} alt=""/>
            <p
              className={`${styles.navitem__text} ${
                isFullNav ? '' : styles.hidden
              }`}
            >
              <Typography component={'span'}>Users</Typography>
            </p>
            {router.pathname.startsWith('/users') && (
              <ActiveNavItem>&nbsp;</ActiveNavItem>
            )}
          </NavItem>
          <NavItem  onClick={() => router.push('/account')} className={router.pathname == '/account' ? 'active' : ''}>
            <Image src="/icons/Account-White.svg" width={18} height={21.5} alt=""/>
            <p
              className={`${styles.navitem__text} ${
                isFullNav ? '' : styles.hidden
              }`}
            >
              <Typography component={'span'}>Account</Typography>
            </p>
            {router.pathname.startsWith('/account') && (
              <ActiveNavItem>&nbsp;</ActiveNavItem>
            )}
          </NavItem>
          <NavItem onClick={() => router.push('/settings')} className={router.pathname == '/settings' ? 'active' : ''}>
            <Image src="/icons/Settings-White.svg" width={18} height={21.5} alt=""/>
            <p
              className={`${styles.navitem__text} ${
                isFullNav ? '' : styles.hidden
              }`}
            >
              <Typography component={'span'}>Settings</Typography>
            </p>
            {router.pathname.startsWith('/settings') && (
              <ActiveNavItem>&nbsp;</ActiveNavItem>
            )}
          </NavItem>
        <Logout onClick={logout}>
          <NavItem>
            <Image src="/icons/Logout-White.svg" width={18} height={21.5} alt=""/>
            <p
              className={`${styles.navitem__text} ${
                isFullNav ? '' : styles.hidden
              }`}
            >
              <Typography component={'span'}>Logout</Typography>
            </p>
          </NavItem>
        </Logout>
      </Nav>
    </div>
  )
}

export default SideNav

const Pill = styled.p`
  background: ${t.primaryDeepBlue};
  padding: 10px 12px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
  transition: 2s;
`

const Nav = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 250px);
`

const NavItem = styled.a`
  display: flex;
  flex-direction: row;
  height: 48px;
  justify-content: flex-start;
  align-items: center;
  padding-left: 41px;
  cursor: pointer;
  position: relative;
  color: white;
  text-decoration: none;

  &.active {
    background: ${t.primaryDeepBlue};
  }

  .sales{
    display: flex;
    flex-direction: row:
    align-items: center;
    justify-content: space-between;
  }
`

const ActiveNavItem = styled.span`
  width: 14px;
  height: 48px;
  background: ${t.primaryBlue};
  border-radius: 0px 14px 14px 0px;
  position: absolute;
  left: 0;
`

const Logout = styled.span`
  margin-top: auto;
  margin-bottom: 40px;
  justify-self: flex-end;
`
