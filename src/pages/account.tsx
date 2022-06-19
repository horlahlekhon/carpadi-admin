import MainLayout from '../components/layouts/MainLayout'
import styled from 'styled-components'
import { Grid, Paper, Radio, Typography, withStyles } from '@material-ui/core'
import Button from '../components/shared/Button'
import { t } from '../styles/theme'
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons'
import PieChart from '../components/charts/PieChart'
import { useState } from 'react'
import { useRouter } from 'next/router'

function AccountPage() {
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
    { name: 'Inspection', value: 10 },
    { name: 'Available', value: 40 },
    { name: 'Trading', value: 35 },
    { name: 'Sold', value: 25 }
  ]
  const COLORS = ['black', t.primaryDeepBlue, t.primaryBlue, t.primaryLite]

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
          <Button text="Add Car Profile" width={150} marginLeft="18px" />
          <Button
            text="Create Trade"
            width={150}
            outlined={true}
            marginLeft="18px"
          />
        </ActionBar>
      </Header>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MainSection>
            <Filter>
              <Typography variant="body1" style={{ fontWeight: 700 }}>
                Account Analytics
              </Typography>
              <FilterCTA>
                <Typography variant="body1" style={{ marginRight: 16 }}>
                  Filter
                </Typography>
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
                <Button text="Apply" width={94} marginLeft="24px" />
              </FilterCTA>
            </Filter>
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
