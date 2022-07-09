import MainLayout from '../../components/layouts/MainLayout'
import styled from 'styled-components'
import {
    FormControl,
    Grid, IconButton,
    Input, InputAdornment,
    InputLabel,
    Modal,
    Paper,
    Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField,
    Typography,
    withStyles
} from '@material-ui/core'
import Button from '../../components/shared/Button'
import {t} from '../../styles/theme'
import {useRef, useState} from 'react'
import {useRouter} from 'next/router'
import Image from "next/image";
import {toast, Toaster} from "react-hot-toast";
import {SearchOutlined} from "@material-ui/icons";
import {usePagination} from "@material-ui/lab/Pagination";

function InventoryPage() {
    const router = useRouter()
    const rowsPerPage = 10
    const [modalOpen, setModalState] = useState(false)
    const [modalView, setModalView] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [modalTagline, setModalTagline] = useState(' Kindly provide the following information below.')
    const [transmissionType, setTransmissionType] = useState('')
    const [seatNumber, setSeatNumber] = useState(4)
    const [fuelType, setFuelType] = useState('')
    const [brandModel, setBrandModel] = useState('')
    const [selectedCarId, setSelectedCar] = useState(null)
    const [page, setPage] = useState(0)

    const hiddenFileInput = useRef(null);

    const handleNavigation = (action: string) => {
        router.push(`${action}`)
            .then(() => {
            })
    }

    const handleFileClick = event => {
        hiddenFileInput.current.click();
    };

    const handleFileChange = event => {
        const fileUploaded = event.target.files[0];
        handleFile(fileUploaded);
    };

    const handleFile = (file) => {
    }

    const showModal = (viewName: string, title: string, customTagline: string = null!) => {
        setModalView(viewName)
        setModalTitle(title)
        if (!!customTagline) {
            setModalTagline(customTagline)
        }
        setModalState(true)
    }

    const saveTrade = () => {
        setModalState(false)
        toast.success('Trade Created')
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

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage - 1)
    }

    const {items} = usePagination({
        count: rows.length / rowsPerPage,
        onChange: handleChangePage
    })

    function saveCarProfile() {
        setModalState(false)
        toast.success('Created Successfully!')
    }

    return (
        <Container>
            <div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            border: '1px solid #243773',
                            padding: '16px',
                            fontWeight: 'bold',
                            color: '#243773'
                        },
                        iconTheme: {
                            primary: '#243773',
                            secondary: '#FFFAEE'
                        }
                    }}
                />
            </div>
            <Header>
                <Typography variant="h4">
                    <b>Inventory</b>
                </Typography>
                <ActionBar>
                    <Button text="Add Car Profile" width={150} marginLeft="18px"
                            onClick={() => showModal('createCarProfile', '')}/>
                    <Button
                        text="Create Brand"
                        width={150}
                        outlined={true}
                        marginLeft="18px"
                        bgColor={t.primaryBlue}
                        disabled={true}
                        onClick={() => showModal('createBrand', 'Create Brand', 'Add a vehicle brand')}
                    />
                    <Button
                        text="Create Trade"
                        width={150}
                        outlined={true}
                        marginLeft="18px"
                        onClick={() => showModal('addCar', 'Select Car')}
                    />
                </ActionBar>
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
                <div>&nbsp;</div>
            </Breadcrumbs>
            <Grid container spacing={5} style={{marginTop: 24}}>
                <Grid item xs={4}>
                    <Card>
                        <Typography variant="h6">Car Listings</Typography>
                        <div className="bottom">
                            <div className="count">800</div>
                            <Button text="View All" width="84px" onClick={() => {
                                handleNavigation('/inventory/car-listings')
                            }}/>
                        </div>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card>
                        <Typography variant="h6">Under Inspection</Typography>
                        <div className="bottom">
                            <div className="count">1,200</div>
                            <Button text="View All" width="84px" onClick={() => {
                                handleNavigation('/inventory/under-inspection')
                            }}/>
                        </div>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card>
                        <div className='top'>
                            <Typography variant="h6">Available For Trade</Typography>
                            <div className='success'>controlled by created trade</div>
                        </div>
                        <div className="bottom">
                            <div className="count">300</div>
                            <Button text="View All" width="84px" onClick={() => {
                                handleNavigation('/inventory/available-for-trade')
                            }}/>
                        </div>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card>
                        <div className='top'>
                            <Typography variant="h6">Ongoing Trade</Typography>
                            <div className='danger'>system controlled</div>
                        </div>
                        <div className="bottom">
                            <div className="count">250</div>
                            <Button text="View All" width="84px" onClick={() => {
                                handleNavigation('/inventory/ongoing-trade')
                            }}/>
                        </div>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card>
                        <div className='top'>
                            <Typography variant="h6">Sold</Typography>
                            <div className='danger'>system controlled</div>
                        </div>
                        <div className="bottom">
                            <div className="count">150</div>
                            <Button text="View All" width="84px" onClick={() => {
                                handleNavigation('/inventory/sold')
                            }}/>
                        </div>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card>
                        <Typography variant="h6">Archived</Typography>
                        <div className="bottom">
                            <div className="count">20</div>
                            <Button text="View All" width="84px" onClick={() => {
                                handleNavigation('/inventory/archived')
                            }}/>
                        </div>
                    </Card>
                </Grid>
            </Grid>
            <Modal
                open={modalOpen}
                onClose={() => {
                    setModalState(false)
                }}
            >
                <ModalBody>
                    <ModalBodyHeader>
                        <Typography variant="h5" style={{fontWeight: 600}}>
                            {modalTitle}
                        </Typography>
                        <Image
                            src="/icons/Cancel-Black.svg"
                            width={25}
                            height={25}
                            onClick={() => setModalState(false)}
                            style={{cursor: 'pointer'}}
                        />
                    </ModalBodyHeader>
                    <Typography variant="inherit" style={{marginBottom: 20}}>
                        {modalTitle !== ''
                            ? modalTagline
                            : ''}{' '}
                        &nbsp;
                    </Typography>
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
                                                <SearchOutlined/>
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            <TableCard style={{height: 480, overflowY: 'auto'}}>
                                <TableContainer>
                                    <Table style={{minWidth: 650}} aria-label="simple table">
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
                                                                style={{borderRadius: '8px'}}
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
                            <div style={{display: 'flex', marginTop: 20}}>
                                <Button
                                    text="Proceed"
                                    width={510}
                                    marginLeft="auto"
                                    marginRight="auto"
                                    onClick={() => showModal('createTrade', 'Create Trade')}
                                    disabled={selectedCarId === null}
                                />
                            </div>
                        </>
                    )}
                    {modalView === 'createBrand' && (
                        <>
                            <InputGrid>
                                <input
                                    type='file'
                                    accept='image/*'
                                    ref={hiddenFileInput}
                                    onChange={handleFileChange}
                                    style={{display: 'none'}}
                                />
                                <FormControl
                                    fullWidth
                                    variant="standard"
                                >
                                    <InputLabel htmlFor="standard-adornment-password">
                                        Upload Vehicle Image
                                    </InputLabel>
                                    <Input
                                        id="custom-file"
                                        type={'text'}
                                        readOnly={true}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleFileClick}
                                                >
                                                    <img src='/images/Upload.png' height={20} width={22}/>
                                                    <Typography variant='subtitle2' color='primary'
                                                                style={{marginLeft: 2}}>Upload</Typography>
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="Model"
                                />
                            </InputGrid>
                            <InputGrid>
                                <FormControl fullWidth>
                                    <Select
                                        value={brandModel}
                                        onChange={(event) =>
                                            setBrandModel(String(event.target.value))
                                        }
                                        displayEmpty
                                        inputProps={{'aria-label': 'Without label'}}
                                        style={{height: 40}}
                                    >
                                        <option value="" disabled>
                                            Brand Model
                                        </option>
                                        <option value={''}>&nbsp;</option>
                                    </Select>
                                </FormControl>
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="Body Type"
                                />
                            </InputGrid>
                            <InputGrid>
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="Year"
                                />
                            </InputGrid>
                            <Button
                                text="Proceed"
                                width={510}
                                marginLeft="auto"
                                marginRight="auto"
                                marginTop={40}
                                onClick={() => showModal('viewBrandSummary', 'Proceed', 'Vehicle brand summary')}
                            />
                        </>
                    )}
                    {modalView === 'viewBrandSummary' && (
                        <>
                            <FlexRow style={{justifyContent: 'space-between', alignItems: 'start', marginTop: 8}}>
                                <img
                                    src="/images/Big-Default-Car.png"
                                    width={185}
                                    height={135}
                                    style={{borderRadius: '8px'}}
                                />
                                <img
                                    src="/images/Toyota-Full.png"
                                    width={80}
                                    height={22}
                                    style={{}}
                                />
                            </FlexRow>
                            <Statistic>
                                <div className='key'>Make</div>
                                <div className='value'>Toyota</div>
                            </Statistic>
                            <Statistic>
                                <div className='key'>Model</div>
                                <div className='value'>Rav4</div>
                            </Statistic>
                            <Statistic>
                                <div className='key'>Year</div>
                                <div className='value'>2018</div>
                            </Statistic>
                            <Statistic>
                                <div className='key'>Body Type</div>
                                <div className='value'>Saloon</div>
                            </Statistic>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                                fontWeight: 'bold',
                                color: t.lightGrey
                            }}>
                                <img src='/icons/Caution-Yellow.svg' alt='caution' height={20} width={20}
                                     style={{marginRight: 4}}/>
                                <span>There’s no current UI for managing created brands, If you wish to delete contact the development team</span>
                            </div>
                            <Button
                                text="Create & Save Brand"
                                width={516}
                                marginLeft="auto"
                                marginRight="auto"
                                marginTop={40}
                                onClick={() => setModalState(false)}
                            />
                        </>
                    )}
                    {modalView === 'createTrade' && (
                        <>
                            <HeaderText variant="inherit" style={{marginTop: '40px'}}>
                                Creating Trade for
                            </HeaderText>
                            <InfoSection container spacing={3}>
                                <Grid item xs={12} style={{display: 'flex'}}>
                                    <VehicleDetails style={{width: 700}}>
                                        <img
                                            src="/images/Big-Default-Car.png"
                                            width={185}
                                            height={135}
                                            style={{borderRadius: '8px'}}
                                        />
                                        <div className="stats">
                                            <img
                                                src="/images/Toyota-Full.png"
                                                width={80}
                                                height={22}
                                                style={{marginBottom: -15}}
                                            />
                                            <Typography variant="h5" className="trade">
                                                Trade ID 09890
                                            </Typography>
                                            <Typography variant="h6">Toyota Rav4 2020</Typography>
                                        </div>
                                    </VehicleDetails>
                                    <Button
                                        text="Go to Car Profile"
                                        width={150}
                                        outlined={true}
                                        onClick={() => handleNavigation(`/inventory/car-profile/1?status=Available For Trade`)}
                                    />
                                </Grid>
                            </InfoSection>
                            <ModalSplitContainer>
                                <div className="left">
                                    <div className="title">Trade Information</div>
                                    <TextField className="input" placeholder="Slot Quantity"/>
                                    <FlexRow className="input">
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Price per slot"
                                            fullWidth
                                        ></TextField>
                                    </FlexRow>
                                    <FlexRow className="input">
                                        <div className="currency-box">%</div>
                                        <TextField
                                            placeholder="Estimated ROT per slot"
                                            fullWidth
                                        ></TextField>
                                    </FlexRow>
                                    <TextField
                                        className="input"
                                        placeholder="Trading Duration in Months"
                                    />
                                    <div
                                        className="title"
                                        style={{marginBottom: 20, marginTop: 40}}
                                    >
                                        Carpadi Commission
                                    </div>
                                    <FlexRow className="input">
                                        <div className="currency-box">&#8358;</div>
                                        <TextField placeholder="Bought price" fullWidth></TextField>
                                    </FlexRow>
                                    <FlexRow className="input">
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Maximum selling price"
                                            fullWidth
                                        ></TextField>
                                    </FlexRow>
                                    <FlexRow className="input">
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Maximum selling price"
                                            fullWidth
                                        ></TextField>
                                    </FlexRow>
                                </div>
                                <div className="right">
                                    <div className="title">Trade Summary</div>
                                    <div className="content">
                                        <Grid item xs={12}>
                                            <PriceCard style={{background: t.alertSuccessLite}}>
                                                <Typography variant="body1">
                                                    Total Slot Price + Total ROT
                                                </Typography>
                                                <Typography variant="h5">&#8358; 0.00</Typography>
                                            </PriceCard>
                                            <Statistic>
                                                <div className="key">Initial + ROT</div>
                                                <div className="value">&#8358; 0.00</div>
                                            </Statistic>
                                            <Statistic>
                                                <div className="key">Sold Slot Price</div>
                                                <div className="value">&#8358; 0.00</div>
                                            </Statistic>
                                            <PriceCard style={{marginTop: 40}}>
                                                <Typography variant="body1">
                                                    Estimated Carpadi minimum Profit on Sales
                                                </Typography>
                                                <Typography variant="h5">&#8358; 0.00</Typography>
                                            </PriceCard>
                                            <PriceCard
                                                style={{
                                                    background: t.alertSuccessLite,
                                                    marginTop: 20
                                                }}
                                            >
                                                <Typography variant="body1">
                                                    Estimated Carpadi maximum Profit on Sales
                                                </Typography>
                                                <Typography variant="h5">&#8358; 0.00</Typography>
                                            </PriceCard>
                                        </Grid>
                                    </div>
                                </div>
                            </ModalSplitContainer>
                            <Button
                                text={modalTitle}
                                width={590}
                                marginLeft="auto"
                                marginRight="auto"
                                marginTop="40px"
                                onClick={() => saveTrade()}
                            />
                        </>
                    )}
                    {modalView === 'createCarProfile' && (
                        <>
                            <Info>
                                <img
                                    src="/images/Fetched-car-Green.png"
                                    alt="Trash"
                                    height={98}
                                    width={98}
                                />
                                <Typography
                                    variant="h6"
                                    style={{marginTop: 48, marginBottom: 16}}
                                >
                                    Upload Vehicle Info
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    style={{maxWidth: 206, marginBottom: 39}}
                                >
                                    Kindly provide the registration number (VIN) of the car below
                                </Typography>
                                <TextField fullWidth placeholder={'Enter VIN number'}/>
                                <Button
                                    text="Fetch Car Information"
                                    width={372}
                                    marginTop={30}
                                    onClick={() => showModal('fetchedCarProfile', 'Fetched Car Profile')}
                                />
                            </Info>
                        </>
                    )}
                    {modalView === 'fetchedCarProfile' && (
                        <>
                            <HeaderText style={{marginBottom: 10, marginTop: 20}}>Number Plate</HeaderText>
                            <TextField placeholder='VIN (Number Plate)' style={{width: 330, marginBottom: 30}}/>
                            <HeaderText style={{marginBottom: 10, marginTop: 10}}>Vehicle Info</HeaderText>
                            <InputGrid>
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="VIN"
                                />
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="Color"
                                    type='color'
                                />
                            </InputGrid>
                            <InputGrid>
                                <FormControl fullWidth>
                                    <Select
                                        value={transmissionType}
                                        onChange={(event) =>
                                            setTransmissionType(String(event.target.value))
                                        }
                                        displayEmpty
                                        inputProps={{'aria-label': 'Without label'}}
                                    >
                                        <option value="" disabled>
                                            Transmission Type
                                        </option>
                                        <option value={'Manual'}>Manual</option>
                                        <option value={'Automatic'}>Automatic</option>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <Select
                                        value={fuelType}
                                        onChange={(event) =>
                                            setFuelType(String(event.target.value))
                                        }
                                        displayEmpty
                                        inputProps={{'aria-label': 'Without label'}}
                                    >
                                        <option value="" disabled>
                                            Fuel Type
                                        </option>
                                        <option value={'Petrol'}>Petrol</option>
                                        <option value={'Diesel'}>Diesel</option>
                                    </Select>
                                </FormControl>
                            </InputGrid>
                            <InputGrid>
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="Vehicle Age"
                                />
                                <FormControl fullWidth>
                                    <Select
                                        value={seatNumber}
                                        onChange={(event) =>
                                            setSeatNumber(Number(event.target.value))
                                        }
                                        displayEmpty
                                        inputProps={{'aria-label': 'Without label'}}
                                    >
                                        <option value="" disabled>
                                            Number of Setas
                                        </option>
                                        <option value={'4'}>4</option>
                                        <option value={'5'}>5</option>
                                        <option value={'6'}>6</option>
                                        <option value={'7'}>7</option>
                                        <option value={'8'}>8</option>
                                    </Select>
                                </FormControl>
                            </InputGrid>
                            <InputGrid>
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="Make"
                                />
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="Current Mileage"
                                />
                            </InputGrid>
                            <InputGrid>
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="Year"
                                />
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="Model"
                                />
                            </InputGrid>
                            <Button
                                text="Proceed"
                                width={510}
                                marginLeft="auto"
                                marginRight="auto"
                                marginTop={40}
                                onClick={() => showModal('uploadCarImages', 'Upload Car Images', 'Upload minimum of 5 images to complete profile')}
                            />
                        </>
                    )}
                    {modalView === 'uploadCarImages' && (
                        <>
                            <ImageGrid style={{justifyContent: 'start', maxWidth: 745}}>
                                <div className='image'>
                                    <img src="/images/FullSize-Default-Car.png" className="image"/>
                                    <img src="/icons/Delete-Circular-Green.svg" className='delete'/>
                                </div>
                                <div className='image'>
                                    <img src="/images/FullSize-Default-Car.png" className="image"/>
                                    <img src="/icons/Delete-Circular-Green.svg" className='delete'/>
                                </div>
                                <div className='image'>
                                    <img src="/images/FullSize-Default-Car.png" className="image"/>
                                    <img src="/icons/Delete-Circular-Green.svg" className='delete'/>
                                </div>
                                <div className='image'>
                                    <img src="/images/FullSize-Default-Car.png" className="image"/>
                                    <img src="/icons/Delete-Circular-Green.svg" className='delete'/>
                                </div>
                                <div className='image'>
                                    <img src="/images/FullSize-Default-Car.png" className="image"/>
                                    <img src="/icons/Delete-Circular-Green.svg" className='delete'/>
                                </div>
                            </ImageGrid>
                            <ImageUpload>
                                <div className='content'>
                                    <Image src='/images/Upload.png' alt='Upload' height={38} width={44}/>
                                    <div style={{marginTop: 10}}>
                                        Upload Vehicle Image
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={hiddenFileInput}
                                        onChange={handleFileChange}
                                        style={{display: 'none'}}
                                    />
                                    <Button text='Upload' width={128} marginTop={40}
                                            onClick={() => handleFileClick(event)}/>
                                </div>
                            </ImageUpload>
                            <Button
                                text="Create Car Profile"
                                width={510}
                                marginLeft="auto"
                                marginRight="auto"
                                marginTop={50}
                                onClick={() => saveCarProfile()}
                            />
                        </>
                    )}
                </ModalBody>
            </Modal>
        </Container>
    )
}

