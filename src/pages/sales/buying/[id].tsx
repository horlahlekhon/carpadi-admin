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
import {
  acceptSale,
  rejectSale,
  retrieveSingleSell
} from '../../../services/market'
import {
  formatDate,
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
import { BuyingStates } from '../../../lib/enums'
import { getColorName } from '../../../helpers/utils'
import ColorPickerDropdown from '../../../components/charts/ColorPickerDropdown'

function SalesProfilePage({ pageId }) {
  const router = useRouter()
  const [saleId, setSaleId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [state, setState] = useState({
    saleActive: false
  })
  const [sale, setSale] = useState({
    id: null,
    status: null,
    seller: {
      first_name: null,
      last_name: null,
      phone: null,
      email: null
    },
    car: {
      id: '94751013-5db6-4c1a-a3d3-c82c6bd1200d',
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
        modified: null,
        specifications: null,
        drive_type: null,
        last_service_date: null,
        last_service_mileage: null,
        previous_owners: null,
        num_of_cylinders: null,
        engine_power: null,
        torque: null
      },
      status: null,
      bought_price: null,
      inspection: null,
      created: null,
      modified: null,
      colour: null,
      cost_of_repairs: null,
      resale_price: null,
      margin: null,
      description: null,
      name: null,
      licence_plate: null
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
    is_negotiable: false
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
  const [color, setColour] = useState(null)
  const [reason, setReason] = useState('')

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

  const reject = () => {
    rejectSale(saleId, reason).then((response) => {
      if (response.status) {
        toast.success('Rejected Successfully!')
        getSale(saleId)
        setModalState(false)
      } else {
        toast.error(response.data)
      }
    })
  }

  const accept = () => {
    acceptSale(saleId).then((response) => {
      if (response.status) {
        toast.success('Accepted Successfully!')
        getSale(saleId)
      } else {
        toast.error(response.data)
      }
    })
  }

  function getInspectors() {
    showModal('setColor', 'Set Car Colour')
  }

  function proceedToCarCreation() {
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
  }

  function addInspection(): void {
    const data = {
      ...newInspection,
      inspection_date: Moment(newInspection?.inspection_date).toISOString(),
      inspector: inspectorId,
      car: sale?.car!.id
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
    if (sale?.car?.inspection?.id) {
      retrieveInspection(sale.car.inspection.id)
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
                  {sale?.car !== null && sale?.car?.inspection !== null && (
                    <>
                      <Button
                        text="View Inspection"
                        width={155}
                        outlined={true}
                        onClick={viewInspectionReport}
                      />
                    </>
                  )}
                  {(sale?.car === null || sale?.car?.inspection === null) && (
                    <>
                      <Button
                        text="Create Inspection"
                        width={155}
                        outlined={true}
                        disabled={sale.status !== BuyingStates.Accepted}
                        title="Sale must be approved"
                        onClick={() => getInspectors()}
                      />
                    </>
                  )}
                  <Button
                    text="Accept Sale"
                    width={150}
                    outlined={true}
                    marginLeft="16px"
                    bgColor={t.alertSuccess}
                    onClick={accept}
                    disabled={sale.status === BuyingStates.Accepted}
                  />
                  <Button
                    text="Reject Sale"
                    width={150}
                    outlined={true}
                    marginLeft="16px"
                    bgColor={t.alertError}
                    onClick={() =>
                      showModal(
                        'declineSale',
                        'Decline Sale',
                        'Please enter a reason for rejecting this sale'
                      )
                    }
                    disabled={sale.status === BuyingStates.Rejected}
                  />
                </div>
              </ActionBar>
              <Typography variant="h6" color="secondary">
                Highlight
              </Typography>
              <p style={{ marginBottom: 10 }}>
                Vehicle Description: {sale?.car?.description}
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
                      {humanReadableDate(sale?.car?.information?.created)}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">VIN</div>
                    <div className="value">{sale?.car?.information?.vin}</div>
                  </Detail>
                  <Detail>
                    <div className="key">Engine</div>
                    <div className="value">
                      {sale?.car?.information?.engine}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Transmission</div>
                    <div className="value">
                      {sale?.car?.information?.transmission}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Vehicle Type</div>
                    <div className="value">
                      {sale?.car?.information?.car_type}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Fuel Type</div>
                    <div className="value">
                      {sale?.car?.information?.fuel_type}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Vehicle Age</div>
                    <div className="value">{sale?.car?.information?.age}</div>
                  </Detail>
                  <Detail>
                    <div className="key">Mileage</div>
                    <div className="value">
                      {sale?.car?.information?.mileage}
                    </div>
                  </Detail>
                  <Typography variant="h6" color="secondary">
                    Brand Information
                  </Typography>
                  <Detail>
                    <div className="key">Brand</div>
                    <div className="value">
                      {sale?.car?.information?.brand?.name}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Model</div>
                    <div className="value">
                      {sale?.car?.information?.brand?.model}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Year</div>
                    <div className="value">
                      {sale?.car?.information?.brand?.year}
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
                {modalView === 'declineSale' && (
                  <>
                    <Flex style={{ marginBottom: '5px' }}>
                      <TextField
                        className="text-field"
                        fullWidth
                        placeholder="Color"
                        error={reason === ''}
                        label="Reason"
                        type="text"
                        variant="standard"
                        onChange={(e) => setReason(e.target.value)}
                      />
                      <Button
                        width={500}
                        marginTop={'40px'}
                        text="Proceed"
                        onClick={reject}
                        disabled={reason === null || reason === ''}
                      />
                    </Flex>
                  </>
                )}
                {modalView === 'setColor' && (
                  <>
                    <Flex style={{ marginBottom: '5px' }}>
                      <Flex
                        style={{
                          marginBottom: '5px',
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <ColorPickerDropdown
                          onChange={setColour}
                          value={'#000'}
                        />
                        <div
                          style={{
                            width: 40,
                            height: 20,
                            backgroundColor: color,
                            marginRight: 10,
                            border: '1px solid black'
                          }}
                        />
                        <div style={{ marginLeft: '5px' }}>
                          {color !== '' && color !== null
                            ? getColorName(color)
                            : 'Color not selected'}
                        </div>
                      </Flex>
                      <Button
                        width={500}
                        marginTop={'40px'}
                        text="Proceed"
                        onClick={proceedToCarCreation}
                        disabled={color === null}
                      />
                    </Flex>
                  </>
                )}
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
                {modalView === 'vehicleInspectionReport' && (
                  <div style={{ maxWidth: 980 }}>
                    <HeaderText variant="inherit" style={{ marginTop: '40px' }}>
                      Inspection Report for
                    </HeaderText>
                    <InfoSection container spacing={3}>
                      <Grid item xs={12} style={{ display: 'flex' }}>
                        <VehicleDetails style={{ width: 700 }}>
                          <img
                            loading="lazy"
                            src={
                              sale?.car?.pictures.length > 0
                                ? sale?.car.pictures[0]
                                : null
                            }
                            width={185}
                            height={135}
                            alt={car?.name}
                            style={{ borderRadius: '8px' }}
                          />
                          <div className="stats">
                            <img
                              loading="lazy"
                              src="/images/Toyota-Full.png"
                              width={80}
                              height={22}
                              style={{ marginBottom: -15 }}
                            />
                            <Typography variant="h5" className="trade">
                              {trimString(inspection?.id || 'NA')}
                            </Typography>
                            <Typography variant="h6">
                              {car?.name || 'NA'}
                            </Typography>
                          </div>
                        </VehicleDetails>
                        <Button
                          text="View Full Report"
                          width={150}
                          outlined={true}
                          onClick={() => handleNavigation('/')}
                        />
                      </Grid>
                    </InfoSection>
                    <div
                      style={{
                        width: '80%',
                        marginRight: 'auto',
                        marginLeft: 'auto',
                        padding: '16px',
                        border: `2px dashed ${t.lightGrey}`,
                        borderRadius: '10px'
                      }}
                    >
                      {/*<Typography variant='h6'>Inspection Summary</Typography>*/}
                      <div className="content">
                        <Grid item xs={12} style={{ marginTop: -10 }}>
                          <Statistic>
                            <div className="key">Status</div>
                            <div className="value">{inspection?.status}</div>
                          </Statistic>
                          <Statistic>
                            <div className="key">Owner’s Name</div>
                            <div className="value">
                              {trimString(inspection?.owners_name, 25) || 'NA'}
                            </div>
                          </Statistic>
                          <Statistic>
                            <div className="key">Owners Phone</div>
                            <div className="value">
                              {inspection?.owners_phone}
                            </div>
                          </Statistic>
                          <Statistic>
                            <div className="key">Inspector</div>
                            <div className="value">
                              {inspection?.inspector?.username || 'NA'}
                            </div>
                          </Statistic>
                          <Statistic>
                            <div className="key">Inspection Date</div>
                            <div className="value">
                              {formatDate(inspection?.inspection_date)}
                            </div>
                          </Statistic>
                          <Statistic>
                            <div className="key">Inspection Verdict</div>
                            <div className="value">
                              {inspection?.inspection_verdict}
                            </div>
                          </Statistic>
                          <Statistic>
                            <div className="key">Address</div>
                            <div className="value">{inspection?.address}</div>
                          </Statistic>
                          <Statistic>
                            <div className="key">Owners Review</div>
                            <div className="value">
                              {inspection?.owners_review || 'NA'}
                            </div>
                          </Statistic>
                        </Grid>
                      </div>
                    </div>
                  </div>
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

const VehicleDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  width: 800px;
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
