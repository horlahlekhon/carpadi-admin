import MainLayout from '../../../components/layouts/MainLayout'
import styled from 'styled-components'
import {Grid, Paper, Typography, withStyles} from '@material-ui/core'
import {t} from '../../../styles/theme'
import {useState} from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Button from '../../../components/shared/Button'

function TradingActivitiesPage() {
    const router = useRouter()

    enum ActivityStatus {
        ACTIVE,
        SOLD,
        CLOSED
    }

    const [activityTab, setActivityTab] = useState(ActivityStatus.ACTIVE)

    const updateActivityTab = (type: ActivityStatus) => {
        setActivityTab(type)
    }

    const handleNavigation = (action: string) => {
        router.push(`${action}`)
    }

    return (
        <Container>
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
                                    <img src="/icons/Users-Blue.svg" width={29} height={38} alt='Profile Image'/>
                                </ProfileImage>
                                <div className='details'>
                                    <div className='name'>John Smith</div>
                                    <div>TRADING NAME: @james_run4deno</div>
                                </div>
                            </div>
                            <ActivityTab style={{background: t.alertSuccessLite, borderRadius: 24}}>Active</ActivityTab>
                        </CardHeader>
                        <Tabs>
                            <ActivityTab
                                className={`${
                                    activityTab === ActivityStatus.ACTIVE ? 'active' : ''
                                }`}
                                onClick={() => updateActivityTab(ActivityStatus.ACTIVE)}
                            >
                                Active
                            </ActivityTab>
                            <ActivityTab
                                className={`${
                                    activityTab === ActivityStatus.SOLD ? 'active' : ''
                                }`}
                                onClick={() => updateActivityTab(ActivityStatus.SOLD)}
                            >
                                Sold
                            </ActivityTab>
                            <ActivityTab
                                className={`${
                                    activityTab === ActivityStatus.CLOSED ? 'active' : ''
                                }`}
                                onClick={() => updateActivityTab(ActivityStatus.CLOSED)}
                            >
                                Closed
                            </ActivityTab>
                        </Tabs>
                        <ActivitiesBody>
                            {activityTab === ActivityStatus.ACTIVE &&
                                [...Array.from({length: 8})].map((_, i) => (
                                    <ActivityCard>
                                        <img
                                            src="/images/FullSize-Default-Car.png"
                                            alt="car"
                                            className="image"
                                        />
                                        <div className='content'>
                                            <div className='header'>
                                                <Image src="/images/Toyota-Full.png" height={11} width={40}/>
                                                <div className='text'>Toyota Corolla 2022</div>
                                            </div>
                                            <Grid container spacing={3}>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Price Per Slot</div>
                                                        <div className='value'>&#8358; 100,000.00</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Total Bought Slot</div>
                                                        <div className='value'>4</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Total Slot Price</div>
                                                        <div className='value'>&#8358; 400,000.00</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Estimated ROT Per Slot</div>
                                                        <div className='value'>&#8358; 20,000.00</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Trading Vehicle ID</div>
                                                        <div className='value'>CP2222</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Trade Duration</div>
                                                        <div className='value'>In 5 Months</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className='btn-group'>
                                            <Button text={'View Trade'} width={'100%'} onClick={() => handleNavigation('/users/1111/view-trade')}/>
                                            <Button text={'Manage Trade'} width={'100%'} outlined={true}
                                                    onClick={() => handleNavigation('/trade/1111?type=Active')}/>
                                            <Button text={'Car Profile'} width={'100%'} bgColor={t.extraLiteGrey}
                                                    color={t.primaryDeepBlue} onClick={() => handleNavigation('/')}/>
                                        </div>
                                    </ActivityCard>
                                ))}
                            {activityTab === ActivityStatus.SOLD &&
                                [...Array.from({length: 8})].map((_, i) => (
                                    <ActivityCard>
                                        <img
                                            src="/images/FullSize-Default-Car.png"
                                            alt="car"
                                            className="image"
                                        />
                                        <div className='content'>
                                            <div className='header'>
                                                <Image src="/images/Toyota-Full.png" height={11} width={40}/>
                                                <div className='text'>Toyota Corolla 2022</div>
                                            </div>
                                            <Grid container spacing={3}>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Price Per Slot</div>
                                                        <div className='value'>&#8358; 100,000.00</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Total Bought Slot</div>
                                                        <div className='value'>4</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Total Slot Price</div>
                                                        <div className='value'>&#8358; 400,000.00</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Recieved ROT Per Slot</div>
                                                        <div className='value'>&#8358; 20,000.00</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Trading Vehicle ID</div>
                                                        <div className='value'>CP2222</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Trade Sold Date</div>
                                                        <div className='value'>11/04/2022</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className='btn-group'>
                                            <Button text={'View Trade'} width={'100%'} onClick={() => handleNavigation('/users/1111/view-trade')}/>
                                            <Button text={'Manage Trade'} width={'100%'} outlined={true}
                                                    onClick={() => handleNavigation('/trade/1111?type=Active')}/>
                                            <Button text={'Car Profile'} width={'100%'} bgColor={t.extraLiteGrey}
                                                    color={t.primaryDeepBlue} onClick={() => handleNavigation('/')}/>
                                        </div>
                                    </ActivityCard>
                                ))}
                            {activityTab === ActivityStatus.CLOSED &&
                                [...Array.from({length: 10})].map((_, i) => (
                                    <ActivityCard>
                                        <img
                                            src="/images/FullSize-Default-Car.png"
                                            alt="car"
                                            className="image"
                                            style={{filter: 'grayscale(80%)'}}
                                        />
                                        <div className='content'>
                                            <div className='header'>
                                                <Image src="/images/Toyota-Full.png" height={11} width={40}/>
                                                <div className='text'>Toyota Corolla 2022</div>
                                            </div>
                                            <Grid container spacing={3}>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Refund Status</div>
                                                        <div className='value'>Refunded</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Total Bought Slot</div>
                                                        <div className='value'>4</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Total Slot Price</div>
                                                        <div className='value'>&#8358; 400,000.00</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Estimated ROT Per Slot</div>
                                                        <div className='value'>&#8358; 20,000.00</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Trading Vehicle ID</div>
                                                        <div className='value'>CP2222</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <ActivityCardItem>
                                                        <div>Date Closed</div>
                                                        <div className='value'>11/04/2022</div>
                                                    </ActivityCardItem>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div className='btn-group'>
                                            <Button text={'View Trade'} width={'100%'} onClick={() => handleNavigation('/users/1111/view-trade')}/>
                                            <Button text={'Manage Trade'} width={'100%'} outlined={true}
                                                    onClick={() => handleNavigation('/trade/1111?type=Active')}/>
                                            <Button text={'Car Profile'} width={'100%'} bgColor={t.extraLiteGrey}
                                                    color={t.primaryDeepBlue} onClick={() => handleNavigation('/')}/>
                                        </div>
                                    </ActivityCard>
                                ))}
                        </ActivitiesBody>
                    </Activities>
                </Grid>
            </Grid>
        </Container>
    )
}

export default TradingActivitiesPage

TradingActivitiesPage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}
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
    justify-content: space-between;
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