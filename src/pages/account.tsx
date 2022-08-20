import MainLayout from '../components/layouts/MainLayout'
import styled from 'styled-components'
import {Grid, Paper, Radio, Typography, withStyles} from '@material-ui/core'
import Button from '../components/shared/Button'
import {t} from '../styles/theme'
import {ArrowBackIos, ArrowForwardIos} from '@material-ui/icons'
import PieChart from '../components/charts/PieChart'
import {useEffect, useState} from 'react'
import CPToast from "../components/shared/CPToast";
import {accountService} from "../services/account";
import {toast} from "react-hot-toast";
import {formatNumber} from "../helpers/formatters";
import {months} from "../lib/constants";


function AccountPage() {
    let currentYear = new Date().getFullYear()
    const [year, setYear] = useState(currentYear)
    const [monthIdx, setMonthIdx] = useState(0)
    const [yearOnlyFilter, setYearOnlyFilter] = useState(true)
    const [pieChartData, setPieChartData] = useState([
        {name: 'Total Deposits', value: 0},
        {name: 'Total Withdrawals', value: 0},
        {name: 'Total Paid Out Trade', value: 0}
    ])
    const [accountStats, setAccountStats] = useState({
            "total_trading_cash": {
                "total_trading_cash": 0,
                "users_trading_count": 0
            },
            "total_withdrawable_cash": {
                "total_withdrawable_cash": 0,
                "users": 0
            },
            "total_unsettled_cash": {
                "total_unsettled_cash": 0,
                "users": 0
            },
            "total_transfer_charges": {
                "total_transfer_charges": 0,
                "users": 0
            },
            "total_withdrawals_count": {
                "total_withdrawals_count": 0,
                "users": 0
            },
            "total_deposits_count": {
                "total_deposits_count": 0,
                "users": 0
            },
            "total_assets": {
                "total_assets": 0,
                "users": 0
            }
        }
    )

    const COLORS = [t.primaryDeepBlue, t.primaryBlue, t.primaryLite]

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

    const getAccountStats = () => {
        accountService.retrieveAccountStats()
            .then((response) => {
                if (response.status) {
                    setAccountStats(response.data)
                    setPieChartData([
                        {
                            name: 'Total Deposits',
                            value: response.data.total_deposits_count.total_deposits_count
                        },
                        {
                            name: 'Total Withdrawals',
                            value: response.data.total_withdrawals_count.total_withdrawals_count
                        },
                        {name: 'Total Paid Out Trade', value: 0}]
                    )
                } else {
                    toast.error(response.data)
                }
            })
            .catch((error) => {
                toast.error(error.data)
            })
    }

    useEffect(() => {
        getAccountStats()
    }, [])

    return (
        <Container>
            <CPToast/>
            <Header>
                <Typography variant="h4">
                    <b>Account</b>
                </Typography>
            </Header>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MainSection>
                        <Filter>
                            <Typography variant="body1" style={{fontWeight: 700}}>
                                Account Analytics
                            </Typography>
                            <FilterCTA>
                                <Typography variant="body1" style={{marginRight: 16}}>
                                    Filter
                                </Typography>
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
                                <Radio
                                    checked={yearOnlyFilter}
                                    onClick={updateYearOnlyFilter}
                                    color="secondary"
                                    style={{marginLeft: '10px'}}
                                />
                                <Button text="Apply" width={94} marginLeft="24px"/>
                            </FilterCTA>
                        </Filter>
                        <Grid container spacing={3} xs={12} style={{marginTop: 20}}>
                            <Grid container item spacing={2} xs={8}>
                                <Grid item xs={4}>
                                    <Card>
                                        <Typography variant="body1">Total Trading Cash</Typography>
                                        <Grid item>
                                            <Typography variant="h5" style={{fontSize: '1.2rem'}}>
                                                &#8358; {formatNumber(accountStats.total_trading_cash.total_trading_cash)}
                                            </Typography>
                                            <Typography
                                                variant="inherit">with {accountStats.total_trading_cash.users_trading_count} Users</Typography>
                                        </Grid>
                                    </Card>
                                </Grid>
                                <Grid item xs={4}>
                                    <Card>
                                        <Typography variant="body1">
                                            Total Withdraw-able Cash
                                        </Typography>
                                        <Grid item>
                                            <Typography variant="h5"
                                                        style={{fontSize: '1.2rem'}}>&#8358; {formatNumber(accountStats.total_withdrawable_cash.total_withdrawable_cash)}</Typography>
                                            <Typography
                                                variant="inherit">with {accountStats.total_withdrawable_cash.users} Users</Typography>
                                        </Grid>
                                    </Card>
                                </Grid>
                                <Grid item xs={4}>
                                    <Card>
                                        <Typography variant="body1">
                                            Total Unsettled Cash
                                        </Typography>
                                        <Grid item>
                                            <Typography variant="h5"
                                                        style={{fontSize: '1.2rem'}}>&#8358; {formatNumber(accountStats.total_unsettled_cash.total_unsettled_cash)}</Typography>
                                            <Typography
                                                variant="inherit">with {accountStats.total_unsettled_cash.users} Users</Typography>
                                        </Grid>
                                    </Card>
                                </Grid>
                                <Grid container item xs={6}>
                                    <Card style={{background: t.primaryLite, height: 190}}>
                                        <Typography variant="body1">
                                            Total Transfer Charges
                                        </Typography>
                                        <Grid item>
                                            <Typography
                                                variant="h5">&#8358; {formatNumber(accountStats.total_transfer_charges.total_transfer_charges)}</Typography>
                                            <Typography
                                                variant="inherit">with {accountStats.total_transfer_charges.users} Users</Typography>
                                        </Grid>
                                    </Card>
                                </Grid>
                                <Grid container item xs={6}>
                                    <Card style={{background: t.alertSuccessLite, height: 190}}>
                                        <Typography variant="body1">
                                            Total Closed Trade Charges
                                        </Typography>
                                        <Grid item>
                                            <Typography variant="h5">&#8358; NA</Typography>
                                            <Typography variant="inherit">with NA Users</Typography>
                                        </Grid>
                                    </Card>
                                </Grid>
                                <Grid container item xs={6}>
                                    <Card style={{height: 190}}>
                                        <Typography variant="body1">
                                            Total Number of made Deposit
                                        </Typography>
                                        <Grid item>
                                            <Typography
                                                variant="h5">{formatNumber(accountStats.total_deposits_count.total_deposits_count)}</Typography>
                                            <Typography
                                                variant="inherit">with {accountStats.total_deposits_count.users} Users</Typography>
                                        </Grid>
                                    </Card>
                                </Grid>
                                <Grid container item xs={6}>
                                    <Card style={{height: 190}}>
                                        <Typography variant="body1">
                                            Total Number of made Withdrawals
                                        </Typography>
                                        <Grid item>
                                            <Typography
                                                variant="h5">{formatNumber(accountStats.total_withdrawals_count.total_withdrawals_count)}</Typography>
                                            <Typography
                                                variant="inherit">with {accountStats.total_withdrawals_count.users} Users</Typography>
                                        </Grid>
                                    </Card>
                                </Grid>
                            </Grid>
                            <Grid container item xs={4}>
                                <Grid item xs={12}>
                                    <Card
                                        style={{color: 'white', background: t.primaryAshBlue}}
                                    >
                                        <Typography variant="body1">Total Assets</Typography>
                                        <Grid item>
                                            <Typography variant="h5">
                                                &#8358; {formatNumber(accountStats.total_assets.total_assets)}
                                            </Typography>
                                            <Typography variant="inherit">
                                                with {formatNumber(accountStats.total_assets.users)} Users
                                            </Typography>
                                        </Grid>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} style={{marginTop: 14}}>
                                    <Card style={{height: 'fit-content'}}>
                                        <PieChart
                                            data={pieChartData}
                                            colors={COLORS}
                                            labels={pieChartData.map((x) => x.name)}
                                        />
                                        {pieChartData.map((item, idx) => (
                                            <ChartStats key={idx}>
                                                <div className="stat">{item.name}</div>
                                                <div className="value">&#8358; {item.value}</div>
                                            </ChartStats>
                                        ))
                                        }
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    </MainSection>
                </Grid>
            </Grid>
        </Container>
    )
}

export default AccountPage

AccountPage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

const GreyTextTypography = withStyles({
    root: {
        color: `${t.grey}`
    }
})(Typography)

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

const Card = withStyles({
    elevation1: {boxShadow: 'none'},
    root: {
        height: '154px',
        width: '100%',
        padding: '13px 19px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: `${t.white}`
    }
})(Paper)

const ChartStats = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid ${t.extraLiteGrey};
  padding-bottom: 8px;
  margin-top: 12px;

  .value {
    font-weight: bold;
  }
`

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
