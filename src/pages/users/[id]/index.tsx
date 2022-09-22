import MainLayout from '../../../components/layouts/MainLayout'
import styled from 'styled-components'
import {Grid, Typography, Paper, Modal} from '@material-ui/core'
import {t} from '../../../styles/theme'
import {useRouter} from 'next/router'
import Button from '../../../components/shared/Button'
import Image from 'next/image'
import {withStyles} from '@material-ui/styles'
import {useEffect, useState} from 'react'
import {toast} from 'react-hot-toast'
import {ArrowBack, Check} from '@material-ui/icons'
import CPToast from "../../../components/shared/CPToast";
import {merchantService} from "../../../services/merchant";
import {walletService} from "../../../services/wallet";
import {formatDate, formatNumber} from "../../../helpers/formatters";
import {transactionService} from "../../../services/transaction";
import {TransactionStates} from "../../../lib/enums";
import Loader from "../../../components/layouts/core/Loader";


function UserProfilePage({pageId}) {
    const router = useRouter()
    const userId = pageId || 'NA'
    const [modalOpen, setModalState] = useState(false)
    const [modalView, setModalView] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [viewAllTransactions, setViewAllTransactions] = useState(false)
    const [user, setUserData] = useState({
        "id": null,
        "user": {
            "id": null,
            "username": null,
            "first_name": null,
            "last_name": null,
            "profile_picture": null,
            "email": null,
            "phone": null,
            "is_active": false
        },
        "banks": [],
        "created": null,
        "modified": null,
        "bvn": null
    })
    const [wallet, setWalletData] = useState({
        "id": "NA",
        "bank_accounts": [],
        "created": "NA",
        "modified": "NA",
        "balance": "0.00",
        "trading_cash": "0.00",
        "withdrawable_cash": "0.00",
        "unsettled_cash": "0.00",
        "total_cash": "0.00",
        "merchant": userId
    })
    const [transactions, setTransactions] = useState([])
    const [pageLoading, setPageLoading] = useState(false)
    const showModal = (viewName: string, title: string) => {
        setModalView(viewName)
        setModalTitle(title)
        setModalState(true)
    }
    const handleNavigation = (action: string) => {
        router.push(`${action}`)
    }
    const deleteAccount = () => {
        setModalState(false)
        toast.success('User Account Deleted')
    }
    const suspendAccount = () => {
        updateUser({is_active: false})
    }
    const retrieveUser = () => {
        if (userId !== 'NA' && userId !== undefined) {
            setPageLoading(true)
            merchantService
                .retrieveSingleMerchant(userId)
                .then((response) => {
                    if (response.status) {
                        setUserData(response.data)
                    } else {
                        toast.error(response.data)
                    }
                })
                .catch((error) => {
                    toast.error(error.data)
                })
                .finally(() => {
                    setPageLoading(false)
                })
        }
    }
    const retrieveUserWallet = () => {
        if (userId !== 'NA' && userId !== undefined) {
            walletService
                .retrieveWallets(1, 0, userId)
                .then((response) => {
                    if (response.status) {
                        if (response.data.results && response.data.results.length > 0) {
                            setWalletData(response.data.results[0])
                        }
                    } else {
                        toast.error(response.data)
                    }
                })
                .catch((error) => {
                    toast.error(error.data)
                })
        }
    }
    const retrieveUserWalletTransactions = (id) => {
        if (id !== 'NA' && id !== undefined) {
            transactionService
                .retrieveTransaction(75, 0, id)
                .then((response) => {
                    if (response.status) {
                        setTransactions(response.data.results)
                        setViewAllTransactions(true)
                    } else {
                        toast.error(response.data)
                    }
                })
                .catch((error) => {
                    toast.error(error.data)
                })
        } else {
            toast.error('No wallet to retrieve transactions from!')
        }
    }
    const updateUser = (data) => {
        if (data && userId !== 'NA' && userId !== undefined) {
            merchantService
                .updateSingleMerchant(userId, {...user.user, ...data})
                .then((response) => {
                    if (response.status) {
                        retrieveUser()
                        toast.success('User Account Suspended')
                    } else {
                        toast.error(response.data)
                    }
                })
                .catch((error) => {
                    toast.error(error.data)
                })
                .finally(() => {
                    setModalState(false)
                })
        }
    }

    useEffect(() => {
        retrieveUser()
        retrieveUserWallet()
    }, [])

    return (
        <MainLayout>
            <Container>
                <CPToast/>
                {!pageLoading && (
                    <>
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
                                            <ProfileImage style={{borderRadius: '50%'}}>
                                                <img src={user?.user?.profile_picture || "/icons/Users-Blue.svg"}
                                                     width={'100%'}
                                                     height={'100%'} style={{borderRadius: '50%'}}/>
                                            </ProfileImage>
                                            <span
                                                className="full-name">{user?.user?.first_name} {user?.user?.last_name}</span>
                                            <span>TRADING NAME: @{user?.user?.username}</span>
                                            <ActivityTab
                                                style={{
                                                    background:
                                                        user?.user?.is_active === true
                                                            ? t.alertSuccessLite
                                                            : t.extraLiteGrey
                                                }}
                                            >
                                                {user?.user?.is_active ? 'Active' : 'Inactive'}
                                            </ActivityTab>
                                        </div>
                                        <Statistic>
                                            <div className="key">Date Of Birth</div>
                                            <div className="value">NA</div>
                                        </Statistic>
                                        <Statistic>
                                            <div className="key">Country Of Origin</div>
                                            <div className="value">NA</div>
                                        </Statistic>
                                        <Statistic>
                                            <div className="key">Email Address</div>
                                            <div className="value">{user?.user?.email}</div>
                                        </Statistic>
                                        <div
                                            className={user?.user?.is_active ? "user-status" : "user-status-error"}>Email {user?.user?.is_active ? 'Verified' : 'Unverified'}</div>
                                        <Statistic style={{fontWeight: 600}}>
                                            <div className="key">Address</div>
                                        </Statistic>
                                        <p>
                                            NA
                                        </p>
                                    </div>
                                </div>
                                {viewAllTransactions && (
                                    <>
                                        <div className="right">
                                            <div className="title">
                                                <ArrowBack
                                                    style={{cursor: 'pointer'}}
                                                    onClick={() => {
                                                        setViewAllTransactions(false)
                                                    }}
                                                />
                                                <div className="text">All Transactions</div>
                                            </div>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    {transactions
                                                        .map((tr, idx) => (
                                                            <Transaction key={idx}>
                                                                <div className="left"
                                                                     title={tr?.transaction_type === 'credit' ? 'Credit' : 'Debit'}
                                                                >
                                                                    <img
                                                                        className="icon"
                                                                        src={tr?.transaction_type === 'credit' ? "/icons/Deposit-Green.svg" : "/icons/Withdraw-Red.svg"}
                                                                        alt={tr?.transaction_type}
                                                                    />
                                                                    <div className="stacked">
                                                                        <div
                                                                            style={{textTransform: "capitalize"}}>{tr?.transaction_description || tr?.transaction_type || tr?.transaction_kind || 'NA'}</div>
                                                                        <div
                                                                            className="date">{formatDate(tr?.created)}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="value" title={tr?.transaction_status}
                                                                     style={{color: tr?.transaction_status === TransactionStates.Success ? t.alertSuccess : tr?.transaction_status === TransactionStates.Pending ? t.alertValidation : tr?.transaction_status === TransactionStates.Failed ? t.alertError : t.grey}}>
                                                                    {tr?.transaction_type === 'credit' ? '+' : '-'}&#8358;{formatNumber(tr?.amount)}
                                                                </div>
                                                            </Transaction>
                                                        ))}
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
                                                        text="Suspend Account"
                                                        width={180}
                                                        outlined={true}
                                                        marginRight="16px"
                                                        marginTop={4}
                                                        bgColor={t.alertValidation}
                                                        disabled={!user.user.is_active}
                                                        onClick={() => showModal('suspendAccount', '')}
                                                    />
                                                    <Button
                                                        text="Delete Account"
                                                        width={165}
                                                        outlined={true}
                                                        marginRight="16px"
                                                        marginTop={4}
                                                        bgColor={t.alertError}
                                                        disabled={true}
                                                        onClick={() => {
                                                            showModal('deleteAccount', '')
                                                        }}
                                                    />
                                                    <Button
                                                        text="Trading Activities"
                                                        width={160}
                                                        marginTop={4}
                                                        onClick={() =>
                                                            handleNavigation(`/users/${userId}/trading-activities`)
                                                        }
                                                    />
                                                </div>
                                            </ActionBar>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <PriceCard style={{background: t.alertSuccessLite}}>
                                                        <Typography variant="body1">Total Asset</Typography>
                                                        <Typography
                                                            variant="h5">&#8358; {formatNumber(wallet?.balance)}</Typography>
                                                    </PriceCard>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Statistic>
                                                        <div className="key">Trading Cash</div>
                                                        <div
                                                            className="value">&#8358; {formatNumber(wallet?.trading_cash)}</div>
                                                    </Statistic>
                                                    <Statistic>
                                                        <div className="key">Withdrawable Cash</div>
                                                        <div
                                                            className="value">&#8358; {formatNumber(wallet?.withdrawable_cash)}</div>
                                                    </Statistic>
                                                    <Statistic>
                                                        <div className="key">Unsettled Cash</div>
                                                        <div
                                                            className="value">&#8358; {formatNumber(wallet?.unsettled_cash)}</div>
                                                    </Statistic>
                                                </Grid>
                                                <div style={{width: '100%'}}>
                                                    <Button
                                                        text="View All Transactions"
                                                        width="90%"
                                                        marginLeft="auto"
                                                        marginRight="auto"
                                                        marginBottom="40px"
                                                        marginTop={40}
                                                        onClick={() => {
                                                            retrieveUserWalletTransactions(wallet?.id)
                                                        }}
                                                    />
                                                </div>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} style={{fontWeight: 600}}>
                                                        <Statistic style={{fontSize: 14}}>
                                                            <div className="key">Personal Bank Account</div>
                                                        </Statistic>
                                                        {user.banks.map((bank, idx) => (
                                                            <Statistic key={idx}>
                                                                <div className="key stacked">
                                                                    <div
                                                                        className="account-number">Acct
                                                                        : {bank?.account_number}</div>
                                                                    <div className="bank-name">Bank
                                                                        : {bank?.bank?.name || 'NA'}</div>
                                                                    <div className="account-name">
                                                                        Acct
                                                                        Name : {bank?.name || 'NA'}
                                                                    </div>
                                                                </div>
                                                                <div className="value">
                                                                    {bank?.is_default && (<div className="checkmark">
                                                                        <Check style={{height: 12}}/>
                                                                    </div>)}
                                                                </div>
                                                            </Statistic>
                                                        ))}
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
                                        style={{fontWeight: 600, marginBottom: 15}}
                                    >
                                        {modalTitle}
                                    </Typography>
                                    <Image
                                        src="/icons/Cancel-Black.svg"
                                        width={25}
                                        height={25}
                                        onClick={() => setModalState(false)}
                                        style={{cursor: 'pointer'}}
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
                                                style={{marginTop: 48, marginBottom: 16}}
                                            >
                                                {modalTitle}
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                style={{maxWidth: 206, marginBottom: 39}}
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
                                                style={{marginTop: 48, marginBottom: 16}}
                                            >
                                                {modalTitle}
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                style={{maxWidth: 206, marginBottom: 39}}
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
                    </>
                )}
                {pageLoading && (
                    <Loader/>
                )}
            </Container>
        </MainLayout>
    )
}

export async function getServerSideProps({params}) {
    return {
        props: {
            pageId: params.id
        }
    }
}

export default UserProfilePage

const PriceCard = withStyles({
    elevation1: {boxShadow: 'none'},
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
    flex-wrap: wrap;
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

      .user-status-error {
        text-align: center;
        font-weight: bold;
        color: ${t.alertError};
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
    overflow-x: hidden;

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
