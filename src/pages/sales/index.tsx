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
  enum Sales {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
  }
  const rowsPerPage = 10
  const router = useRouter()
  const [selectedSales, setSelected] = useState(Sales.ACTIVE)
  const [page, setPage] = useState(0)
  const [modalOpen, setModalState] = useState(false)
  const [modalView, setModalView] = useState('')
  const [selectedCarId, setSelectedCar] = useState(null)
  const [state, setState] = useState({
    saleActive: true
  })

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

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

  const rows = Array.from(Array(300).keys()).map((i) => {
    return createData(
      i + 1,
      '/images/Default-Car.png',
      `VID-11${i}`,
      'Toyota',
      'Rav 4',
      2004,
      'Petrol',
      10000000,
      new Date().toISOString().split('T')[0],
      'Ongoing'
    )
  })

  const { items } = usePagination({
    count: rows.length / rowsPerPage,
    onChange: handleChangePage
  })

  const handleOpen = () => {
    setModalState(true)
  }

  const handleClose = () => {
    setModalState(false)
  }

  const showModal = (viewName: string) => {
    setModalView(viewName)
    handleOpen()
  }

  return (
    <Container>
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
            showModal('addCar')
          }}
        />
      </Header>
      <Breadcrumbs>
        <img
          src="/icons/Vehicle-Blue.svg"
          width={'20px'}
          height={'18px'}
          style={{ marginRight: '12px' }}
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
      <Grid container spacing={3} style={{ marginTop: 21, marginBottom: 15 }}>
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
          <Table style={{ minWidth: 650 }} aria-label="simple table">
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
                      <img src={row.imageUrl} width={48} height={48} />
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
      <Modal open={modalOpen} onClose={handleClose}>
        <ModalBody>
          <ModalBodyHeader>
            <Typography variant="h5" style={{ fontWeight: 600 }}>
              Add Car to Sales Platform
            </Typography>
            <Image
              src="/icons/Cancel-Black.svg"
              width={25}
              height={25}
              onClick={() => setModalState(false)}
              style={{ cursor: 'pointer' }}
            />
          </ModalBodyHeader>
          {modalView === 'addCar' && (
            <>
              <Typography variant="inherit">
                Select Car From Created Trade
              </Typography>
              <FormControl
                style={{
                  width: '794px',
                  display: 'flex',
                  marginTop: '20px',
                  marginBottom: '10px'
                }}
                variant="standard"
              >
                <InputLabel htmlFor="standard-adornment-password">
                  Search
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type="text"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility">
                        <SearchOutlined />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <TableCard style={{ height: 480, overflowY: 'auto' }}>
                <TableContainer>
                  <Table style={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Image</TableCell>
                        <TableCell align="left">Car</TableCell>
                        <TableCell align="left">Trade ID</TableCell>
                        <TableCell align="left">VIN</TableCell>
                        <TableCell align="left">Date Created</TableCell>
                        <TableCell align="left">Trade Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => (
                          <TableRow
                            key={row.idx}
                            style={{
                              cursor: 'pointer',
                              background:
                                selectedCarId === row.idx
                                  ? t.primaryExtraLite
                                  : 'white'
                            }}
                            onClick={() => setSelectedCar(row.idx)}
                          >
                            <TableCell component="th" scope="row">
                              <img
                                src={row.imageUrl}
                                width={48}
                                height={48}
                                alt="car"
                                style={{ borderRadius: '8px' }}
                              />
                            </TableCell>
                            <TableCell align="left">
                              {row.model} {row.make} {row.year}
                            </TableCell>
                            <TableCell align="left">{row.idx}</TableCell>
                            <TableCell align="left">{row.vin}</TableCell>
                            <TableCell align="left">{row.dateListed}</TableCell>
                            <TableCell align="left">
                              {row.tradeStatus}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TableCard>
              <div style={{ display: 'flex', marginTop: 20 }}>
                <Button
                  text="Proceed"
                  width={510}
                  marginLeft="auto"
                  marginRight="auto"
                  onClick={() => showModal('addCarDetails')}
                  disabled={selectedCarId === null}
                />
              </div>
            </>
          )}
          {modalView === 'addCarDetails' && (
            <>
              <Typography variant="inherit">
                Kindly provide the following information below.
              </Typography>
              <HeaderText variant="inherit" style={{ marginTop: '40px' }}>
                Creating Sales For
              </HeaderText>
              <InfoSection container spacing={3}>
                <Grid item xs={6}>
                  <VehicleDetails>
                    <img
                      src="/images/Big-Default-Car.png"
                      width={185}
                      height={135}
                      style={{ borderRadius: '8px' }}
                    />
                    <div className="stats">
                      <img
                        src="/images/Toyota-Full.png"
                        width={80}
                        height={22}
                        style={{ marginBottom: -15 }}
                      />
                      <Typography variant="h5" className="trade">
                        Trade ID 09890
                      </Typography>
                      <Typography variant="h6">Toyota Rav4 2020</Typography>
                    </div>
                  </VehicleDetails>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    text="Select a Different Car"
                    outlined={true}
                    width={200}
                    marginLeft="auto"
                    onClick={() => setModalView('addCar')}
                  />
                </Grid>
              </InfoSection>
              <HeaderText style={{ marginBottom: 16 }}>
                Car Sales Highlight
              </HeaderText>
              <TextField
                fullWidth
                placeholder="Accident free | full customs duty paid | good history report ..."
              ></TextField>
              <HeaderText
                variant="inherit"
                style={{ marginTop: 40, marginBottom: 20 }}
              >
                Selling Price
              </HeaderText>
              <FlexRow style={{ marginBottom: 50 }}>
                <div className="currency-box">&#8358;</div>
                <TextField
                  placeholder="Enter price"
                  style={{ width: 400 }}
                ></TextField>
              </FlexRow>
              <FlexRow style={{ marginBottom: 20 }}>
                <HeaderText>Key Features</HeaderText>
                <IconPill>
                  Add key feature
                  <Add className="icon" />
                </IconPill>
              </FlexRow>
              <InputGrid>
                <TextField
                  className="text-field"
                  fullWidth
                  placeholder="Key Feature 1"
                />
                <div className="input">
                  <div className="text">Upload Image</div>
                  <Button
                    text="Upload"
                    outlined={true}
                    width={71}
                    height={28}
                    borderRadius="8px"
                  />
                </div>
              </InputGrid>
              <InputGrid>
                <TextField
                  className="text-field"
                  fullWidth
                  placeholder="Key Feature 2"
                />
                <div className="input">
                  <div className="text">engine indlmor.png</div>
                  <Button
                    text="Delete"
                    outlined={true}
                    width={71}
                    height={28}
                    bgColor={t.alertError}
                    borderRadius="8px"
                  />
                </div>
              </InputGrid>
              <FlexRow style={{ marginBottom: 20, marginTop: 60 }}>
                <HeaderText>Car Sales Image</HeaderText>
                <IconPill>
                  Add Image
                  <Add className="icon" />
                </IconPill>
              </FlexRow>
              <InputGrid>
                <div className="input">
                  <div className="text">Upload Image</div>
                  <Button
                    text="Upload"
                    outlined={true}
                    width={71}
                    height={28}
                    borderRadius="8px"
                  />
                </div>
                <div className="input">
                  <div className="text">Upload Image</div>
                  <Button
                    text="Upload"
                    outlined={true}
                    width={71}
                    height={28}
                    borderRadius="8px"
                  />
                </div>
              </InputGrid>
              <InputGrid>
                <div className="input">
                  <div className="text">Upload Image</div>
                  <Button
                    text="Upload"
                    outlined={true}
                    width={71}
                    height={28}
                    borderRadius="8px"
                  />
                </div>
                <div className="input">
                  <div className="text">Upload Image</div>
                  <Button
                    text="Upload"
                    outlined={true}
                    width={71}
                    height={28}
                    borderRadius="8px"
                  />
                </div>
              </InputGrid>
              <InputGrid>
                <div className="input">
                  <div className="text">Upload Image</div>
                  <Button
                    text="Upload"
                    outlined={true}
                    width={71}
                    height={28}
                    borderRadius="8px"
                  />
                </div>
                <div className="input">
                  <div className="text">engine indlmor.png</div>
                  <Button
                    text="Delete"
                    outlined={true}
                    width={71}
                    height={28}
                    bgColor={t.alertError}
                    borderRadius="8px"
                  />
                </div>
              </InputGrid>
              <div style={{ display: 'flex', marginTop: 70 }}>
                <Button
                  text="Proceed"
                  width={510}
                  marginLeft="auto"
                  marginRight="auto"
                  onClick={() => showModal('viewCarSummary')}
                />
              </div>
            </>
          )}
          {modalView === 'viewCarSummary' && (
            <>
              <Typography variant="inherit">
                Kindly review the following information below.
              </Typography>
              <Body>
                <PriceSection container spacing={3}>
                  <Grid item xs={6}>
                    <VehicleDetail>
                      <Image
                        src="/images/Big-Default-Car.png"
                        height={135}
                        width={185}
                        style={{ borderRadius: '8px' }}
                      />
                      <div className="stats">
                        <img
                          src="/images/Toyota-Full.png"
                          width={80}
                          height={22}
                          style={{ marginBottom: -15 }}
                        />
                        <Typography variant="h5" className="trade">
                          Trade ID 09890
                        </Typography>
                        <Typography variant="h6">Toyota Rav4 2020</Typography>
                      </div>
                    </VehicleDetail>
                  </Grid>
                  <Grid item xs={6}>
                    <PriceCard>
                      <div>Selling Price</div>
                      <Typography variant="h5">
                        &#8358; 12,500,000.00
                      </Typography>
                    </PriceCard>
                  </Grid>
                </PriceSection>
                <Typography variant="h6" color="secondary">
                  Car Sales Highlight
                </Typography>
                <p style={{ marginBottom: 40 }}>
                  Interdum et malesuada fames ac ante ipsum primis in faucibus.
                  Aenean nulla neque, facilisis eget sem in, porttitor porttitor
                  diam. Maecenas vitae nisi pharetra, dapibus nisl sit amet,
                  pulvinar erat.
                </p>
                <Typography variant="h6" color="secondary">
                  Key Features
                </Typography>
                <Features>
                  <div className="key-features">
                    <img src="/images/Big-Default-Car.png" alt="Feature" />
                    <Typography variant="subtitle1" className="text">
                      Leather Seats
                    </Typography>
                  </div>
                  <div className="key-features">
                    <img src="/images/Big-Default-Car.png" alt="Feature" />
                    <Typography variant="subtitle1" className="text">
                      Leather Seats
                    </Typography>
                  </div>
                  <div className="key-features">
                    <img src="/images/Big-Default-Car.png" alt="Feature" />
                    <Typography variant="subtitle1" className="text">
                      Leather Seats
                    </Typography>
                  </div>
                  <div className="key-features">
                    <img src="/images/Big-Default-Car.png" alt="Feature" />
                    <Typography variant="subtitle1" className="text">
                      Leather Seats
                    </Typography>
                  </div>
                  <div className="key-features">
                    <img src="/images/Big-Default-Car.png" alt="Feature" />
                    <Typography variant="subtitle1" className="text">
                      Leather Seats
                    </Typography>
                  </div>
                  <div className="key-features">
                    <img src="/images/Big-Default-Car.png" alt="Feature" />
                    <Typography variant="subtitle1" className="text">
                      Leather Seats
                    </Typography>
                  </div>
                  <div className="key-features">
                    <img src="/images/Big-Default-Car.png" alt="Feature" />
                    <Typography variant="subtitle1" className="text">
                      Leather Seats
                    </Typography>
                  </div>
                  <div className="key-features">
                    <img src="/images/Big-Default-Car.png" alt="Feature" />
                    <Typography variant="subtitle1" className="text">
                      Leather Seats
                    </Typography>
                  </div>
                </Features>
                <Typography variant="h6" color="secondary">
                  Car Sales Image
                </Typography>
                <Flex>
                  <div className="gallery">
                    <ImageGrid>
                      <img
                        src="/images/FullSize-Default-Car.png"
                        className="image"
                      />
                      <img
                        src="/images/FullSize-Default-Car.png"
                        className="image"
                      />
                      <img
                        src="/images/FullSize-Default-Car.png"
                        className="image"
                      />
                      <img
                        src="/images/FullSize-Default-Car.png"
                        className="image"
                      />
                      <img
                        src="/images/FullSize-Default-Car.png"
                        className="image"
                      />
                      <img
                        src="/images/FullSize-Default-Car.png"
                        className="image"
                      />
                      <img
                        src="/images/FullSize-Default-Car.png"
                        className="image"
                      />
                      <img
                        src="/images/FullSize-Default-Car.png"
                        className="image"
                      />
                    </ImageGrid>
                  </div>
                </Flex>
                <SalesStatus>
                  <Typography variant="h6" className="status">
                    Sales Status
                  </Typography>
                  <div className="cta">
                    <span>Set As Active</span>
                    <ToggleSwitch
                      checked={state.saleActive}
                      onChange={handleChange}
                      name="saleActive"
                    />
                  </div>
                </SalesStatus>
                <div style={{ display: 'flex', marginTop: 70 }}>
                <Button
                  text="Create Sales Profile"
                  width={510}
                  marginLeft="auto"
                  marginRight="auto"
                  onClick={() => handleNavigation('/sales/VID-123')}
                />
              </div>
              </Body>
            </>
          )}
        </ModalBody>
      </Modal>
    </Container>
  )
}

