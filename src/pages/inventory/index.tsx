import MainLayout from '../../components/layouts/MainLayout'
import styled from 'styled-components'
import {Grid, Paper, Radio, Typography, withStyles} from '@material-ui/core'
import Button from '../../components/shared/Button'
import {t} from '../../styles/theme'
import {useState} from 'react'
import {useRouter} from 'next/router'

function InventoryPage() {
    const router = useRouter()

    const handleNavigation = (action: string) => {
        router.push(`${action}`)
            .then(() => {
            })
    }

    return (
        <Container>
            <Header>
                <Typography variant="h4">
                    <b>Inventory</b>
                </Typography>
                <ActionBar>
                    <Button text="Add Car Profile" width={150} marginLeft="18px"/>
                    <Button
                        text="Create Brand"
                        width={150}
                        outlined={true}
                        marginLeft="18px"
                        bgColor={t.primaryBlue}
                    />
                    <Button
                        text="Create Trade"
                        width={150}
                        outlined={true}
                        marginLeft="18px"
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
        </Container>
    )
}

export default InventoryPage

InventoryPage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

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
