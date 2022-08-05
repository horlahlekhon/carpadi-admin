import {withStyles} from "@material-ui/styles";
import {t} from "../../styles/theme";
import {
    FormControl,
    Grid, IconButton,
    Input,
    InputAdornment,
    InputLabel, Modal,
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import styled from "styled-components";
import Image from "next/image";
import Button from "./Button";
import {Add, SearchOutlined} from "@material-ui/icons";
import ToggleSwitch from "./ToggleSwitch";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {retrieveCars} from "../../services/car";
import {toast} from "react-hot-toast";
import {formatDate, trimString} from "../../helpers/formatters";
import CPToast from "./CPToast";

const CreateSale = ({modalOpen = true, onClick, car = null}) => {
    const router = useRouter()
    const rowsPerPage = 50
    const [modalView, setModalView] = useState('addCar')
    const [selectedCar, setSelectedCar] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [state, setState] = useState({
        saleActive: true
    })
    const [cars, setCars] = useState([])
    const [refCars, setRefCars] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const options = {
        addCar: {
            title: 'Select Car',
            description: 'Kindly provide the following information below.'
        },
        addCarDetails: {
            title: '',
            description: 'Kindly provide the following information below. '
        },
        viewCarSummary: {
            title: '',
            description: 'Kindly review the following information below.'
        },
    }

    const handleNavigation = (action: string) => {
        router.push(`${action}`)
            .then(() => {
            })
    }

    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.checked})
    }

    const retrieveCarList = (page = 0) => {
        retrieveCars(rowsPerPage, page)
            .then((response) => {
                if (response.status) {
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

    const filterCars = () => {
        if (searchTerm === '' || searchTerm === undefined || searchTerm === null) {
            setCars(refCars)
        } else {
            const filteredCars = [...refCars].filter(x => (x?.information?.model.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                x?.information?.make.toString().toLowerCase().includes(searchTerm.toLowerCase())))
            setCars(filteredCars)
        }
    }

    useEffect(() => {
        if (car) {
            setSelectedCar(car)
            setModalView('addCarDetails')
        } else {
            retrieveCarList()
        }
    }, [car])

    return (<>
        <CPToast/>
        <Modal
            open={modalOpen}
            onClose={() => {
                onClick()
            }}
        >
            <ModalBody>
                <ModalBodyHeader>
                    <Typography variant="h5" style={{fontWeight: 600}}>
                        {options[modalView].title}
                    </Typography>
                    <Image
                        src="/icons/Cancel-Black.svg"
                        width={25}
                        height={25}
                        onClick={() => onClick()}
                        style={{cursor: 'pointer'}}
                    />
                </ModalBodyHeader>
                <Typography variant="inherit" style={{marginBottom: 20}}>
                    {options[modalView].title !== ''
                        ? options[modalView].description
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
                                width: '100%',
                                display: 'flex',
                                marginTop: '20px',
                                marginBottom: '10px'
                            }}
                            fullWidth
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
                                value={searchTerm}
                                onChange={(e) => {
                                    if (e.target.value === '' || e.target.value === undefined || e.target.value === null) {
                                        setSearchTerm('')
                                        setCars(refCars)
                                    } else {
                                        setSearchTerm(e.target.value)
                                    }
                                }}
                                onKeyPress={(ev) => {
                                    if (ev.key === "Enter") {
                                        ev.preventDefault();
                                        filterCars()
                                    }
                                }}
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
                                        {cars
                                            .map((row, idx) => (
                                                <TableRow
                                                    key={idx}
                                                    style={{
                                                        cursor: 'pointer',
                                                        background:
                                                            selectedCar?.id === row.id
                                                                ? t.primaryExtraLite
                                                                : 'white'
                                                    }}
                                                    onClick={() => setSelectedCar(row)}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        <img
                                                            src={row.pictures.length > 0 ? row.pictures[0] : null}
                                                            width={48}
                                                            height={48}
                                                            alt={row?.information?.make}
                                                            style={{borderRadius: '8px'}}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {row?.information?.make} {row?.information?.model} {row?.information?.year}
                                                    </TableCell>
                                                    <TableCell
                                                        align="left">{trimString(row?.information?.id)}</TableCell>
                                                    <TableCell align="left">{row.vin}</TableCell>
                                                    <TableCell
                                                        align="left">{formatDate(row?.created)}</TableCell>
                                                    <TableCell align="left"
                                                               style={{textTransform: 'capitalize'}}>
                                                        {row?.status}
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
                                onClick={() => setModalView('addCarDetails')}
                                disabled={selectedCar === null}
                            />
                        </div>
                    </>
                )
                }
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
                                onClick={() => setModalView('viewCarSummary')}
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
            </ModalBody>
        </Modal>
    </>)
}

export default CreateSale;


const HeaderText = withStyles({
    root: {
        color: t.lightGrey,
        fontWeight: 'bold',
        display: 'block'
    }
})(Typography)
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