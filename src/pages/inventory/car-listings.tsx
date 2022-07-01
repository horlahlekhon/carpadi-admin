import MainLayout from '../../components/layouts/MainLayout'
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
import {t} from '../../styles/theme'
import {useState} from 'react'
import {useRouter} from 'next/router'
import Button from '../../components/shared/Button'
import {makeStyles} from '@material-ui/styles'
import {usePagination} from '@material-ui/lab/Pagination'

function CarListingsPage() {
    const rowsPerPage = 10
    const router = useRouter()
    const [page, setPage] = useState(0)

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage - 1)
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

    function createData(
        idx: number,
        imageUrl: string,
        vin: string,
        make: string,
        model: string,
        year: number,
        fuelType: string,
        transmissionType: string,
        dateListed: string
    ) {
        return {
            idx,
            imageUrl,
            vin,
            make,
            model,
            year,
            fuelType,
            transmissionType,
            dateListed
        }
    }

    const rows = Array.from(Array(300).keys()).map((i) => {
        return createData(
            i + 1,
            '/images/Default-Car.png',
            `VID-11${i}`,
            'Toyota',
            'Rav 4',
            2004,
            'Petrol',
            'Automatic',
            new Date().toISOString().split('T')[0]
        )
    })

    const {items} = usePagination({
        count: rows.length / rowsPerPage,
        onChange: handleChangePage
    })

    return (
        <Container>
            <Header>
                <Typography variant="h4">
                    <b>Car Listings</b>
                </Typography>
            </Header>
            <Breadcrumbs>
                <img
                    src="/icons/Inventory-Black.svg"
                    width={'20px'}
                    height={'18px'}
                    style={{marginRight: '12px'}}
                />
                <div
                    onClick={() => {
                        handleNavigation('/inventory')
                    }}
                >
                    <span className="text">Inventory</span>
                    <span className="separator"></span>
                </div>
                <div>
                    <span className="text">Car Listings</span>
                    <span className="separator"></span>
                </div>
            </Breadcrumbs>
            <TableCard>
                <TableContainer>
                    <Table style={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>No</TableCell>
                                <TableCell align="left">Image</TableCell>
                                <TableCell align="left">VIN</TableCell>
                                <TableCell align="left">Make</TableCell>
                                <TableCell align="left">Model</TableCell>
                                <TableCell align="left">Year</TableCell>
                                <TableCell align="left">Fuel Type</TableCell>
                                <TableCell align="left">Transmission Type</TableCell>
                                <TableCell align="left">Date Listed</TableCell>
                                <TableCell align="left">&nbsp;</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow
                                        key={row.idx}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.idx}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <img src={row.imageUrl} width={48} height={48}/>
                                        </TableCell>
                                        <TableCell align="left">{row.vin}</TableCell>
                                        <TableCell align="left">{row.make}</TableCell>
                                        <TableCell align="left">{row.model}</TableCell>
                                        <TableCell align="left">{row.year}</TableCell>
                                        <TableCell align="left">{row.fuelType}</TableCell>
                                        <TableCell align="left">
                                            {row.transmissionType}
                                        </TableCell>
                                        <TableCell align="left">{row.dateListed}</TableCell>
                                        <TableCell align="left">
                                            <Button
                                                text="View"
                                                width={66}
                                                outlined={true}
                                                onClick={() => handleNavigation(`/inventory/car-listings/${row.vin}`)}
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
        </Container>
    )
}

export default CarListingsPage

CarListingsPage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}


const TableCard = withStyles({
    elevation1: {boxShadow: 'none'},
    root: {
        marginTop: 32
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