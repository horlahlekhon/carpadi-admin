import MainLayout from '../../../../components/layouts/MainLayout'
import styled from 'styled-components'
import {
    Typography,
    Modal,
    TextField,
    Select,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Grid, Paper
} from '@material-ui/core'
import {t} from '../../../../styles/theme'
import {useRouter} from 'next/router'
import Button from '../../../../components/shared/Button'
import Image from 'next/image'
import {withStyles} from '@material-ui/styles'
import {useState, useRef} from 'react'
import Checkbox from "../../../../components/shared/Checkbox";
import {Add, SearchOutlined} from "@material-ui/icons";
import ToggleSwitch from "../../../../components/shared/ToggleSwitch";
import {usePagination} from "@material-ui/lab/Pagination";
import {toast} from "react-hot-toast";

function SingleUnderInspectionPage() {
    const router = useRouter()
    const pageId = router.query.id || 'NA'
    const status = String(router.query.status).toLowerCase() || 'NA'
    const rowsPerPage = 10
    const [modalOpen, setModalState] = useState(false)
    const [modalView, setModalView] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [modalTagline, setModalTagline] = useState(' Kindly provide the following information below.')
    const [transmissionType, setTransmissionType] = useState('')
    const [fuelType, setFuelType] = useState('')
    const [carBrand, setCarBrand] = useState('')
    const [state, setState] = useState({
        saleActive: true
    })
    const [selectedCarId, setSelectedCar] = useState(null)
    const [page, setPage] = useState(0)
    const hiddenFileInput = useRef(null);

    const showModal = (viewName: string, title: string, customTagline: string = null!) => {
        setModalView(viewName)
        setModalTitle(title)
        if (!!customTagline) {
            setModalTagline(customTagline)
        }
        setModalState(true)
    }

    const handleNavigation = (action: string) => {
        router.push(`${action}`)
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

    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.checked})
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage - 1)
    }

    const {items} = usePagination({
        count: rows.length / rowsPerPage,
        onChange: handleChangePage
    })

    const saveTrade = () => {
        setModalState(false)
        toast.success('Trade Created')
    }

    return (
        <Container>
            <Header>
                <Typography variant="h4">
                    <b>{pageId}</b>
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
                    <span className="text" style={{textTransform: 'capitalize'}}>{status}</span>
                    <span className="separator"></span>
                </div>
                <div>
                    <span className="text">{pageId}</span>
                    <span className="separator"></span>
                </div>
            </Breadcrumbs>
            <Body>
                <ActionBar>
                    <div className="vehicle-info">
                        <Image src="/images/Toyota-Full.png" height={11} width={40}/>
                        <Typography variant="h5" style={{marginLeft: 20}}>
                            Toyota Rav4 2020
                        </Typography>
                    </div>
                    <div className="button-group">
                        <Button
                            text="Vehicle Inspection Report"
                            width={210}
                            outlined={true}
                            marginRight="16px"
                        />
                        <Button
                            text="Delete Car Profile"
                            width={160}
                            outlined={true}
                            marginRight="16px"
                            bgColor={t.alertError}
                            onClick={() => {
                                showModal('deleteCarProfile', '')
                            }}
                        />
                        <Button
                            text="Edit Images"
                            width={150}
                            outlined={true}
                            marginRight="16px"
                            onClick={() => showModal('editImages', 'Edit Car Images', 'Upload minimum of 5 images to complete profile')}
                        />
                        <Button
                            text="Edit Details"
                            width={150}
                            outlined={true}
                            onClick={() => showModal('editDetails', 'Edit Car Profile')}
                        />
                    </div>
                </ActionBar>
                <SplitContainer>
                    <div className="left">
                        <Flex>
                            <div className="slideshow">
                                <img
                                    className="main"
                                    src="/images/FullSize-Default-Car.png"
                                    height={255}
                                    width='100%'
                                />
                                <img
                                    src="/images/Previous-Slideshow.png"
                                    alt="Prev"
                                    className="previous"
                                />
                                <img src="/images/Next-Slideshow.png" alt="Next" className="next"/>
                            </div>
                            <div className="gallery">
                                <ImageGrid>
                                    <img src="/images/FullSize-Default-Car.png" className="image"/>
                                    <img src="/images/FullSize-Default-Car.png" className="image"/>
                                    <img src="/images/FullSize-Default-Car.png" className="image"/>
                                </ImageGrid>
                            </div>
                            <Button text="Create Sales Profile" width='100%' outlined={true}
                                    onClick={() => showModal('addCar', "Add Car To Sales Platform")}/>
                            <Button text="Maintenance Record" width='100%' outlined={true} marginTop={16}
                                    marginBottom={30} onClick={() => handleNavigation(`/inventory/car-profile/VID-110/maintenance-record?status=${status}`)}/>
                            <CheckItem style={{background: status === 'car listings' ? t.alertSuccessLite : ''}}>
                                <span>Car Listings</span>
                                <Checkbox color='primary'/>
                            </CheckItem>
                            <CheckItem style={{background: status === 'under inspection' ? t.alertSuccessLite : ''}}>
                                <span>Under Inspection</span>
                                <Checkbox color='primary'/>
                            </CheckItem>
                            <CheckItem style={{background: status === 'available for trade' ? t.alertSuccessLite : ''}}>
                                <div className='multi'>
                                    <span className='title'>Available for Trade</span>
                                    <span className='success'>controlled by created trade</span>
                                </div>
                                <Checkbox color='primary'/>
                            </CheckItem>
                            <CheckItem style={{background: status === 'ongoing trade' ? t.alertSuccessLite : ''}}>
                                <div className='multi'>
                                    <span className='title'>Ongoing Trade</span>
                                    <span className='danger'>system controlled</span>
                                </div>
                                <Checkbox color='primary'/>
                            </CheckItem>
                            <CheckItem style={{background: status === 'sold' ? t.alertSuccessLite : ''}}>
                                <div className='multi'>
                                    <span className='title'>Sold</span>
                                    <span className='danger'>system controlled</span>
                                </div>
                                <Checkbox color='primary'/>
                            </CheckItem>
                            <CheckItem style={{background: status === 'archived' ? t.alertSuccessLite : ''}}>
                                <span>Add to Archived</span>
                                <Checkbox color='primary'/>
                            </CheckItem>
                        </Flex>
                    </div>
                    <div className="right">
                        <Detail>
                            <div className="key">Date Added</div>
                            <div className="value">March 20, 1989</div>
                        </Detail>
                        <Detail>
                            <div className="key">Vehicle ID</div>
                            <div className="value">VID-09890</div>
                        </Detail>
                        <Detail>
                            <div className="key">Vehicle Identification Number</div>
                            <div className="value">EN-9930-929292-91923</div>
                        </Detail>
                        <Detail>
                            <div className="key">Number of Seats</div>
                            <div className="value">4</div>
                        </Detail>
                        <Detail>
                            <div className="key">Make</div>
                            <div className="value">Toyota</div>
                        </Detail>
                        <Detail>
                            <div className="key">Model</div>
                            <div className="value">Rav4</div>
                        </Detail>
                        <Detail>
                            <div className="key">Year</div>
                            <div className="value">2020</div>
                        </Detail>
                        <Detail>
                            <div className="key">Color</div>
                            <div className="value">Grey</div>
                        </Detail>
                        <Detail>
                            <div className="key">Body Type</div>
                            <div className="value">Saloon</div>
                        </Detail>
                        <Detail>
                            <div className="key">Fuel Type</div>
                            <div className="value">Petrol</div>
                        </Detail>
                        <Detail>
                            <div className="key">Transmission Type</div>
                            <div className="value">Automatic</div>
                        </Detail>
                        <Detail>
                            <div className="key">Current Mileage</div>
                            <div className="value">5,000</div>
                        </Detail>
                        <Detail>
                            <div className="key">Vehicle Age</div>
                            <div className="value">3 Years</div>
                        </Detail>
                        {['car listings'].includes(status) && (
                            <Button text='Create Trade' width='100%' marginTop={30} onClick={() => showModal('createTrade', 'Create Trade')}
                            />
                        )}
                        {['available for trade', 'ongoing trade', 'sold'].includes(status) && (
                            <Button text='View Trade' width='100%' marginTop={30}
                                    onClick={() => handleNavigation(`/trade/${pageId}`)}/>
                        )}
                    </div>
                </SplitContainer>
            </Body>
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
                    {modalView === 'editDetails' && (
                        <>
                            <HeaderText style={{marginBottom: 10, marginTop: 20}}>Select Car Brand</HeaderText>
                            <FormControl style={{width: 330, marginBottom: 30}}>
                                <Select
                                    value={carBrand}
                                    onChange={(event) =>
                                        setCarBrand(String(event.target.value))
                                    }
                                    displayEmpty
                                    inputProps={{'aria-label': 'Without label'}}
                                >
                                    <option value="" disabled>
                                        Car Brand
                                    </option>
                                    <option value={'Toyota Rav4'}>Toyota Rav4</option>
                                    <option value={'Toyoya Sequoia'}>Toyoya Sequoia</option>
                                </Select>
                            </FormControl>
                            <HeaderText style={{marginBottom: 10, marginTop: 10}}>Car Profile Details</HeaderText>
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
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="Mileage"
                                />
                            </InputGrid>
                            <HeaderText style={{marginBottom: 10, marginTop: 10}}>Vehicle Description</HeaderText>
                            <TextField fullWidth type='textfield' multiline rows={4} placeholder='
                                A detailed vehicle description'>
                            </TextField>
                            <Button
                                text="Save Changes"
                                width={510}
                                marginLeft="auto"
                                marginRight="auto"
                                marginTop={40}
                                onClick={() => setModalState(false)}
                            />
                        </>
                    )}
                    {modalView === 'editImages' && (
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
                                text="Save Changes"
                                width={510}
                                marginLeft="auto"
                                marginRight="auto"
                                marginTop={50}
                            />
                        </>
                    )}
                    {modalView === 'deleteCarProfile' && (
                        <>
                            <Info>
                                <img
                                    src="/icons/Trash-Red.svg"
                                    alt="Trash"
                                    height={40}
                                    width={40}
                                />
                                <Typography
                                    variant="h6"
                                    style={{marginTop: 48, marginBottom: 16}}
                                >
                                    Delete Car Profile
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    style={{maxWidth: 206, marginBottom: 39}}
                                >
                                    You are about to delete this vehicle profile.
                                </Typography>
                                <Button
                                    text="Yes, Delete"
                                    width={174}
                                    onClick={() => setModalState(false)}
                                />
                            </Info>
                        </>
                    )}
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
                                    onClick={() => showModal('addCarDetails', '')}
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
                            <HeaderText variant="inherit" style={{marginTop: '40px'}}>
                                Creating Sales For
                            </HeaderText>
                            <InfoSection container spacing={3} style={{width: 700}}>
                                <Grid item xs={6}>
                                    <VehicleDetails>
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
                            <HeaderText style={{marginBottom: 16}}>
                                Car Sales Highlight
                            </HeaderText>
                            <TextField
                                fullWidth
                                placeholder="Accident free | full customs duty paid | good history report ..."
                            ></TextField>
                            <HeaderText
                                variant="inherit"
                                style={{marginTop: 40, marginBottom: 20}}
                            >
                                Selling Price
                            </HeaderText>
                            <FlexRow style={{marginBottom: 50}}>
                                <div className="currency-box">&#8358;</div>
                                <TextField
                                    placeholder="Enter price"
                                    style={{width: 400}}
                                ></TextField>
                            </FlexRow>
                            <FlexRow style={{marginBottom: 20}}>
                                <HeaderText>Key Features</HeaderText>
                                <IconPill>
                                    Add key feature
                                    <Add className="icon"/>
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
                            <FlexRow style={{marginBottom: 20, marginTop: 60}}>
                                <HeaderText>Car Sales Image</HeaderText>
                                <IconPill>
                                    Add Image
                                    <Add className="icon"/>
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
                            <div style={{display: 'flex', marginTop: 70}}>
                                <Button
                                    text="Proceed"
                                    width={510}
                                    marginLeft="auto"
                                    marginRight="auto"
                                    onClick={() => showModal('viewCarSummary', '')}
                                />
                            </div>
                        </>
                    )}
                    {modalView === 'viewCarSummary' && (
                        <>
                            <Typography variant="inherit">
                                Kindly review the following information below.
                            </Typography>
                            <Body style={{width: 960}}>
                                <PriceSection container spacing={3}>
                                    <Grid item xs={6}>
                                        <VehicleDetail>
                                            <Image
                                                src="/images/Big-Default-Car.png"
                                                height={135}
                                                width={185}
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
                                <p style={{marginBottom: 40}}>
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
                                        <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                        <Typography variant="subtitle1" className="text">
                                            Leather Seats
                                        </Typography>
                                    </div>
                                    <div className="key-features">
                                        <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                        <Typography variant="subtitle1" className="text">
                                            Leather Seats
                                        </Typography>
                                    </div>
                                    <div className="key-features">
                                        <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                        <Typography variant="subtitle1" className="text">
                                            Leather Seats
                                        </Typography>
                                    </div>
                                    <div className="key-features">
                                        <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                        <Typography variant="subtitle1" className="text">
                                            Leather Seats
                                        </Typography>
                                    </div>
                                    <div className="key-features">
                                        <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                        <Typography variant="subtitle1" className="text">
                                            Leather Seats
                                        </Typography>
                                    </div>
                                    <div className="key-features">
                                        <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                        <Typography variant="subtitle1" className="text">
                                            Leather Seats
                                        </Typography>
                                    </div>
                                    <div className="key-features">
                                        <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                        <Typography variant="subtitle1" className="text">
                                            Leather Seats
                                        </Typography>
                                    </div>
                                    <div className="key-features">
                                        <img src="/images/Big-Default-Car.png" alt="Feature"/>
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
                                <div style={{display: 'flex', marginTop: 70}}>
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
                    {modalView === 'createTrade' && (
                        <div style={{maxWidth: 980}}>
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
                                        <Grid item xs={12} style={{marginTop: -30}}>
                                            <PriceCard style={{background: t.alertSuccessLite, marginBottom: 10}}>
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
                        </div>
                    )}
                </ModalBody>
            </Modal>
        </Container>
    )
}

