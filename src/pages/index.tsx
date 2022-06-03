import MainLayout from '../components/layouts/MainLayout'
import styled from 'styled-components'
import {Grid, Paper, Radio, Typography, withStyles} from '@material-ui/core'
import Button from '../components/shared/Button'
import {t} from '../styles/theme'
import {
    ArrowRightSharp,
    ArrowBackIos,
    ArrowForwardIos
} from '@material-ui/icons'
import Image from 'next/image'
import PieChart from '../components/charts/PieChart'
import LineChart from '../components/charts/LineChart'
import {useState} from 'react'
import {useRouter} from "next/router";

function HomePage() {
    const router = useRouter()
    let currentYear = new Date().getFullYear()
    const [year, setYear] = useState(currentYear)
    const [monthIdx, setMonthIdx] = useState(0)
    const [yearOnlyFilter, setYearOnlyFilter] = useState(true)
    const months = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december'
    ]
    const pieChartData = [
        {name: 'Inspection', value: 10},
        {name: 'Available', value: 40},
        {name: 'Trading', value: 35},
        {name: 'Sold', value: 25}
    ]
    const COLORS = ['black', t.primaryDeepBlue, t.primaryBlue, t.primaryLite]
    const lineChartData = [
        {
            name: 'WK 0',
            uv: 2000,
            pv: 2600,
            amt: 2400
        }, {
            name: 'WK 1',
            uv: 3000,
            pv: 2600,
            amt: 2400
        },
        {
            name: 'WK 2',
            uv: 2000,
            pv: 2398,
            amt: 2210
        },
        {
            name: 'WK 3',
            uv: 2000,
            pv: 800,
            amt: 2290
        },
        {
            name: 'WK 4',
            uv: 2780,
            pv: 3908,
            amt: 2000
        },
        {
            name: 'WK 5',
            uv: 1890,
            pv: 4800,
            amt: 2181
        }
    ]

    const updateYear = (action: string) => {
        if (action === 'next') {
            let newYear = year + 1
            if (newYear > currentYear) {
                newYear = currentYear
            }
            setYear(newYear)
        } else if (action === 'prev') {
            setYear(year - 1)
        }
    }

    const updateMonth = (action: string) => {
        if (action === 'next') {
            let newMonthIdx = monthIdx + 1
            if (newMonthIdx > 11) {
                newMonthIdx = 11
            }
            setMonthIdx(newMonthIdx)
        } else if (action === 'prev') {
            let newMonthIdx = monthIdx - 1
            if (newMonthIdx < 0) {
                setMonthIdx(0)
            } else {
                setMonthIdx(newMonthIdx)
            }
        }
    }

    const updateYearOnlyFilter = () => {
        setYearOnlyFilter(!yearOnlyFilter)
    }

    const handleNavigation = (action: string) => {
        router.replace(`${action}`)
    }

    return (
        <Container>
            <Header>
                <Typography variant="h4">
                    <b>Dashboard</b>
                </Typography>
                <ActionBar>
                    <GreyTextTypography variant="subtitle2">
                        Quick Action
                    </GreyTextTypography>
                    <Button text="Add Car Profile" width={150} marginLeft="18px"/>
                    <Button
                        text="Create Trade"
                        width={150}
                        outlined={true}
                        marginLeft="18px"
                    />
                </ActionBar>
            </Header>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <MainSection>
                        <Filter>
                            <Typography variant="body1">Filter</Typography>
                            <FilterCTA>
                                <Picker>
                                    <ArrowBackIos
                                        onClick={() => {
                                            updateMonth('prev')
                                        }}
                                    />
                                    <PickerText style={{textTransform: 'capitalize'}}>
                                        {months[monthIdx]}
                                    </PickerText>
                                    <ArrowForwardIos
                                        onClick={() => {
                                            updateMonth('next')
                                        }}
                                    />
                                </Picker>
                                <Picker>
                                    <ArrowBackIos
                                        onClick={() => {
                                            updateYear('prev')
                                        }}
                                    />
                                    <PickerText>{year}</PickerText>
                                    <ArrowForwardIos
                                        onClick={() => {
                                            updateYear('next')
                                        }}
                                    />
                                </Picker>
                                <Typography variant="body1">Filter year only</Typography>
                                <Radio checked={yearOnlyFilter} onClick={updateYearOnlyFilter} color="secondary"
                                       style={{marginLeft: '10px'}}/>
                                <Button text="Apply" width={94} marginLeft="24px"/>
                            </FilterCTA>
                        </Filter>
                        <Grid container spacing={2} style={{marginTop: '8px'}}>
                            <Grid item xs={4}>
                                <AveragesCard>
                                    <Typography variant="body2">
                                        Average Buy to Sell Time
                                    </Typography>
                                    <Typography variant="h5">24 Days</Typography>
                                </AveragesCard>
                            </Grid>
                            <Grid item xs={4}>
                                <AveragesCard>
                                    <Typography variant="body2">
                                        Average Number of Users Trading
                                    </Typography>
                                    <Typography variant="h5">2,000</Typography>
                                </AveragesCard>
                            </Grid>
                            <Grid item xs={4}>
                                <AveragesCard>
                                    <Typography variant="body2">
                                        Average Trading Cash Per Slot
                                    </Typography>
                                    <Typography variant="h5">₦100,000.00</Typography>
                                </AveragesCard>
                            </Grid>
                        </Grid>
                        <Shares>
                            <ShareItem>
                                <Typography variant="subtitle2">
                                    Total available share
                                </Typography>
                                <Typography variant="h6">2,400</Typography>
                            </ShareItem>
                            <ShareItem>
                                <Typography variant="subtitle2">
                                    Available share value
                                </Typography>
                                <Typography variant="h6">₦100,000,000.00</Typography>
                            </ShareItem>
                            <ShareItem>
                                <Typography variant="subtitle2">
                                    Cars with available share
                                </Typography>
                                <Typography variant="h6">25</Typography>
                            </ShareItem>
                        </Shares>
                        <Paper
                            elevation={0}
                            style={{marginTop: '16px', height: '409px', padding: '16px'}}
                        >
                            <GraphStats>
                                <StatItem>
                                    <ColorSquare style={{backgroundColor: t.primaryBlue}}/>
                                    <div>
                                        <Typography variant="body2">Total Trading Cash</Typography>
                                        <Typography variant="h6">₦50,000,000.00</Typography>
                                    </div>
                                </StatItem>
                                <StatItem>
                                    <ColorSquare style={{backgroundColor: t.primaryDeepBlue}}/>
                                    <div>
                                        <Typography variant="body2">Return On Trades</Typography>
                                        <Typography variant="h6">₦50,000,000.00</Typography>
                                    </div>
                                </StatItem>
                            </GraphStats>
                            <div style={{height: "300px"}}>
                                <LineChart data={lineChartData}/>
                            </div>
                        </Paper>
                    </MainSection>
                </Grid>
                <Grid item xs={4}>
                    <CarsSummaryCard>
                        <Typography variant="body1">Cars Summary</Typography>
                        <PieChart data={pieChartData} colors={COLORS} labels={pieChartData.map(x => x.name)}/>
                    </CarsSummaryCard>
                    <ActivitiesCard>
                        <ActivitiesHeader>
                            <Typography variant="body1">Recent Trade Activities</Typography>
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}
                                onClick={() => {
                                    handleNavigation('/trade/activities')
                                }}
                            >
                                View All
                                <ArrowRightSharp/>
                            </Typography>
                        </ActivitiesHeader>
                        {[...Array.from({length: 5})].map((x, i) => <ActivityItem onClick={() => {
                            handleNavigation(`/users/${i}/trade-activities`)
                        }}>
                            <ImageCircle>
                                <Image src="/icons/Users-Blue.svg" width={16} height={21}/>
                            </ImageCircle>
                            <ActivityItemText>
                                <b>James Lee</b> bought 3 shares of <b>2018 Carmy model</b> with{' '}
                                <b>ID 093290</b>
                            </ActivityItemText>
                        </ActivityItem>)}
                    </ActivitiesCard>
                </Grid>
            </Grid>
        </Container>
    )
}

