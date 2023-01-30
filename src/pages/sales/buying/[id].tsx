import MainLayout from '../../../components/layouts/MainLayout'
import styled from 'styled-components'
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography
} from '@material-ui/core'
import { t } from '../../../styles/theme'
import { useRouter } from 'next/router'
import { withStyles } from '@material-ui/styles'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { retrieveSingleSell } from '../../../services/market'
import {
  formatNumber,
  humanReadableDate,
  trimString
} from '../../../helpers/formatters'
import CPToast from '../../../components/shared/CPToast'
import Loader from '../../../components/layouts/core/Loader'
import Button from '../../../components/shared/Button'
import Moment from 'moment'
import {
  createInspection,
  retrieveInspection,
  retrieveInspectors
} from '../../../services/inspection'
import { createCar } from '../../../services/car'

function SalesProfilePage({ pageId }) {
  const router = useRouter()
  const [saleId, setSaleId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [state, setState] = useState({
    saleActive: false
  })
  const [sale, setSale] = useState({
    id: null,
    seller: {
      first_name: null,
      last_name: null,
      phone: null,
      email: null
    },
    created: null,
    modified: null,
    licence_plate: null,
    registeration_state: null,
    current_usage_timeframe_by_user: 0,
    mileage: 0,
    count_of_previous_users: 0,
    custom_papers_availability: false,
    car_condition: null,
    note: null,
    price: 0,
    inspection: null,
    inspection_location: null,
    contact_preference: null,
    is_negotiable: false,
    vehicle_info: {
      id: null,
      engine: null,
      transmission: null,
      car_type: null,
      fuel_type: null,
      mileage: 0,
      age: 0,
      description: null,
      trim: null,
      manufacturer: null,
      vin: null,
      brand: {
        id: null,
        created: null,
        modified: null,
        model: null,
        name: null,
        year: null
      },
      created: null,
      modified: null,
      specifications: null,
      drive_type: null,
      last_service_date: null,
      last_service_mileage: null,
      previous_owners: null,
      num_of_cylinders: null,
      engine_power: null,
      torque: null
    }
  })
  const [car, setCarData] = useState({
    id: null,
    maintenance_cost: 0,
    total_cost: 0,
    pictures: [],
    vin: null,
    information: {
      id: null,
      engine: null,
      transmission: null,
      car_type: null,
      fuel_type: null,
      mileage: 0,
      age: 0,
      description: null,
      trim: null,
      manufacturer: null,
      vin: null,
      brand: {
        id: null,
        created: null,
        modified: null,
        name: null,
        model: null,
        year: 0
      },
      created: null,
      modified: null
    },
    status: null,
    bought_price: '0',
    inspection: { id: null, status: null },
    created: null,
    modified: null,
    colour: null,
    cost_of_repairs: null,
    resale_price: null,
    margin: null,
    description: null,
    name: null,
    licence_plate: null
  })
  const [pageLoading, setPageLoading] = useState(false)
  const [newInspection, setNewInspection] = useState({
    owners_name: null,
    owners_review: null,
    inspection_date: null,
    owners_phone: null,
    address: null,
    inspector: null,
    car: null
  })
  const [inspection, setInspection] = useState({
    id: null,
    created: null,
    modified: null,
    owners_name: null,
    inspection_date: null,
    owners_phone: null,
    owners_review: null,
    address: null,
    status: 'ongoing',
    inspection_verdict: null,
    inspector: null,
    inspection_assignor: null,
    car: null
  })
  const [inspectorList, setInspectors] = useState([])
  const [inspectorId, setInspectorID] = useState(null)
  const [modalOpen, setModalState] = useState(false)
  const [modalView, setModalView] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [modalTagline, setModalTagline] = useState(
    ' Kindly provide the following information below.'
  )

  const showModal = (
    viewName: string,
    title: string,
    customTagline: string = null!
  ) => {
    setModalView(viewName)
    setModalTitle(title)
    if (!!customTagline) {
      setModalTagline(customTagline)
    }
    setModalState(true)
  }

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

  const handleNavigation = (action: string) => {
    router.push(`${action}`)
  }

  const getSale = (id) => {
    if (id !== null && id !== undefined && id !== '') {
      setPageLoading(true)
      retrieveSingleSell(id)
        .then((response) => {
          if (response.status) {
            setSale(response.data)
            if (response.data?.status === 'active') {
              setState({ ...state, saleActive: true })
            }
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

  const updateInspectionFields = (field, value) => {
    if (
      field == 'inspection_date' &&
      Moment(value).toDate() < Moment().toDate()
    ) {
      toast.dismiss()
      toast.error('Date cannot be less than today')
      return
    } else {
      let obj = { ...newInspection }
      obj[field] = value
      setNewInspection(obj)
    }
  }

  function getInspectors() {
    //TODO: Handle case for vin already existing
    const data = { vin: sale.vehicle_info.vin, color: 'black' }
    createCar(data)
      .then((response) => {
        if (response.status) {
          toast.success('Created Car Successfully!')
        } else {
          toast.error(response.data)
        }
      })
      .catch((error) => {
        toast.error(error)
      })
      .finally(() => {
        setIsSaving(false)
        retrieveInspectors()
          .then((response) => {
            if (response.status) {
              setInspectors(response.data?.results || [])
              showModal('createInspection', 'Add Inspection')
            } else {
              toast.error(response.data)
            }
          })
          .catch((error) => {
            toast.error(error.data)
          })
      })
  }

  function addInspection(): void {
    const data = {
      ...newInspection,
      inspection_date: Moment(newInspection?.inspection_date).toISOString(),
      inspector: inspectorId,
      car: car?.id
    }
    setIsSaving(true)
    createInspection(data)
      .then((res) => {
        if (res.status) {
          toast.success('Created Inspection Successfully')
          getSale(String(router.query.id))
        } else {
          toast.error(res?.data)
        }
      })
      .catch((err) => {
        toast.error(err)
      })
      .finally(() => {
        setIsSaving(false)
        setModalState(false)
      })
  }

  function viewInspectionReport() {
    if (sale?.inspection?.id) {
      retrieveInspection(sale.inspection.id)
        .then((response) => {
          if (response.status) {
            setInspection(response.data)
            showModal(
              'vehicleInspectionReport',
              'Vehicle Inspection Report',
              'An overview of the information gathered.'
            )
          } else {
            toast.error(response.data)
          }
        })
        .catch((error) => {
          toast.error(error.data)
        })
    }
  }

  useEffect(() => {
    setSaleId(pageId)
    getSale(pageId)
  }, [])

  return (
    <MainLayout>
      <Container>
        <CPToast />
        {!pageLoading && (
          <>
            <Header>
              <Typography variant="h4">
                <b>{trimString(saleId)}</b>
              </Typography>
            </Header>
            <Breadcrumbs>
              <img
                loading="lazy"
                src="/icons/Vehicle-Blue.svg"
                width={'20px'}
                height={'18px'}
                style={{ marginRight: '12px' }}
              />
              <div
                onClick={() => {
                  handleNavigation('/sales/buying')
                }}
              >
                <span className="text">Buying</span>
                <span className="separator"></span>
              </div>
              <div
                onClick={() => {
                  handleNavigation(`/sales/buying/${saleId}`)
                }}
              >
                <span className="text">{trimString(saleId)}</span>
                <span className="separator"></span>
              </div>
            </Breadcrumbs>
            <Body>
              <ActionBar>
                <div className="button-group">
                  <Button
                    text="Create Inspection"
                    width={150}
                    outlined={true}
                    onClick={() => getInspectors()}
                  />
                  <Button
                    text="Reject Sale"
                    width={170}
                    outlined={true}
                    marginLeft="16px"
                    bgColor={t.alertError}
                  />
                </div>
              </ActionBar>
              <Typography variant="h6" color="secondary">
                Highlight
              </Typography>
              <p style={{ marginBottom: 10 }}>
                Vehicle Description: {sale?.vehicle_info.description}
              </p>
              <p style={{ marginBottom: 40 }}>Note: {sale?.note}</p>
              <PriceSection container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="h6" color="secondary">
                    Seller Information
                  </Typography>
                  <Detail>
                    <div className="key">Name</div>
                    <div className="value">
                      {sale?.seller?.first_name} {sale?.seller?.last_name}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Phone</div>
                    <div className="value">{sale?.seller?.phone}</div>
                  </Detail>
                  <Detail>
                    <div className="key">Email</div>
                    <div className="value">{sale?.seller?.email}</div>
                  </Detail>
                  <Typography variant="h6" color="secondary">
                    Sale Information
                  </Typography>
                  <Detail>
                    <div className="key">Price</div>
                    <div className="value">
                      &#8358; {formatNumber(sale?.price)}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">License Plate</div>
                    <div
                      className="value"
                      style={{ textTransform: 'uppercase' }}
                    >
                      {sale?.licence_plate}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Contact Preference</div>
                    <div className="value">{sale?.contact_preference}</div>
                  </Detail>
                  <Detail>
                    <div className="key">Registered In</div>
                    <div className="value">{sale?.registeration_state}</div>
                  </Detail>
                  <Detail>
                    <div className="key">Previous Owners</div>
                    <div className="value">{sale?.count_of_previous_users}</div>
                  </Detail>
                  <Detail>
                    <div className="key">Inspection Location</div>
                    <div className="value">{sale?.inspection_location}</div>
                  </Detail>
                  <Detail>
                    <div className="key">Customs Papers</div>
                    <div className="value">
                      {sale?.custom_papers_availability ? 'Yes' : 'No'}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Negotiable</div>
                    <div className="value">
                      {sale?.is_negotiable ? 'Yes' : 'No'}
                    </div>
                  </Detail>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" color="secondary">
                    Vehicle Information
                  </Typography>
                  <Detail>
                    <div className="key">Date Added</div>
                    <div className="value">
                      {humanReadableDate(sale?.vehicle_info?.created)}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">VIN</div>
                    <div className="value">{sale?.vehicle_info?.vin}</div>
                  </Detail>
                  <Detail>
                    <div className="key">Engine</div>
                    <div className="value">{sale?.vehicle_info?.engine}</div>
                  </Detail>
                  <Detail>
                    <div className="key">Transmission</div>
                    <div className="value">
                      {sale?.vehicle_info?.transmission}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Vehicle Type</div>
                    <div className="value">{sale?.vehicle_info?.car_type}</div>
                  </Detail>
                  <Detail>
                    <div className="key">Fuel Type</div>
                    <div className="value">{sale?.vehicle_info?.fuel_type}</div>
                  </Detail>
                  <Detail>
                    <div className="key">Vehicle Age</div>
                    <div className="value">{sale?.vehicle_info?.age}</div>
                  </Detail>
                  <Detail>
                    <div className="key">Mileage</div>
                    <div className="value">{sale?.vehicle_info?.mileage}</div>
                  </Detail>
                  <Typography variant="h6" color="secondary">
                    Brand Information
                  </Typography>
                  <Detail>
                    <div className="key">Brand</div>
                    <div className="value">
                      {sale?.vehicle_info?.brand?.name}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Model</div>
                    <div className="value">
                      {sale?.vehicle_info?.brand?.model}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Year</div>
                    <div className="value">
                      {sale?.vehicle_info?.brand?.year}
                    </div>
                  </Detail>
                </Grid>
              </PriceSection>
            </Body>
            <Modal
              open={modalOpen}
              onClose={() => {
                setModalState(false)
              }}
            >
              <ModalBody>
                <ModalBodyHeader>
                  <Typography variant="h5" style={{ fontWeight: 600 }}>
                    {modalTitle}
                  </Typography>
                  <img
                    src="/icons/Cancel-Black.svg"
                    width={25}
                    height={25}
                    onClick={() => setModalState(false)}
                    style={{ cursor: 'pointer' }}
                  />
                </ModalBodyHeader>
                <Typography variant="inherit" style={{ marginBottom: 20 }}>
                  {modalTitle !== '' ? modalTagline : ''} &nbsp;
                </Typography>
                {modalView === 'createInspection' && (
                  <>
                    <InputGrid>
                      <Flex style={{ marginBottom: '5px' }}>
                        <HeaderText style={{ marginTop: 10 }}>
                          Enter Inspection Date
                        </HeaderText>
                        <TextField
                          type="date"
                          className="text-field"
                          fullWidth
                          variant="standard"
                          value={newInspection?.inspection_date}
                          onChange={(e) =>
                            updateInspectionFields(
                              'inspection_date',
                              e.target.value
                            )
                          }
                        />
                      </Flex>
                    </InputGrid>
                    <InputGrid style={{ marginTop: 5 }}>
                      <Flex style={{ marginBottom: '5px' }}>
                        <HeaderText style={{ marginTop: 10 }}>
                          Enter Owners Name
                        </HeaderText>
                        <TextField
                          className="text-field"
                          fullWidth
                          variant="standard"
                          value={newInspection?.owners_name}
                          onChange={(e) =>
                            updateInspectionFields(
                              'owners_name',
                              e.target.value
                            )
                          }
                        />
                      </Flex>
                      <Flex style={{ marginBottom: '5px' }}>
                        <HeaderText style={{ marginTop: 10 }}>
                          Enter Owners Phone Number
                        </HeaderText>
                        <TextField
                          className="text-field"
                          fullWidth
                          variant="standard"
                          value={newInspection?.owners_phone}
                          error={
                            !new RegExp(
                              /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
                            ).test(newInspection?.owners_phone)
                          }
                          onChange={(e) => {
                            updateInspectionFields(
                              'owners_phone',
                              e.target.value
                            )
                          }}
                        />
                      </Flex>
                    </InputGrid>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="demo-simple-select-outlined-label">
                        Inspector
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={inspectorId}
                        onChange={(e) => setInspectorID(e.target.value)}
                        label="Inspector"
                      >
                        <MenuItem value="" disabled>
                          <em>None</em>
                        </MenuItem>
                        {inspectorList.map((i, _) => (
                          <MenuItem key={_} value={i.id}>
                            {i?.username}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Flex style={{ marginBottom: '5px', marginTop: 5 }}>
                      <HeaderText style={{ marginTop: 10 }}>
                        Enter Review
                      </HeaderText>
                      <TextField
                        className="text-field"
                        fullWidth
                        variant="standard"
                        multiline
                        rows={3}
                        maxRows={6}
                        value={newInspection?.owners_review}
                        onChange={(e) =>
                          updateInspectionFields(
                            'owners_review',
                            e.target.value
                          )
                        }
                      />
                    </Flex>
                    <Flex style={{ marginBottom: '5px' }}>
                      <HeaderText style={{ marginTop: 10 }}>
                        Enter Owners Address
                      </HeaderText>
                      <TextField
                        className="text-field"
                        fullWidth
                        variant="standard"
                        multiline
                        rows={3}
                        maxRows={6}
                        value={newInspection?.address}
                        onChange={(e) =>
                          updateInspectionFields('address', e.target.value)
                        }
                      />
                    </Flex>
                    <Button
                      text={isSaving ? 'Saving...' : 'Add Inspection'}
                      width={510}
                      marginLeft="auto"
                      marginRight="auto"
                      marginTop={40}
                      disabled={
                        isSaving ||
                        !new RegExp(
                          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
                        ).test(newInspection?.owners_phone)
                      }
                      onClick={() => addInspection()}
                    />
                  </>
                )}
              </ModalBody>
            </Modal>
          </>
        )}
        {pageLoading && <Loader />}
      </Container>
    </MainLayout>
  )
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      pageId: params.id
    }
  }
}

export default SalesProfilePage

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

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  margin-top: 16px;

  .slideshow {
    margin-right: 20px;
    position: relative;
    height: fit-content;

    .main {
      object-fit: cover;
      border-radius: 14px;
    }

    .next,
    .previous {
      position: absolute;
      cursor: pointer;
      top: 0;
      bottom: 0;
      margin: auto 0;
    }

    .previous {
      left: 16px;
    }

    .next {
      right: 16px;
    }
  }

  @media screen and (max-width: 1080px) {
    .slideshow {
      img.main {
        width: 400px;
        height: 240px;

        .next,
        .prev {
        }
      }
    }
  }
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

const Detail = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 15px;
  padding-bottom: 10px;
  font-size: 14px;
  border-bottom: 1px solid ${t.extraLiteGrey};
  width: 100%;

  .value {
    font-weight: bold;
  }
`

const HeaderText = withStyles({
  root: {
    color: t.lightGrey,
    fontWeight: 'bold',
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

const PriceSection = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})(Grid)

const PriceCard = withStyles({
  elevation1: { boxShadow: 'none' },
  root: {
    height: '131px',
    width: '482px',
    padding: '13px 19px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: `${t.alertSuccessLite}`,
    float: 'right'
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

const SalesStatus = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
  padding-bottom: 20px;
  border-bottom: 1px solid ${t.liteGrey};
  margin-bottom: 20px;

  .status {
    color: ${t.primaryBlue};
  }

  .cta {
    background-color: ${t.extraLiteGrey};
    margin-left: 14px;
    padding: 10px 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  &.stacked {
    flex-direction: column;
    border-bottom: none;
    align-items: flex-start;

    .cta {
      margin-left: 0;
    }
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

  .vehicle-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: auto;
  }
`
