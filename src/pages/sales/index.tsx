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
import {t} from '../../styles/theme'
import {useState} from 'react'
import {useRouter} from 'next/router'
import Button from '../../components/shared/Button'
import {makeStyles} from '@material-ui/styles'
import {usePagination} from '@material-ui/lab/Pagination'
import Image from 'next/image'
import {SearchOutlined, Add} from '@material-ui/icons'
import ToggleSwitch from '../../components/shared/ToggleSwitch'
import CPToast from "../../components/shared/CPToast";
import CreateSale from "../../components/shared/CreateSale";

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

    const selectSale = (sale: Sales) => {
        setSelected(sale)
    }

    function createData(
        idx: number,
        imageUrl: string,
        vin: string,
        make: string,
        model: string,
        year: number,
        fuelType: string,
        sellingPrice: number,
        dateListed: string,
        tradeStatus: string
    ) {
        return {
            idx,
            imageUrl,
            vin,
            make,
            model,
            year,
            fuelType,
            sellingPrice,
            dateListed,
            tradeStatus
        }
    }

    const rows = Array.from(Array(30).keys()).map((i) => {
        return createData(
            i + 1,
            '/images/Default-Car.png',
            `VID-1${i}1${i}`,
            'Toyota',
            'Rav 4'+i,
            2004,
            'Petrol',
            10000000,
            new Date().toISOString().split('T')[0],
            'Ongoing'
        )
    })

    const {items} = usePagination({
        count: rows.length / rowsPerPage,
        onChange: handleChangePage
    })

    return (
        <Container>
            <CPToast/>
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
                <img
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
                            3,803
                        </Typography>
                    </StatsCard>
                </Grid>
                <Grid item xs={6}>
                    <StatsCard
                        onClick={() => {
                            selectSale(Sales.INACTIVE)
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
                            20
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
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow
                                        key={row.idx}
                                        // style={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.idx}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <img src={row.imageUrl} width={48} height={48}/>
                                        </TableCell>
                                        <TableCell align="right">{row.vin}</TableCell>
                                        <TableCell align="right">{row.make}</TableCell>
                                        <TableCell align="right">{row.model}</TableCell>
                                        <TableCell align="right">{row.year}</TableCell>
                                        <TableCell align="right">{row.fuelType}</TableCell>
                                        <TableCell align="right">
                                            &#8358;{row.sellingPrice}
                                        </TableCell>
                                        <TableCell align="right">{row.dateListed}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                text="View"
                                                width={66}
                                                outlined={true}
                                                onClick={() => handleNavigation(`sales/${row.vin}`)}
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
