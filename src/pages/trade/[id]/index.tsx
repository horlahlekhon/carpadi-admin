import MainLayout from '../../../components/layouts/MainLayout'
import styled from 'styled-components'
import {Grid, Typography, Paper, Modal, TextField} from '@material-ui/core'
import {t} from '../../../styles/theme'
import {useRouter} from 'next/router'
import Button from '../../../components/shared/Button'
import Image from 'next/image'
import {withStyles} from '@material-ui/styles'
import {useEffect, useState} from 'react'
import {toast, Toaster} from 'react-hot-toast'
import {tradeService} from '../../../services/trade'
import trade from "../index";

function TradeProfilePage() {
    const router = useRouter()
    const tradeId = String(router.query.id) || 'NA'
    const tradeType = router.query.type || 'NA'
    const [modalOpen, setModalState] = useState(false)
    const [modalView, setModalView] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [editDetails, setEditDetails] = useState(false)
    const [tradeData, setTradeData] = useState({
        id: tradeId,
        remaining_slots: 0,
        return_on_trade: 0,
        return_on_trade_percentage: 0,
        car: {
            id: '0',
            bought_price: 0,
            image: '/images/Big-Default-Car.png',
            make: null,
            model: null
        },
        return_on_trade_per_unit: 0,
        total_users_trading: 0,
        created: Date.now().toString(),
        modified: Date.now().toString(),
        slots_available: 0,
        estimated_return_on_trade: '0',
        price_per_slot: '0',
        trade_status: 'NA',
        min_sale_price: '0',
        max_sale_price: '0',
        estimated_sales_duration: 0,
        bts_time: null,
        date_of_sale: null,
        sold_slots_price: 0
    })

    useEffect(() => {
        retrieveTrade()
    }, [])

    const handleTradeChange = (prop) => (event) => {
        setTradeData({...tradeData, [prop]: event.target.value})
    }

    const showModal = (viewName: string, title: string) => {
        setModalView(viewName)
        setModalTitle(title)
        setModalState(true)
    }

    const handleNavigation = (action: string) => {
        router.push(`${action}`)
    }

    const deleteTrade = () => {
        setModalState(false)
        tradeService
            .deleteSingleTrade(tradeId)
            .then((response) => {
                if (response.status) {
                    toast.success('Trade Deleted')
                    router.push('/trade')
                } else {
                    toast.error(response.data)
                }
            })
            .catch((error) => {
                toast.error(error.data)
            })
    }
    const saveTrade = () => {
        setModalState(false)
        tradeService
            .updateSingleTrade(tradeId, {...tradeData, car: tradeData.car.id})
            .then((response) => {
                if (response.status) {
                    toast.success('Trade Updated')
                    retrieveTrade()
                } else {
                    toast.error(response.data)
                }
            })
            .catch((error) => {
                toast.error(error.data)
            })
    }

    const retrieveTrade = () => {
        tradeService
            .retrieveSingleTrade(tradeId)
            .then((response) => {
                if (response.status) {
                    setTradeData(response.data)
                } else {
                    toast.error(response.data)
                }
            })
            .catch((error) => {
                toast.error(error.data)
            })
    }
    const formatNumber = (number) => Number(number).toLocaleString()
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
                    <b>Trade</b>
                </Typography>
            </Header>
            <Breadcrumbs>
                <img
                    src="/icons/Trade-Black.svg"
                    width={'20px'}
                    height={'18px'}
                    style={{marginRight: '12px'}}
                />
                <div
                    onClick={() => {
                        handleNavigation('/trade')
                    }}
                >
                    <span className="text">Trade</span>
                    <span className="separator"></span>
                </div>
                <div onClick={() => {
                    handleNavigation('/trade')
                }}>
                    <span className="text">{tradeType}</span>
                    <span className="separator"></span>
                </div>
                <div
                    onClick={() => {
                        handleNavigation(`sales/${tradeId}`)
                    }}
                >
                    <span className="text">{tradeId}</span>
                    <span className="separator"></span>
                </div>
            </Breadcrumbs>
            <Body>
                <ActionBar>
                    <div className="trading-info">
                        <Typography
                            variant="body1"
                            className="trading-id-title"
                            component="div"
                        >
                            Trading ID
                        </Typography>
                        <Typography variant="h5" className="trading-id">
                            {tradeId.substring(tradeId.length - 7)}
                        </Typography>
                    </div>
                    <div className="button-group">
                        <Button
                            text="Delete Trade"
                            width={150}
                            outlined={true}
                            marginRight="16px"
                            bgColor={t.alertError}
                            disabled={
                                String(tradeType).toLowerCase() === 'active' ||
                                String(tradeType).toLowerCase() === 'sold'
                            }
                            onClick={() => {
                                showModal('deleteTrade', '')
                            }}
                        />
                        <Button
                            text="Manage Trade"
                            width={150}
                            outlined={true}
                            marginRight="16px"
                            onClick={() => {
                                handleNavigation(
                                    `/trade/${tradeId}/manage-trade?status=${tradeType}`
                                )
                            }}
                        />
                        <Button
                            text="Edit Trade"
                            width={150}
                            outlined={true}
                            marginRight="16px"
                            disabled={String(tradeType).toLowerCase() === 'sold'}
                            onClick={() => showModal('editTrade', 'Edit Trade')}
                        />
                        <Button
                            text="Go to Car Profile"
                            width={150}
                            outlined={true}
                            onClick={() =>
                                handleNavigation(
                                    `/inventory/car-profile/${tradeData.car.id}?status=car listings`
                                )
                            }
                        />
                    </div>
                </ActionBar>
                <SplitContainer>
                    <div className="left">
                        <div className="vehicle-details">
                            <Typography
                                variant="h6"
                                className="title"
                                style={{marginBottom: 20}}
                            >
                                Created Trade for
                            </Typography>
                            <VehicleDetails style={{marginBottom: 70}}>
                                <img
                                    src={tradeData.car.image}
                                    height={135}
                                    width={185}
                                    style={{borderRadius: '8px'}}
                                    alt={String(tradeData.id)}
                                />
                                <div className="stats">
                                    <img
                                        src="/images/Toyota-Full.png"
                                        width={80}
                                        height={22}
                                        style={{marginBottom: -15}}
                                    />
                                    <Typography
                                        variant="h5"
                                        noWrap
                                        className="trade"
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            width: '250px'
                                        }}
                                    >
                                        Trade ID {tradeId.substring(tradeId.length - 7)}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        noWrap
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            width: '250px'
                                        }}
                                        title={`${tradeData.car.make}-${tradeData.car.model}`}
                                    >
                                        {tradeData.car.make}-{tradeData.car.model}
                                    </Typography>
                                </div>
                            </VehicleDetails>
                        </div>

                        <div className="trade-info">
                            <Typography variant="h6" className="title">
                                Trade Information
                            </Typography>
                            <Statistic>
                                <div className="key">Total Trading Slots</div>
                                <div className="value">{tradeData.slots_available}</div>
                            </Statistic>
                            <Statistic>
                                <div className="key">Price Per Slot</div>
                                <div className="value">
                                    &#8358; {formatNumber(tradeData.price_per_slot)}
                                </div>
                            </Statistic>
                            <Statistic>
                                <div className="key">ROT Per Slot</div>
                                <div className="value">
                                    &#8358; {formatNumber(tradeData.estimated_return_on_trade)}
                                </div>
                            </Statistic>
                            <Statistic>
                                <div className="key">Trading Duration in Months</div>
                                <div className="value">
                                    {Math.ceil(tradeData.estimated_sales_duration / 30)} Months
                                </div>
                            </Statistic>
                            <Typography
                                variant="h6"
                                className="title"
                                style={{marginTop: 40}}
                            >
                                Carpadi Commission
                            </Typography>
                            <Statistic>
                                <div className="key">Bought Price</div>
                                <div className="value">
                                    &#8358; {formatNumber(tradeData.car.bought_price)}
                                </div>
                            </Statistic>
                            <Statistic>
                                <div className="key">Minimum Selling Price</div>
                                <div className="value">
                                    &#8358; {formatNumber(tradeData.min_sale_price)}
                                </div>
                            </Statistic>
                            <Statistic>
                                <div className="key">Maximum Selling Price</div>
                                <div className="value">
                                    &#8358; {formatNumber(tradeData.max_sale_price)}
                                </div>
                            </Statistic>
                            <Statistic>
                                <div className="key">Trading Duration in Months</div>
                                <div className="value">
                                    {Math.ceil(tradeData.estimated_sales_duration / 30)} Months
                                </div>
                            </Statistic>
                        </div>
                    </div>
                    <div className="right">
                        <Typography variant="h6" className="title">
                            Trade Analytics
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <PriceCard>
                                    <Typography variant="body1">Sold Slot</Typography>
                                    <Typography variant="h5">
                                        {tradeData.slots_available - tradeData.remaining_slots}
                                    </Typography>
                                </PriceCard>
                            </Grid>
                            <Grid item xs={6}>
                                <PriceCard>
                                    <Typography variant="body1">Remaining Slot</Typography>
                                    <Typography variant="h5">
                                        {tradeData.remaining_slots}
                                    </Typography>
                                </PriceCard>
                            </Grid>
                            <Grid item xs={6}>
                                <PriceCard>
                                    <Typography variant="body1">Total Users Trading</Typography>
                                    <Typography variant="h5">
                                        {tradeData.total_users_trading}
                                    </Typography>
                                </PriceCard>
                            </Grid>
                            <Grid item xs={6}>
                                <PriceCard>
                                    <Typography variant="body1">
                                        Total Users with Closed Trade
                                    </Typography>
                                    <Typography variant="h5">NA</Typography>
                                </PriceCard>
                            </Grid>
                            <Grid item xs={12}>
                                <PriceCard style={{background: t.alertSuccessLite}}>
                                    <Typography variant="body1">Sold Slot Price + ROT</Typography>
                                    <Typography variant="h5">
                                        &#8358;{' '}
                                        {formatNumber(
                                            Number(tradeData.sold_slots_price) +
                                            Number(tradeData.return_on_trade)
                                        )}
                                    </Typography>
                                </PriceCard>
                            </Grid>
                            <Grid item xs={12}>
                                <Statistic>
                                    <div className="key">Initial + ROT</div>
                                    <div className="value">
                                        &#8358;{' '}
                                        {formatNumber(
                                            tradeData.car.bought_price + tradeData.return_on_trade
                                        )}
                                    </div>
                                </Statistic>
                                <Statistic>
                                    <div className="key">Sold Slot Price</div>
                                    <div className="value">
                                        &#8358; {formatNumber(tradeData.sold_slots_price)}
                                    </div>
                                </Statistic>
                            </Grid>
                            {String(tradeType).toLowerCase() !== 'sold' && (
                                <>
                                    <Grid item xs={12}>
                                        <PriceCard>
                                            <Typography variant="body1">
                                                Estimated Carpadi minimum Profit on sales
                                            </Typography>
                                            <Typography variant="h5">&#8358; NA</Typography>
                                        </PriceCard>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PriceCard style={{background: t.alertSuccessLite}}>
                                            <Typography variant="body1">
                                                Estimated Carpadi maximum Profit on sales
                                            </Typography>
                                            <Typography variant="h5">&#8358; NA</Typography>
                                        </PriceCard>
                                    </Grid>
                                </>
                            )}
                            {String(tradeType).toLowerCase() === 'sold' && (
                                <>
                                    {editDetails && (
                                        <>
                                            <Typography
                                                variant="h6"
                                                className="title"
                                                style={{
                                                    marginTop: 20,
                                                    marginLeft: 5,
                                                    marginBottom: 24
                                                }}
                                            >
                                                Enter Actual Sold Price
                                            </Typography>
                                            <FlexRow>
                                                <div className="currency-box">&#8358;</div>
                                                <TextField
                                                    placeholder="Enter price"
                                                    label="Enter price"
                                                    fullWidth
                                                    type="number"
                                                    value={tradeData.sold_slots_price}
                                                    onChange={handleTradeChange('sold_slots_price')}
                                                ></TextField>
                                            </FlexRow>
                                            <Button
                                                text="Calculate and Save"
                                                width="90%"
                                                marginLeft="auto"
                                                marginRight="auto"
                                                marginTop={40}
                                                onClick={() => saveTrade()}
                                            />
                                        </>
                                    )}
                                    {!editDetails && (
                                        <>
                                            <Grid item xs={12}>
                                                <PriceCard style={{background: t.alertSuccessLite}}>
                                                    <Typography variant="body1">
                                                        Carpadi Commision On Trade
                                                    </Typography>
                                                    <Typography variant="h5">&#8358; NA</Typography>
                                                </PriceCard>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <PriceCard
                                                    style={{background: t.alertValidationLite}}
                                                >
                                                    <Typography variant="body1">
                                                        Actual Sold Price
                                                    </Typography>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <Typography variant="h5">
                                                            &#8358; {formatNumber(tradeData.sold_slots_price)}
                                                        </Typography>
                                                        <Button
                                                            text="Edit Sold Price"
                                                            width={175}
                                                            onClick={() => setEditDetails(true)}
                                                        />
                                                    </div>
                                                </PriceCard>
                                            </Grid>
                                        </>
                                    )}
                                </>
                            )}
                        </Grid>
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
                            ? ' Kindly provide the following information below.'
                            : ''}{' '}
                        &nbsp;
                    </Typography>
                    {modalView === 'deleteTrade' && (
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
                                    Delete Trade
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    style={{maxWidth: 206, marginBottom: 39}}
                                >
                                    You are about to delete this trade. Car profile would be left
                                    with no trade.
                                </Typography>
                                <Button
                                    text="Yes, Delete"
                                    width={174}
                                    onClick={() => deleteTrade()}
                                />
                            </Info>
                        </>
                    )}
                    {modalView === 'editTrade' && (
                        <>
                            <HeaderText variant="inherit" style={{marginTop: '40px'}}>
                                Creating Trade for
                            </HeaderText>
                            <InfoSection container spacing={3}>
                                <Grid item xs={12} style={{display: 'flex'}}>
                                    <VehicleDetails style={{width: 700}}>
                                        <img
                                            src={tradeData.car.image}
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
                                            <Typography
                                                variant="h5"
                                                noWrap
                                                className="trade"
                                                style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    width: '250px'
                                                }}
                                            >
                                                Trade ID {tradeId}
                                            </Typography>
                                            <Typography variant="h6">{tradeData.car.make}-{tradeData.car.model}</Typography>
                                        </div>
                                    </VehicleDetails>
                                    <Button
                                        text="Go to Car Profile"
                                        width={150}
                                        outlined={true}
                                        onClick={() =>
                                            handleNavigation(
                                                `/inventory/car-profile/${tradeData.car.id}?status=car listings`
                                            )
                                        }
                                    />
                                </Grid>
                            </InfoSection>
                            <ModalSplitContainer>
                                <div className="left">
                                    <div className="title">Trade Information</div>
                                    <TextField
                                        className="input"
                                        placeholder="Slot Quantity"
                                        label="Slot Quantity"
                                        value={tradeData.slots_available}
                                        onChange={handleTradeChange('slots_available')}
                                    />
                                    <FlexRow className="input">
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Price per slot"
                                            label="Price per slot"
                                            fullWidth
                                            disabled
                                            value={tradeData.price_per_slot}
                                            onChange={handleTradeChange('price_per_slot')}
                                        ></TextField>
                                    </FlexRow>
                                    <FlexRow className="input">
                                        <div className="currency-box">%</div>
                                        <TextField
                                            placeholder="Estimated ROT per slot"
                                            label="Estimated ROT per slot"
                                            fullWidth
                                            disabled
                                            value={tradeData.return_on_trade_per_unit}
                                            onChange={handleTradeChange('return_on_trade_per_unit')}
                                        ></TextField>
                                    </FlexRow>
                                    <TextField
                                        className="input"
                                        placeholder="Trading Duration in Days"
                                        label="Trading Duration in Days"
                                        value={tradeData.estimated_sales_duration}
                                        onChange={handleTradeChange('estimated_sales_duration')}
                                    />
                                    <div
                                        className="title"
                                        style={{marginBottom: 20, marginTop: 40}}
                                    >
                                        Carpadi Commission
                                    </div>
                                    <FlexRow className="input">
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Bought price"
                                            label="Bought price"
                                            fullWidth disabled
                                            value={tradeData.car.bought_price}></TextField>
                                    </FlexRow>
                                    <FlexRow className="input">
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Minimum selling price"
                                            label="Minimum selling price"
                                            fullWidth
                                            value={tradeData.min_sale_price}
                                            onChange={handleTradeChange('min_sale_price')}
                                        ></TextField>
                                    </FlexRow>
                                    <FlexRow className="input">
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Maximum selling price"
                                            label="Maximum selling price"
                                            fullWidth
                                            value={tradeData.max_sale_price}
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
                                                <Typography variant="h5">
                                                    &#8358;{' '}
                                                    {formatNumber(
                                                        Number(tradeData.price_per_slot) *
                                                        Number(tradeData.slots_available) +
                                                        Number(tradeData.return_on_trade)
                                                    )}
                                                </Typography>
                                            </PriceCard>
                                            <Statistic>
                                                <div className="key">Initial + ROT</div>
                                                <div
                                                    className="value">&#8358; {formatNumber(tradeData.car.bought_price + tradeData.return_on_trade)}</div>
                                            </Statistic>
                                            <Statistic>
                                                <div className="key">Sold Slot Price</div>
                                                <div
                                                    className="value">&#8358; {formatNumber(tradeData.sold_slots_price + tradeData.return_on_trade)}</div>
                                            </Statistic>
                                            <PriceCard style={{marginTop: 40}}>
                                                <Typography variant="body1">
                                                    Estimated Carpadi minimum Profit on Sales
                                                </Typography>
                                                <Typography variant="h5">&#8358; NA</Typography>
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
                                                <Typography variant="h5">&#8358; NA</Typography>
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
                </ModalBody>
            </Modal>
        </Container>
    )
}

export default TradeProfilePage

TradeProfilePage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

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

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
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

  .trading-info {
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-right: auto;

    .trading-id {
      font-weight: bold;

      &-title {
        color: ${t.grey};
        margin-bottom: 5px;
      }
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

    .trade-info {
      border: 2px solid ${t.extraLiteGrey};
      border-radius: 12px;
      padding: 20px;
    }
  }

  .right {
    width: 55%;
    border: 2px solid ${t.extraLiteGrey};
    border-radius: 12px;
    padding: 20px;

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
