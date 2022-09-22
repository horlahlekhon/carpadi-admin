import MainLayout from '../../../components/layouts/MainLayout'
import styled from 'styled-components'
import {Grid, Paper, Typography, withStyles} from '@material-ui/core'
import {t} from '../../../styles/theme'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Button from '../../../components/shared/Button'
import {tradeService} from "../../../services/trade";
import {toast} from "react-hot-toast";
import {merchantService} from "../../../services/merchant";
import {formatDate, formatNumber, trimString} from "../../../helpers/formatters";
import Loader from "../../../components/layouts/core/Loader";

function TradingActivitiesPage({uid}) {
    const router = useRouter()
    const status = String(router.query.status).toLowerCase() || 'NA'
    const [userId, setUserId] = useState(uid)
    const [tradeId, setTradeId] = useState(String(router.query.tradeId))
    const [trade, setTrade] = useState({
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
        created: '',
        modified: '',
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
    const [user, setUserData] = useState({
        "id": "0",
        "user": {
            "id": "0",
            "username": "NA",
            "first_name": "NA",
            "last_name": "NA",
            "profile_picture": "NA",
            "email": "NA",
            "phone": "NA",
            "is_active": false
        },
        "created": "2022-06-17T09:11:56.000265Z",
        "modified": "2022-06-17T09:11:56.000265Z",
        "bvn": "3568302072"
    })
    const [pageLoading, setPageLoading] = useState(false)

    const handleNavigation = (action: string) => {
        router.push(`${action}`)
    }

    const retrieveTrade = (id) => {
        if (id !== null && id !== undefined) {
            setPageLoading(true)
            tradeService
                .retrieveSingleTrade(id)
                .then((response) => {
                    if (response.status) {
                        setTrade(response.data)
                    } else {
                        toast.error(response.data)
                    }
                })
                .catch((error) => {
                    toast.error(error.data)
                })
                .finally(() => {
                    setPageLoading(false)
                })
        }
    }
    const retrieveUser = (id) => {
        if (id !== null && id !== undefined) {
            merchantService
                .retrieveSingleMerchant(userId)
                .then((response) => {
                    if (response.status) {
                        setUserData(response.data)
                    } else {
                        toast.error(response.data)
                    }
                })
                .catch((error) => {
                    toast.error(error.data)
                })
        }
    }

    useEffect(() => {
        setUserId(uid)
        setTradeId(String(router.query.tradeId))
        retrieveTrade(tradeId)
        retrieveUser(uid)
    }, [tradeId, userId])

    return (
        <MainLayout>
            <Container>
                {!pageLoading && (
                    <>
                        <Header>
                            <Typography variant="h4">
                                <b>Trading Activities</b>
                            </Typography>
                        </Header>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Activities>
                                    <CardHeader>
                                        <div className='profile'>
                                            <ProfileImage>
                                                <img src={user?.user?.profile_picture} width={'100%'}
                                                     height={'100%'} alt={user?.user?.first_name}
                                                     style={{borderRadius: '100%'}}/>
                                            </ProfileImage>
                                            <div className='details'>
                                                <div
                                                    className='name'>{user?.user?.first_name} {user?.user?.last_name}</div>
                                                <div>TRADING NAME: @{user?.user?.username}</div>
                                            </div>
                                        </div>
                                        <BtnGroup>
                                            <Button text='Go to Trade Profile' outlined={true} width={165}
                                                    onClick={() => handleNavigation(`/trade/${trade?.id}?type=Active`)}/>
                                            <Button text='Go to Car Profile' outlined={true} width={160} marginLeft={18}
                                                    onClick={() => handleNavigation(`/inventory/car-profile/${trade?.car?.id}?status=car listings`)}/>
                                        </BtnGroup>
                                    </CardHeader>
                                    <SplitContainer>
                                        <div className="left">
                                            <div className="vehicle-details">
                                                <div className='row'>
                                                    <div className='item'>
                                                        <Typography variant="body1" className="title">
                                                            Trading ID
                                                        </Typography>
                                                        <Typography variant="h5" className="id">
                                                            {trimString(trade?.id)}
                                                        </Typography>
                                                    </div>
                                                    <div className='item'>
                                                        <Typography variant="body1" className="title">
                                                            User ID
                                                        </Typography>
                                                        <Typography variant="h5" className="id">
                                                            {trimString(user?.id)}
                                                        </Typography>
                                                    </div>
                                                </div>
                                                <Typography variant="body1" className="title"
                                                            style={{marginTop: 24, marginBottom: 0}}>
                                                    Trading with
                                                </Typography>
                                                <img
                                                    src="/images/Toyota-Full.png"
                                                    width={80}
                                                    height={22}
                                                    style={{marginBottom: -15}}
                                                />
                                                <Typography variant="h4" color='secondary'
                                                            style={{marginTop: 30}}>{trimString(trade?.car?.id)}</Typography>
                                                <Typography
                                                    variant="h6">{trade?.car?.make} {trade?.car?.model}</Typography>

                                                <img
                                                    src={trade?.car?.image}
                                                    height={300}
                                                    width={450}
                                                    style={{borderRadius: '8px'}}
                                                    alt={trade?.car?.make}
                                                />
                                            </div>
                                        </div>
                                        <div className="right">
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <PriceCard
                                                        style={{background: status !== 'active' ? t.extraLiteGrey : ''}}>
                                                        <Typography
                                                            variant="body1">{status === 'active' ? 'Total Expected' : 'Received'} ROT</Typography>
                                                        <Typography
                                                            variant="h5">&#8358; {formatNumber(trade?.estimated_return_on_trade)}</Typography>
                                                    </PriceCard>
                                                </Grid>
                                                <div className='title'>
                                                    Trade Purchase Details
                                                </div>
                                                <Grid item xs={12}>
                                                    <Statistic>
                                                        <div className="key">Bought Slots</div>
                                                        <div
                                                            className="value">{formatNumber((trade?.slots_available || 0) - (trade?.remaining_slots || 0))}</div>
                                                    </Statistic>
                                                    <Statistic>
                                                        <div className="key">Total
                                                            Slot {status !== 'active' ? 'Purchased' : ''} Price
                                                        </div>
                                                        <div
                                                            className="value">&#8358; {formatNumber(trade?.sold_slots_price)}</div>
                                                    </Statistic>
                                                    <Statistic>
                                                        <div
                                                            className="key">{status === 'active' ? 'Expected' : 'Received'} ROT
                                                        </div>
                                                        <div
                                                            className="value">&#8358; {formatNumber(trade?.estimated_return_on_trade)}</div>
                                                    </Statistic>
                                                    <Statistic>
                                                        <div className="key">Trading Duration in Months</div>
                                                        <div
                                                            className="value">{Math.ceil((trade?.estimated_sales_duration || 0) / 30)} Months
                                                        </div>
                                                    </Statistic>
                                                    <Statistic>
                                                        <div
                                                            className="key">Purchase Date
                                                        </div>
                                                        <div className="value">{formatDate(trade?.modified)}</div>
                                                    </Statistic>
                                                    {status !== 'active' && (
                                                        <>
                                                            <Statistic>
                                                                <div
                                                                    className="key">{status === 'sold' ? 'Sold' : 'Closed'} Date
                                                                </div>
                                                                <div className="value">11/03/2022</div>
                                                            </Statistic>
                                                        </>
                                                    )}
                                                    <Statistic>
                                                        <div className="key">Recent Payment Ref</div>
                                                        <div className="value">REF NA</div>
                                                    </Statistic>
                                                    <Statistic>
                                                        <div className="key">Trade Status</div>
                                                        <div className="value">
                                                            <ActivityTab
                                                                style={{
                                                                    background:
                                                                        trade?.trade_status === 'purchased'
                                                                            ? t.alertSuccessLite
                                                                            : (status === 'sold' ? t.primaryExtraLite : t.extraLiteGrey)
                                                                }}
                                                            >
                                                                {trade?.trade_status}
                                                            </ActivityTab>
                                                        </div>
                                                    </Statistic>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </SplitContainer>
                                </Activities>
                            </Grid>
                        </Grid>
                    </>
                )}
                {pageLoading && (
                    <Loader/>
                )}
            </Container>
        </MainLayout>
    )
}

export async function getServerSideProps({params}) {
    return {
        props: {
            uid: params.id
        }
    }
}

export default TradingActivitiesPage


const Activities = withStyles({
    elevation1: {boxShadow: 'none'},
    root: {
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        scrollbarWidth: 'none'
    }
})(Paper)
const PriceCard = withStyles({
    elevation1: {boxShadow: 'none'},
    root: {
        height: '100px',
        width: '100%',
        padding: '13px 19px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: `${t.alertSuccessLite}`
    }
})(Paper)

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
const CardHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
  padding: 20px;

  .profile {
    display: flex;
    flex-direction: row;
    align-items: center;

    .details {
      display: inherit;
      flex-direction: column;

      .name {
        margin-bottom: 2px;
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
`
const BtnGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 18px;
`
const ProfileImage = styled.div`
  width: 71px;
  height: 71px;
  background: ${t.primaryExtraLite};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  object-fit: cover;
  margin-right: 21px;
  border-radius: 50%;
`
const SplitContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;

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

    .row {
      display: flex;
      flex-direction: row;
      align-items: center;

      .item {
        &:not(:last-child) {
          margin-right: 50px;
        }
      }
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
      margin-top: 10px;
      margin-left: 14px;
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
    font-size: 14px;
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