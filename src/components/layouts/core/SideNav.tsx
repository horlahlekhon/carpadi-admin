import Image from 'next/image'
import styles from '../../../styles/SideNav.module.css'
import styled from 'styled-components'
import {t} from '../../../styles/theme'
import {Typography} from '@material-ui/core'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import {authService} from "../../../services/auth"

function SideNav() {
    const router = useRouter()
    const [isFullNav, setIsFullNav] = useState(true)

    const toggleNav = () => {
        setIsFullNav(!isFullNav)
    }

    const handleResize = () => {
        if (window.innerWidth <= 1080) {
            setIsFullNav(false)
        } else {
            setIsFullNav(true)
        }
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize)
    })

    const logout = () => {
        authService.logout();
    }

    const Hamburger = styled.p`
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
                    className={styles.pointer}
                    onClick={toggleNav}
                />
            </Hamburger>
            <Nav>
                <Link href="/" shallow>
                    <NavItem className={router.pathname == '/' ? 'active' : ''}>
                        <Image src="/icons/Home-White.svg" width={18} height={21.5}/>
                        <p
                            className={`${styles.navitem__text} ${
                                isFullNav ? '' : styles.hidden
                            }`}
                        >
                            <Typography component={'span'}>Dashboard</Typography>
                        </p>
                        {router.pathname == '/' && <ActiveNavItem>&nbsp;</ActiveNavItem>}
                    </NavItem>
                </Link>
                <Link href="/notifications" shallow>
                    <NavItem
                        className={router.pathname.startsWith('/notifications') ? 'active' : ''}
                    >
                        <Image
                            src="/icons/Notification-White.svg"
                            width={18}
                            height={21.5}
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
                </Link>
                <Link href="/trade" shallow>
                    <NavItem className={router.pathname.startsWith('/trade') ? 'active' : ''}>
                        <Image src="/icons/Trade-White.svg" width={18} height={21.5}/>
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
                </Link>
                <Link href="/sales" shallow>
                    <NavItem className={router.pathname.startsWith('/sales') ? 'active' : ''}>
                        <Image src="/icons/Sales-White.svg" width={18} height={21.5}/>
                        <p
                            className={`${styles.navitem__text} ${
                                isFullNav ? '' : styles.hidden
                            }`}
                        >
                            <Typography component={'span'}>Sales Platform</Typography>
                        </p>
                        {router.pathname.startsWith('/sales') && (
                            <ActiveNavItem>&nbsp;</ActiveNavItem>
                        )}
                    </NavItem>
                </Link>
                <Link href="/inventory" shallow>
                    <NavItem className={router.pathname.startsWith('/inventory') ? 'active' : ''}>
                        <Image src="/icons/Inventory-White.svg" width={18} height={21.5}/>
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
                </Link>
                <Link href="/users" shallow>
                    <NavItem className={router.pathname.startsWith('/users') ? 'active' : ''}>
                        <Image src="/icons/Users-White.svg" width={18} height={21.5}/>
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
                </Link>
                <Link href="/account" shallow>
                    <NavItem className={router.pathname == '/account' ? 'active' : ''}>
                        <Image src="/icons/Account-White.svg" width={18} height={21.5}/>
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
                </Link>
                <Link href="/settings" shallow>
                    <NavItem className={router.pathname == '/settings' ? 'active' : ''}>
                        <Image src="/icons/Settings-White.svg" width={18} height={21.5}/>
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
                </Link>
                <Logout onClick={logout}>
                    <NavItem>
                        <Image src="/icons/Logout-White.svg" width={18} height={21.5}/>
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

  &.active {
    background: ${t.primaryDeepBlue};
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
