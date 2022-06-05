import MainLayout from '../../components/layouts/MainLayout'
import styled from 'styled-components'
import { Grid, Paper, Typography, withStyles } from '@material-ui/core'
import { t } from '../../styles/theme'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

function NotificationsPage() {
  const router = useRouter()
  enum NotificationType {
    TRADING,
    USERS,
    GENERAL
  }
  const [notificationTab, setNotificationTab] = useState(
    NotificationType.TRADING
  )

  const updateNotificationType = (type: NotificationType) => {
    setNotificationTab(type)
  }

  const handleNavigation = (action: string) => {
    router.replace(`${action}`)
  }

  return (
    <Container>
      <Header>
        <Typography variant="h4">
          <b>Notifications</b>
        </Typography>
      </Header>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Activities>
            <CardHeader style={{ justifyContent: 'start' }}>
              <ActivityTab
                className={`${
                  notificationTab === NotificationType.TRADING ? 'active' : ''
                }`}
                onClick={() => updateNotificationType(NotificationType.TRADING)}
              >
                Trading
                <NotificationCount>3</NotificationCount>
              </ActivityTab>
              <ActivityTab
                className={`${
                  notificationTab === NotificationType.USERS ? 'active' : ''
                }`}
                onClick={() => updateNotificationType(NotificationType.USERS)}
              >
                Users
              </ActivityTab>
              <ActivityTab
                className={`${
                  notificationTab === NotificationType.GENERAL ? 'active' : ''
                }`}
                onClick={() => updateNotificationType(NotificationType.GENERAL)}
              >
                General
              </ActivityTab>
            </CardHeader>
            <ActivitiesBody>
              <Typography
                variant="h6"
                style={{ fontWeight: 600, marginBottom: 24 }}
              >
                All Trade Activities
              </Typography>
              {notificationTab === NotificationType.TRADING &&
                [...Array.from({ length: 8 })].map((_, i) => (
                  <ActivityItem
                    key={i}
                    onClick={() => {
                      handleNavigation(`/users/${i}/trade-activities`)
                    }}
                  >
                    <ActivityImage>
                      <Image
                        src="/icons/Users-Blue.svg"
                        width={16}
                        height={21}
                      />
                    </ActivityImage>
                    <ActivityItemText>
                      <div>
                        <b>James Lee</b> bought 3 shares of
                        <b> 2018 Carmy model</b> with <b> ID 093290</b>
                      </div>
                    </ActivityItemText>
                  </ActivityItem>
                ))}
              {notificationTab === NotificationType.USERS &&
                [...Array.from({ length: 8 })].map((_, i) => (
                  <ActivityItem
                    key={i}
                    onClick={() => {
                      handleNavigation(`/users/${i}/trade-activities`)
                    }}
                  >
                    <ActivityImage style={{ borderRadius: '50%' }}>
                      <Image
                        src="/icons/Users-Blue.svg"
                        width={16}
                        height={21}
                      />
                    </ActivityImage>
                    <ActivityItemText>
                      <div>
                        <b>James Lee</b> joined Carpadi
                      </div>
                      <ActivityItemDate>
                        <div>11/03/2022</div>
                        <div>12:30</div>
                      </ActivityItemDate>
                    </ActivityItemText>
                  </ActivityItem>
                ))}
              {notificationTab === NotificationType.GENERAL &&
                [...Array.from({ length: 10 })].map((_, i) => (
                  <ActivityItem
                    key={i}
                    onClick={() => {
                      handleNavigation(`/users/${i}/trade-activities`)
                    }}
                  >
                    <ActivityImage>
                      <Image
                        src="/icons/Users-Blue.svg"
                        width={16}
                        height={21}
                      />
                    </ActivityImage>
                    <ActivityItemText>
                      <div>
                        <b>2018 Carmy model</b> with <b>ID 093290</b> was added
                        to listing
                      </div>
                    </ActivityItemText>
                  </ActivityItem>
                ))}
            </ActivitiesBody>
          </Activities>
        </Grid>
        <Grid item xs={6}>
          <Chat>2</Chat>
        </Grid>
      </Grid>
    </Container>
  )
}

export default NotificationsPage

NotificationsPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>
}

const Activities = withStyles({
  elevation1: { boxShadow: 'none' },
  root: {
    height: 'calc(100vh - 200px)',
    display: 'flex',
    flexDirection: 'column'
  }
})(Paper)

const Chat = withStyles({
  elevation1: { boxShadow: 'none' },
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
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding: 20px;
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

const NotificationCount = styled.span`
  height: 20px;
  width: 20px;
  background: ${t.alertError};
  color: ${t.white};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 6px;
  font-size: 12px;
`

const ActivitiesBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 24px 24px 24px;
  overflow-y: auto;
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
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 11px;
  line-height: 18px;
  font-size: 13px;
  font-weight: 300;
  width: calc(100% - 40px);
`

const ActivityImage = styled.div`
  width: 40px;
  height: 40px;
  background: ${t.primaryExtraLite};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  object-fit: cover;
`

const ActivityItemDate = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  justify-content: space-between;
  align-items: end;
`
