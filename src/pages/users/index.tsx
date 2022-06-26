import MainLayout from '../../components/layouts/MainLayout'
import styled from 'styled-components'
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  withStyles
} from '@material-ui/core'
import { t } from '../../styles/theme'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Button from '../../components/shared/Button'
import { makeStyles } from '@material-ui/styles'
import { usePagination } from '@material-ui/lab/Pagination'

function UsersPage() {
  enum Users {
    ACTIVE = 'ActiveTrading',
    NO_TRADING = 'NoTrading',
    TOTAL = 'Total',
    INACTIVE = 'Inactive'
  }
  const rowsPerPage = 10
  const router = useRouter()
  const [selectedUsers, setSelected] = useState(Users.TOTAL)
  const [page, setPage] = useState(0)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage - 1)
  }

  const handleNavigation = (action: string) => {
    router.replace(`${action}`)
  }

  const useStyles = makeStyles((theme) => ({
    ul: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      alignItems: 'center'
    },
    li: {
      marginRight: 6
    },
    button: {
      border: '1px solid #ccc',
      backgroundColor: 'transparent',
      borderRadius: 12,
      padding: '7px 11px',
      cursor: 'pointer',
      textTransform: 'capitalize'
    }
  }))

  const classes = useStyles()

  function createData(
    idx: number,
    imageUrl: string,
    userName: string,
    status: string,
    joinedDate: string,
    userId: string,
    totalAsset: number,
    tradingCash: number
  ) {
    return {
      idx,
      imageUrl,
      userName,
      status,
      joinedDate,
      userId,
      totalAsset,
      tradingCash
    }
  }

  const rows = Array.from(Array(100).keys()).map((i) => {
    return createData(
      i + 1,
      '/icons/Users-Blue.svg',
      'John Doe',
      ['active', 'inactive'][Math.round(Math.random())],
      new Date().toISOString().split('T')[0],
      `${(Math.random() * 1002033).toFixed(0)}`,
      50000,
      50000000
    )
  })

  const { items } = usePagination({
    count: rows.length / rowsPerPage,
    onChange: handleChangePage
  })

  return (
    <Container>
      <Header>
        <Typography variant="h4">
          <b>Users</b>
        </Typography>
      </Header>
      <Breadcrumbs>
        <img
          src="/icons/Trade-Black.svg"
          width={'20px'}
          height={'18px'}
          style={{ marginRight: '12px' }}
        />
        <div
          onClick={() => {
            handleNavigation('users')
          }}
        >
          <span className="text">Users</span>
          <span className="separator"></span>
        </div>
        <div>
          <span className="text">&nbsp;</span>
          <span className="separator"></span>
        </div>
      </Breadcrumbs>
      <Grid container spacing={3} style={{ marginTop: 21, marginBottom: 15 }}>
        <Grid item xs={3}>
          <StatsCard
            onClick={() => {
              setSelected(Users.TOTAL)
            }}
            style={{
              border:
                selectedUsers === Users.TOTAL ? '3px solid #00AEEF' : 'none'
            }}
          >
            <Typography
              variant="inherit"
              color={selectedUsers == Users.TOTAL ? 'primary' : 'inherit'}
            >
              Total Users
            </Typography>
            <Typography
              variant="h5"
              color={selectedUsers == Users.TOTAL ? 'primary' : 'inherit'}
            >
              10,000
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={3}>
          <StatsCard
            onClick={() => {
              setSelected(Users.ACTIVE)
            }}
            style={{
              border:
                selectedUsers === Users.ACTIVE ? '3px solid #00AEEF' : 'none'
            }}
          >
            <Typography
              variant="inherit"
              color={selectedUsers == Users.ACTIVE ? 'primary' : 'inherit'}
            >
              Active Trading Users
            </Typography>
            <Typography
              variant="h5"
              color={selectedUsers == Users.ACTIVE ? 'primary' : 'inherit'}
            >
              4,000
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={3}>
          <StatsCard
            onClick={() => {
              setSelected(Users.NO_TRADING)
            }}
            style={{
              border:
                selectedUsers === Users.NO_TRADING
                  ? '3px solid #00AEEF'
                  : 'none'
            }}
          >
            <Typography
              variant="inherit"
              color={selectedUsers == Users.NO_TRADING ? 'primary' : 'inherit'}
            >
              Users with No Trading Activities
            </Typography>
            <Typography
              variant="h5"
              color={selectedUsers == Users.NO_TRADING ? 'primary' : 'inherit'}
            >
              2,000
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={3}>
          <StatsCard
            onClick={() => {
              setSelected(Users.INACTIVE)
            }}
            style={{
              border:
                selectedUsers === Users.INACTIVE ? '3px solid #00AEEF' : 'none',
              color: 'white',
              background: t.primaryAshBlue
            }}
          >
            <Typography variant="inherit">Inactive Users</Typography>
            <Typography variant="h5">4,000</Typography>
          </StatsCard>
        </Grid>
      </Grid>
      <TableCard>
        <TableFilters>
          <div className="filter">Filter by Status</div>
          <div className="filter">Filter by Date</div>
        </TableFilters>
        <TableContainer>
          <Table style={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell align="left">Image</TableCell>
                <TableCell align="left">User Name</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Joined Date</TableCell>
                <TableCell align="left">User ID</TableCell>
                <TableCell align="left">Total Asset</TableCell>
                <TableCell align="left">Trading Cash</TableCell>
                <TableCell align="left">&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.idx}>
                    <TableCell component="th" scope="row">
                      {row.idx}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <ActivityImage style={{ borderRadius: '50%' }}>
                        <img src={row.imageUrl} width={16} height={21} />
                      </ActivityImage>
                    </TableCell>
                    <TableCell align="left">{row.userName}</TableCell>
                    <TableCell
                      align="left"
                      style={{
                        color: selectedUsers === Users.TOTAL ? 'red' : 'inherit'
                      }}
                    >
                      <ActivityTab
                        style={{
                          background:
                            row.status === 'active'
                              ? t.alertSuccessLite
                              : t.extraLiteGrey
                        }}
                      >
                        {row.status}
                      </ActivityTab>
                    </TableCell>
                    <TableCell align="left">{row.joinedDate}</TableCell>
                    <TableCell align="left">{row.userId}</TableCell>
                    <TableCell align="left">
                      &#8358; {row.totalAsset.toLocaleString()}
                    </TableCell>
                    <TableCell align="left">
                      &#8358; {row.tradingCash.toLocaleString()}
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        text="View"
                        width={66}
                        outlined={true}
                        onClick={() => handleNavigation(`users/${row.userId}`)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableFooter>
          <div>
            Showing page {page + 1} of {Math.ceil(rows.length / rowsPerPage)}/{' '}
            {rows.length} Total Items
          </div>

          <nav>
            <ul className={classes.ul}>
              {items.map(({ page, type, selected, ...item }, index) => {
                let children = null

                if (type === 'start-ellipsis' || type === 'end-ellipsis') {
                  children = '…'
                } else if (type === 'page') {
                  children = (
                    <button
                      type="button"
                      className={classes.button}
                      {...item}
                      style={{
                        borderColor: selected ? t.primaryDeepBlue : t.lightGrey,
                        fontWeight: selected ? 'bold' : undefined
                      }}
                    >
                      {page}
                    </button>
                  )
                } else if (type === 'previous') {
                  children = (
                    <button
                      className={classes.button}
                      type="button"
                      {...item}
                      style={{
                        borderColor: selected ? t.primaryDeepBlue : t.lightGrey
                      }}
                    >
                      {'back'}
                    </button>
                  )
                } else {
                  children = (
                    <button
                      className={classes.button}
                      type="button"
                      {...item}
                      style={{
                        borderColor: selected ? t.primaryDeepBlue : t.lightGrey
                      }}
                    >
                      {type}
                    </button>
                  )
                }

                return (
                  <li key={index} className={classes.li}>
                    {children}
                  </li>
                )
              })}
            </ul>
          </nav>
        </TableFooter>
      </TableCard>
    </Container>
  )
}

export default UsersPage

UsersPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>
}

const TableCard = withStyles({
  elevation1: { boxShadow: 'none' }
})(Paper)

const StatsCard = withStyles({
  elevation1: { boxShadow: 'none' },
  root: {
    height: '123px',
    padding: '14px 19px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'all 0.3s ease-out'
  }
})(Paper)

const TableFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 17px 40px;
`

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

const Breadcrumbs = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: black;
  font-weight: bold;
  justify-content: start;

  div {
    &:not(:last-child) {
      margin-right: 10px;
      .text {
        padding-right: 10px;
        cursor: pointer;
      }
      .separator {
        :after {
          color: ${t.grey};
          content: '|';
        }
      }
    }
  }
`

const ActivityTab = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 7px 10px;
  background: transparent;
  border-radius: 20px;
  font-weight: 600;
  font-size: 15px;
  color: ${t.grey};
  text-transform: capitalize;
`

const TableFilters = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  padding: 12px 30px;

  .filter {
    cursor: pointer;
    margin-left: 30px;
    color: ${t.primaryBlue};
    font-weight: bold;
  }
`
const ActivityImage = styled.div`
  width: 40px;
  height: 40px;
  background: ${t.primaryExtraLite};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  object-fit: cover;
`