export default InventoryPage

InventoryPage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

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
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`
const ModalBodyHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const HeaderText = withStyles({
    root: {
        color: t.lightGrey,
        fontWeight: 'bold',
        display: 'block'
    }
})(Typography)
const PriceCard = withStyles({
    elevation1: {boxShadow: 'none'},
    root: {
        height: '100px',
        width: '100%',
        padding: '13px 19px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: `${t.primaryExtraLite}`
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
const Card = styled.div`
  min-width: 356px;
  height: 235px;
  padding: 13px 19px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${t.white};
  border-radius: 14px;

  .count {
    font-weight: bold;
    font-size: 32px;
  }

  .bottom {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .top {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;

    .danger, .success {
      margin-left: 10px;
    }

    .danger {
      color: ${t.alertError};
    }

    .success {
      color: ${t.alertSuccess}
    }
  }
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
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
const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`
const ActionBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;

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
const VehicleDetails = styled.div`
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
const Statistic = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 20px;
  padding-bottom: 5px;
  font-size: 16px;
  border-bottom: 1px solid ${t.extraLiteGrey};
  width: 100%;

  .value {
    font-weight: bold;
  }
`
const ModalSplitContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  min-width: 800px;

  .left,
  .right {
    display: flex;
    flex-direction: column;

    .title {
      font-weight: bold;
      color: ${t.grey};
      margin-bottom: 10px;
      font-size: 16px;
    }
  }

  .left {
    width: 45%;
    margin-right: 24px;
    display: flex;
    flex-direction: column;

    .input {
      margin-bottom: 30px;
    }
  }

  .right {
    width: 55%;

    .content {
      border: 2px solid ${t.extraLiteGrey};
      border-radius: 12px;
      padding: 20px;
    }

    .title {
      font-weight: bold;
      color: ${t.grey};
      margin-bottom: 10px;
    }
  }
`
const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`
const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 24px;
  margin-bottom: 20px;
  width: 700px;

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
const ImageGrid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
  justify-content: space-between;

  .image {
    margin-bottom: 14px;
    object-fit: cover;
    border-radius: 14px;
    height: 130px;
    width: 135px;
    position: relative;

    .delete {
      position: absolute;
      right: 8px;
      top: 8px;
      cursor: pointer;
    }

    &:not(:last-child) {
      margin-right: 14px;
    }
  }
`
const ImageUpload = styled.div`
  border: 2px solid ${t.extraLiteGrey};
  border-radius: 14px;
  padding: 31px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .content {
    display: inherit;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`

const TableCard = withStyles({
    elevation1: {boxShadow: 'none'}
})(Paper)