import MainLayout from '../../../../components/layouts/MainLayout'
import styled from 'styled-components'
import {
    Typography,
    Modal, Paper, Grid, TextField,
} from '@material-ui/core'
import {t} from '../../../../styles/theme'
import {useRouter} from 'next/router'
import Image from 'next/image'
import {useState} from 'react'
import Button from "../../../../components/shared/Button";
import {withStyles} from "@material-ui/styles";
import {Add} from "@material-ui/icons";

function SingleUnderInspectionMaintenancePage() {
    const router = useRouter()
    const pageId = router.query.id || 'NA'
    const [isPageEmpty, setPageState] = useState(true)
    const [modalOpen, setModalState] = useState(false)
    const [modalView, setModalView] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [modalTagline, setModalTagline] = useState(' Kindly provide the following information below.')

    const showModal = (viewName: string, title: string, customTagline: string = null!) => {
        setModalView(viewName)
        setModalTitle(title)
        if (!!customTagline || customTagline === '') {
            setModalTagline(customTagline)
        }
        setModalState(true)
    }

    const handleNavigation = (action: string) => {
        router.push(`${action}`)
    }

    const saveMaintenanceRecord = () => {
        setModalState(false)
        setPageState(false)
    }

    return (
        <Container>
            <Header>
                <Typography variant="h4">
                    <b>{pageId}</b>
                </Typography>
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
                <div>
                    <span className="text">Under Inspection</span>
                    <span className="separator"></span>
                </div>
                <div>
                    <span className="text">{pageId}</span>
                    <span className="separator"></span>
                </div>
            </Breadcrumbs>
            <Body>
                <TopTab>
                    <VehicleDetails>
                        <Image
                            src="/images/Big-Default-Car.png"
                            height={91}
                            width={125}
                            style={{borderRadius: '8px'}}
                        />
                        <div className="stats">
                            <img
                                src="/images/Toyota-Full.png"
                                width={80}
                                height={20}
                                style={{marginBottom: -10}}
                            />
                            <Typography variant="h6" className="trade">
                                Trade ID 09890
                            </Typography>
                            <Typography variant="h6">Toyota Rav4 2020</Typography>
                        </div>
                    </VehicleDetails>
                    <div className='flex'>
                        {!isPageEmpty && (<>
                            <Button text="Manage Maintenance" width={160} outlined={true} marginRight={10}
                                    onClick={() => showModal("createSparePart", "Manage Maintenance Record")}/>
                        </>)}
                        <Button text="Go to Car Profile" width={150} outlined={true} marginRight={10}/>
                        {!isPageEmpty && (
                            <>
                                <PriceCard>
                                    <Typography variant="body1">Total Maintenance Cost</Typography>
                                    <Typography variant="h5">₦37,000.00</Typography>
                                </PriceCard>
                            </>
                        )}
                    </div>
                </TopTab>
                {!isPageEmpty && (
                    <>
                        <Typography variant='h5' style={{
                            marginTop: 24,
                            borderBottom: `1px solid ${t.extraLiteGrey}`
                        }}>Description</Typography>
                        <p>
                            Nulla cursus est ut libero maximus, at cursus ex aliquet. Pellentesque gravida malesuada
                            pretium. In
                            vehicula lectus vitae tincidunt iaculis. Nunc ullamcorper auctor mauris. Nunc fringilla ut
                            neque
                            quis fringilla. Fusce dapibus nisi sed sodales faucibus. Maecenas nulla sapien, porta ut
                            tristique
                            eget, vestibulum et mi. Nulla viverra aliquet cursus.
                        </p>
                    </>
                )}
                {isPageEmpty && (
                    <>
                        <CenteredFlex style={{height: 'calc(100vh - 400px)'}}>
                            <div className='content'>
                                <Image src='/images/MaintenanceRecord.png' alt='Upload' height={120} width={120}/>
                                <div style={{marginTop: 10}}>
                                    No Maintenance Record
                                </div>
                                <Button text='Create Record' outlined={true} width={128} marginTop={40}
                                        onClick={() => showModal('createRecord', 'Record Maintenance', '')}/>
                            </div>
                        </CenteredFlex>
                    </>
                )}
            </Body>
            {!isPageEmpty && (
                <>
                    <Grid container style={{marginTop: 4}} spacing={3}>
                        <Grid item xs={7}>
                            <Body style={{padding: 15}}>
                                <Typography variant='h6'>Spare Parts</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                            <Image src='/images/Brakes.png' alt='brakes' height={93} width={93}/>
                                            <div style={{marginLeft: 10, fontWeight: 700}}>Brakes</div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                            <Image src='/images/Clutch.png' alt='brakes' height={93} width={93}/>
                                            <div style={{marginLeft: 10, fontWeight: 700}}>Clutch</div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <PriceCard style={{width: '100%', background: t.primaryLite}}>
                                            <Typography variant="body1">Spare Part Cost</Typography>
                                            <Typography variant="h5">₦12,000.00</Typography>
                                        </PriceCard>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <PriceCard style={{width: '100%', background: t.primaryLite}}>
                                            <Typography variant="body1">Spare Part Cost</Typography>
                                            <Typography variant="h5">₦12,000.00</Typography>
                                        </PriceCard>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <PriceCard style={{width: '100%', background: t.extraLiteGrey}}>
                                            <Typography variant="body1">Repair Cost</Typography>
                                            <Typography variant="h5">₦12,000.00</Typography>
                                        </PriceCard>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <PriceCard style={{width: '100%', background: t.extraLiteGrey}}>
                                            <Typography variant="body1">Repair Cost</Typography>
                                            <Typography variant="h5">₦12,000.00</Typography>
                                        </PriceCard>
                                    </Grid>
                                </Grid>
                            </Body>
                        </Grid>
                        <Grid item xs={5}>
                            <Body style={{padding: 15}}>
                                <Typography variant='h6'>Expenses</Typography>
                                <Expense>
                                    <div className="key">Fueling</div>
                                    <div className="value">&#8358; 3,000.00</div>
                                </Expense>
                                <Expense>
                                    <div className="key">Engine Oil</div>
                                    <div className="value">&#8358; 5,000.00</div>
                                </Expense>
                            </Body>
                        </Grid>
                    </Grid></>
            )}
            <Modal
                open={modalOpen}
                onClose={() => {
                    setModalState(false)
                }}
            >
                <ModalBody>
                    <ModalBodyHeader>
                        <Typography variant="h5" style={{fontWeight: 600}}>
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
                    <Typography variant="inherit" style={{marginBottom: 20}}>
                        {modalTitle !== ''
                            ? modalTagline
                            : ''}{' '}
                        &nbsp;
                    </Typography>
                    {modalView === 'createRecord' && (
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <div style={{
                                width: 390,
                                height: 200,
                                background: t.alertSuccessLite,
                                padding: 20,
                                display: 'flex',
                                flexDirection: 'column',
                                marginRight: 20
                            }}>
                                <Typography variant='h6' color='primary'>Expenses</Typography>
                                <p>Cras vel leo gravida, porttitor ex vitae, blandit lectus.</p>
                                <div style={{marginTop: 'auto'}}>
                                    <div style={{
                                        fontWeight: 600,
                                        float: 'right',
                                        cursor: 'pointer',
                                        color: t.primaryDeepBlue
                                    }} onClick={() => showModal("createExpense", "Create Expenses Maintenance Record")}>
                                        Proceed &#62;
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                width: 390,
                                height: 200,
                                background: t.primaryExtraLite,
                                padding: 20,
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Typography variant='h6' color='primary'>Spare Parts</Typography>
                                <p>Cras vel leo gravida, porttitor ex vitae, blandit lectus.</p>
                                <div style={{marginTop: 'auto'}}>
                                    <div style={{
                                        fontWeight: 600,
                                        float: 'right',
                                        cursor: 'pointer',
                                        color: t.primaryDeepBlue
                                    }}
                                         onClick={() => showModal("createSparePart", "Create Spare Part Maintenance Record")}>
                                        Proceed &#62;
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {modalView === 'createSparePart' && (
                        <>
                            <HeaderText variant="inherit" style={{marginTop: '40px'}}>
                                Maintenance Record For
                            </HeaderText>
                            <InfoSection container spacing={3}>
                                <Grid item xs={12}>
                                    <VehicleDetails2 style={{width: 700}}>
                                        <img
                                            src="/images/Big-Default-Car.png"
                                            width={185}
                                            height={135}
                                            style={{borderRadius: '8px'}}
                                        />
                                        <div className="stats">
                                            <img
                                                src="/images/Toyota-Full.png"
                                                width={80}
                                                height={22}
                                                style={{marginBottom: -15}}
                                            />
                                            <Typography variant="h5" className="trade">
                                                VID 09890
                                            </Typography>
                                            <Typography variant="h6">Toyota Rav4 2020</Typography>
                                        </div>
                                    </VehicleDetails2>
                                </Grid>
                            </InfoSection>
                            <HeaderText style={{marginBottom: 12}}>
                                Description
                            </HeaderText>
                            <TextField
                                fullWidth
                                placeholder="Damaged brakes and clutch, needing replacement..."
                                style={{marginBottom: 18}}
                            ></TextField>
                            <FlexRow style={{marginBottom: 20}}>
                                <HeaderText>Spare Part</HeaderText>
                                <IconPill>
                                    Add Spare Part
                                    <Add className="icon"/>
                                </IconPill>
                            </FlexRow>
                            <InputGrid>
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="Spare Part"
                                />
                                <div className="input">
                                    <div className="text">Upload Image</div>
                                    <Button
                                        text="Upload"
                                        outlined={true}
                                        width={71}
                                        height={28}
                                        borderRadius="8px"
                                    />
                                </div>
                            </InputGrid>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <HeaderText variant="inherit" style={{marginBottom: 8}}>
                                    Costing
                                </HeaderText>
                                <InputGrid style={{background: 'white'}}>
                                    <FlexRow>
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Enter spare part price"
                                            style={{width: 400}}
                                        ></TextField>
                                    </FlexRow>
                                    <FlexRow>
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Enter repair cost"
                                            style={{width: 400}}
                                        ></TextField>
                                    </FlexRow>
                                </InputGrid>
                            </div>
                            <InputGrid style={{marginTop: 14}}>
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="Spare Part"
                                />
                                <div className="input">
                                    <div className="text">engine indlmor.png</div>
                                    <Button
                                        text="Delete"
                                        outlined={true}
                                        width={71}
                                        height={28}
                                        bgColor={t.alertError}
                                        borderRadius="8px"
                                    />
                                </div>
                            </InputGrid>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <HeaderText variant="inherit" style={{marginBottom: 8}}>
                                    Costing
                                </HeaderText>
                                <InputGrid style={{background: 'white'}}>
                                    <FlexRow>
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Enter spare part price"
                                            style={{width: 400}}
                                        ></TextField>
                                    </FlexRow>
                                    <FlexRow>
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Enter repair cost"
                                            style={{width: 400}}
                                        ></TextField>
                                    </FlexRow>
                                </InputGrid>
                            </div>
                            <Button
                                text="Create Maintenance Record"
                                width={510}
                                marginLeft="auto"
                                marginRight="auto"
                                marginTop={50}
                                onClick={() =>
                                    saveMaintenanceRecord()
                                }
                            />
                        </>
                    )}
                    {modalView === 'createExpense' && (
                        <>
                            <HeaderText variant="inherit" style={{marginTop: '40px'}}>
                                Maintenance Record For
                            </HeaderText>
                            <InfoSection container spacing={3}>
                                <Grid item xs={12}>
                                    <VehicleDetails2 style={{width: 700}}>
                                        <img
                                            src="/images/Big-Default-Car.png"
                                            width={185}
                                            height={135}
                                            style={{borderRadius: '8px'}}
                                        />
                                        <div className="stats">
                                            <img
                                                src="/images/Toyota-Full.png"
                                                width={80}
                                                height={22}
                                                style={{marginBottom: -15}}
                                            />
                                            <Typography variant="h5" className="trade">
                                                VID 09890
                                            </Typography>
                                            <Typography variant="h6">Toyota Rav4 2020</Typography>
                                        </div>
                                    </VehicleDetails2>
                                </Grid>
                            </InfoSection>
                            <HeaderText style={{marginBottom: 12}}>
                                Description
                            </HeaderText>
                            <TextField
                                fullWidth
                                placeholder="Damaged brakes and clutch, needing replacement..."
                                style={{marginBottom: 18}}
                            ></TextField>
                            <FlexRow style={{marginBottom: 20}}>
                                <HeaderText>Expenses</HeaderText>
                                <IconPill>
                                    Add Expense
                                    <Add className="icon"/>
                                </IconPill>
                            </FlexRow>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <InputGrid style={{background: 'white'}}>
                                    <FlexRow className='reverse'>
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Expense"
                                            style={{width: 400}}
                                        ></TextField>
                                    </FlexRow>
                                    <FlexRow className='reverse'>
                                        <div className="currency-box"
                                             style={{color: t.alertError, background: 'white'}}>&#215;</div>
                                        <TextField
                                            placeholder="Cost"
                                            style={{width: 400}}
                                        ></TextField>
                                    </FlexRow>
                                </InputGrid> <InputGrid style={{background: 'white'}}>
                                <FlexRow className='reverse'>
                                    <div className="currency-box">&#8358;</div>
                                    <TextField
                                        placeholder="Expense"
                                        style={{width: 400}}
                                    ></TextField>
                                </FlexRow>
                                <FlexRow className='reverse'>
                                    <div className="currency-box"
                                         style={{color: t.alertError, background: 'white'}}>&#215;</div>
                                    <TextField
                                        placeholder="Cost"
                                        style={{width: 400}}
                                    ></TextField>
                                </FlexRow>
                            </InputGrid>
                            </div>
                            <Button
                                text="Create Maintenance Record"
                                width={510}
                                marginLeft="auto"
                                marginRight="auto"
                                marginTop={50}
                                onClick={() =>
                                    saveMaintenanceRecord()
                                }
                            />
                        </>
                    )}
                </ModalBody>
            </Modal>
        </Container>
    )
}

export default SingleUnderInspectionMaintenancePage

SingleUnderInspectionMaintenancePage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

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
const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 36px 26px;
  background-color: ${t.white};
  border-radius: 12px;
  margin-top: 17px;
`
const TopTab = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 2px solid ${t.extraLiteGrey};
  border-radius: 14px;

  .flex {
    display: inherit;
    flex-direction: inherit;
    justify-content: end;
    align-items: center;
  }
`
const VehicleDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;

  .stats {
    height: 100%;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .trade {
      color: ${t.primaryBlue};
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
`
const PriceCard = withStyles({
    elevation1: {boxShadow: 'none'},
    root: {
        height: '100px',
        width: '260px',
        padding: '13px 19px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: `${t.alertSuccessLite}`
    }
})(Paper)
const Expense = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 10px;
  padding-bottom: 5px;
  font-size: 14px;
  border-bottom: 1px solid ${t.extraLiteGrey};
  width: 100%;

  .value {
    font-weight: bold;
  }
`
const CenteredFlex = styled.div`
  padding: 31px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .content {
    display: inherit;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`
const IconPill = styled.button`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 7px 12px;
  border-radius: 8px;
  background: ${t.primaryExtraLite};
  color: ${t.primaryDeepBlue};
  border: none;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    transition: all 0.3s ease-out;
  }

  .icon {
    margin-left: 8px;
  }
`
const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 24px;
  padding: 8px 12px;
  height: 54px;
  background: ${t.extraLiteGrey};
  margin-bottom: 10px;

  .input {
    width: 97%;
    background: ${t.white};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: fit-content;
    padding: 5px 10px;
    margin: auto;
    border-bottom: 1px solid ${t.lightGrey};
  }

  .text-field {
    width: 97%;
    background: ${t.white};
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: space-between;
    height: 39px;
    margin: auto;
  }
`
const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  .currency-box {
    height: 27px;
    width: 27px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${t.lightGrey};
    background: ${t.liteGrey};
    margin-right: 10px;
  }

  &.reverse {
    flex-direction: row-reverse !important;
  }
`
const HeaderText = withStyles({
    root: {
        color: t.lightGrey,
        fontWeight: 700,
        display: 'block'
    }
})(Typography)
const InfoSection = withStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '20px',
        marginTop: '8px'
    }
})(Grid)
const VehicleDetails2 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  margin-bottom: 27px;

  .stats {
    height: 100%;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .trade {
      color: ${t.primaryBlue};
      margin-top: 36px;
      margin-bottom: 17px;
    }
  }
`
