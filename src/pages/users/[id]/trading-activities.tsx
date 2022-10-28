import MainLayout from '../../../components/layouts/MainLayout'
import styled from 'styled-components'
import {Grid, Paper, Typography, withStyles} from '@material-ui/core'
import {t} from '../../../styles/theme'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Button from '../../../components/shared/Button'
import {toast} from "react-hot-toast";
import CPToast from "../../../components/shared/CPToast";
import {merchantService} from "../../../services/merchant";
import {tradeService} from "../../../services/trade";
import {formatDate, formatNumber, trimString} from "../../../helpers/formatters";
import Loader from "../../../components/layouts/core/Loader";

function TradingActivitiesPage({pageId}) {
    enum ActivityStatus {
        ACTIVE = 'purchased',
        SOLD = 'completed',
        CLOSED = 'closed'
    }

    const [pageLoading, setPageLoading] = useState(false)
    const router = useRouter()
    const [userId, setUserId] = useState(pageId)
    const [activities, setActivities] = useState([])
    const [activityTab, setActivityTab] = useState(ActivityStatus.ACTIVE)
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

    const handleNavigation = (action: string) => {
        router.push(`${action}`)
    }

    useEffect(() => {
            setUserId(pageId)
            if (userId) {
                retrieveUser(userId)
                retrieveActivities(userId)
            }
        },
        [userId])


    const retrieveUser = (userId) => {
        if (userId !== 'NA' && userId !== undefined) {
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

    const retrieveActivities = (id, tradeStatus = activityTab) => {
        setActivities([])
        if (id !== null && id !== undefined) {
            setPageLoading(true)
            tradeService.retrieveUserTrades(id, tradeStatus).then((response) => {
                if (response.status) {
                    setActivities(response.data.results)
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
        } else {
            toast.error('No wallet to retrieve transactions from!')
        }
    }

    const updateTrades = (status = ActivityStatus.ACTIVE) => {
        setActivityTab(status)
        // @ts-ignore
        retrieveActivities(userId, status.valueOf())
    }

    return (
        <MainLayout>
            <Container>
                <CPToast/>
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
                                                <img loading="lazy" src={user?.user?.profile_picture} width={'100%'}
                                                     height={'100%'} alt={user?.user?.first_name}
                                                     style={{borderRadius: '100%'}}/>
                                            </ProfileImage>
                                            <div className='details'>
                                                <div
                                                    className='name'>{user?.user?.first_name} {user?.user?.last_name}</div>
                                                <div>TRADING NAME: @{user?.user?.username}</div>
                                            </div>
                                        </div>
                                        <ActivityTab style={{
                                            background: user?.user?.is_active ? t.alertSuccessLite : t.extraLiteGrey,
                                            borderRadius: 24
                                        }}>{user?.user?.is_active ? 'Active' : 'Inactive'}</ActivityTab>
                                    </CardHeader>
                                    <Tabs>
                                        <ActivityTab
                                            className={`${
                                                activityTab === ActivityStatus.ACTIVE ? 'active' : ''
                                            }`}
                                            onClick={() => updateTrades(ActivityStatus.ACTIVE)}
                                        >
                                            Active
                                        </ActivityTab>
                                        <ActivityTab
                                            className={`${
                                                activityTab === ActivityStatus.SOLD ? 'active' : ''
                                            }`}
                                            onClick={() => updateTrades(ActivityStatus.SOLD)}
                                        >
                                            Sold
                                        </ActivityTab>
                                        <ActivityTab
                                            className={`${
                                                activityTab === ActivityStatus.CLOSED ? 'active' : ''
                                            }`}
                                            onClick={() => updateTrades(ActivityStatus.CLOSED)}
                                        >
                                            Closed
                                        </ActivityTab>
                                    </Tabs>
                                    <ActivitiesBody>
                                        {activityTab === ActivityStatus.ACTIVE &&
                                            activities.map((trade, i) => (
                                                <ActivityCard key={i}>
                                                    <img loading="lazy"
                                                        src={trade?.trade_car?.images}
                                                        alt={trade?.trade_car?.manufacturer}
                                                        className="image"
                                                    />
                                                    <div className='content'>
                                                        <div className='header'>
                                                            <Image src="/images/Toyota-Full.png" height={11}
                                                                   width={40}/>
                                                            <div
                                                                className='text'>{trade?.trade_car?.manufacturer} {trade?.trade_car?.model} {trade?.trade_car?.year}</div>
                                                        </div>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Price Per Slot</div>
                                                                    <div
                                                                        className='value'>&#8358; {formatNumber(trade?.price_per_slot)}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Total Bought Slot</div>
                                                                    <div
                                                                        className='value'>{trade?.slots_quantity}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Total Slot Price</div>
                                                                    <div
                                                                        className='value'>&#8358; {formatNumber(Number(trade?.unit_value || 0) * Number(trade?.slots_quantity))}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Estimated ROT Per Slot</div>
                                                                    <div
                                                                        className='value'>&#8358; {formatNumber(trade?.estimated_rot)}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Trading Car ID</div>
                                                                    <div
                                                                        className='value'>{trimString(trade?.trade_car?.id)}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Trading Share Percentage</div>
                                                                    <div
                                                                        className='value'>{formatNumber(trade?.share_percentage)}%
                                                                    </div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                    <div className='btn-group'>
                                                        <Button text={'View Trade'} width={'100%'} marginBottom='20px'
                                                                onClick={() => handleNavigation(`/users/${userId}/view-trade?status=active&tradeId=${trade?.trade}`)}/>
                                                        {/*<Button text={'Manage Unit'} width={'100%'} outlined={true}*/}
                                                        {/*        onClick={() => handleNavigation(`/trade/${trade?.id}/manage-trade?status=${trade?.trade_status}`)}/>*/}
                                                        <Button text={'Car Profile'} width={'100%'}
                                                                bgColor={t.extraLiteGrey}
                                                                color={t.primaryDeepBlue}
                                                                onClick={() => handleNavigation(`/inventory/car-profile/${trade?.trade_car?.id}?status=car listings`)}/>
                                                    </div>
                                                </ActivityCard>
                                            ))}
                                        {activityTab === ActivityStatus.SOLD &&
                                            activities.map((trade, i) => (
                                                <ActivityCard key={i}>
                                                    <img loading="lazy"
                                                        src={trade?.trade_car?.images}
                                                        alt={trade?.trade_car?.manufacturer}
                                                        className="image"
                                                    />
                                                    <div className='content'>
                                                        <div className='header'>
                                                            <Image src="/images/Toyota-Full.png" height={11}
                                                                   width={40}/>
                                                            <div
                                                                className='text'>{trade?.trade_car?.manufacturer} {trade?.trade_car?.model} {trade?.trade_car?.year}</div>
                                                        </div>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Price Per Slot</div>
                                                                    <div
                                                                        className='value'>&#8358; {formatNumber(trade?.price_per_slot)}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Total Bought Slot</div>
                                                                    <div
                                                                        className='value'>{trade?.slots_quantity}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Total Slot Price</div>
                                                                    <div
                                                                        className='value'>&#8358; {formatNumber(Number(trade?.unit_value || 0) * Number(trade?.slots_quantity))}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Estimated ROT Per Slot</div>
                                                                    <div
                                                                        className='value'>&#8358; {formatNumber(trade?.estimated_rot)}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Trading Car ID</div>
                                                                    <div
                                                                        className='value'>{trimString(trade?.trade_car?.id)}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Trade Sold Date</div>
                                                                    <div
                                                                        className='value'>{formatDate(trade?.trade_sold_date) || 'NA'}
                                                                    </div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                    <div className='btn-group'>
                                                        <Button text={'View Trade'} width={'100%'} marginBottom='20px'
                                                                onClick={() => handleNavigation(`/users/${userId}/view-trade?status=active&tradeId=${trade?.trade}`)}/>
                                                        {/*<Button text={'Manage Unit'} width={'100%'} outlined={true}*/}
                                                        {/*        onClick={() => handleNavigation(`/trade/${trade.trade}/manage-trade?status=${trade.trade_status}`)}/>*/}
                                                        <Button text={'Car Profile'} width={'100%'}
                                                                bgColor={t.extraLiteGrey}
                                                                color={t.primaryDeepBlue}
                                                                onClick={() => handleNavigation(`/inventory/car-profile/${trade?.trade_car?.id}?status=car listings`)}/>
                                                    </div>
                                                </ActivityCard>
                                            ))}
                                        {activityTab === ActivityStatus.CLOSED &&
                                            activities.map((trade, i) => (
                                                <ActivityCard key={i}>
                                                    <img loading="lazy"
                                                        src={trade?.trade_car?.images}
                                                        alt={trade?.trade_car?.manufacturer}
                                                        className="image"
                                                    />
                                                    <div className='content'>
                                                        <div className='header'>
                                                            <img loading="lazy" src="/images/Toyota-Full.png" height={11} width={40}
                                                                 alt={trade?.trade_car?.manufacturer}/>
                                                            <div
                                                                className='text'>{trade?.trade_car?.manufacturer} {trade?.trade_car?.model} {trade?.trade_car?.year}</div>
                                                        </div>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Refund Status</div>
                                                                    <div
                                                                        className='value'>&#8358; {trade?.payment_transaction_ref ? 'Refunded' : 'Pending'}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Total Bought Slot</div>
                                                                    <div
                                                                        className='value'>{trade?.slots_quantity || 'NA'}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Total Slot Price</div>
                                                                    <div
                                                                        className='value'>&#8358; {formatNumber(Number(trade?.unit_value || 0) * Number(trade?.slots_quantity))}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Estimated ROT Per Slot</div>
                                                                    <div
                                                                        className='value'>&#8358; {formatNumber(trade?.estimated_rot)}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Trading Car ID</div>
                                                                    <div
                                                                        className='value'>{trimString(trade?.trade_car?.id)}</div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <ActivityCardItem>
                                                                    <div>Trade Closed Date</div>
                                                                    <div
                                                                        className='value'>NA
                                                                    </div>
                                                                </ActivityCardItem>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                    <div className='btn-group'>
                                                        <Button text={'View Trade'} width={'100%'} marginBottom='20px'
                                                                onClick={() => handleNavigation(`/users/${userId}/view-trade?status=active&tradeId=${trade?.trade}`)}/>
                                                        {/*<Button text={'Manage Unit'} width={'100%'} outlined={true}*/}
                                                        {/*        onClick={() => handleNavigation(`/trade/${trade.trade}/manage-trade?status=${trade.trade_status}`)}/>*/}
                                                        <Button text={'Car Profile'} width={'100%'}
                                                                bgColor={t.extraLiteGrey}
                                                                color={t.primaryDeepBlue}
                                                                onClick={() => handleNavigation(`/inventory/car-profile/${trade?.trade_car?.id}?status=car listings`)}/>
                                                    </div>
                                                </ActivityCard>
                                            ))}
                                    </ActivitiesBody>
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
            pageId: params.id
        }
    }
}

export default TradingActivitiesPage

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
const Activities = withStyles({
    elevation1: {boxShadow: 'none'},
    root: {
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column'
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

const ActivityTab = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 41px;
  min-width: 108px;
  padding: 9px 23px;
  background: transparent;
  cursor: pointer;
  border-radius: 14px;
  font-weight: 600;
  font-size: 15px;
  line-height: 24px;
  color: ${t.grey};
  margin-right: 18px;

  &.active {
    background: ${t.primaryExtraLite};
    color: ${t.primaryDeepBlue};

    &:hover {
      background: ${t.primaryExtraLite};
    }
  }

  &:hover {
    background: ${t.extraLiteGrey};
  }
`

const ActivitiesBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 24px 24px 24px;
  overflow-y: auto;
`

const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
`

const ActivityCard = styled.div`
  height: 201px;
  border: 2px solid ${t.extraLiteGrey};
  border-radius: 12px;
  padding: 8px;
  margin-bottom: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .image {
    width: 338px;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 24px;
  }

  .content {
    margin: 0 auto;
    height: 100%;
    width: 100%;
    padding: 12px 0;

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 18px;
      font-weight: bold;

      .text {
        margin-left: 10px;
      }
    }
  }

  .btn-group {
    width: 150px;
    display: flex;
    flex-direction: column;
    //justify-content: space-between;
    margin-left: 40px;
    flex-shrink: 0;
  }
`

const ActivityCardItem = styled.div`
  display: flex;
  flex-direction: column;

  .value {
    font-weight: bold;
    color: ${t.primaryDeepBlue};
    margin-top: 4px;
  }
`