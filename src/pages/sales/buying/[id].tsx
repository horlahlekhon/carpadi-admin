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
import Button from '../../../components/shared/Button'
import Image from 'next/image'
import { withStyles } from '@material-ui/styles'
import { Add } from '@material-ui/icons'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { retrieveSingleBuying } from '../../../services/market'
import { formatNumber, trimString } from '../../../helpers/formatters'
import CPToast from '../../../components/shared/CPToast'
import { uploadFile } from '../../../services/upload'
import { UploadTypes } from '../../../lib/enums'
import Loader from '../../../components/layouts/core/Loader'

function SalesProfilePage({ pageId }) {
  const refKeyFeature = {
    name: '',
    feature_images: []
  }
  const router = useRouter()
  const [saleId, setSaleId] = useState(null)
  const [state, setState] = useState({
    saleActive: false
  })
  const [modalOpen, setModalState] = useState(false)
  const [modalView, setModalView] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [sale, setSale] = useState({
    id: null,
    product_images: [],
    car_features: [],
    highlight: null,
    trade: null,
    created: null,
    modified: null,
    selling_price: '0',
    status: null,
    car: null
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [keyFeature, setKeyFeature] = useState(refKeyFeature)
  const [saleImage, setSaleImage] = useState('')
  const [kfIdx, setKFIdx] = useState(0)
  const [sfIdx, setSFIdx] = useState(0)
  const [pageLoading, setPageLoading] = useState(false)
  const [newImages, setNewImages] = useState([])

  const hiddenFileInput2 = useRef(null)
  const hiddenFileInput3 = useRef(null)

  const showModal = (viewName: string, title: string) => {
    setModalView(viewName)
    setModalTitle(title)
    setModalState(true)
  }

  const handleFileChange2 = (event) => {
    const fileUploaded = event.target.files[0]
    uploadFile(fileUploaded, UploadTypes.CAR_FEATURE, sale?.car?.id)
      .then((res) => {
        if (res.status) {
          const url = res.data.secure_url
          const obj = { ...sale }
          obj.car_features[kfIdx].feature_images.push(url)
          setSale(obj)
        } else {
          toast.error(res.data)
        }
      })
      .catch((error) => {
        toast.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleFileChange3 = (event) => {
    const fileUploaded = event.target.files[0]
    uploadFile(fileUploaded, UploadTypes.CAR_PRODUCT, sale?.car?.id)
      .then((res) => {
        if (res.status) {
          const url = res.data.secure_url
          const obj = { ...sale }
          obj.product_images[sfIdx] = url
          setSale(obj)
          setNewImages([...newImages, url])
        } else {
          toast.error(res.data)
        }
      })
      .catch((error) => {
        toast.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

  const handleNavigation = (action: string) => {
    router.push(`${action}`)
  }

  function nextImage() {
    if (carouselIdx < sale.product_images.length - 1) {
      setCarouselIdx(carouselIdx + 1)
    }
  }

  function prevImage() {
    if (carouselIdx > 0) {
      setCarouselIdx(carouselIdx - 1)
    }
  }

  const getSale = (id) => {
    if (id !== null && id !== undefined && id !== '') {
      setPageLoading(true)
      retrieveSingleBuying(id)
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

  function handleSaleChange(key: string, value: string) {
    let obj = { ...sale }
    obj[key] = value
    setSale(obj)
  }

  const addKeyfeature = () => {
    const obj = { ...sale }
    obj['car_features'] = [...obj?.car_features, keyFeature]
    setSale(obj)
    setKeyFeature(refKeyFeature)
  }

  const addSaleImage = () => {
    const obj = { ...sale }
    obj['product_images'] = [...obj?.product_images, saleImage]
    setSale(obj)
    setSaleImage('')
  }

  function deleteKfImage(idx, url) {
    const obj = { ...sale }
    const cf = obj?.car_features?.filter((a) => !a.feature_images.includes(url))
    obj['car_features'] = cf
    setSale(obj)
  }

  function deleteSaleImage(idx, url) {
    const obj = { ...sale }
    obj['product_images'] = obj?.product_images.filter((a) => a !== url)
    setSale(obj)
  }

  function addKfImage(idx) {
    setKFIdx(idx)
    hiddenFileInput2.current.click()
  }

  function addSFImage(idx) {
    setSFIdx(idx)
    hiddenFileInput3.current.click()
  }

  function updateKeyFeature(idx: number, field: string, value: string) {
    const obj = { ...sale }
    obj.car_features[idx].name = value
    setSale(obj)
  }

  return (
    <MainLayout>
      <Container>
        <CPToast />
        {!pageLoading && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={hiddenFileInput2}
              onChange={handleFileChange2}
              style={{ display: 'none' }}
            />
            <input
              type="file"
              accept="image/*"
              ref={hiddenFileInput3}
              onChange={handleFileChange3}
              style={{ display: 'none' }}
            />

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
              <PriceSection container spacing={3}>
                <Grid item xs={6}>
                  <VehicleDetails>
                    <img
                      loading="lazy"
                      src={
                        sale?.product_images.length > 0
                          ? sale.product_images[0]
                          : null
                      }
                      alt={sale?.car?.make}
                      height={135}
                      width={185}
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
                        {trimString(sale?.car?.id)}
                      </Typography>
                      <Typography variant="h6">
                        {sale?.car?.make} {sale?.car?.model}
                      </Typography>
                    </div>
                  </VehicleDetails>
                </Grid>
                <Grid item xs={6}>
                  <PriceCard>
                    <div>Selling Price</div>
                    <Typography variant="h4">
                      &#8358; {formatNumber(sale?.selling_price)}
                    </Typography>
                  </PriceCard>
                </Grid>
              </PriceSection>
              <SalesStatus>
                <Typography variant="h6" className="status">
                  Sales Status
                </Typography>
                <div className="cta">
                  <span>Set As Active</span>
                  <Switch
                    checked={state.saleActive}
                    onChange={handleChange}
                    name="saleActive"
                    color="primary"
                    disabled={true}
                  ></Switch>
                </div>
              </SalesStatus>
              <Typography variant="h6" color="secondary">
                Car Sales Highlight
              </Typography>
              <p style={{ marginBottom: 40 }}>{sale?.highlight}</p>
              <Typography variant="h6" color="secondary">
                Car Sales Image
              </Typography>
              <Flex>
                <div className="slideshow" style={{ width: '500px' }}>
                  <img
                    loading="lazy"
                    className="main"
                    src={
                      sale?.product_images.length > 0
                        ? sale.product_images[carouselIdx]
                        : null
                    }
                    height={403}
                    width={558}
                    style={{ borderRadius: '14px' }}
                    alt={sale?.status + ' sale'}
                  />
                  <img
                    loading="lazy"
                    src="/images/Previous-Slideshow.png"
                    alt="Prev"
                    className="previous"
                    onClick={prevImage}
                  />
                  <img
                    loading="lazy"
                    src="/images/Next-Slideshow.png"
                    alt="Next"
                    className="next"
                    onClick={nextImage}
                  />
                </div>
                <div className="gallery">
                  <ImageGrid>
                    {sale?.product_images.map((img, idx) => (
                      <img
                        loading="lazy"
                        key={idx}
                        src={img}
                        className="image"
                      />
                    ))}
                  </ImageGrid>
                </div>
              </Flex>
              <Typography variant="h6" color="secondary">
                Key Features
              </Typography>
              <Features>
                {sale?.car_features.map((ft, idx) => (
                  <div className="key-features" key={idx}>
                    <img
                      loading="lazy"
                      src={
                        ft?.feature_images.length > 0
                          ? ft.feature_images[0]
                          : null
                      }
                      alt={ft?.name + 'feature image'}
                    />
                    <Typography variant="subtitle1" className="text">
                      {ft?.name || 'NA'}
                    </Typography>
                  </div>
                ))}
              </Features>
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
                  <Image
                    src="/icons/Cancel-Black.svg"
                    width={25}
                    height={25}
                    onClick={() => setModalState(false)}
                    style={{ cursor: 'pointer' }}
                  />
                </ModalBodyHeader>
                <Typography variant="inherit" style={{ marginBottom: 20 }}>
                  {modalTitle !== ''
                    ? ' Kindly provide the following information below.'
                    : ''}{' '}
                  &nbsp;
                </Typography>
                {modalView === 'editDetails' && (
                  <>
                    <HeaderText variant="inherit" style={{ marginTop: '40px' }}>
                      Sales For
                    </HeaderText>
                    <InfoSection container spacing={3}>
                      <Grid item xs={12}>
                        <VehicleDetails style={{ width: 700 }}>
                          <img
                            loading="lazy"
                            src={
                              sale?.product_images.length > 0
                                ? sale.product_images[0]
                                : null
                            }
                            alt="Sales Image"
                            width={185}
                            height={135}
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
                              {trimString(sale?.car?.id)}
                            </Typography>
                            <Typography variant="h6">
                              {sale?.car?.make} {sale?.car?.model}{' '}
                              {sale?.car?.year}
                            </Typography>
                          </div>
                        </VehicleDetails>
                      </Grid>
                    </InfoSection>
                    <HeaderText style={{ marginBottom: 16 }}>
                      Car Sales Highlight
                    </HeaderText>
                    <TextField
                      fullWidth
                      placeholder="Accident free | full customs duty paid | good history report ..."
                      value={sale?.highlight}
                      onChange={(e) =>
                        handleSaleChange('highlight', e.target.value)
                      }
                    ></TextField>

                    <FlexRow
                      style={{
                        marginBottom: 50,
                        marginTop: 40,
                        alignItems: 'start'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <HeaderText
                          variant="inherit"
                          style={{ marginBottom: 14 }}
                        >
                          Selling Price
                        </HeaderText>
                        <FlexRow>
                          <div className="currency-box">&#8358;</div>
                          <TextField
                            placeholder="Enter price"
                            style={{ width: 400 }}
                            type="text"
                            value={sale?.selling_price}
                            onChange={(e) =>
                              handleSaleChange('selling_price', e.target.value)
                            }
                          ></TextField>
                        </FlexRow>
                      </div>
                      <SalesStatus
                        className="stacked"
                        style={{ marginLeft: 'auto' }}
                      >
                        <HeaderText className="status">Sales Status</HeaderText>
                        <div className="cta">
                          <span>Set As Active</span>
                          <Switch
                            checked={state.saleActive}
                            onChange={handleChange}
                            name="saleActive"
                            color="primary"
                          ></Switch>
                        </div>
                      </SalesStatus>
                    </FlexRow>
                  </>
                )}
                {modalView === 'editImages' && (
                  <>
                    <HeaderText variant="inherit" style={{ marginTop: '40px' }}>
                      Sales For
                    </HeaderText>
                    <InfoSection container spacing={3}>
                      <Grid item xs={12}>
                        <VehicleDetails style={{ width: 700 }}>
                          <img
                            loading="lazy"
                            src={
                              sale?.product_images.length > 0
                                ? sale?.product_images[0]
                                : null
                            }
                            alt="Sale Image"
                            width={185}
                            height={135}
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
                              {trimString(sale?.car?.id)}
                            </Typography>
                            <Typography variant="h6">
                              {sale?.car?.make} {sale?.car?.model}{' '}
                              {sale?.car?.year}
                            </Typography>
                          </div>
                        </VehicleDetails>
                      </Grid>
                    </InfoSection>
                    <FlexRow style={{ marginBottom: 20 }}>
                      <HeaderText>Key Features</HeaderText>
                      <IconPill onClick={() => addKeyfeature()}>
                        Add key feature
                        <Add className="icon" />
                      </IconPill>
                    </FlexRow>
                    {sale?.car_features.map((cf, idx) => (
                      <InputGrid key={idx}>
                        <TextField
                          className="text-field"
                          fullWidth
                          placeholder={`Key Feature ${idx + 1}`}
                          value={sale?.car_features[idx]?.name}
                          onChange={(e) =>
                            updateKeyFeature(idx, 'name', e.target.value)
                          }
                        />
                        <div className="input">
                          <div className="text">
                            {sale?.car_features[idx]?.feature_images.length > 0
                              ? trimString(
                                  sale?.car_features[idx]?.feature_images[0]
                                )
                              : 'Upload Image'}
                          </div>
                          <Button
                            text={
                              sale?.car_features[idx]?.feature_images.length > 0
                                ? 'Delete'
                                : 'Upload'
                            }
                            outlined={true}
                            width={71}
                            height={28}
                            borderRadius="8px"
                            bgColor={
                              sale?.car_features[idx]?.feature_images.length > 0
                                ? t.alertError
                                : ''
                            }
                            onClick={() =>
                              sale?.car_features[idx]?.feature_images.length > 0
                                ? deleteKfImage(
                                    idx,
                                    sale?.car_features[idx]?.feature_images[0]
                                  )
                                : addKfImage(idx)
                            }
                          />
                        </div>
                      </InputGrid>
                    ))}
                    <FlexRow style={{ marginBottom: 20, marginTop: 60 }}>
                      <HeaderText>Car Sales Image</HeaderText>
                      <IconPill onClick={() => addSaleImage()}>
                        Add Image
                        <Add className="icon" />
                      </IconPill>
                    </FlexRow>
                    <InputGrid>
                      {sale?.product_images.map((si, idx) => (
                        <div className="input" key={idx}>
                          <div className="text">
                            {si !== '' ? trimString(si, 12) : 'Upload Image'}
                          </div>
                          <Button
                            text={si !== '' ? 'Delete' : 'Upload'}
                            outlined={true}
                            width={71}
                            height={28}
                            bgColor={si !== '' ? t.alertError : ''}
                            borderRadius="8px"
                            onClick={() =>
                              si !== ''
                                ? deleteSaleImage(idx, si)
                                : addSFImage(idx)
                            }
                          />
                        </div>
                      ))}
                    </InputGrid>
                    <Button
                      text="Proceed"
                      width={510}
                      marginLeft="auto"
                      marginRight="auto"
                      marginTop={50}
                      onClick={() =>
                        showModal('imagesPreview', 'Car Sales Image Preview')
                      }
                    />
                  </>
                )}
                {modalView === 'imagesPreview' && (
                  <>
                    <HeaderText variant="inherit" style={{ marginTop: '40px' }}>
                      Sale For
                    </HeaderText>
                    <InfoSection container spacing={3}>
                      <Grid item xs={12}>
                        <VehicleDetails style={{ width: 700 }}>
                          <img
                            loading="lazy"
                            src={
                              sale?.product_images.length > 0
                                ? sale?.product_images[0]
                                : null
                            }
                            alt="Sale Image"
                            width={185}
                            height={135}
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
                              {trimString(sale?.car?.id)}
                            </Typography>
                            <Typography variant="h6">
                              {sale?.car?.make} {sale?.car?.model}{' '}
                              {sale?.car?.year}
                            </Typography>
                          </div>
                        </VehicleDetails>
                      </Grid>
                    </InfoSection>
                    <Typography variant="h6" color="secondary">
                      Key Features
                    </Typography>
                    <Features className="modal">
                      {sale?.car_features.map((ft, idx) => (
                        <div className="key-features" key={idx}>
                          <img
                            loading="lazy"
                            src={
                              ft?.feature_images.length > 0
                                ? ft?.feature_images[0]
                                : null
                            }
                            alt={ft?.name + ' Feature'}
                          />
                          <Typography variant="subtitle1" className="text">
                            {ft?.name}
                          </Typography>
                        </div>
                      ))}
                    </Features>
                    <Typography variant="h6" color="secondary">
                      Car Sales Image
                    </Typography>
                    <Flex>
                      <div className="gallery">
                        <ImageGrid className="modal">
                          {sale?.product_images.map((url, idx) => (
                            <img
                              loading="lazy"
                              key={idx}
                              src={url}
                              className="image modal"
                            />
                          ))}
                        </ImageGrid>
                      </div>
                    </Flex>
                  </>
                )}
                {modalView === 'deleteSale' && (
                  <>
                    <Info>
                      <img
                        loading="lazy"
                        src="/icons/Trash-Red.svg"
                        alt="Trash"
                        height={40}
                        width={40}
                      />
                      <Typography
                        variant="h6"
                        style={{ marginTop: 48, marginBottom: 16 }}
                      >
                        Delete Car Sales Profile
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ maxWidth: 206, marginBottom: 39 }}
                      >
                        You are about to delete this vehicle sales profile.
                      </Typography>
                    </Info>
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

const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 36px 26px;
  background-color: ${t.white};
  border-radius: 12px;
  margin-top: 17px;
`

const VehicleDetails = styled.div`
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

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 40px;
  margin-top: 16px;

  .slideshow {
    min-width: fit-content;
    min-height: 300px;
    margin-right: 20px;
    position: relative;
    height: fit-content;

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

const Features = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 40px;
  margin-top: 16px;

  .key-features {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    img {
      height: 200px;
      width: 200px;
      object-fit: cover;
      border-radius: 0;
      margin-bottom: 14px;
      margin-right: 24px;
    }

    .text {
      color: ${t.grey};
    }
  }

  &.modal {
    max-width: 900px;
  }
`

const ImageGrid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .image {
    margin-right: 14px;
    margin-bottom: 14px;
    object-fit: cover;
    border-radius: 14px;
    height: 145px;
    width: 145px;
  }

  &.modal {
    max-width: 900px;

    .image {
      width: 200px;
      height: 200px;
      margin-right: 24px;
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

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 24px;
  padding: 8px;
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
