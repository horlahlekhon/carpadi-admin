import Image from 'next/image'
import styles from '../../../styles/SideNav.module.css'
import styled from 'styled-components'
import { t } from '../../../styles/theme'
import { Typography } from '@material-ui/core'
import { MenuOpen } from '@material-ui/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
function SideNav() {
  const router = useRouter()
  const [isFullNav, setIsFullNav] = useState(true)

  const toggleNav = () => {
    setIsFullNav(!isFullNav)
  }

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
      <Hambuger>
        <MenuOpen className={styles.pointer} onClick={toggleNav} />
      </Hambuger>
      <Nav>
        <Link href="/">
          <NavItem className={router.pathname == '/' ? 'active' : ''}>
            <Image src="/icons/Home-White.svg" width={18} height={21.5} />
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
        <Link href="/notifications">
          <NavItem
            className={router.pathname == '/notifications' ? 'active' : ''}
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
            {router.pathname.startsWith('/notifications') && (
              <ActiveNavItem>&nbsp;</ActiveNavItem>
            )}
          </NavItem>
        </Link>
        <Link href="/trade">
          <NavItem className={router.pathname == '/trade' ? 'active' : ''}>
            <Image src="/icons/Trade-White.svg" width={18} height={21.5} />
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
        <Link href="/sales">
          <NavItem className={router.pathname == '/sales' ? 'active' : ''}>
            <Image src="/icons/Sales-White.svg" width={18} height={21.5} />
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
        <Link href="/inventory">
          <NavItem className={router.pathname == '/inventory' ? 'active' : ''}>
            <Image src="/icons/Inventory-White.svg" width={18} height={21.5} />
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
        <Link href="/users">
          <NavItem className={router.pathname == '/users' ? 'active' : ''}>
            <Image src="/icons/Users-White.svg" width={18} height={21.5} />
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
        <Link href="/account">
          <NavItem className={router.pathname == '/account' ? 'active' : ''}>
            <Image src="/icons/Account-White.svg" width={18} height={21.5} />
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
        <Link href="/settings">
          <NavItem className={router.pathname == '/settings' ? 'active' : ''}>
            <Image src="/icons/Settings-White.svg" width={18} height={21.5} />
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
        <Logout>
          <NavItem>
            <Image src="/icons/Logout-White.svg" width={18} height={21.5} />
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
`

const Hambuger = styled.p`
  width: 100%;
  heiight: 48px;
  padding: 16px 25px;
  display: flex;
  justify-content: flex-end;
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
  width: 100%;
  height: 48px;
  justift-content: flex-start;
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
  justify-self: flex-end;
`