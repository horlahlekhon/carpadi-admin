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
import {searchResults} from "../../services/search";
import {toast} from "react-hot-toast";
import CPToast from "../../components/shared/CPToast";
import {formatDate, formatNumber, trimString} from '../../helpers/formatters'
import {applyTransformation} from "../../services/upload";
import {allowedSearchModules} from "../../lib/constants";


function SearchPage() {
    const rowsPerPage = 10
    const router = useRouter()
    const [page, setPage] = useState(0)
    const [data, setData] = useState([])
    const [paginationKeys, setPagination] = useState({
        "count": 0,
        "next": null,
        "previous": null,
    })
    const [searchTerm, setSearchTerm]= useState('')

    const retrieveSearchData = ({page = 0}) => {
        setData([])
        setPagination({
            "count": 0,
            "next": null,
            "previous": null,
        })
        searchResults(rowsPerPage, page, String(router.query?.type), String(router.query?.searchTerm))
            .then((response: { status: boolean, data: any }) => {
                if (response.status) {
                    setData(response.data.results)
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
    }


    useEffect(() => {
        if (allowedSearchModules.includes(String(router.query?.type))) {
            localStorage.setItem('recentSearchModule', String(router.query?.type))
            setSearchTerm(String(router.query?.type))
            retrieveSearchData({})
        } else {
            toast.error(`Module ${String(router.query?.type).toUpperCase()} does not support searches!`)
            router.back()
        }
    }, [])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage - 1)
        retrieveSearchData({
            page: newPage - 1
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

    return (
        <MainLayout>
            <Container>
                <CPToast/>
                <Header>
                    <Typography variant="h4">
                        <b>Search Results ({String(router.query?.type)})</b>
                    </Typography>
                </Header>
                <TableCard>
                    {(String(router.query?.type) === 'inventory') && (<TableContainer>
                        <Table style={{minWidth: 650}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell align="left">Image</TableCell>
                                    <TableCell align="left">VIN</TableCell>
                                    <TableCell align="left">Status</TableCell>
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
                                {data
                                    .map((row, idx) => (
                                        <TableRow
                                            key={idx}
                                        >
                                            <TableCell component="th" scope="row">
                                                {idx + 1}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <img loading="lazy"
                                                     src={row.pictures.length > 0 ? row.pictures[0] : null} width={48}
                                                     height={48}/>
                                            </TableCell>
                                            <TableCell align="left">{row.vin}</TableCell>
                                            <TableCell align="left"
                                                       style={{textTransform: 'uppercase'}}>{row?.status}</TableCell>
                                            <TableCell align="left">{row?.information?.brand?.name}</TableCell>
                                            <TableCell align="left">{row?.information?.brand?.model}</TableCell>
                                            <TableCell align="left">{row?.information?.brand?.year}</TableCell>
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
                                                    onClick={() => handleNavigation(`/inventory/car-profile/${row.id}?status=car listings`)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>)}
                    {(String(router.query?.type) === 'sales') && (
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
                                    {data
                                        .map((row, idx) => (
                                            <TableRow
                                                key={idx}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {idx + 1}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <img loading="lazy"
                                                         src={row?.product_images.length > 0 ? row?.product_images[0] : null}
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
                    )}
                    {(String(router.query?.type) === 'trade') && (
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
                                    {data
                                        .map((row, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell component="th" scope="row">
                                                    {(idx + 1) + (page > 0 ? (rowsPerPage / page) : 0)}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <img loading="lazy" src={applyTransformation(row.car.image, 48, 48)}
                                                         width={48} height={48}/>
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
                                                >
                                                    {formatDate(row.created) || 'NA'}
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Button
                                                        text="View"
                                                        width={66}
                                                        outlined={true}
                                                        onClick={() =>
                                                            handleNavigation(`trade/${row.id}?type=${'active'}`)
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    {(String(router.query?.type) === 'users') && (
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
                                        <TableCell align="left">&nbsp;</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data
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
                    )}
                    <TableFooter>
                        <div>
                            Showing page {page + 1} of {Math.ceil(data.length / rowsPerPage)}/{' '}
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
        </MainLayout>
    )
}

export default SearchPage

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