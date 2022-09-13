import {
    FormControl, Grid,
    IconButton,
    Input,
    InputAdornment,
    InputLabel, Modal, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField,
    Typography, withStyles
} from "@material-ui/core";
import Image from "next/image";
import {SearchOutlined} from "@material-ui/icons";
import {t} from "../../styles/theme";
import Button from "./Button";
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import CPToast from "./CPToast";
import styled from "styled-components";
import {useRouter} from "next/router";
import {tradeService} from "../../services/trade";
import {retrieveCars} from "../../services/car";
import {formatDate, formatNumber, trimString} from "../../helpers/formatters";
import {retrieveSettings} from "../../services/setting";
import {CarStates} from "../../lib/enums";


const CreateTrade = ({modalOpen = true, onClick, car = null}) => {
    const router = useRouter()
    const rowsPerPage = 50
    const [modalView, setModalView] = useState('addCar')
    const [selectedCar, setSelectedCar] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [cars, setCars] = useState([])
    const [refCars, setRefCars] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [trade, setTrade] = useState({
        "car": selectedCar?.id,
        "slots_available": 1,
        "estimated_return_on_trade": 0,
        "trade_status": selectedCar?.status,
        "min_sale_price": 0,
        "max_sale_price": 0,
        "estimated_sales_duration": 1,
        "bts_time": 0,
        "date_of_sale": new Date()
    })
    const [fees, setFees] = useState({
        "id": null,
        "created": null,
        "modified": null,
        "carpadi_trade_rot_percentage": 0,
        "merchant_trade_rot_percentage": 0,
        "transfer_fee": 0,
        "close_trade_fee": 0,
        "carpadi_commision": 0,
        "bonus_percentage": 0
    })
    const [pricePerslot, setPPS] = useState((Number(selectedCar?.bought_price || 0) + Number(selectedCar?.maintenance_cost || 0)) / Number(trade.slots_available))
    const [extimatedRot, setEROT] = useState((Number(pricePerslot) * (Number(fees?.merchant_trade_rot_percentage) / 100)))
    const [minSellingPrice, setMSP] = useState(((Number(pricePerslot) * (Number(fees?.carpadi_commision) / 100)) * trade.slots_available))
    const [ROT, setROT] = useState((Number(pricePerslot) * (Number(fees?.merchant_trade_rot_percentage) / 100)))
    const [minProfit, setMProfit] = useState((Number(pricePerslot) * (Number(fees?.merchant_trade_rot_percentage) / 100)))


    const options = {
        addCar: {
            title: 'Select Car',
            description: 'Kindly provide the following information below.'
        },
        createTrade: {
            title: 'Create Trade',
            description: 'Kindly provide the following information below. '
        }
    }

    const handleTradeChange = (prop) => (event) => {
        setTrade({...trade, [prop]: event.target.value})
        if (prop === 'slots_available') {
            const pps = (Number(selectedCar?.bought_price || 0) + Number(selectedCar?.maintenance_cost || 0)) / Number(event.target.value)
            // @ts-ignore
            setPPS(pps.toFixed(2))
            // const erot = (Number(pps) * (Number(fees?.merchant_trade_rot_percentage) / 100))

            const rot = ((Number(selectedCar?.bought_price) + Number(selectedCar?.maintenance_cost)) * (Number(fees?.merchant_trade_rot_percentage) / 100))
            // @ts-ignore
            setROT(rot.toFixed(2))

            const mProfit = (rot * (Number(fees?.carpadi_commision) / 100))
            // @ts-ignore
            setMProfit(mProfit.toFixed(2))

            const erot = ((Number(selectedCar?.bought_price) + Number(selectedCar?.maintenance_cost)) * (Number(fees?.merchant_trade_rot_percentage) / 100)) / Number(trade?.slots_available)
            // @ts-ignore
            setEROT(erot.toFixed(2))
            // @ts-ignore
            setMSP((rot + (Number(selectedCar?.bought_price) + Number(selectedCar?.maintenance_cost))).toFixed(2))
        }
    }

    const handleTradeChangeX = (value) => {
        setTrade({...trade, 'slots_available': value})
        const pps = (Number(selectedCar?.bought_price || 0) + Number(selectedCar?.cost_of_repairs || 0) + Number(selectedCar?.maintenance_cost || 0)) / Number(value)
        // @ts-ignore
        setPPS(pps.toFixed(2))

        const rot = ((Number(selectedCar?.bought_price) + Number(selectedCar?.maintenance_cost)) * (Number(fees?.merchant_trade_rot_percentage) / 100))
        // @ts-ignore
        setROT(rot.toFixed(2))

        const mProfit = (rot * (Number(fees?.carpadi_commision) / 100))
        // @ts-ignore
        setMProfit(mProfit.toFixed(2))

        const erot = ((Number(selectedCar?.bought_price) + Number(selectedCar?.maintenance_cost)) * (Number(fees?.merchant_trade_rot_percentage) / 100)) / Number(trade?.slots_available)
        // @ts-ignore
        setEROT(erot.toFixed(2))
        // @ts-ignore
        setMSP((rot + (Number(selectedCar?.bought_price) + Number(selectedCar?.maintenance_cost))).toFixed(2))

    }

    const handleNavigation = (action: string) => {
        router.push(`${action}`)
            .then(() => {
            })
    }

    const retrieveCarList = (page = 0) => {
        retrieveCars(rowsPerPage, page, CarStates.AVAILABLE)
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
            const filteredCars = [...refCars].filter(x => (String(x?.information?.brand?.model).toLowerCase().includes(searchTerm.toLowerCase()) || String(x?.information?.brand?.name).toLowerCase().includes(searchTerm.toLowerCase())))
            setCars(filteredCars)
        }
    }

    useEffect(() => {
        if (car) {
            setSelectedCar(car)
            setModalView('createTrade')
        } else {
            retrieveCarList()
        }
        retrieveSettings()
            .then((res) => {
                if (res.status) {
                    if (res.data?.results.length > 0) {
                        setFees(res.data.results[0])
                    }
                } else {
                    toast.error(res.data)
                }
            })
            .catch((error) => {
                toast.error(error)
            })
    }, [car])

    useEffect(() => {
        handleTradeChangeX(trade?.slots_available || 1)
    })

    const saveTrade = () => {
        setLoading(true)
        let tradeX = {
            slots_available: trade?.slots_available,
            estimated_sales_duration: trade?.estimated_sales_duration,
            car: selectedCar?.id,
        }
        return tradeService.createSingleTrade(tradeX)
            .then((data) => {
                if (data.status) {
                    toast.success('Trade Created')
                    onClick()
                    handleNavigation(`/trade/${data.data.id}`)
                } else {
                    toast.error(data?.data || "An error occurred")
                }
                setLoading(false)
            })
            .catch(error => {
                toast.error(error)
                setLoading(false)
            });
    }


    return (
        <>
            <CPToast/>
            <Modal
                open={true}
                onClose={() => onClick()}
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
                                                                alt={row?.information?.brand?.name}
                                                                style={{borderRadius: '8px'}}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row?.name || row?.information?.brand?.name}
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
                            <Button
                                text="Proceed"
                                width={510}
                                marginLeft="auto"
                                marginRight="auto"
                                marginTop={20}
                                onClick={() => setModalView('createTrade')}
                                disabled={selectedCar === null}
                            />
                        </>
                    )
                    }
                    {modalView === 'createTrade' && (
                        <>
                            <HeaderText variant="inherit" style={{marginTop: '40px'}}>
                                Creating Trade for
                            </HeaderText>
                            <InfoSection container spacing={3}>
                                <Grid item xs={12} style={{display: 'flex'}}>
                                    <VehicleDetails style={{width: 700}}>
                                        <img
                                            src={selectedCar?.pictures.length > 0 ? selectedCar?.pictures[0] : null}
                                            width={185}
                                            height={135}
                                            style={{borderRadius: '8px'}}
                                            alt={selectedCar?.information?.brand?.name}
                                        />
                                        <div className="stats">
                                            <img
                                                src="/images/Toyota-Full.png"
                                                width={80}
                                                height={22}
                                                style={{marginBottom: -15}}
                                            />
                                            <Typography variant="h5" className="trade">
                                                {trimString(selectedCar?.information?.id)}
                                            </Typography>
                                            <Typography
                                                variant="h6">{selectedCar?.name || selectedCar?.information?.brand?.name}</Typography>
                                        </div>
                                    </VehicleDetails>
                                    <Button
                                        text="Go to Car Profile"
                                        width={155}
                                        outlined={true}
                                        onClick={() => handleNavigation(`/inventory/car-profile/${selectedCar?.id}?status=${selectedCar?.status}`)}
                                    />
                                </Grid>
                            </InfoSection>
                            <ModalSplitContainer>
                                <div className="left">
                                    <div className="title">Trade Information</div>
                                    <TextField className="input" placeholder="Slot Quantity" label="Slot Quantity"
                                               value={trade.slots_available} type='number'
                                               InputProps={{inputProps: {min: 1}}}
                                               onChange={handleTradeChange('slots_available')}/>
                                    <FlexRow className="input">
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Price per slot"
                                            label="Price per slot"
                                            fullWidth
                                            value={pricePerslot}
                                            disabled
                                        ></TextField>
                                    </FlexRow>
                                    <FlexRow className="input">
                                        <div className="currency-box">%</div>
                                        <TextField
                                            placeholder="Estimated ROT per slot"
                                            label="Estimated ROT per slot"
                                            value={extimatedRot}
                                            fullWidth
                                            disabled
                                            onChange={handleTradeChange('estimated_return_on_trade')}
                                        ></TextField>
                                    </FlexRow>
                                    <TextField
                                        className="input"
                                        placeholder="Trading Duration in Months"
                                        label="Trading Duration in Months"
                                        variant='standard'
                                        value={trade?.estimated_sales_duration}
                                        onChange={handleTradeChange('estimated_sales_duration')}
                                    />
                                    <FlexRow className="input">
                                        <div className="currency-box">&#8358;</div>
                                        <TextField disabled placeholder="Car value" label="Car value"
                                                   fullWidth
                                                   value={Number(selectedCar?.bought_price) + Number(selectedCar?.cost_of_repairs) + Number(selectedCar?.maintenance_cost)}></TextField>
                                    </FlexRow>
                                    <FlexRow className="input">
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Minimum selling price"
                                            label="Minimum selling price"
                                            variant='standard'
                                            value={minSellingPrice}
                                            fullWidth
                                            disabled
                                            onChange={handleTradeChange('min_sale_price')}
                                        ></TextField>
                                    </FlexRow>
                                    <FlexRow className="input">
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Total Maintenance on Car"
                                            label="Total Maintenance on Car"
                                            variant='standard'
                                            value={Number(selectedCar?.maintenance_cost) + +Number(selectedCar?.cost_of_repairs)}
                                            fullWidth
                                            disabled
                                            onChange={handleTradeChange('max_sale_price')}
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
                                                <Typography
                                                    variant="h5">&#8358; {formatNumber((Number(pricePerslot) * Number(trade?.slots_available)) + Number(ROT))}</Typography>
                                            </PriceCard>
                                            <Statistic>
                                                <div className="key">Initial + ROT</div>
                                                <div
                                                    className="value">&#8358; {formatNumber((Number(selectedCar?.bought_price) + Number(selectedCar?.maintenance_cost)) + Number(ROT))}</div>
                                            </Statistic>
                                            <Statistic>
                                                <div className="key">Sold Slot Price</div>
                                                <div className="value">&#8358; 0.00</div>
                                            </Statistic>
                                            <PriceCard style={{marginTop: 40}}>
                                                <Typography variant="body1">
                                                    Estimated Carpadi minimum Profit on Sales
                                                </Typography>
                                                <Typography
                                                    variant="h5">&#8358; {formatNumber(minProfit)}</Typography>
                                            </PriceCard>
                                            {/*<PriceCard*/}
                                            {/*    style={{*/}
                                            {/*        background: t.alertSuccessLite,*/}
                                            {/*        marginTop: 20*/}
                                            {/*    }}*/}
                                            {/*>*/}
                                            {/*    <Typography variant="body1">*/}
                                            {/*        Estimated Carpadi maximum Profit on Sales*/}
                                            {/*    </Typography>*/}
                                            {/*    <Typography variant="h5">&#8358; 0.00</Typography>*/}
                                            {/*</PriceCard>*/}
                                        </Grid>
                                    </div>
                                </div>
                            </ModalSplitContainer>
                            <Button
                                text={isLoading ? "Processing ..." : options[modalView].title}
                                width={590}
                                marginLeft="auto"
                                marginRight="auto"
                                marginTop="40px"
                                onClick={() => saveTrade()}
                            />
                        </>
                    )}
                </ModalBody>
            </Modal></>)
}

export default CreateTrade

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
const TableCard = withStyles({
    elevation1: {boxShadow: 'none'}
})(Paper)