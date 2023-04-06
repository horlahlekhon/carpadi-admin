import MainLayout from '../components/layouts/MainLayout'
import styled from 'styled-components'
import { Grid, Paper, Radio, Typography, withStyles } from '@material-ui/core'
import Button from '../components/shared/Button'
import { t, theme } from '../styles/theme'
import {
  ArrowRightSharp,
  ArrowBackIos,
  ArrowForwardIos
} from '@material-ui/icons'
import Image from 'next/image'
import PieChart from '../components/charts/PieChart'
import LineChart from '../components/charts/LineChart'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { months } from '../lib/constants'
import { formatNumber } from '../helpers/formatters'
import { retrieveHomeStats } from '../services/home'
import { toast } from 'react-hot-toast'
import CPToast from '../components/shared/CPToast'
import CreateTrade from '../components/shared/CreateTrade'
import AddCarProfile from '../components/shared/AddCarProfile'
import Loader from '../components/layouts/core/Loader'
import moment from 'moment'
function HomePage() {
  const router = useRouter()
  let currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [monthIdx, setMonthIdx] = useState(new Date().getMonth());
  const [yearOnlyFilter, setYearOnlyFilter] = useState(true)
  const [createTrade, setCreateTrade] = useState(false)
  const [addCarProfile, setAddCarProfile] = useState(false)
  const [pageData, setPageData] = useState({
    average_bts: 0,
    number_of_trading_users: 0,
    average_trading_cash: 0,
    total_available_shares: 0,
    total_available_shares_value: 0,
    total_cars_with_shares: 0,
    total_trading_cash_vs_return_on_trades: {
      graph_type: 'weekly',
      ttc: [0, 0, 0, 0, 0],
      rot: [0, 0, 0, 0, 0]
    },
    cars_summary: {
      total_cars: 6,
      available: {
        count: 0,
        percentage: 0
      },
      trading: {
        count: 0,
        percentage: 0
      },
      inspection: {
        count: 0,
        percentage: 0
      },
      sold: {
        count: 0,
        percentage: 0
      }
    },
    recent_trade_activities: {
      recent_activities: []
    },
    start_date: '2022-08-01',
    end_date: '2022-08-04',
    filter_year_only: false
  })
  const [pieChartData, setPieData] = useState([
    { name: 'Inspection', value: 0 },
    { name: 'Available', value: 0 },
    { name: 'Trading', value: 0 },
    { name: 'Sold', value: 0 }
  ])
  const COLORS = [
    'black',
    t.primaryDeepBlue,
    t.primaryBlue,
    t.primaryLite,
    t.primaryAshBlue
  ]
  const [pageLoading, setPageLoading] = useState(false)

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
    router.push(`${action}`)
  }

  const parsePieChartData = () => {
    const arr = []
    for (const [key, value] of Object.entries(pageData.cars_summary)) {
      let obj = {}
      obj['name'] = key
      if (typeof value === 'object') {
        obj['value'] = value?.percentage || value?.count
      }
      arr.push(obj)
    }
    setPieData(arr)
  }

  function getLastDayOfMonth(monthIndex) {
    const momentObj = moment().month(monthIndex).date(1)
    // Use the endOf() method to get the last day of the month
    const lastDayOfMonth = momentObj.endOf('month').date()
    // Return the last day of the month
    return lastDayOfMonth
  }

  const getHomeStats = () => {
    const endDate = yearOnlyFilter
      ? moment(new Date()).format('YYYY-MM-DD')
      : `${year}-${monthIdx + 1}-${getLastDayOfMonth(monthIdx)}`
    const startDate = `${year}-${monthIdx + 1}-01`
    retrieveHomeStats(yearOnlyFilter, startDate, endDate)
      .then((res) => {
        if (res.status) {
          setPageData(res.data)
          parsePieChartData()
        } else {
          toast.error(res.data)
        }
      })
      .catch((error) => {
        toast.error(error)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }

  useEffect(() => {
    setPageLoading(true)
    getHomeStats()
  }, [])

  useEffect(() => {
    parsePieChartData()
  }, [pageData, year])

  return (
    <Container>
      <CPToast />
      {!pageLoading && (
        <>
          <Header>
            <Typography variant="h4">
              <b>Dashboard</b>
            </Typography>
            <ActionBar>
              <GreyTextTypography variant="subtitle2">
                Quick Action
              </GreyTextTypography>
              <Button
                text="Add Car Profile"
                width={150}
                marginLeft="18px"
                onClick={() => setAddCarProfile(true)}
              />
              <Button
                text="Create Trade"
                width={150}
                outlined={true}
                marginLeft="18px"
                onClick={() => setCreateTrade(true)}
              />
            </ActionBar>
          </Header>
          {createTrade && (
            <CreateTrade
              modalOpen={createTrade}
              onClick={() => setCreateTrade(false)}
            />
          )}
          {addCarProfile && (
            <AddCarProfile
              modalOpen={addCarProfile}
              onClick={() => setAddCarProfile(false)}
            />
          )}
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
                      <PickerText style={{ textTransform: 'capitalize' }}>
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
                      style={{ marginLeft: '10px' }}
                    />
                    <Button
                      onClick={getHomeStats}
                      text="Apply"
                      width={94}
                      marginLeft="24px"
                    />
                  </FilterCTA>
                </Filter>
                <Grid container spacing={2} style={{ marginTop: '8px' }}>
                  <Grid item xs={4}>
                    <AveragesCard>
                      <Typography variant="body2">
                        Average Buy to Sell Time
                      </Typography>
                      <Typography variant="h5">
                        {formatNumber(pageData?.average_bts)} Days
                      </Typography>
                    </AveragesCard>
                  </Grid>
                  <Grid item xs={4}>
                    <AveragesCard>
                      <Typography variant="body2">
                        Average Number of Users Trading
                      </Typography>
                      <Typography variant="h5">
                        {formatNumber(pageData?.number_of_trading_users)}
                      </Typography>
                    </AveragesCard>
                  </Grid>
                  <Grid item xs={4}>
                    <AveragesCard>
                      <Typography variant="body2">
                        Average Trading Cash Per Slot
                      </Typography>
                      <Typography variant="h5">
                        ₦ {formatNumber(pageData?.average_trading_cash)}
                      </Typography>
                    </AveragesCard>
                  </Grid>
                </Grid>
                <Shares>
                  <ShareItem>
                    <Typography variant="subtitle2">
                      Total available share
                    </Typography>
                    <Typography variant="h6">
                      {formatNumber(pageData?.total_available_shares)}
                    </Typography>
                  </ShareItem>
                  <ShareItem>
                    <Typography variant="subtitle2">
                      Available share value
                    </Typography>
                    <Typography variant="h6">
                      ₦ {formatNumber(pageData?.total_available_shares_value)}
                    </Typography>
                  </ShareItem>
                  <ShareItem>
                    <Typography variant="subtitle2">
                      Cars with available share
                    </Typography>
                    <Typography variant="h6">
                      {formatNumber(pageData?.total_cars_with_shares)}
                    </Typography>
                  </ShareItem>
                </Shares>
                <Paper
                  elevation={0}
                  style={{
                    marginTop: '16px',
                    height: '409px',
                    padding: '16px'
                  }}
                >
                  <GraphStats>
                    <StatItem>
                      <ColorSquare style={{ backgroundColor: t.primaryBlue }} />
                      <div>
                        <Typography variant="body2">
                          Total Trading Cash
                        </Typography>
                        <Typography variant="h6">
                          ₦{' '}
                          {formatNumber(
                            pageData?.total_trading_cash_vs_return_on_trades?.ttc.reduce(
                              (a, b) => a + b,
                              0
                            )
                          )}
                        </Typography>
                      </div>
                    </StatItem>
                    <StatItem>
                      <ColorSquare
                        style={{ backgroundColor: t.primaryDeepBlue }}
                      />
                      <div>
                        <Typography variant="body2">
                          Return On Trades
                        </Typography>
                        <Typography variant="h6">
                          {' '}
                          {formatNumber(
                            pageData?.total_trading_cash_vs_return_on_trades?.rot.reduce(
                              (a, b) => a + b,
                              0
                            )
                          )}
                        </Typography>
                      </div>
                    </StatItem>
                  </GraphStats>
                  <div style={{ height: '300px' }}>
                    <LineChart
                      ttc={
                        pageData?.total_trading_cash_vs_return_on_trades?.ttc
                      }
                      rot={
                        pageData?.total_trading_cash_vs_return_on_trades?.rot
                      }
                      weeks={
                        pageData?.total_trading_cash_vs_return_on_trades?.ttc
                          .length || 4
                      }
                    />
                  </div>
                </Paper>
              </MainSection>
            </Grid>
            <Grid item xs={4}>
              <CarsSummaryCard>
                <Typography variant="body1">Cars Summary</Typography>
                <PieChart
                  data={pieChartData}
                  colors={COLORS}
                  labels={pieChartData.map((x) => x?.name)}
                />
              </CarsSummaryCard>
              <ActivitiesCard>
                <ActivitiesHeader>
                  <Typography variant="body1">
                    Recent Trade Activities
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      handleNavigation('/notifications')
                    }}
                  >
                    View All
                    <ArrowRightSharp />
                  </Typography>
                </ActivitiesHeader>
                {pageData?.recent_trade_activities?.recent_activities.map(
                  (activity, i) => (
                    <ActivityItem
                      key={i}
                      onClick={() => {
                        handleNavigation(`/users/${activity.merchant}`)
                      }}
                    >
                      <ImageCircle>
                        <Image
                          src="/icons/Users-Blue.svg"
                          width={16}
                          height={21}
                        />
                      </ImageCircle>
                      <ActivityItemText>
                        {activity?.description.replace('Activity Type:', '')}
                      </ActivityItemText>
                    </ActivityItem>
                  )
                )}
              </ActivitiesCard>
            </Grid>
          </Grid>
        </>
      )}
      {pageLoading && <Loader />}
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
  elevation1: { boxShadow: 'none' },
  root: {
    height: '301px',
    padding: '11px 20px'
  }
})(Paper)

const Filter = withStyles({
  elevation1: { boxShadow: 'none' },
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
  elevation1: { boxShadow: 'none' },
  root: {
    height: '127px',
    padding: '14px 0 11px 16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
})(Paper)

const ActivitiesCard = withStyles({
  elevation1: { boxShadow: 'none' },
  root: {
    marginTop: '16px',
    height: '409px',
    padding: '16px 19px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  }
})(Paper)

const Shares = withStyles({
  elevation1: { boxShadow: 'none' },
  root: {
    marginTop: '16px',
    height: '73px',
    padding: '11px 20px',
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

  @media screen and (max-width: 1080px) {
    h6.MuiTypography-root.MuiTypography-h6 {
      font-size: 18px;
    }
  }
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
