import MainLayout from '../../components/layouts/MainLayout'
import styled from 'styled-components'
import {CircularProgress, Grid, Paper, Typography, withStyles} from '@material-ui/core'
import {t} from '../../styles/theme'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Button from '../../components/shared/Button'
import {retrieveActivities} from "../../services/activity";
import {toast} from "react-hot-toast";
import CPToast from "../../components/shared/CPToast";
import {formatDate, formatDateTime, formatTime} from "../../helpers/formatters";
import {ActivityTypes} from "../../lib/enums";

function NotificationsPage() {
    const router = useRouter()

    enum NotificationType {
        TRADING = 'trade_unit',
        USERS = 'new_user',
        GENERAL = ''
    }

    const [notificationTab, setNotificationTab] = useState(
        NotificationType.TRADING
    )
    const [activities, setActivities] = useState([])
    const [isLoading, setLoading] = useState(false)

    const updateNotificationType = (type: NotificationType) => {
        setActivities([])
        setNotificationTab(type)
        retrieveActivityList(type.valueOf())
    }

    const handleNavigation = (action: string) => {
        router.push(`${action}`)
    }

    const retrieveActivityList = (type = notificationTab.valueOf()) => {
        setLoading(true)
        retrieveActivities({activityType: type, limit: 50})
            .then((response) => {
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
                setLoading(false)
            })
    }

    useEffect(() => {
        retrieveActivityList()
    }, [])

    function goToActivity(activity: any) {
        switch (activity?.activity_type) {
            case ActivityTypes.NewUser:
                handleNavigation(`/users/${activity?.merchant}`)
                break;
            case ActivityTypes.CarCreation:
                // handleNavigation(`/inventory/car-profile/0e0c0f52-d74c-4108-80f3-b13342cc4735?status=car%20listings`)
                toast.error("Entity object empty")
                break;
            case ActivityTypes.Disbursement:
                handleNavigation(`/users/${activity?.merchant}/trading-activities`)
                break;
            case ActivityTypes.TradeUnit:
                handleNavigation(` / users /${activity?.merchant}/view-trade?status=active&tradeId=${activity?.activity_entity?.trade}`)
                break;
            case ActivityTypes.Transaction:
                handleNavigation(`/users/${activity?.merchant}`)
                break;
            default:
                handleNavigation(`/users/${activity?.merchant}/trading-activities`)
        }
    }

    return (
        <Container>
            <CPToast/>
            <Header>
                <Typography variant="h4">
                    <b>Notifications</b>
                </Typography>
            </Header>
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <Activities>
                        <CardHeader style={{justifyContent: 'start'}}>
                            <ActivityTab
                                className={`${
                                    notificationTab === NotificationType.TRADING ? 'active' : ''
                                }`}
                                onClick={() => updateNotificationType(NotificationType.TRADING)}
                            >
                                Trading
                                <NotificationCount>{notificationTab === NotificationType.TRADING ? activities.length : 0}</NotificationCount>
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
                                style={{fontWeight: 600, marginBottom: 24}}
                            >
                                All {notificationTab === NotificationType.TRADING ? 'Trade' : notificationTab === NotificationType.USERS ? 'User' : ''} Activities
                            </Typography>
                            {activities.length < 1 && (<div style={{textAlign: 'center'}}>
                                {isLoading && <CircularProgress/>}
                                {!isLoading && 'No activities yet'}
                            </div>)}
                            {activities.length > 0 && (
                                <>
                                    {notificationTab === NotificationType.TRADING &&
                                        activities.map((activity, i) => (
                                            <ActivityItem
                                                key={i}
                                                onClick={() => {
                                                    handleNavigation(`/users/${activity?.merchant}/view-trade?status=active&tradeId=${activity?.activity_entity?.trade}`)
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
                                                    <div style={{marginRight: '4px'}}>
                                                        {activity?.description.replace('Activity Type:', '')}
                                                    </div>
                                                    <ActivityItemDate>
                                                        <div>{formatDate(activity?.activity_entity?.created)}</div>
                                                        <div>{formatTime(activity?.activity_entity?.created)}</div>
                                                    </ActivityItemDate>
                                                </ActivityItemText>
                                            </ActivityItem>
                                        ))}
                                    {notificationTab === NotificationType.USERS &&
                                        activities.map((activity, i) => (
                                            <ActivityItem
                                                key={i}
                                                onClick={() => {
                                                    handleNavigation(`/users/${activity?.merchant}`)
                                                }}
                                            >
                                                <ActivityImage style={{borderRadius: '50%'}}>
                                                    <Image
                                                        src="/icons/Users-Blue.svg"
                                                        width={16}
                                                        height={21}
                                                    />
                                                </ActivityImage>
                                                <ActivityItemText>
                                                    <div>
                                                        {activity?.description.replace('Activity Type:', '')}
                                                    </div>
                                                    <ActivityItemDate>
                                                        <div>{formatDate(activity?.activity_entity?.created)}</div>
                                                        <div>{formatTime(activity?.activity_entity?.created)}</div>
                                                    </ActivityItemDate>
                                                </ActivityItemText>
                                            </ActivityItem>
                                        ))}
                                    {notificationTab === NotificationType.GENERAL &&
                                        activities.map((activity, i) => (
                                            <ActivityItem
                                                key={i}
                                                onClick={() => {
                                                    goToActivity(activity)
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
                                                        {activity?.description.replace('Activity Type:', '')}
                                                    </div>
                                                    <ActivityItemDate>
                                                        <div>{formatDate(activity?.activity_entity?.created)}</div>
                                                        <div>{formatTime(activity?.activity_entity?.created)}</div>
                                                    </ActivityItemDate>
                                                </ActivityItemText>
                                            </ActivityItem>
                                        ))}
                                </>
                            )}
                        </ActivitiesBody>
                    </Activities>
                </Grid>
                <Grid item xs={6}>
                    <Chat>
                        <CardHeader style={{paddingBottom: '14px'}}>
                            <Typography variant="h6" style={{fontWeight: 600}}>
                                Help Center Chat System
                            </Typography>
                            <ChatCTA>
                                <NotificationCount>2</NotificationCount>
                                <Button width={150} marginLeft="16px" text="Select User Chat"/>
                            </ChatCTA>
                        </CardHeader>
                        <UserInfo>
                            <ActivityImage
                                style={{borderRadius: '50%', height: 64, width: 64}}
                            >
                                <Image src="/icons/Users-Blue.svg" width={16} height={21}/>
                            </ActivityImage>
                            <Typography
                                variant="body1"
                                style={{fontWeight: 600, marginLeft: 16}}
                            >
                                James Lee <br/>
                                <Typography variant="caption">Online</Typography>
                            </Typography>
                        </UserInfo>
                        <Messages>
                            <Message>
                                <MessageContent>
                                    I Did not recieve return on my recent trade,please what is
                                    wrong?
                                </MessageContent>
                                <div className="timestamp">3:45 PM</div>
                            </Message>
                            <Message className="self">
                                <MessageContent className="self">
                                    Sorry to hear that James.Kindly provide me your trading share
                                    Id number to run a check
                                </MessageContent>
                                <div className="timestamp">3:45 PM</div>
                            </Message>
                            <Message>
                                <MessageContent>
                                    I Did not recieve return on my recent trade,please what is
                                    wrong?
                                </MessageContent>
                                <div className="timestamp">3:45 PM</div>
                            </Message>
                            <Message className="self">
                                <MessageContent className="self">
                                    Sorry to hear that James.Kindly provide me your trading share
                                    Id number to run a check
                                </MessageContent>
                                <div className="timestamp">3:45 PM</div>
                            </Message>
                        </Messages>
                        <ChatInput>
                            <input type="text" placeholder="Start a conversation ..."/>
                            <div className="actionbar">
                                <div className="attachments">
                                    <img
                                        src="/icons/Typography-Dark-Blue.svg"
                                        width={22}
                                        height={16}
                                        className="attachments-icon"
                                    />
                                    <img
                                        src="/icons/Image-Grey.svg"
                                        width={22}
                                        height={20}
                                        className="attachments-icon"
                                    />
                                </div>
                                <Image
                                    src="/icons/Send-Message-Dark-Blue.svg"
                                    width={29}
                                    height={28}
                                    style={{cursor: 'pointer'}}
                                />
                            </div>
                            <div className="powered-by">Powered by XYZ</div>
                        </ChatInput>
                    </Chat>
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
    elevation1: {boxShadow: 'none'},
    root: {
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column'
    }
})(Paper)

const Chat = withStyles({
    elevation1: {boxShadow: 'none'},
    root: {
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column'
    }
})(Paper)

const Messages = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100% - 200px);
  padding: 0 18px;
`

const Message = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  .timestamp {
    font-size: 12px;
    color: ${t.lightGrey};
    margin-top: 2px;
    align-self: inherit;
  }

  &.self {
    align-self: flex-end;
  }
`

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 17px;
  background: ${t.extraLiteGrey};
  border-radius: 14px;
  font-size: 14px;
  align-self: flex-start;
  max-width: 313px;

  &.self {
    background: ${t.primaryExtraLite};
  }
`

const ChatInput = styled.div`
  display: flex;
  flex-direction: column;
  justify-self: flex-end;
  border-top: 1px solid #e0e0e0;
  padding-top: 14px;
  margin: auto 20px 0 20px;

  input {
    border: none;
    outline: none;
    height: 28px;
    line-height: 28px;
  }

  .actionbar {
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .attachments {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;

      .attachments-icon {
        margin-right: 15px !important;
        cursor: pointer;

        :hover {
          transform: scale(1.1);
        }
      }
    }
  }

  .powered-by {
    margin: 30px auto 21px auto;
    color: #9b9b9b;
  }
`

const UserInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 0 20px 16px 20px;
`

const ChatCTA = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
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
  font-size: 12px;
  color: ${t.grey};
`