export default SalesPage

SalesPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>
}

const HeaderText = withStyles({
  root: {
    color: t.lightGrey,
    fontWeight: 'bold',
    display: 'block'
  }
})(Typography)

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

const InfoSection = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '20px',
    marginTop: '8px'
  }
})(Grid)

const PriceSection = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})(Grid)

const PriceCard = withStyles({
  elevation1: { boxShadow: 'none' },
  root: {
    height: '100px',
    width: '482px',
    padding: '13px 19px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: `${t.alertSuccessLite}`,
    float: 'right',
    marginTop: '34px'
  }
})(Paper)

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 24px;
  padding: 8 12px;
  height: 54px;
  background: ${t.extraLiteGrey};
  margin-bottom: 10px;

  .input {
    width: 97%;
    background: ${t.white};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: fit-content;
    padding: 5px 10px;
    margin: auto;
    border-bottom: 1px solid ${t.lightGrey};
  }

  .text-field {
    width: 97%;
    background: ${t.white};
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: space-between;
    height: 39px;
    margin: auto;
  }
`

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  .currency-box {
    height: 27px;
    width: 27px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${t.lightGrey};
    background: ${t.liteGrey};
    margin-right: 10px;
  }
`

const IconPill = styled.button`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 7px 12px;
  border-radius: 8px;
  background: ${t.primaryExtraLite};
  color: ${t.primaryDeepBlue};
  border: none;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    transition: all 0.3s ease-out;
  }

  .icon {
    margin-left: 8px;
  }
`

