import MainLayout from '../../../components/layouts/MainLayout'
import styled from 'styled-components'
import {Grid, Paper, Typography, withStyles} from '@material-ui/core'
import {t} from '../../../styles/theme'
import {useState} from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Button from '../../../components/shared/Button'
import {stat} from "fs";

function TradingActivitiesPage() {
    const router = useRouter()
    const userId = router.query.id || 'NA'
    const status = String(router.query.status).toLowerCase() || 'NA'

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
                            <BtnGroup>
                                <Button text='Go to Trade Profile' outlined={true} width={160}
                                        onClick={() => handleNavigation('/trade/1111?type=Active')}/>
                                <Button text='Go to Car Profile' outlined={true} width={160} marginLeft={18}
                                        onClick={() => handleNavigation('/')}/>
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
                                                020290
                                            </Typography>
                                        </div>
                                        <div className='item'>
                                            <Typography variant="body1" className="title">
                                                Trading ID
                                            </Typography>
                                            <Typography variant="h5" className="id">
                                                020290
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
                                                style={{marginTop: 30}}>VID-09890</Typography>
                                    <Typography variant="h6">Toyota Rav4 2020</Typography>

                                    <Image
                                        src="/images/FullSize-Default-Car.png"
                                        height={300}
                                        width={450}
                                        style={{borderRadius: '8px'}}
                                    />
                                </div>
                            </div>
                            <div className="right">
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <PriceCard style={{background: status !== 'active' ? t.extraLiteGrey : ''}}>
                                            <Typography
                                                variant="body1">{status === 'active' ? 'Total Expected' : 'Received'} ROT</Typography>
                                            <Typography variant="h5">&#8358; 400,000.00</Typography>
                                        </PriceCard>
                                    </Grid>
                                    <div className='title'>
                                        Trade Purchase Details
                                    </div>
                                    <Grid item xs={12}>
                                        <Statistic>
                                            <div className="key">Bought Slots</div>
                                            <div className="value">4</div>
                                        </Statistic>
                                        <Statistic>
                                            <div className="key">Total
                                                Slot {status !== 'active' ? 'Purchased' : ''} Price
                                            </div>
                                            <div className="value">&#8358; 400,000.00</div>
                                        </Statistic>
                                        <Statistic>
                                            <div className="key">{status === 'active' ? 'Expected' : 'Received'} ROT
                                            </div>
                                            <div className="value">&#8358; 80,000.00</div>
                                        </Statistic>
                                        <Statistic>
                                            <div className="key">Trading Duration in Months</div>
                                            <div className="value">5 Months</div>
                                        </Statistic>
                                        <Statistic>
                                            <div
                                                className="key">Purchase Date
                                            </div>
                                            <div className="value">11/03/2022</div>
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
                                            <div className="value">REF09393020292022</div>
                                        </Statistic>
                                        <Statistic>
                                            <div className="key">Trade Status</div>
                                            <div className="value">
                                                <ActivityTab
                                                    style={{
                                                        background:
                                                            status === 'active'
                                                                ? t.alertSuccessLite
                                                                : (status === 'sold' ? t.primaryExtraLite : t.extraLiteGrey)
                                                    }}
                                                >
                                                    {status}
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
        </Container>
    )
}

export default TradingActivitiesPage

TradingActivitiesPage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

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