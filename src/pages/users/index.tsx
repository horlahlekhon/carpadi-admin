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
import {t} from '../../styles/theme'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Button from '../../components/shared/Button'
import {makeStyles} from '@material-ui/styles'
import {usePagination} from '@material-ui/lab/Pagination'
import {merchantService} from "../../services/merchant";
import {toast} from "react-hot-toast";
import CPToast from "../../components/shared/CPToast";
import {formatDate, formatNumber, trimString} from '../../helpers/formatters'
import Loader from "../../components/layouts/core/Loader";
import {applyTransformation} from "../../services/upload";


function UsersPage() {
    enum Users {
        ACTIVE = 'ActiveTrading',
        NO_TRADING = 'NoTrading',
        TOTAL = 'Total',
        INACTIVE = 'Inactive',
        PENDING = 'Unapproved'
    }

    const [pageLoading, setPageLoading] = useState(false)
    const rowsPerPage = 10
    const router = useRouter()
    const [selectedUsers, setSelected] = useState(Users.TOTAL)
    const [page, setPage] = useState(0)
    const [users, setUsers] = useState([])
    const [status, setStatus] = useState('active')
    const [paginationKeys, setPagination] = useState({
        "count": 0,
        "next": null,
        "previous": null,
    })
    const [userStats, setUserStats] = useState(
        {
            "total_users": 0,
            "active_users": 0,
            "inactive_users": 0,
            "unapproved_users": 0
        }
    )

    const retrieveUserStats = () => {
        merchantService.retrieveMerchantStats()
            .then((response) => {
                if (response.status) {
                    setUserStats(response.data)
                } else {
                    toast.error(response.data)
                }
            })
            .catch((error) => {
                toast.error(error.data)
            })
    }

    const retrieveUsers = ({tradeStatus = '', page = 0, status = '', is_approved=''}) => {
        setPageLoading(true)
        setUsers([])
        setPagination({
            "count": 0,
            "next": null,
            "previous": null,
        })
        merchantService.retrieveMerchants(rowsPerPage, page, tradeStatus, '', status, is_approved)
            .then((response) => {
                if (response.status) {
                    setUsers(response.data.results)
                    setPagination({
                        "count": response.data.count,
                        "next": response.data.next,
                        "previous": response.data.prevoius,
                    })
                } else {
                    toast.error(response.data)
                }
            })
            .catch((error) => {
                toast.error(error.data)
            })
            .finally(() => {
                setPageLoading(false)
            })
    }


    useEffect(() => {
        retrieveUserStats();
        retrieveUsers({})
    }, [])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage - 1)
        retrieveUsers({
            tradeStatus: selectedUsers === Users.ACTIVE ? 'actively_trading' : selectedUsers === Users.NO_TRADING ? 'not_actively_trading' : '',
            page: ((newPage - 1) * rowsPerPage)
        })
    }

    const handleNavigation = (action: string) => {
        router.push(`${action}`)
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

    const {items} = usePagination({
        count: Math.ceil(paginationKeys.count / rowsPerPage),
        onChange: handleChangePage
    })

    const filterByStatus = () => {
        if (status === 'active') {
            retrieveUsers({status: 'inactive'})
            setStatus('inactive')
        } else if (status === 'inactive') {
            retrieveUsers({status: 'active'})
            setStatus('active')
        } else {
            retrieveUsers({})
        }
    }

    return (
        <Container>
            <CPToast/>
            {!pageLoading && (
                <>
                    <Header>
                        <Typography variant="h4">
                            <b>Users</b>
                        </Typography>
                    </Header>
                    <Breadcrumbs>
                        <img loading="lazy"
                            src="/icons/Trade-Black.svg"
                            width={'20px'}
                            height={'18px'}
                            style={{marginRight: '12px'}}
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
                    <Flex>
                        <StatsCard
                            onClick={() => {
                                setSelected(Users.TOTAL)
                                setPage(0);
                                retrieveUsers({tradeStatus: ''})
                            }}
                            style={{
                                border:
                                    selectedUsers === Users.TOTAL ? '3px solid #00AEEF' : 'none',
                                width: "19%"
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
                                {formatNumber(userStats.total_users)}
                            </Typography>
                        </StatsCard>
                        <StatsCard
                            onClick={() => {
                                setSelected(Users.ACTIVE)
                                setPage(0);
                                retrieveUsers({tradeStatus: 'actively_trading'})
                            }}
                            style={{
                                border:
                                    selectedUsers === Users.ACTIVE ? '3px solid #00AEEF' : 'none',
                                width: "19%"
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
                                {formatNumber(userStats.active_users)}
                            </Typography>
                        </StatsCard>
                        <StatsCard
                            onClick={() => {
                                setSelected(Users.PENDING)
                                setPage(0);
                                retrieveUsers({is_approved: 'False'})
                            }}
                            style={{
                                border:
                                    selectedUsers === Users.PENDING ? '3px solid #00AEEF' : 'none',
                                width: "19%"
                            }}
                        >
                            <Typography variant="inherit">Pending Approval</Typography>
                            <Typography variant="h5">{formatNumber(userStats.unapproved_users)}</Typography>
                        </StatsCard>
                        <StatsCard
                            onClick={() => {
                                setSelected(Users.NO_TRADING)
                                setPage(0);
                                retrieveUsers({tradeStatus: 'not_actively_trading'})
                            }}
                            style={{
                                border:
                                    selectedUsers === Users.NO_TRADING
                                        ? '3px solid #00AEEF'
                                        : 'none',
                                width: "19%"
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
                                {formatNumber(userStats.inactive_users)}
                            </Typography>
                        </StatsCard>
                        <StatsCard
                            onClick={() => {
                                setSelected(Users.INACTIVE)
                                setPage(0);
                                retrieveUsers({status: 'inactive'})
                            }}
                            style={{
                                border:
                                    selectedUsers === Users.INACTIVE ? '3px solid #00AEEF' : 'none',
                                color: 'white',
                                background: t.primaryAshBlue,
                                width: "19%"
                            }}
                        >
                            <Typography variant="inherit">Inactive Users</Typography>
                            <Typography variant="h5">NA</Typography>
                        </StatsCard>
                    </Flex>
                    <TableCard>
                        <TableFilters>
                            <div className="filter" onClick={() => filterByStatus()}>Filter by Status</div>
                            <div className="filter">Filter by Date</div>
                        </TableFilters>
                        <TableContainer>
                            <Table style={{minWidth: 650}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell align="left">Image</TableCell>
                                        <TableCell align="left">Full Name</TableCell>
                                        <TableCell align="left">User Name</TableCell>
                                        <TableCell align="left">Status</TableCell>
                                        <TableCell align="left">Joined Date</TableCell>
                                        <TableCell align="left">User ID</TableCell>
                                        {/*<TableCell align="left">Total Asset</TableCell>*/}
                                        {/*<TableCell align="left">Trading Cash</TableCell>*/}
                                        <TableCell align="left">&nbsp;</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users
                                        .map((row, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell component="th" scope="row">
                                                    {(idx + 1) + (page > 0 ? (rowsPerPage / page) : 0)}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <img loading="lazy" alt={row.user?.first_name}
                                                         src={applyTransformation(row.user.profile_picture, 48, 48)}
                                                         width={40}
                                                         height={40}
                                                         style={{borderRadius: '50%'}}/>

                                                </TableCell>
                                                <TableCell
                                                    align="left">{row.user?.first_name} {row.user?.last_name}</TableCell>
                                                <TableCell align="left">{row.user.username}</TableCell>
                                                <TableCell
                                                    align="left"
                                                    style={{
                                                        color: selectedUsers === Users.TOTAL ? 'red' : 'inherit'
                                                    }}
                                                >
                                                    <ActivityTab
                                                        style={{
                                                            width: '100px',
                                                            background:
                                                                row.user.is_active
                                                                    ? t.alertSuccessLite
                                                                    : t.extraLiteGrey
                                                        }}
                                                    >
                                                        {row.user.is_active ? 'Active' : 'Inactive'}
                                                    </ActivityTab>
                                                </TableCell>
                                                <TableCell align="left">{formatDate(row.created)}</TableCell>
                                                <TableCell align="left">{trimString(row.user.id)}</TableCell>
                                                {/*<TableCell align="left">*/}
                                                {/*    &#8358; NA*/}
                                                {/*</TableCell>*/}
                                                {/*<TableCell align="left">*/}
                                                {/*    &#8358; NA*/}
                                                {/*</TableCell>*/}
                                                <TableCell align="left">
                                                    <Button
                                                        text="View"
                                                        width={66}
                                                        outlined={true}
                                                        onClick={() => handleNavigation(`users/${row.id}`)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TableFooter>
                            <div>
                                Showing page {page + 1} of {Math.ceil(users.length / rowsPerPage)}/{' '}
                                {paginationKeys.count} Total Items
                            </div>

                            <nav>
                                <ul className={classes.ul}>
                                    {items.map(({page, type, selected, ...item}, index) => {
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
                </>
            )}
            {pageLoading && (
                <Loader/>
            )}
        </Container>
    )
}

export default UsersPage

UsersPage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

const TableCard = withStyles({
    elevation1: {boxShadow: 'none'}
})(Paper)

const StatsCard = withStyles({
    elevation1: {boxShadow: 'none'},
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

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 21px;
  margin-bottom: 15px;
`;