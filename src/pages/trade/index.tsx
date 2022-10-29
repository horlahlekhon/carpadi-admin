import MainLayout from '../../components/layouts/MainLayout'
import styled from 'styled-components'
import {
    Avatar,
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
import {tradeService} from '../../services/trade'
import {toast, Toaster} from "react-hot-toast";
import Moment from 'moment';
import CPToast from "../../components/shared/CPToast";
import Loader from "../../components/layouts/core/Loader";
import CreateTrade from "../../components/shared/CreateTrade";
import {applyTransformation} from "../../services/upload";
import {randomColor} from "../../helpers/condeGenerators";

function TradesPage({response}) {
    enum Trades {
        ACTIVE = 'Active',
        SOLD = 'Sold',
        CLOSED = 'Closed',
        PURCHASED = 'Purchased',
        EXPIRED = 'Expired'
    }

    const rowsPerPage = 10
    const router = useRouter()
    const [selectedTrade, setSelected] = useState(Trades.ACTIVE)
    const [page, setPage] = useState(0)
    const [trades, setTrades] = useState([])
    const [paginationKeys, setPagination] = useState({
        "count": 0,
        "next": null,
        "previous": null,
    })
    const [tradeStats, setTradeStats] = useState(
        {
            "active_trades": {"trading_users": 0, "active_trades": 0},
            "sold_trades": {"trading_users": 0, "sold_trades": 0},
            "closed_trades": {"trading_users": 0, "closed_trades": 0},
            "expired_trades": {"trading_users": 0, "expired_trades": 0},
            "purchased_trades": {"trading_users": 0, "purchased_trades": 0}
        }
    )
    const [pageLoading, setPageLoading] = useState(false)
    const [createTrade, setCreateTrade] = useState(false)

    useEffect(() => {
        retrieveTradeStats();
        retrieveTrades()
    }, [])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage - 1);
        retrieveTrades(selectedTrade === Trades.ACTIVE ? 'ongoing' : selectedTrade === Trades.SOLD ? 'completed' : 'sold', ((newPage - 1) * rowsPerPage))
    }

    const handleNavigation = (action: string) => {
        router.push(`${action}`)
    }

    const retrieveTradeStats = () => {
        tradeService.retrieveTradeStats()
            .then((response) => {
                if (response.status) {
                    setTradeStats(response.data)
                } else {
                    toast.error(response.data)
                }
            })
            .catch((error) => {
                toast.error(error.data)
            })
    }

    const retrieveTrades = (tradeStatus = 'ongoing', page = 0) => {
        setPageLoading(true)
        setTrades([])
        setPagination({
            "count": 0,
            "next": null,
            "previous": null,
        })
        tradeService.retrieveTrades(rowsPerPage, page, tradeStatus)
            .then((response) => {
                if (response.status) {
                    setTrades(response.data.results)
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

    const classes = useStyles({})

    const {items} = usePagination({
        count: Math.ceil(paginationKeys.count / rowsPerPage),
        onChange: handleChangePage
    })

    const formatDate = (date) => Moment(date).format('DD-MM-YYYY')

    return (
        <Container>
            <CPToast/>
            {!pageLoading && (
                <>
                    {createTrade && <CreateTrade modalOpen={createTrade} onClick={() => setCreateTrade(false)}/>}
                    <Header>
                        <Typography variant="h4">
                            <b>Trade</b>
                        </Typography>
                        <ActionBar>
                            <Button
                                text="Create Trade"
                                width={150}
                                outlined={true}
                                marginLeft="18px"
                                onClick={() => setCreateTrade(true)}
                            />
                        </ActionBar>
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
                                handleNavigation('trade')
                            }}
                        >
                            <span className="text">Trade</span>
                            <span className="separator"></span>
                        </div>
                        <div>
                            <span className="text">{selectedTrade}</span>
                            <span className="separator"></span>
                        </div>
                    </Breadcrumbs>
                    <Flex>
                        <StatsCard
                            onClick={() => {
                                setSelected(Trades.ACTIVE);
                                setPage(0);
                                retrieveTrades('ongoing')
                            }}
                            style={{
                                border:
                                    selectedTrade === Trades.ACTIVE ? '3px solid #00AEEF' : 'none',
                                width: '19%'
                            }}
                        >
                            <Typography
                                variant="inherit"
                                color={selectedTrade == Trades.ACTIVE ? 'primary' : 'inherit'}
                            >
                                Ongoing
                            </Typography>
                            <Typography
                                variant="h5"
                                color={selectedTrade == Trades.ACTIVE ? 'primary' : 'inherit'}
                            >
                                {tradeStats.active_trades.active_trades}
                            </Typography>
                            <Typography
                                variant="inherit"
                                color={selectedTrade == Trades.ACTIVE ? 'primary' : 'inherit'}
                            >
                                with {tradeStats.active_trades.trading_users} Users
                            </Typography>
                        </StatsCard>
                        <StatsCard
                            onClick={() => {
                                setSelected(Trades.SOLD);
                                setPage(0);
                                retrieveTrades('completed')
                            }}
                            style={{
                                border:
                                    selectedTrade === Trades.SOLD ? '3px solid #00AEEF' : 'none',
                                width: '19%'
                            }}
                        >
                            <Typography
                                variant="inherit"
                                color={selectedTrade == Trades.SOLD ? 'primary' : 'inherit'}
                            >
                                Completed
                            </Typography>
                            <Typography
                                variant="h5"
                                color={selectedTrade == Trades.SOLD ? 'primary' : 'inherit'}
                            >
                                {tradeStats.sold_trades.sold_trades}
                            </Typography>
                            <Typography
                                variant="inherit"
                                color={selectedTrade == Trades.SOLD ? 'primary' : 'inherit'}
                            >
                                with {tradeStats.sold_trades.trading_users} Users
                            </Typography>
                        </StatsCard>
                        <StatsCard
                            onClick={() => {
                                setSelected(Trades.PURCHASED);
                                setPage(0);
                                retrieveTrades('purchased')
                            }}
                            style={{
                                border:
                                    selectedTrade === Trades.PURCHASED ? '3px solid #00AEEF' : 'none',
                                width: '19%'
                            }}
                        >
                            <Typography
                                variant="inherit"
                                color={selectedTrade == Trades.PURCHASED ? 'primary' : 'inherit'}
                            >
                                Purchased
                            </Typography>
                            <Typography
                                variant="h5"
                                color={selectedTrade == Trades.PURCHASED ? 'primary' : 'inherit'}
                            >
                                {tradeStats?.purchased_trades?.purchased_trades}
                            </Typography>
                            <Typography
                                variant="inherit"
                                color={selectedTrade == Trades.PURCHASED ? 'primary' : 'inherit'}
                            >
                                with {tradeStats?.purchased_trades?.trading_users} Users
                            </Typography>
                        </StatsCard>
                        <StatsCard
                            onClick={() => {
                                setSelected(Trades.CLOSED);
                                setPage(0);
                                retrieveTrades('closed')
                            }}
                            style={{
                                border:
                                    selectedTrade === Trades.CLOSED ? '3px solid #00AEEF' : 'none',
                                width: '19%'
                            }}
                        >
                            <Typography
                                variant="inherit"
                                color={selectedTrade == Trades.CLOSED ? 'primary' : 'inherit'}
                            >
                                Closed
                            </Typography>
                            <Typography
                                variant="h5"
                                color={selectedTrade == Trades.CLOSED ? 'primary' : 'inherit'}
                            >
                                {tradeStats.closed_trades.closed_trades}
                            </Typography>
                            <Typography
                                variant="inherit"
                                color={selectedTrade == Trades.CLOSED ? 'primary' : 'inherit'}
                            >
                                with {tradeStats.closed_trades.trading_users} Users
                            </Typography>
                        </StatsCard>
                        <StatsCard
                            onClick={() => {
                                setSelected(Trades.EXPIRED);
                                setPage(0);
                                retrieveTrades('expired')
                            }}
                            style={{
                                border:
                                    selectedTrade === Trades.EXPIRED ? '3px solid #00AEEF' : 'none',
                                width: '19%'
                            }}
                        >
                            <Typography
                                variant="inherit"
                                color={selectedTrade == Trades.EXPIRED ? 'primary' : 'inherit'}
                            >
                                Expired
                            </Typography>
                            <Typography
                                variant="h5"
                                color={selectedTrade == Trades.EXPIRED ? 'primary' : 'inherit'}
                            >
                                {tradeStats?.expired_trades?.expired_trades}
                            </Typography>
                            <Typography
                                variant="inherit"
                                color={selectedTrade == Trades.EXPIRED ? 'primary' : 'inherit'}
                            >
                                with {tradeStats?.expired_trades?.trading_users} Users
                            </Typography>
                        </StatsCard>
                    </Flex>
                    <TableCard>
                        <TableContainer>
                            <Table style={{minWidth: 650}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell align="left">Image</TableCell>
                                        <TableCell align="left">Trading ID</TableCell>
                                        <TableCell align="left">Total Slots</TableCell>
                                        <TableCell align="left">Available Slots</TableCell>
                                        <TableCell align="left">Sold Slots</TableCell>
                                        <TableCell align="left">Price Per Slot</TableCell>
                                        <TableCell align="left">Total Slot Price</TableCell>
                                        <TableCell align="left">Date Listed</TableCell>
                                        <TableCell align="left">&nbsp;</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {trades
                                        .map((row, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell component="th" scope="row">
                                                    {(idx + 1) + (page > 0 ? (rowsPerPage / page) : 0)}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {/*<img loading="lazy" src={applyTransformation(row.car.image, 48, 48) } width={48} height={48}/>*/}
                                                    <Avatar alt={row.vin}
                                                            style={{width: '48px', height: '48px', backgroundColor: randomColor()}}
                                                            src={applyTransformation(row.car.image, 48, 48)}>{String(row.car.make).slice(0, 2).toUpperCase() || 'NA'}</Avatar>
                                                </TableCell>
                                                <TableCell
                                                    align="left">{row.id.substring(row.id.length - 7)}</TableCell>
                                                <TableCell align="left">{row.slots_available}</TableCell>
                                                <TableCell align="left">{row.remaining_slots}</TableCell>
                                                <TableCell
                                                    align="left">{row.slots_available - row.remaining_slots}</TableCell>
                                                <TableCell align="left">
                                                    &#8358; {row.price_per_slot.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                </TableCell>
                                                <TableCell align="left">
                                                    &#8358; {(row.price_per_slot * row.slots_available).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                </TableCell>
                                                <TableCell
                                                    align="left"
                                                    style={{
                                                        color:
                                                            selectedTrade === Trades.CLOSED ? 'red' : 'inherit'
                                                    }}
                                                >
                                                    {formatDate(row.created) || 'NA'}
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Button
                                                        text="View"
                                                        width={66}
                                                        outlined={true}
                                                        onClick={() =>
                                                            handleNavigation(`trade/${row.id}?type=${selectedTrade}`)
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TableFooter>
                            <div>
                                Showing page {page + 1} of {Math.ceil(paginationKeys.count / rowsPerPage)}/{' '}
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

export default TradesPage

TradesPage.getLayout = function getLayout(page) {
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

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 21px;
  margin-bottom: 15px;
`;

const FlexItem = styled.div`
  width: 100px;
`;

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
const ActionBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`