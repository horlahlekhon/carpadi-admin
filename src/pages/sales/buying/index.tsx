import MainLayout from '../../../components/layouts/MainLayout'
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
import { t } from '../../../styles/theme'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Button from '../../../components/shared/Button'
import { makeStyles } from '@material-ui/styles'
import { usePagination } from '@material-ui/lab/Pagination'
import CPToast from '../../../components/shared/CPToast'
import CreateSale from '../../../components/shared/CreateSale'
import { toast } from 'react-hot-toast'
import { retrieveSell } from '../../../services/market'
import { formatDate, formatNumber } from '../../../helpers/formatters'
import Loader from '../../../components/layouts/core/Loader'
import { BuyingStates } from '../../../lib/enums'

function BuyingPage() {
  enum Sales {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
  }

  const rowsPerPage = 10
  const router = useRouter()
  const [selectedSales, setSelected] = useState(BuyingStates.Pending)
  const [page, setPage] = useState(0)
  const [createSale, setCreateSale] = useState(false)
  const [sales, setSales] = useState([])
  const [paginationKeys, setPagination] = useState({
    count: 0,
    next: null,
    previous: null
  })
  const [pageLoading, setPageLoading] = useState(false)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage - 1)
    getSales(selectedSales, (newPage - 1) * rowsPerPage)
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

  const selectSale = (sale: BuyingStates) => {
    setSelected(sale)
  }

  const retrieveSaleStats = () => {}

  const getSales = (saleStatus = selectedSales, page = 0) => {
    setPageLoading(true)
    retrieveSell(rowsPerPage, page, saleStatus)
      .then((response) => {
        if (response.status) {
          setSales(response.data.results)
          setPagination({
            count: response.data.count,
            next: response.data.next,
            previous: response.data.prevoius
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

  const { items } = usePagination({
    count: Math.ceil(paginationKeys.count / rowsPerPage),
    onChange: handleChangePage
  })

  return (
    <Container>
      <CPToast />
      {!pageLoading && (
        <>
          {createSale && (
            <CreateSale modalOpen={true} onClick={() => setCreateSale(false)} />
          )}
          <Header>
            <Typography variant="h4">
              <b>Buying</b>
            </Typography>
          </Header>
          <Breadcrumbs style={{ marginBottom: '32px' }}>
            <img
              loading="lazy"
              src="/icons/Vehicle-Blue.svg"
              width={'20px'}
              height={'18px'}
              style={{ marginRight: '12px' }}
            />
            <div
              onClick={() => {
                handleNavigation('sales/buying')
              }}
            >
              <span className="text">Buying</span>
              <span className="separator"></span>
            </div>
            <div
              onClick={() => {
                handleNavigation('sales')
              }}
            ></div>
          </Breadcrumbs>
          <Grid container spacing={3} style={{marginTop: 21, marginBottom: 15}}>
                        <Grid item xs={4}>
                            <StatsCard
                                onClick={() => {
                                    selectSale(BuyingStates.Pending)
                                    setPage(0);
                                    getSales(BuyingStates.Pending)
                                }}
                                style={{
                                    border:
                                        selectedSales === BuyingStates.Pending ? '3px solid #00AEEF' : 'none'
                                }}
                            >
                                <Typography
                                    variant="inherit"
                                    color={selectedSales == BuyingStates.Pending ? 'primary' : 'inherit'}
                                >
                                    Pending
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color={selectedSales == BuyingStates.Pending ? 'primary' : 'inherit'}
                                >
                                    NA
                                </Typography>
                            </StatsCard>
                        </Grid>
                        <Grid item xs={4}>
                            <StatsCard
                                onClick={() => {
                                    selectSale(BuyingStates.Accepted)
                                    setPage(0);
                                    getSales(BuyingStates.Accepted)
                                }}
                                style={{
                                    border:
                                        selectedSales === BuyingStates.Accepted ? '3px solid #00AEEF' : 'none'
                                }}
                            >
                                <Typography
                                    variant="inherit"
                                    color={selectedSales == BuyingStates.Accepted ? 'primary' : 'inherit'}
                                >
                                    Accepted
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color={selectedSales == BuyingStates.Accepted ? 'primary' : 'inherit'}
                                >
                                    NA
                                </Typography>
                            </StatsCard>
                        </Grid>
                        
                        <Grid item xs={4}>
                            <StatsCard
                                onClick={() => {
                                    selectSale(BuyingStates.Rejected)
                                    setPage(0);
                                    getSales(BuyingStates.Rejected)
                                }}
                                style={{
                                    border:
                                        selectedSales === BuyingStates.Rejected ? '3px solid #00AEEF' : 'none'
                                }}
                            >
                                <Typography
                                    variant="inherit"
                                    color={selectedSales == BuyingStates.Rejected ? 'primary' : 'inherit'}
                                >
                                    Rejected
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color={selectedSales == BuyingStates.Rejected ? 'primary' : 'inherit'}
                                >
                                    NA
                                </Typography>
                            </StatsCard>
                        </Grid>
                    </Grid>
          <TableCard>
            <TableContainer>
              <Table style={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell align="right">Vehicle</TableCell>
                    <TableCell align="right">Seller</TableCell>
                    <TableCell align="right">VIN</TableCell>
                    <TableCell align="right">Plate</TableCell>
                    <TableCell align="right">Year</TableCell>
                    <TableCell align="right">Fuel Type</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Date Listed</TableCell>
                    <TableCell align="right">&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell component="th" scope="row">
                        {idx + 1 + (page > 0 ? rowsPerPage / page : 0)}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row?.vehicle_info?.manufacturer || 'NA'} (
                        {row?.vehicle_info?.brand?.model || 'NA'})
                      </TableCell>
                      <TableCell align="right">
                        {row?.seller?.first_name} {row?.seller?.last_name}
                      </TableCell>
                      <TableCell align="right">
                        {row?.vehicle_info?.vin}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{ textTransform: 'uppercase' }}
                      >
                        {row?.licence_plate}
                      </TableCell>
                      <TableCell align="right">
                        {row?.vehicle_info?.brand?.year}
                      </TableCell>
                      <TableCell align="right">
                        {row?.vehicle_info?.fuel_type}
                      </TableCell>
                      <TableCell align="right">
                        &#8358;{formatNumber(row?.price)}
                      </TableCell>
                      <TableCell align="right">
                        {formatDate(row?.created)}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          text="View"
                          width={66}
                          outlined={true}
                          onClick={() =>
                            handleNavigation(`/sales/buying/${row.id}`)
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
                Showing page {page + 1} of{' '}
                {Math.ceil(paginationKeys.count / rowsPerPage)}/{' '}
                {paginationKeys.count} Total Items
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
                            borderColor: selected
                              ? t.primaryDeepBlue
                              : t.lightGrey,
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
                            borderColor: selected
                              ? t.primaryDeepBlue
                              : t.lightGrey
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
                            borderColor: selected
                              ? t.primaryDeepBlue
                              : t.lightGrey
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
      {pageLoading && <Loader />}
    </Container>
  )
}

export default BuyingPage

BuyingPage.getLayout = function getLayout(page) {
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
