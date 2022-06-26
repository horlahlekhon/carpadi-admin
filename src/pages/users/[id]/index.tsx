import MainLayout from '../../../components/layouts/MainLayout'
import styled from 'styled-components'
import { Grid, Typography, Paper, Modal, TextField } from '@material-ui/core'
import { t } from '../../../styles/theme'
import { useRouter } from 'next/router'
import Button from '../../../components/shared/Button'
import Image from 'next/image'
import { withStyles } from '@material-ui/styles'
import { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { ArrowBack, Check } from '@material-ui/icons'

function UserProfilePage() {
  const router = useRouter()
  const userId = router.query.id || 'NA'
  const [modalOpen, setModalState] = useState(false)
  const [modalView, setModalView] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [editDetails, setEditDetails] = useState(false)
  const [viewAllTransactions, setViewAllTransactions] = useState(false)

  const showModal = (viewName: string, title: string) => {
    setModalView(viewName)
    setModalTitle(title)
    setModalState(true)
  }

  const handleNavigation = (action: string) => {
    router.replace(`${action}`)
  }

  const deleteAccount = () => {
    setModalState(false)
    toast.success('Account Deleted')
  }
  const suspendAccount = () => {
    setModalState(false)
    toast.success('Account Suspended')
  }
  const saveTrade = () => {
    setModalState(false)
    toast.success('Trade Updated')
  }
  return (
    <Container>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              border: '1px solid #243773',
              padding: '16px',
              fontWeight: 'bold',
              color: '#243773'
            },
            iconTheme: {
              primary: '#243773',
              secondary: '#FFFAEE'
            }
          }}
        />
      </div>
      <Header>
        <Typography variant="h4">
          <b>Users</b>
        </Typography>
      </Header>
      <Body>
        <SplitContainer>
          <div className="left">
            <div className="user-info">
              <div className="profile">
                <ProfileImage style={{ borderRadius: '50%' }}>
                  <img src="/icons/Users-Blue.svg" width={47} height={62} />
                </ProfileImage>
                <span className="full-name">John Do Smith</span>
                <span>TRADING NAME: @james_run4deno</span>
                <ActivityTab
                  style={{
                    background:
                      'active' === 'active'
                        ? t.alertSuccessLite
                        : t.extraLiteGrey
                  }}
                >
                  active
                </ActivityTab>
              </div>
              <Statistic>
                <div className="key">Date Of Birth</div>
                <div className="value">March 20, 1989</div>
              </Statistic>
              <Statistic>
                <div className="key">Country Of Origin</div>
                <div className="value">Nigeria</div>
              </Statistic>
              <Statistic>
                <div className="key">Email Address</div>
                <div className="value">james_rundeno47@gmail.com</div>
              </Statistic>
              <div className="user-status">Email Verified</div>
              <Statistic style={{ fontWeight: 600 }}>
                <div className="key">Address</div>
              </Statistic>
              <p>
                Phasellus ultrices, velit a feugiat placerat, massa odio
                efficitur orci, porttitor varius ligula ipsum in arcu. Praesent
                tempus mi nisi, ut tempus libero porta eget.
              </p>
            </div>
          </div>
          {viewAllTransactions && (
            <>
              <div className="right">
                <div className="title">
                  <ArrowBack
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setViewAllTransactions(false)
                    }}
                  />
                  <div className="text">All Transactions</div>
                </div>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Transaction>
                      <div className="left">
                        <img
                          className="icon"
                          src="/icons/Deposit-Green.svg"
                          alt="Deposit"
                        />
                        <div className="stacked">
                          <div>Deposit</div>
                          <div className="date">Jan 23, 2022</div>
                        </div>
                      </div>
                      <div className="value" style={{ color: t.alertSuccess }}>
                        +&#8358;5,000.00
                      </div>
                    </Transaction>
                    <Transaction>
                      <div className="left">
                        <img
                          className="icon"
                          src="/icons/Withdraw-Red.svg"
                          alt="Withdraw"
                        />
                        <div className="stacked">
                          <div>Withdraw</div>
                          <div className="date">Jan 23, 2022</div>
                        </div>
                      </div>
                      <div className="value" style={{ color: t.alertError }}>
                        -&#8358;5,000.00
                      </div>
                    </Transaction>
                    <Transaction>
                      <div className="left">
                        <img
                          className="icon"
                          src="/icons/Deposit-Green.svg"
                          alt="Deposit"
                        />
                        <div className="stacked">
                          <div>Deposit</div>
                          <div className="date">Jan 23, 2022</div>
                        </div>
                      </div>
                      <div className="value" style={{ color: t.alertSuccess }}>
                        +&#8358;5,000.00
                      </div>
                    </Transaction>
                    <Transaction>
                      <div className="left">
                        <img
                          className="icon"
                          src="/icons/Withdraw-Red.svg"
                          alt="Withdraw"
                        />
                        <div className="stacked">
                          <div>Withdraw</div>
                          <div className="date">Jan 23, 2022</div>
                        </div>
                      </div>
                      <div className="value" style={{ color: t.alertError }}>
                        -&#8358;5,000.00
                      </div>
                    </Transaction>
                    <Transaction>
                      <div className="left">
                        <img
                          className="icon"
                          src="/icons/Deposit-Green.svg"
                          alt="Deposit"
                        />
                        <div className="stacked">
                          <div>Deposit</div>
                          <div className="date">Jan 23, 2022</div>
                        </div>
                      </div>
                      <div className="value" style={{ color: t.alertSuccess }}>
                        +&#8358;5,000.00
                      </div>
                    </Transaction>
                    <Transaction>
                      <div className="left">
                        <img
                          className="icon"
                          src="/icons/Withdraw-Red.svg"
                          alt="Withdraw"
                        />
                        <div className="stacked">
                          <div>Withdraw</div>
                          <div className="date">Jan 23, 2022</div>
                        </div>
                      </div>
                      <div className="value" style={{ color: t.alertError }}>
                        -&#8358;5,000.00
                      </div>
                    </Transaction>
                    <Transaction>
                      <div className="left">
                        <img
                          className="icon"
                          src="/icons/Deposit-Green.svg"
                          alt="Deposit"
                        />
                        <div className="stacked">
                          <div>Deposit</div>
                          <div className="date">Jan 23, 2022</div>
                        </div>
                      </div>
                      <div className="value" style={{ color: t.alertSuccess }}>
                        +&#8358;5,000.00
                      </div>
                    </Transaction>
                    <Transaction>
                      <div className="left">
                        <img
                          className="icon"
                          src="/icons/Withdraw-Red.svg"
                          alt="Withdraw"
                        />
                        <div className="stacked">
                          <div>Withdraw</div>
                          <div className="date">Jan 23, 2022</div>
                        </div>
                      </div>
                      <div className="value" style={{ color: t.alertError }}>
                        -&#8358;5,000.00
                      </div>
                    </Transaction>
                    <Transaction>
                      <div className="left">
                        <img
                          className="icon"
                          src="/icons/Deposit-Green.svg"
                          alt="Deposit"
                        />
                        <div className="stacked">
                          <div>Deposit</div>
                          <div className="date">Jan 23, 2022</div>
                        </div>
                      </div>
                      <div className="value" style={{ color: t.alertSuccess }}>
                        +&#8358;5,000.00
                      </div>
                    </Transaction>
                    <Transaction>
                      <div className="left">
                        <img
                          className="icon"
                          src="/icons/Withdraw-Red.svg"
                          alt="Withdraw"
                        />
                        <div className="stacked">
                          <div>Withdraw</div>
                          <div className="date">Jan 23, 2022</div>
                        </div>
                      </div>
                      <div className="value" style={{ color: t.alertError }}>
                        -&#8358;5,000.00
                      </div>
                    </Transaction>
                    <Transaction>
                      <div className="left">
                        <img
                          className="icon"
                          src="/icons/Deposit-Green.svg"
                          alt="Deposit"
                        />
                        <div className="stacked">
                          <div>Deposit</div>
                          <div className="date">Jan 23, 2022</div>
                        </div>
                      </div>
                      <div className="value" style={{ color: t.alertSuccess }}>
                        +&#8358;5,000.00
                      </div>
                    </Transaction>
                    <Transaction>
                      <div className="left">
                        <img
                          className="icon"
                          src="/icons/Withdraw-Red.svg"
                          alt="Withdraw"
                        />
                        <div className="stacked">
                          <div>Withdraw</div>
                          <div className="date">Jan 23, 2022</div>
                        </div>
                      </div>
                      <div className="value" style={{ color: t.alertError }}>
                        -&#8358;5,000.00
                      </div>
                    </Transaction>
                  </Grid>
                </Grid>
              </div>
            </>
          )}
          {!viewAllTransactions && (
            <>
              <div className="right">
                <ActionBar>
                  <div className="button-group">
                    <Button
                      text="Suspend User Account"
                      width={180}
                      outlined={true}
                      marginRight="16px"
                      bgColor={t.alertValidation}
                      onClick={() => showModal('suspendAccount', '')}
                    />
                    <Button
                      text="Delete User Account"
                      width={165}
                      outlined={true}
                      marginRight="16px"
                      bgColor={t.alertError}
                      onClick={() => {
                        showModal('deleteAccount', '')
                      }}
                    />
                    <Button
                      text="Trading Activities"
                      width={150}
                      onClick={() =>
                        handleNavigation(`/users/${userId}/trading-activities`)
                      }
                    />
                  </div>
                </ActionBar>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <PriceCard style={{ background: t.alertSuccessLite }}>
                      <Typography variant="body1">Total Asset</Typography>
                      <Typography variant="h5">&#8358; 10,000.00</Typography>
                    </PriceCard>
                  </Grid>
                  <Grid item xs={12}>
                    <Statistic>
                      <div className="key">Trading Cash</div>
                      <div className="value">&#8358; 5,000.00</div>
                    </Statistic>
                    <Statistic>
                      <div className="key">Withdrawable Cash</div>
                      <div className="value">&#8358; 3,000.00</div>
                    </Statistic>
                    <Statistic>
                      <div className="key">Unsettled Cash</div>
                      <div className="value">&#8358; 2,000.00</div>
                    </Statistic>
                  </Grid>
                  <Button
                    text="View All Transactions"
                    width="90%"
                    marginLeft="auto"
                    marginRight="auto"
                    marginBottom="40px"
                    marginTop={40}
                    onClick={() => {
                      setViewAllTransactions(true)
                    }}
                  />
                  <Grid container spacing={3}>
                    <Grid item xs={12} style={{ fontWeight: 600 }}>
                      <Statistic style={{ fontSize: 14 }}>
                        <div className="key">Personal Bank Account</div>
                      </Statistic>
                      <Statistic>
                        <div className="key stacked">
                          <div className="account-number">0320090101</div>
                          <div className="bank-name">WEMA Bank Plc</div>
                          <div className="account-name">
                            Maxwell Samuel Anthony
                          </div>
                        </div>
                        <div className="value">
                          <div className="checkmark">
                            <Check style={{ height: 12 }} />
                          </div>
                        </div>
                      </Statistic>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </>
          )}
        </SplitContainer>
      </Body>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalState(false)
        }}
      >
        <ModalBody>
          <ModalBodyHeader>
            <Typography
              variant="h5"
              style={{ fontWeight: 600, marginBottom: 15 }}
            >
              {modalTitle}
            </Typography>
            <Image
              src="/icons/Cancel-Black.svg"
              width={25}
              height={25}
              onClick={() => setModalState(false)}
              style={{ cursor: 'pointer' }}
            />
          </ModalBodyHeader>
          {modalView === 'deleteAccount' && (
            <>
              <Info>
                <img
                  src="/icons/Trash-Red.svg"
                  alt="Trash"
                  height={40}
                  width={40}
                />
                <Typography
                  variant="h6"
                  style={{ marginTop: 48, marginBottom: 16 }}
                >
                  {modalTitle}
                </Typography>
                <Typography
                  variant="subtitle2"
                  style={{ maxWidth: 206, marginBottom: 39 }}
                >
                  You are about to delete this users account.
                </Typography>
                <Button
                  text="Yes, Delete"
                  width={174}
                  onClick={() => deleteAccount()}
                />
              </Info>
            </>
          )}
          {modalView === 'suspendAccount' && (
            <>
              <Info>
                <img
                  src="/icons/Caution-Yellow.svg"
                  alt="Caution"
                  height={40}
                  width={40}
                />
                <Typography
                  variant="h6"
                  style={{ marginTop: 48, marginBottom: 16 }}
                >
                  {modalTitle}
                </Typography>
                <Typography
                  variant="subtitle2"
                  style={{ maxWidth: 206, marginBottom: 39 }}
                >
                  You are about to suspend this users account.
                </Typography>
                <Button
                  text="Yes, Suspend"
                  width={174}
                  onClick={() => suspendAccount()}
                />
              </Info>
            </>
          )}
        </ModalBody>
      </Modal>
    </Container>
  )
}