const ModalBody = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  padding: 24px 32px;
  background: white;
  width: fit-content;
  border-radius: 12px;
  height: fit-content;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
`

const ModalBodyHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

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
const VehicleDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  width: 800px;
  margin-bottom: 27px;

  .stats {
    height: 100%;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .trade {
      color: ${t.primaryBlue};
      margin-top: 36px;
      margin-bottom: 17px;
    }
  }
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 36px 26px;
  background-color: ${t.white};
  border-radius: 12px;
  margin-top: 17px;
  max-width: 950px;
`

const VehicleDetail = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  margin-bottom: 27px;

  .stats {
    height: 100%;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .trade {
      color: ${t.primaryBlue};
      margin-top: 36px;
      margin-bottom: 17px;
    }
  }
`
const SalesStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: end;
  padding-bottom: 20px;
  border-bottom: 1px solid ${t.liteGrey};
  margin-bottom: 20px;

  .status {
    color: ${t.primaryBlue};
  }

  .cta {
    background-color: ${t.liteGrey};
    padding: 10px 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 40px;
  margin-top: 16px;

  .slideshow {
    margin-right: 20px;
    position: relative;

    .next,
    .previous {
      position: absolute;
      cursor: pointer;
      top: 0;
      bottom: 0;
      margin: auto 0;
    }

    .previous {
      left: 16px;
    }
    .next {
      right: 16px;
    }
  }
`

const Features = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 40px;
  margin-top: 16px;

  .key-features {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    img {
      height: 200px;
      width: 200px;
      object-fit: cover;
      border-radius: 0;
      margin-bottom: 14px;
      margin-right: 24px;
    }

    .text {
      color: ${t.grey};
    }
  }
`

const ImageGrid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .image {
    margin-right: 24px;
    margin-bottom: 24px;
    object-fit: cover;
    border-radius: 14px;
    height: 200px;
    width: 200px;
  }
`
