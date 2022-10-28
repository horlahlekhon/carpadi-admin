import MainLayout from '../../components/layouts/MainLayout'
import styled from 'styled-components'
import {
    FormControl,
    Grid, IconButton,
    Input, InputAdornment,
    InputLabel,
    Modal,
    Select,
    TextField,
    Typography,
} from '@material-ui/core'
import Button from '../../components/shared/Button'
import {t} from '../../styles/theme'
import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/router'
import Image from "next/image";
import {toast} from "react-hot-toast";
import CPToast from "../../components/shared/CPToast";
import CreateTrade from "../../components/shared/CreateTrade";
import AddCarProfile from "../../components/shared/AddCarProfile";
import {retrieveInventoryStats} from "../../services/inventory";
import {formatNumber} from "../../helpers/formatters";
import Loader from "../../components/layouts/core/Loader";

function InventoryPage() {
    const router = useRouter()
    const [modalOpen, setModalState] = useState(false)
    const [modalView, setModalView] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [modalTagline, setModalTagline] = useState(' Kindly provide the following information below.')
    const [brandModel, setBrandModel] = useState('')
    const [createTrade, setCreateTrade] = useState(false)
    const [addCarProfile, setAddCarProfile] = useState(false)
    const [tradeStats, setTradeStats] = useState({
        "car_listing": 0,
        "under_inspection": 0,
        "passed_for_trade": 0,
        "ongoing_trade": 0,
        "sold": 0,
        "archived": 0
    })
    const [pageLoading, setPageLoading] = useState(false)
    const hiddenFileInput = useRef(null);

    const handleNavigation = (action: string) => {
        router.push(`${action}`)
            .then(() => {
            })
    }

    const handleFileClick = event => {
        hiddenFileInput.current.click();
    };

    const handleFileChange = event => {
        const fileUploaded = event.target.files[0];
        handleFile(fileUploaded);
    };

    const handleFile = (file) => {
    }

    const showModal = (viewName: string, title: string, customTagline: string = null!) => {
        setModalView(viewName)
        setModalTitle(title)
        if (!!customTagline) {
            setModalTagline(customTagline)
        }
        setModalState(true)
    }

    const retrieveInventoryStatistics = () => {
        setPageLoading(true)
        retrieveInventoryStats()
            .then((response) => {
                if (response.status) {
                    setTradeStats(response.data)
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

    useEffect(() => {
        retrieveInventoryStatistics()
    }, [])

    return (
        <Container>
            <CPToast/>
            {!pageLoading && (
                <>
                    {createTrade && <CreateTrade modalOpen={createTrade} onClick={() => setCreateTrade(false)}/>}
                    {addCarProfile &&
                        <AddCarProfile modalOpen={addCarProfile} onClick={() => setAddCarProfile(false)}/>}
                    <Header>
                        <Typography variant="h4">
                            <b>Inventory</b>
                        </Typography>
                        <ActionBar>
                            <Button text="Add Car Profile" width={150} marginLeft="18px"
                                    onClick={() => setAddCarProfile(true)}/>
                            <Button
                                text="Create Brand"
                                width={150}
                                outlined={true}
                                marginLeft="18px"
                                bgColor={t.primaryBlue}
                                disabled={true}
                                onClick={() => showModal('createBrand', 'Create Brand', 'Add a vehicle brand')}
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
                    <Breadcrumbs>
                        <img loading="lazy"
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
                                    <div className="count">{formatNumber(tradeStats.car_listing)}</div>
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
                                    <div className="count">{formatNumber(tradeStats.under_inspection)}</div>
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
                                    <div className="count">{formatNumber(tradeStats.passed_for_trade)}</div>
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
                                    <div className="count">{formatNumber(tradeStats.ongoing_trade)}</div>
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
                                    <div className="count">{formatNumber(tradeStats.sold)}</div>
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
                                    <div className="count">{formatNumber(tradeStats.archived)}</div>
                                    <Button text="View All" width="84px" onClick={() => {
                                        handleNavigation('/inventory/archived')
                                    }}/>
                                </div>
                            </Card>
                        </Grid>
                    </Grid>
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
                            {modalView === 'createBrand' && (
                                <>
                                    <InputGrid>
                                        <input
                                            type='file'
                                            accept='image/*'
                                            ref={hiddenFileInput}
                                            onChange={handleFileChange}
                                            style={{display: 'none'}}
                                        />
                                        <FormControl
                                            fullWidth
                                            variant="standard"
                                        >
                                            <InputLabel htmlFor="standard-adornment-password">
                                                Upload Vehicle Image
                                            </InputLabel>
                                            <Input
                                                id="custom-file"
                                                type={'text'}
                                                readOnly={true}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleFileClick}
                                                        >
                                                            <img loading="lazy" src='/images/Upload.png' height={20} width={22}/>
                                                            <Typography variant='subtitle2' color='primary'
                                                                        style={{marginLeft: 2}}>Upload</Typography>
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                        <TextField
                                            className="text-field"
                                            fullWidth
                                            placeholder="Model"
                                        />
                                    </InputGrid>
                                    <InputGrid>
                                        <FormControl fullWidth>
                                            <Select
                                                value={brandModel}
                                                onChange={(event) =>
                                                    setBrandModel(String(event.target.value))
                                                }
                                                displayEmpty
                                                inputProps={{'aria-label': 'Without label'}}
                                                style={{height: 40}}
                                            >
                                                <option value="" disabled>
                                                    Brand Model
                                                </option>
                                                <option value={''}>&nbsp;</option>
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            className="text-field"
                                            fullWidth
                                            placeholder="Body Type"
                                        />
                                    </InputGrid>
                                    <InputGrid>
                                        <TextField
                                            className="text-field"
                                            fullWidth
                                            placeholder="Year"
                                        />
                                    </InputGrid>
                                    <Button
                                        text="Proceed"
                                        width={510}
                                        marginLeft="auto"
                                        marginRight="auto"
                                        marginTop={40}
                                        onClick={() => showModal('viewBrandSummary', 'Proceed', 'Vehicle brand summary')}
                                    />
                                </>
                            )}
                            {modalView === 'viewBrandSummary' && (
                                <>
                                    <FlexRow
                                        style={{justifyContent: 'space-between', alignItems: 'start', marginTop: 8}}>
                                        <img loading="lazy"
                                            src="/images/Big-Default-Car.png"
                                            width={185}
                                            height={135}
                                            style={{borderRadius: '8px'}}
                                        />
                                        <img loading="lazy"
                                            src="/images/Toyota-Full.png"
                                            width={80}
                                            height={22}
                                            style={{}}
                                        />
                                    </FlexRow>
                                    <Statistic>
                                        <div className='key'>Make</div>
                                        <div className='value'>Toyota</div>
                                    </Statistic>
                                    <Statistic>
                                        <div className='key'>Model</div>
                                        <div className='value'>Rav4</div>
                                    </Statistic>
                                    <Statistic>
                                        <div className='key'>Year</div>
                                        <div className='value'>2018</div>
                                    </Statistic>
                                    <Statistic>
                                        <div className='key'>Body Type</div>
                                        <div className='value'>Saloon</div>
                                    </Statistic>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                        color: t.lightGrey
                                    }}>
                                        <img loading="lazy" src='/icons/Caution-Yellow.svg' alt='caution' height={20} width={20}
                                             style={{marginRight: 4}}/>
                                        <span>There’s no current UI for managing created brands, If you wish to delete contact the development team</span>
                                    </div>
                                    <Button
                                        text="Create & Save Brand"
                                        width={516}
                                        marginLeft="auto"
                                        marginRight="auto"
                                        marginTop={40}
                                        onClick={() => setModalState(false)}
                                    />
                                </>
                            )}
                        </ModalBody>
                    </Modal>
                </>
            )}
            {pageLoading && (<Loader/>)}
        </Container>
    )
}

export default InventoryPage

InventoryPage.getLayout = function getLayout(page) {
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
const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;

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
  }
`
const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 24px;
  margin-bottom: 20px;
  width: 700px;

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