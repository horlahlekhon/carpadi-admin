import MainLayout from '../../../components/layouts/MainLayout'
import styled from 'styled-components'
import {
  Grid,
  Modal,
  Paper,
  Switch,
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

function SalesProfilePage({ pageId }) {
  const router = useRouter()
  const [saleId, setSaleId] = useState(null)
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
  const [pageLoading, setPageLoading] = useState(false)

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
                    <div className="key">Inspected At</div>
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