export default SingleUnderInspectionPage

SingleUnderInspectionPage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

const HeaderText = withStyles({
    root: {
        color: t.lightGrey,
        fontWeight: 'bold',
        display: 'block'
    }
})(Typography)
const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
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
const ActionBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;

  .button-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: auto;
  }

  .vehicle-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: auto;
  }
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 36px 26px;
  background-color: ${t.white};
  border-radius: 12px;
  margin-top: 17px;
`
const Flex = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  margin-top: 16px;

  .slideshow {
    margin-right: 20px;
    position: relative;
    height: fit-content;

    .main {
      object-fit: cover;
      border-radius: 14px;
    }

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

  @media screen and (max-width: 1080px) {
    .slideshow {
      img.main {
        width: 400px;
        height: 240px;

        .next, .prev {

        }
      }
    }
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
const SplitContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;

  .left,
  .right {
    display: flex;
    flex-direction: column;
  }

  .left {
    width: 45%;
    margin-right: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .title {
      font-weight: bold;
      color: ${t.grey};
      margin-bottom: 10px;
    }
  }

  .right {
    width: 55%;

    .title {
      font-weight: bold;
      color: ${t.grey};
      margin-bottom: 10px;
    }
  }
`
const Detail = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 15px;
  padding-bottom: 5px;
  font-size: 14px;
  border-bottom: 1px solid ${t.extraLiteGrey};
  width: 100%;

  .value {
    font-weight: bold;
  }
`
const CheckItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  font-size: 14px;
  background: ${t.extraLiteGrey};
  height: 45px;
  margin-bottom: 4px;

  .multi {
    .title {
      font-weight: bold;
    }

    .danger, .success {
      font-size: 12px;
      margin-left: 4px;
    }

    .danger {
      color: ${t.alertError};
    }

    .success {
      color: ${t.alertSuccess}
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
const PriceCard = withStyles({
    elevation1: {boxShadow: 'none'},
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
const SalesStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: end;
  padding-bottom: 20px;
  margin-bottom: 20px;

  .status {
    color: ${t.primaryBlue};
  }

  .cta {
    background-color: ${t.extraLiteGrey};
    padding: 10px 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
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
