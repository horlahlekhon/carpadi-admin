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
import {t} from '../../../styles/theme'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Button from '../../../components/shared/Button'
import {makeStyles} from '@material-ui/styles'
import {usePagination} from '@material-ui/lab/Pagination'
import {retrieveCars} from "../../../services/car";
import {toast} from "react-hot-toast";
import {CarStates} from "../../../lib/enums";
import {formatDate} from "../../../helpers/formatters";

function ArchivedPage() {
    const rowsPerPage = 10
    const router = useRouter()
    const [page, setPage] = useState(0)
    const [cars, setCars] = useState([])
    const [refCars, setRefCars] = useState([])
    const [paginationKeys, setPagination] = useState({
        "count": 0,
        "next": null,
        "previous": null,
    })

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage - 1)
        retrieveCarList(newPage - 1)
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

    const retrieveCarList = (page = 0) => {
        retrieveCars(rowsPerPage, page, CarStates.ARCHIVED)
            .then((response) => {
                if (response.status) {
                    setPagination({
                        "count": response.data.count,
                        "next": response.data.next,
                        "previous": response.data.previous,
                    })
                    setCars(response.data.results)
                    setRefCars(response.data.results)
                } else {
                    toast.error(response.data)
                }
            })
            .catch((error) => {
                toast.error(error.data)
            })
    }

    useEffect(() => {
        retrieveCarList(0)
    }, [])

    const {items} = usePagination({
        count: Math.ceil(paginationKeys.count / rowsPerPage),
        onChange: handleChangePage
    })

    return (
        <Container>
            <Header>
                <Typography variant="h4">
                    <b>Archived</b>
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
                    <span className="text">Archived</span>
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
                            {cars
                                .map((row, idx) => (
                                    <TableRow
                                        key={idx}
                                    >
                                        <TableCell component="th" scope="row">
                                            {idx}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <img src={row.pictures.length > 0 ? row.pictures[0] : null} width={48}
                                                 height={48}/>
                                        </TableCell>
                                        <TableCell align="left">{row.vin}</TableCell>
                                        <TableCell align="left">{row?.information?.make}</TableCell>
                                        <TableCell align="left">{row?.information?.model}</TableCell>
                                        <TableCell align="left">{row?.information?.year}</TableCell>
                                        <TableCell align="left">{row?.information?.fuel_type}</TableCell>
                                        <TableCell align="left">
                                            {row?.information?.transmission}
                                        </TableCell>
                                        <TableCell align="left">{formatDate(row?.information?.created)}</TableCell>
                                        <TableCell align="left">
                                            <Button
                                                text="View"
                                                width={66}
                                                outlined={true}
                                                onClick={() => handleNavigation(`/inventory/car-profile/${row.id}?status=archived`)}
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
        </Container>
    )
}

export default ArchivedPage

ArchivedPage.getLayout = function getLayout(page) {
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