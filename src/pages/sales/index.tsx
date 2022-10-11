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
import CPToast from "../../components/shared/CPToast";
import CreateSale from "../../components/shared/CreateSale";
import {toast} from "react-hot-toast";
import {retrieveSales} from "../../services/sale";
import {formatDate, formatNumber, trimString} from "../../helpers/formatters";
import Loader from "../../components/layouts/core/Loader";
import {applyTransformation} from "../../services/upload";

function SalesPage() {
    enum Sales {
        ACTIVE = 'active',
        INACTIVE = 'inactive'
    }

    const rowsPerPage = 10
    const router = useRouter()
    const [selectedSales, setSelected] = useState(Sales.ACTIVE)
    const [page, setPage] = useState(0)
    const [createSale, setCreateSale] = useState(false)
    const [sales, setSales] = useState([])
    const [paginationKeys, setPagination] = useState({
        "count": 0,
        "next": null,
        "previous": null,
    })
    const [saleStats, setSaleStats] = useState(
        {
            "active_trades": {
                "trading_users": 0,
                "active_trades": 0
            },
            "sold_trades": {
                "trading_users": 0,
                "sold_trades": 0
            },
            "closed_trades": {
                "trading_users": 0,
                "closed_trades": 0
            }
        }
    )
    const [pageLoading, setPageLoading] = useState(false)


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage - 1)
        getSales(selectedSales.valueOf(), ((newPage - 1) * rowsPerPage))
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

    const selectSale = (sale: Sales) => {
        setSelected(sale)
    }

    const retrieveSaleStats = () => {
    }

    const getSales = (saleStatus = 'active', page = 0) => {
        setPageLoading(true)
        retrieveSales(rowsPerPage, page, saleStatus)
            .then((response) => {
                if (response.status) {
                    setSales(response.data.results)
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
        retrieveSaleStats()
        getSales()
    }, [])


    const {items} = usePagination({
        count: Math.ceil(paginationKeys.count / rowsPerPage),
        onChange: handleChangePage
    })

    return (
        <Container>
            <CPToast/>
            {!pageLoading && (
                <>
                    {createSale && <CreateSale modalOpen={true} onClick={() => setCreateSale(false)}/>}
                    <Header>
                        <Typography variant="h4">
                            <b>Selling</b>
                        </Typography>
                        <Button
                            text="Add Car to Sales Platform"
                            width={210}
                            fontSize="13px"
                            outlined={true}
                            onClick={() => {
                                setCreateSale(true)
                            }}
                        />
                    </Header>
                    <Breadcrumbs>
                        <img loading="lazy"
                            src="/icons/Vehicle-Blue.svg"
                            width={'20px'}
                            height={'18px'}
                            style={{marginRight: '12px'}}
                        />
                        <div
                            onClick={() => {
                                handleNavigation('sales')
                            }}
                        >
                            <span className="text">Selling</span>
                            <span className="separator"></span>
                        </div>
                        <div
                            onClick={() => {
                                handleNavigation('sales')
                            }}
                        ></div>
                    </Breadcrumbs>
                    <Grid container spacing={3} style={{marginTop: 21, marginBottom: 15}}>
                        <Grid item xs={6}>
                            <StatsCard
                                onClick={() => {
                                    selectSale(Sales.ACTIVE)
                                    setPage(0);
                                    getSales('active')
                                }}
                                style={{
                                    border:
                                        selectedSales === Sales.ACTIVE ? '3px solid #00AEEF' : 'none'
                                }}
                            >
                                <Typography
                                    variant="inherit"
                                    color={selectedSales == Sales.ACTIVE ? 'primary' : 'inherit'}
                                >
                                    Active
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color={selectedSales == Sales.ACTIVE ? 'primary' : 'inherit'}
                                >
                                    NA
                                </Typography>
                            </StatsCard>
                        </Grid>
                        <Grid item xs={6}>
                            <StatsCard
                                onClick={() => {
                                    selectSale(Sales.INACTIVE)
                                    setPage(0);
                                    getSales('inactive')
                                }}
                                style={{
                                    border:
                                        selectedSales === Sales.INACTIVE ? '3px solid #00AEEF' : 'none'
                                }}
                            >
                                <Typography
                                    variant="inherit"
                                    color={selectedSales == Sales.INACTIVE ? 'primary' : 'inherit'}
                                >
                                    Inctive
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color={selectedSales == Sales.INACTIVE ? 'primary' : 'inherit'}
                                >
                                    NA
                                </Typography>
                            </StatsCard>
                        </Grid>
                    </Grid>
                    <TableCard>
                        <TableContainer>
                            <Table style={{minWidth: 650}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell align="right">Image</TableCell>
                                        <TableCell align="right">VIN</TableCell>
                                        <TableCell align="right">Make</TableCell>
                                        <TableCell align="right">Model</TableCell>
                                        <TableCell align="right">Year</TableCell>
                                        <TableCell align="right">Fuel Type</TableCell>
                                        <TableCell align="right">Selling Price</TableCell>
                                        <TableCell align="right">Date Listed</TableCell>
                                        <TableCell align="right">&nbsp;</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sales
                                        .map((row, idx) => (
                                            <TableRow
                                                key={idx}
                                                // style={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {(idx + 1) + (page > 0 ? (rowsPerPage / page) : 0)}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <img loading="lazy" src={row?.product_images.length > 0 ? applyTransformation(row?.product_images[0], 48, 48) : null}
                                                         width={48} height={48} alt={trimString(row?.id)}/>
                                                </TableCell>
                                                <TableCell align="right">{row?.car?.vin}</TableCell>
                                                <TableCell align="right">{row?.car?.make}</TableCell>
                                                <TableCell align="right">{row?.car?.model}</TableCell>
                                                <TableCell align="right">{row?.car?.year}</TableCell>
                                                <TableCell align="right">{row?.car?.fuel_type}</TableCell>
                                                <TableCell align="right">
                                                    &#8358;{formatNumber(row?.selling_price)}
                                                </TableCell>
                                                <TableCell align="right">{formatDate(row?.created)}</TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        text="View"
                                                        width={66}
                                                        outlined={true}
                                                        onClick={() => handleNavigation(`sales/${row.id}`)}
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
            {pageLoading && (<Loader/>)}
        </Container>
    )
}

export default SalesPage

SalesPage.getLayout = function getLayout(page) {
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