export default UserProfilePage

UserProfilePage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>
}

const PriceCard = withStyles({
  elevation1: { boxShadow: 'none' },
  root: {
    height: '100px',
    width: '100%',
    padding: '13px 19px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: `${t.primaryExtraLite}`
  }
})(Paper)

const ProfileImage = styled.div`
  width: 114px;
  height: 114px;
  background: ${t.primaryExtraLite};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  object-fit: cover;
  margin-bottom: 16px;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`
const ModalBody = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  padding: 24px 32px;
  background: white;
  width: fit-content;
  border-radius: 12px;
  height: fit-content;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`
const ModalBodyHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
const ActionBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;

  .button-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: auto;
  }

  .trading-info {
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-right: auto;

    .trading-id {
      font-weight: bold;
      &-title {
        color: ${t.grey};
        margin-bottom: 5px;
      }
    }
  }
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 36px 26px;
  background-color: ${t.white};
  border-radius: 12px;
  margin-top: 17px;
`
const SplitContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;

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

    .user-info {
      padding: 40px 20px;

      .profile {
        display: flex;
        flex-direction: column;
        margin-bottom: 34px;
        text-align: center;
        align-items: center;

        .full-name {
          font-weight: bold;
          font-size: 24px;
          margin-bottom: 8px;
        }
      }

      .user-status {
        text-align: center;
        font-weight: bold;
        color: ${t.alertSuccess};
        margin: 44px 0;
      }
    }
  }
  .right {
    width: 55%;
    border: 2px solid ${t.extraLiteGrey};
    border-radius: 12px;
    padding: 20px;
    max-height: calc(100vh - 200px);
    overflow-y: auto;

    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;
      .text {
        font-weight: bold;
        color: ${t.grey};
        margin-left: 8px;
      }
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

    .checkmark {
      background: ${t.primaryBlue};
      color: white;
      border-radius: 50%;
    }
  }

  .key {
    &.stacked {
      display: flex;
      flex-direction: column;

      .account-name,
      .bank-name {
        font-size: 11px;
        margin-top: 4px;
      }
    }
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
  margin-top: 16px;
`

const Transaction = styled.div`
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

  .left {
    display: flex;
    flex-direction: row;
    justify-content: start;
    .stacked {
      display: flex;
      flex-direction: column;
      margin-left: 15px;

      .date {
        font-size: 11px;
        margin-top: 4px;
      }
    }
  }
`
