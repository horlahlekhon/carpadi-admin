import MainLayout from '../../components/layouts/MainLayout'
import styled from 'styled-components'
import {
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core'
import { t } from '../../styles/theme'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Button from '../../components/shared/Button'
import { makeStyles } from '@material-ui/styles'
import { usePagination } from '@material-ui/lab/Pagination'
import Image from 'next/image'
import { SearchOutlined, Add } from '@material-ui/icons'
import ToggleSwitch from '../../components/shared/ToggleSwitch'

function SalesPage() {
  enum Trades {
    ACTIVE = 'Active',
    SOLD = 'Sold',
    CLOSED = 'Closed'
  }
  const rowsPerPage = 10
  const router = useRouter()
  const [selectedTrade, setSelected] = useState(Trades.ACTIVE)
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
    tradingId: string,
    totalSlots: number,
    availableSlots: number,
    soldSlots: number,
    pricePerSlot: number,
    totalSlotPrice: number,
    dateListed: string
  ) {
    return {
      idx,
      imageUrl,
      tradingId,
      totalSlots,
      availableSlots,
      soldSlots,
      pricePerSlot,
      totalSlotPrice,
      dateListed
    }
  }

  const rows = Array.from(Array(300).keys()).map((i) => {
    return createData(
      i + 1,
      '/images/Default-Car.png',
      `${(Math.random() * 1002033).toFixed(0)}`,
      100,
      selectedTrade === Trades.SOLD ? 0 : 100,
      24,
      50000,
      50000000.0,
      new Date().toISOString().split('T')[0]
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
          <b>Trade</b>
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
      <Grid container spacing={3} style={{ marginTop: 21, marginBottom: 15 }}>
        <Grid item xs={4}>
          <StatsCard
            onClick={() => {
              setSelected(Trades.ACTIVE)
            }}
            style={{
              border:
                selectedTrade === Trades.ACTIVE ? '3px solid #00AEEF' : 'none'
            }}
          >
            <Typography
              variant="inherit"
              color={selectedTrade == Trades.ACTIVE ? 'primary' : 'inherit'}
            >
              Active
            </Typography>
            <Typography
              variant="h5"
              color={selectedTrade == Trades.ACTIVE ? 'primary' : 'inherit'}
            >
              1,000
            </Typography>
            <Typography
              variant="inherit"
              color={selectedTrade == Trades.ACTIVE ? 'primary' : 'inherit'}
            >
              with 200 Users
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={4}>
          <StatsCard
            onClick={() => {
              setSelected(Trades.SOLD)
            }}
            style={{
              border:
                selectedTrade === Trades.SOLD ? '3px solid #00AEEF' : 'none'
            }}
          >
            <Typography
              variant="inherit"
              color={selectedTrade == Trades.SOLD ? 'primary' : 'inherit'}
            >
              Sold
            </Typography>
            <Typography
              variant="h5"
              color={selectedTrade == Trades.SOLD ? 'primary' : 'inherit'}
            >
              800
            </Typography>
            <Typography
              variant="inherit"
              color={selectedTrade == Trades.SOLD ? 'primary' : 'inherit'}
            >
              with 80 Users
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={4}>
          <StatsCard
            onClick={() => {
              setSelected(Trades.CLOSED)
            }}
            style={{
              border:
                selectedTrade === Trades.CLOSED ? '3px solid #00AEEF' : 'none'
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
              2
            </Typography>
            <Typography
              variant="inherit"
              color={selectedTrade == Trades.CLOSED ? 'primary' : 'inherit'}
            >
              with 20 Users
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
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.idx}>
                    <TableCell component="th" scope="row">
                      {row.idx}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <img src={row.imageUrl} width={48} height={48} />
                    </TableCell>
                    <TableCell align="left">{row.tradingId}</TableCell>
                    <TableCell align="left">{row.totalSlots}</TableCell>
                    <TableCell align="left">{row.availableSlots}</TableCell>
                    <TableCell align="left">{row.soldSlots}</TableCell>
                    <TableCell align="left">
                      &#8358; {row.pricePerSlot.toLocaleString()}
                    </TableCell>
                    <TableCell align="left">
                      &#8358; {row.totalSlotPrice.toLocaleString()}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        color:
                          selectedTrade === Trades.CLOSED ? 'red' : 'inherit'
                      }}
                    >
                      {row.dateListed}
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        text="View"
                        width={66}
                        outlined={true}
                        onClick={() =>
                          handleNavigation(`trade/${row.tradingId}?type=${selectedTrade}`)
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

export default SalesPage

SalesPage.getLayout = function getLayout(page) {
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