export default HomePage

HomePage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

const GreyTextTypography = withStyles({
    root: {
        color: `${t.grey}`
    }
})(Typography)

const CarsSummaryCard = withStyles({
    elevation1: {boxShadow: 'none'},
    root: {
        height: '301px',
        padding: '11px 20px'
    }
})(Paper)

const Filter = withStyles({
    elevation1: {boxShadow: 'none'},
    root: {
        height: '70px',
        padding: '11px 16px 11px 22px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})(Paper)

const AveragesCard = withStyles({
    elevation1: {boxShadow: 'none'},
    root: {
        height: '127px',
        padding: '14px 0 11px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
})(Paper)

const ActivitiesCard = withStyles({
    elevation1: {boxShadow: 'none'},
    root: {
        marginTop: '16px',
        height: '409px',
        padding: '16px 19px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: "auto"
    }
})(Paper)

const Shares = withStyles({
    elevation1: {boxShadow: 'none'},
    root: {
        marginTop: '16px',
        height: '73px',
        padding: '11px 27px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})(Paper)

const FilterCTA = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    
    @media screen and (max-width: 1080px) {
        p.MuiTypography-root.MuiTypography-body1 {
            font-size: 14px;
        }
        button.MuiButtonBase-root.MuiButton-root {
            margin-left: 12px !important;
        }
   }
`

const Picker = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid ${t.lightGrey};
  padding-bottom: 6px;
  margin-right: 22px;

  svg {
    height: 16px;
    width: 13px;
    cursor: pointer;
  }
  
  @media screen and (max-width: 1080px) {
  margin-right: 10px;
  margin-left: 10px;
  }
`

const PickerText = styled.div`
  font-size: 16px;
  line-height: 24px;
  margin: 0 14px;
  
  @media screen and (max-width: 1080px) {
  font-size: 14px;
  margin: 0 6px;
  }
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
const ActionBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const MainSection = styled.div`
  background: transparent;
  display: flex;
  flex-direction: column;
`

const ShareItem = styled.div`
  display: flex;
  flex-direction: column;
  // margin-right: 24px;
`

const ActivitiesHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.8px solid ${t.liteGrey};
  padding-bottom: 8px;
  margin-bottom: 16px;
`

const ActivityItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding-bottom: 12px;
  cursor: pointer;

  &:not(:last-child) {
    margin-bottom: 12px;
    border-bottom: 0.5px solid ${t.liteGrey};
  }
`

const ActivityItemText = styled.div`
  margin-left: 11px;
  line-height: 18px;
  font-size: 13px;
  font-weight: 300;
  width: calc(100% - 40px);
`

const ImageCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${t.primaryExtraLite};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const GraphStats = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  margin-bottom: 10px;
`

const StatItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  width: 200px;

  &:not(:last-child) {
    margin-right: 14px;
  }
`

const ColorSquare = styled.div`
  width: 17px;
  height: 17px;
  margin-right: 9px;
  &::after {
    content: '';
  }
`
