import MainLayout from '../../../components/layouts/MainLayout'
import styled from 'styled-components'
import {
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
import { useState } from 'react'
import { useRouter } from 'next/router'
import Button from '../../../components/shared/Button'
import { makeStyles } from '@material-ui/styles'
import { usePagination } from '@material-ui/lab/Pagination'

function ManageTradePage() {
  enum Trades {
    ACTIVE = 'active',
    SOLD = 'sold',
    CLOSED = 'closed'
  }
  const rowsPerPage = 10
  const router = useRouter()
  const tradeId = router.query.id || 'NA'
  const tradeType = router.query.status || 'active'
  const [selectedTrade, setSelected] = useState(tradeType)
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
    userId: string,
    boughtSlots: number,
    totalSlotPrice: number,
    expectedROT: number,
    purchaseDate: string
  ) {
    return {
      idx,
      imageUrl,
      userName,
      userId,
      boughtSlots,
      totalSlotPrice,
      expectedROT,
      purchaseDate
    }
  }

  const rows = Array.from(Array(300).keys()).map((i) => {
    return createData(
      i + 1,
      '/images/Default-Car.png',
      'John Doe',
      `${(Math.random() * 1002033).toFixed(0)}`,
      100,
      50000000,
      100000,
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
            handleNavigation('/trade')
          }}
        >
          <span className="text">Trade</span>
          <span className="separator"></span>
        </div>
        <div>
          <span className="text">{selectedTrade}</span>
          <span className="separator"></span>
        </div>
        <div
          onClick={() =>
            handleNavigation(`/trade/${tradeId}?type=${selectedTrade}`)
          }
        >
          <span className="text">{tradeId}</span>
          <span className="separator"></span>
        </div>
        <div>
          <span className="text">Manage Trade</span>
          <span className="separator"></span>
        </div>
      </Breadcrumbs>
      <TableCard style={{ marginTop: 30 }}>
        <FlexRow>
          <ActivityTab
            className={`${selectedTrade === Trades.ACTIVE ? 'active' : ''}`}
          >
            Active
          </ActivityTab>
          <ActivityTab
            className={`${selectedTrade === Trades.CLOSED ? 'active' : ''}`}
          >
            Closed
          </ActivityTab>
        </FlexRow>
        <TableContainer>
          <Table style={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell align="left">Image</TableCell>
                <TableCell align="left">User Name</TableCell>
                <TableCell align="left">User ID</TableCell>
                <TableCell align="left">Bought Slots</TableCell>
                <TableCell align="left">Total Slot Price</TableCell>
                <TableCell align="left">Expected ROT</TableCell>
                <TableCell align="left">Closed Date</TableCell>
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
                      <img
                        src={row.imageUrl}
                        width={48}
                        height={48}
                        style={{ borderRadius: '50%' }}
                      />
                    </TableCell>
                    <TableCell align="left">{row.userName}</TableCell>
                    <TableCell align="left">{row.userId}</TableCell>
                    <TableCell align="left">{row.boughtSlots}</TableCell>
                    <TableCell align="left">
                      &#8358; {row.totalSlotPrice.toLocaleString()}
                    </TableCell>
                    <TableCell align="left">{row.expectedROT}</TableCell>
                    <TableCell align="left">
                      &#8358; {row.purchaseDate}
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        text="View"
                        width={66}
                        outlined={true}
                        onClick={() =>
                          handleNavigation(
                            `users/${row.userId}/trades/${tradeId}`
                          )
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

export default ManageTradePage

ManageTradePage.getLayout = function getLayout(page) {
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

const ActivityTab = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 41px;
  min-width: 108px;
  padding: 9px 23px;
  background: transparent;
  cursor: pointer;
  border-radius: 14px;
  font-weight: 600;
  font-size: 15px;
  line-height: 24px;
  color: ${t.grey};
  margin-right: 18px;

  &.active {
    background: ${t.primaryExtraLite};
    color: ${t.primaryDeepBlue};

    &:hover {
      background: ${t.primaryExtraLite};
    }
  }

  &:hover {
    background: ${t.extraLiteGrey};
  }
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
        text-transform: capitalize;
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
const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 20px;
`
