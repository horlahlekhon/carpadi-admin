import MainLayout from '../../components/layouts/MainLayout'
import styled from 'styled-components'
import {Grid, Typography, Paper, Modal, TextField} from '@material-ui/core'
import {t} from '../../styles/theme'
import {useRouter} from 'next/router'
import Button from '../../components/shared/Button'
import Image from 'next/image'
import {withStyles} from '@material-ui/styles'
import ToggleSwitch from '../../components/shared/ToggleSwitch'
import {Add} from '@material-ui/icons'
import {useEffect, useState} from 'react'
import {deleteCar, retrieveSingleCar} from "../../services/car";
import {toast} from "react-hot-toast";
import {deleteSale, retrieveSingleSale} from "../../services/sale";
import {trimString} from "../../helpers/formatters";
import CPToast from "../../components/shared/CPToast";

function SalesProfilePage() {
    const router = useRouter()
    const [saleId, setSaleId] = useState(null)
    const [state, setState] = useState({
        saleActive: false
    })
    const [modalOpen, setModalState] = useState(false)
    const [modalView, setModalView] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [sale, setSale] = useState({
        "id": null,
        "product_images": [],
        "car_features": [],
        "highlight": null,
        "trade": null,
        "created": null,
        "modified": null,
        "selling_price": "0",
        "status": null,
        "car": null
    })
    const [isSaving, setIsSaving] = useState(false)
    const [carouselIdx, setCarouselIdx] = useState(0)

    const showModal = (viewName: string, title: string) => {
        setModalView(viewName)
        setModalTitle(title)
        setModalState(true)
    }

    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.checked})
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

    function deleteSaleProfile() {
        setIsSaving(true)
        deleteSale(saleId)
            .then((res) => {
                if (res.status) {
                    toast.success('Deleted Successfully!')
                    handleNavigation(`/sales`)
                } else {
                    toast.error(res.data)
                }
            })
            .catch((error) => [
                toast.error(error)
            ])
            .finally(() => {
                setIsSaving(false)
                setModalState(false)
            })
    }

    const getSale = (id) => {
        if (id !== null && id !== undefined && id !== '') {
            retrieveSingleSale(id)
                .then((response) => {
                        if (response.status) {
                            setSale(response.data)
                            if (response.data?.status === 'active') {
                                setState({...state, saleActive: true})
                            }
                        } else {
                            toast.error(response.data)
                        }
                    }
                )
                .catch((error) => {
                    toast.error(error.data)
                })
        }
    }

    useEffect(() => {
        setSaleId(String(router.query.id))
        getSale(String(router.query.id))
    }, [])

    return (
        <Container>
            <CPToast/>
            <Header>
                <Typography variant="h4">
                    <b>{trimString(saleId)}</b>
                </Typography>
            </Header>
            <Breadcrumbs>
                <img
                    src="/icons/Vehicle-Blue.svg"
                    width={'20px'}
                    height={'18px'}
                    style={{marginRight: '12px'}}
                />
                <div
                    onClick={() => {
                        handleNavigation('/sales')
                    }}
                >
                    <span className="text">Selling</span>
                    <span className="separator"></span>
                </div>
                <div
                    onClick={() => {
                        handleNavigation(`sales/${saleId}`)
                    }}
                >
                    <span className="text">{trimString(saleId)}</span>
                    <span className="separator"></span>
                </div>
            </Breadcrumbs>
            <Body>
                <ActionBar>
                    <div className="vehicle-info">
                        <Image src="/images/Toyota-Full.png" height={11} width={40}/>
                        <Typography variant="h5" style={{marginLeft: 20}}>
                            NA
                        </Typography>
                    </div>
                    <div className="button-group">
                        <Button
                            text="Vehicle Inspection Report"
                            width={210}
                            outlined={true}
                            marginRight="16px"
                        />
                        <Button
                            text="Delete Sales Profile"
                            width={160}
                            outlined={true}
                            marginRight="16px"
                            bgColor={t.alertError}
                            onClick={() => {
                                showModal('deleteSale', '')
                            }}
                        />
                        <Button
                            text="Edit Images"
                            width={150}
                            outlined={true}
                            marginRight="16px"
                            onClick={() => showModal('editImages', 'Edit Car Sales Images')}
                        />
                        <Button
                            text="Edit Details"
                            width={150}
                            outlined={true}
                            onClick={() => showModal('editDetails', 'Edit Car Sales Details')}
                        />
                    </div>
                </ActionBar>
                <PriceSection container spacing={3}>
                    <Grid item xs={6}>
                        <VehicleDetails>
                            <Image
                                src="/images/Big-Default-Car.png"
                                height={135}
                                width={185}
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
                                    Trade ID NA
                                </Typography>
                                <Typography variant="h6">NA</Typography>
                            </div>
                        </VehicleDetails>
                    </Grid>
                    <Grid item xs={6}>
                        <PriceCard>
                            <div>Selling Price</div>
                            <Typography variant="h4">&#8358; NA</Typography>
                        </PriceCard>
                    </Grid>
                </PriceSection>
                <SalesStatus>
                    <Typography variant="h6" className="status">
                        Sales Status
                    </Typography>
                    <div className="cta">
                        <span>Set As Active</span>
                        <ToggleSwitch
                            checked={state.saleActive}
                            onChange={handleChange}
                            name="saleActive"
                        />
                    </div>
                </SalesStatus>
                <Typography variant="h6" color="secondary">
                    Car Sales Highlight
                </Typography>
                <p style={{marginBottom: 40}}>
                    {sale?.highlight}
                </p>
                <Typography variant="h6" color="secondary">
                    Car Sales Image
                </Typography>
                <Flex>
                    <div className="slideshow">
                        <img
                            className="main"
                            src={sale?.product_images.length > 0 ? sale.product_images[carouselIdx] : null}
                            height={403}
                            width={558}
                            style={{borderRadius: '14px'}}
                            alt={sale?.status + ' sale'}
                        />
                        <img
                            src="/images/Previous-Slideshow.png"
                            alt="Prev"
                            className="previous"
                            onClick={prevImage}
                        />
                        <img src="/images/Next-Slideshow.png" alt="Next" className="next" onClick={nextImage}/>
                    </div>
                    <div className="gallery">
                        <ImageGrid>
                            {sale?.product_images.map((img, idx) => (
                                <img key={idx} src={img} className="image"/>
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
                            <img src={ft?.feature_images.length > 0 ? ft.feature_images[0] : null}
                                 alt={ft?.name + ' image'}/>
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
                            ? ' Kindly provide the following information below.'
                            : ''}{' '}
                        &nbsp;
                    </Typography>
                    {modalView === 'editDetails' && (
                        <>
                            <HeaderText variant="inherit" style={{marginTop: '40px'}}>
                                Sales For
                            </HeaderText>
                            <InfoSection container spacing={3}>
                                <Grid item xs={12}>
                                    <VehicleDetails style={{width: 700}}>
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
                                                Trade ID 09890
                                            </Typography>
                                            <Typography variant="h6">Toyota Rav4 2020</Typography>
                                        </div>
                                    </VehicleDetails>
                                </Grid>
                            </InfoSection>
                            <HeaderText style={{marginBottom: 16}}>
                                Car Sales Highlight
                            </HeaderText>
                            <TextField
                                fullWidth
                                placeholder="Accident free | full customs duty paid | good history report ..."
                            ></TextField>

                            <FlexRow
                                style={{marginBottom: 50, marginTop: 40, alignItems: 'start'}}
                            >
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <HeaderText variant="inherit" style={{marginBottom: 14}}>
                                        Selling Price
                                    </HeaderText>
                                    <FlexRow>
                                        <div className="currency-box">&#8358;</div>
                                        <TextField
                                            placeholder="Enter price"
                                            style={{width: 400}}
                                        ></TextField>
                                    </FlexRow>
                                </div>
                                <SalesStatus className="stacked" style={{marginLeft: 'auto'}}>
                                    <HeaderText className="status">Sales Status</HeaderText>
                                    <div className="cta">
                                        <span>Set As Active</span>
                                        <ToggleSwitch
                                            checked={state.saleActive}
                                            onChange={handleChange}
                                            name="saleActive"
                                        />
                                    </div>
                                </SalesStatus>
                            </FlexRow>
                            <Button
                                text="Save Changes"
                                width={510}
                                marginLeft="auto"
                                marginRight="auto"
                                onClick={() => setModalState(false)}
                            />
                        </>
                    )}
                    {modalView === 'editImages' && (
                        <>
                            <HeaderText variant="inherit" style={{marginTop: '40px'}}>
                                Sales For
                            </HeaderText>
                            <InfoSection container spacing={3}>
                                <Grid item xs={12}>
                                    <VehicleDetails style={{width: 700}}>
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
                                                Trade ID 09890
                                            </Typography>
                                            <Typography variant="h6">Toyota Rav4 2020</Typography>
                                        </div>
                                    </VehicleDetails>
                                </Grid>
                            </InfoSection>
                            <FlexRow style={{marginBottom: 20}}>
                                <HeaderText>Key Features</HeaderText>
                                <IconPill>
                                    Add key feature
                                    <Add className="icon"/>
                                </IconPill>
                            </FlexRow>
                            <InputGrid>
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="Key Feature 1"
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
                            <InputGrid>
                                <TextField
                                    className="text-field"
                                    fullWidth
                                    placeholder="Key Feature 2"
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
                            <FlexRow style={{marginBottom: 20, marginTop: 60}}>
                                <HeaderText>Car Sales Image</HeaderText>
                                <IconPill>
                                    Add Image
                                    <Add className="icon"/>
                                </IconPill>
                            </FlexRow>
                            <InputGrid>
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
                            <InputGrid>
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
                            <InputGrid>
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
                            <HeaderText variant="inherit" style={{marginTop: '40px'}}>
                                Sales For
                            </HeaderText>
                            <InfoSection container spacing={3}>
                                <Grid item xs={12}>
                                    <VehicleDetails style={{width: 700}}>
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
                                                Trade ID 09890
                                            </Typography>
                                            <Typography variant="h6">Toyota Rav4 2020</Typography>
                                        </div>
                                    </VehicleDetails>
                                </Grid>
                            </InfoSection>
                            <Typography variant="h6" color="secondary">
                                Key Features
                            </Typography>
                            <Features className="modal">
                                <div className="key-features">
                                    <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                    <Typography variant="subtitle1" className="text">
                                        Leather Seats
                                    </Typography>
                                </div>
                                <div className="key-features">
                                    <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                    <Typography variant="subtitle1" className="text">
                                        Leather Seats
                                    </Typography>
                                </div>
                                <div className="key-features">
                                    <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                    <Typography variant="subtitle1" className="text">
                                        Leather Seats
                                    </Typography>
                                </div>
                                <div className="key-features">
                                    <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                    <Typography variant="subtitle1" className="text">
                                        Leather Seats
                                    </Typography>
                                </div>
                                <div className="key-features">
                                    <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                    <Typography variant="subtitle1" className="text">
                                        Leather Seats
                                    </Typography>
                                </div>
                                <div className="key-features">
                                    <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                    <Typography variant="subtitle1" className="text">
                                        Leather Seats
                                    </Typography>
                                </div>
                                <div className="key-features">
                                    <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                    <Typography variant="subtitle1" className="text">
                                        Leather Seats
                                    </Typography>
                                </div>
                                <div className="key-features">
                                    <img src="/images/Big-Default-Car.png" alt="Feature"/>
                                    <Typography variant="subtitle1" className="text">
                                        Leather Seats
                                    </Typography>
                                </div>
                            </Features>
                            <Typography variant="h6" color="secondary">
                                Car Sales Image
                            </Typography>
                            <Flex>
                                <div className="gallery">
                                    <ImageGrid className="modal">
                                        <img
                                            src="/images/FullSize-Default-Car.png"
                                            className="image modal"
                                        />
                                        <img
                                            src="/images/FullSize-Default-Car.png"
                                            className="image modal"
                                        />
                                        <img
                                            src="/images/FullSize-Default-Car.png"
                                            className="image modal"
                                        />
                                        <img
                                            src="/images/FullSize-Default-Car.png"
                                            className="image modal"
                                        />
                                        <img
                                            src="/images/FullSize-Default-Car.png"
                                            className="image modal"
                                        />
                                        <img
                                            src="/images/FullSize-Default-Car.png"
                                            className="image modal"
                                        />
                                        <img
                                            src="/images/FullSize-Default-Car.png"
                                            className="image modal"
                                        />
                                        <img
                                            src="/images/FullSize-Default-Car.png"
                                            className="image modal"
                                        />
                                    </ImageGrid>
                                </div>
                            </Flex>
                            <Button
                                text="Save Changes"
                                width={510}
                                marginLeft="auto"
                                marginRight="auto"
                                marginTop={50}
                                onClick={() => setModalState(false)}
                            />
                        </>
                    )}
                    {modalView === 'deleteSale' && (
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
                                    Delete Car Sales Profile
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    style={{maxWidth: 206, marginBottom: 39}}
                                >
                                    You are about to delete this vehicle sales profile.
                                </Typography>
                                <Button
                                    text={isSaving ? "Deleting ..." : "Yes, Delete"}
                                    width={174}
                                    onClick={deleteSaleProfile}
                                />
                            </Info>
                        </>
                    )}
                </ModalBody>
            </Modal>
        </Container>
    )
}

export default SalesProfilePage

SalesProfilePage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

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
    elevation1: {boxShadow: 'none'},
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

        .next, .prev {

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
  padding: 8 12px;
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
