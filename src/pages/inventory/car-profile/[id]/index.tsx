import MainLayout from '../../../../components/layouts/MainLayout'
import styled from 'styled-components'
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography
} from '@material-ui/core'
import { t } from '../../../../styles/theme'
import { useRouter } from 'next/router'
import Button from '../../../../components/shared/Button'
import Image from 'next/image'
import { withStyles } from '@material-ui/styles'
import { useEffect, useRef, useState } from 'react'
import Checkbox from '../../../../components/shared/Checkbox'
import { toast } from 'react-hot-toast'
import {
  formatDate,
  formatNumber,
  humanReadableDate,
  trimString
} from '../../../../helpers/formatters'
import {
  deleteCar,
  retrieveSingleCar,
  updateCar
} from '../../../../services/car'
import {
  CarStates,
  CarTransmissionTypes,
  FuelTypes,
  InspectionStates,
  RequiredCarDocuments,
  UploadTypes
} from '../../../../lib/enums'
import CreateTrade from '../../../../components/shared/CreateTrade'
import CPToast from '../../../../components/shared/CPToast'
import { resizeFile, uploadFile } from '../../../../services/upload'
import { updateVehicle } from '../../../../services/vehicle'
import CreateSale from '../../../../components/shared/CreateSale'
import {
  createInspection,
  retrieveInspection,
  retrieveInspectors
} from '../../../../services/inspection'
import { getColorName } from '../../../../helpers/utils'
import Moment from 'moment'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Add } from '@material-ui/icons'
import {
  createCarDocument,
  deleteCarDocument,
  retrieveCarDocuments,
  updateCarDocument
} from '../../../../services/car-documents'
import Loader from '../../../../components/layouts/core/Loader'
import _ from 'lodash'
import ColorPickerDropdown from '../../../../components/charts/ColorPickerDropdown'

function CarProfilePage({ pageId }) {
  const carDocuments = [
    {
      asset: null,
      name: 'Proof of ownership',
      description: 'Proof of ownership',
      car: null,
      is_preloaded: true,
      document_type: RequiredCarDocuments.ProofOfOwnership
    },
    {
      asset: null,
      name: 'Allocation of plate number',
      description: 'Allocation of plate number',
      car: null,
      is_preloaded: true,
      document_type: RequiredCarDocuments.AllocationOfLicensePlate
    },
    {
      asset: null,
      name: 'Vehicle license',
      description: 'Vehicle license',
      car: null,
      is_preloaded: true,
      document_type: RequiredCarDocuments.VehicleLicense
    },
    {
      asset: null,
      name: 'Customs paper/Receipt of purchase',
      description: 'Customs paper/Receipt of purchase',
      car: null,
      is_preloaded: true,
      document_type: RequiredCarDocuments.CustomPapersOrPurchaseReceipt
    },
    {
      asset: null,
      name: 'Police CMR',
      description: 'Police CMR',
      car: null,
      is_preloaded: true,
      document_type: RequiredCarDocuments.PoliceCMR
    },
    {
      asset: null,
      name: 'Insurance',
      description: 'Insurance',
      car: null,
      is_preloaded: true,
      document_type: RequiredCarDocuments.Insurance
    },
    {
      asset: null,
      name: 'Road worthiness',
      description: 'Road worthiness',
      car: null,
      is_preloaded: true,
      document_type: RequiredCarDocuments.RoadWorthiness
    },
    {
      asset: null,
      name: 'Owner Information',
      description: 'Owner Information',
      car: null,
      is_preloaded: true,
      document_type: RequiredCarDocuments.OwnerInformation
    }
  ]
  const router = useRouter()
  const [carId, setCarId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [createTrade, setCreateTrade] = useState(false)
  const status = String(router.query.status).toLowerCase() || 'NA'
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
  const [editedCar, setEditedCarData] = useState({})
  const [editedVehicle, setEditedVehicleData] = useState({})
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
  const [modalOpen, setModalState] = useState(false)
  const [modalView, setModalView] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [modalTagline, setModalTagline] = useState(
    ' Kindly provide the following information below.'
  )
  const [createSale, setCreateSale] = useState(false)
  const [documentValue, setDocumentValue] = useState(null)
  const [docIdx, setDocIdx] = useState(null)
  const [vehicleDocuments, setVehicleDocuments] = useState([])
  const [inspectorList, setInspectors] = useState([])
  const hiddenFileInput = useRef(null)
  const hiddenFileInput2 = useRef(null)
  const [pageLoading, setPageLoading] = useState(false)
  const [inspectorId, setInspectorID] = useState(null)

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

  const handleNavigation = (action: string) => {
    router.push(`${action}`)
  }

  const handleFileClick = (event) => {
    hiddenFileInput.current.click()
  }

  const handleFileChange = (event) => {
    const fileUploaded = event.target.files
    handleFile(fileUploaded)
  }

  const handleFileChange2 = (event) => {
    const fileUploaded = event.target.files[0]
    _.debounce(
      uploadFile(fileUploaded, UploadTypes.CAR_DOCUMENT, car?.id)
        .then((res) => {
          if (res.status) {
            const url = res.data.secure_url
            let docs = [...vehicleDocuments]
            docs[docIdx]['asset'] = url
            setVehicleDocuments(docs)
          } else {
            toast.error(res.data)
          }
        })
        .catch((error) => {
          toast.error(error)
        })
        .finally(() => {
          setIsSaving(false)
        }),
      1500
    )
  }

  const handleFile = (files) => {
    let arr = Array.from(files)
    arr.forEach(async (file) => {
      const resizedFile = await resizeFile(file, {
        width: 500,
        height: 300,
        format: 'WEBP'
      })
      setIsSaving(true)
      uploadFile(resizedFile)
        .then((res) => {
          if (res.status) {
            let arr = car.pictures
            arr.push(res.data?.secure_url)
            setCarData({ ...car, pictures: arr })
          } else {
            toast.error(res.data)
          }
        })
        .catch((error) => {
          toast.error(error)
        })
        .finally(() => {
          setIsSaving(false)
        })
    })
  }

  function deleteCarProfile() {
    setIsSaving(true)
    deleteCar(carId)
      .then((res) => {
        if (res.status) {
          toast.success('Deleted Successfully!')
          handleNavigation(`/inventory`)
        } else {
          toast.error(res.data)
        }
      })
      .catch((error) => [toast.error(error)])
      .finally(() => {
        setIsSaving(false)
        setModalState(false)
      })
  }

  function nextImage() {
    if (carouselIdx < car.pictures.length - 1) {
      setCarouselIdx(carouselIdx + 1)
    }
  }

  function prevImage() {
    if (carouselIdx > 0) {
      setCarouselIdx(carouselIdx - 1)
    }
  }

  const retrieveCar = (id) => {
    if (id !== null && id !== undefined && id !== '') {
      setPageLoading(true)
      retrieveSingleCar(id)
        .then((response) => {
          if (response.status) {
            setCarData(response.data)
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

  const saveCarImages = () => {
    setIsSaving(true)
    const data = {
      car_pictures: car.pictures,
      colour: car.colour
    }
    updateCar(carId, data)
      .then((response) => {
        if (response.status) {
          toast.success('Updated Car Successfully!')
        } else {
          toast.error(response.data)
        }
      })
      .catch((error) => {
        toast.error(error)
      })
      .finally(() => {
        setIsSaving(false)
      })
  }
  const updateCarData = () => {
    setIsSaving(true)
    const data = editedCar
    const vehicleData = editedVehicle

    if (Object.keys(data).length > 0) {
      updateCar(carId, data)
        .then((response) => {
          if (response.status) {
            toast.success('Updated Car Successfully!')
          } else {
            toast.error(response.data)
          }
        })
        .catch((error) => {
          toast.error(error)
        })
        .finally(() => {
          setIsSaving(false)
        })
    }

    if (Object.keys(vehicleData).length > 0) {
      updateVehicle(car.information.id, vehicleData)
        .then((response) => {
          if (response.status) {
            toast.success('Updated Vehicle Successfully!')
          } else {
            toast.error(response.data)
          }
        })
        .catch((error) => {
          toast.error(error)
        })
        .finally(() => {
          setIsSaving(false)
        })
    }
  }

  function removePicture(url) {
    const arr = car.pictures.filter((a) => a !== url)
    setCarData({ ...car, pictures: arr })
  }

  function setColor(colorCode) {
    setCarData({ ...car, colour: colorCode })
    setEditedCarData({ ...editedCar, colour: colorCode })
  }

  function setField(fieldName, value) {
    let obj = { ...car }
    let obj2 = { ...editedCar }
    obj[fieldName] = value
    obj2[fieldName] = value
    setCarData(obj)
    setEditedCarData(obj2)
    if (
      ['transmission', 'fuel_type', 'mileage', 'age', 'description'].includes(
        fieldName
      )
    ) {
      let obj3 = { ...editedVehicle }
      obj3[fieldName] = value
      setEditedVehicleData(obj3)
    }
  }

  function setInfoField(fieldName, value) {
    if (
      ['transmission', 'fuel_type', 'mileage', 'age', 'description'].includes(
        fieldName
      )
    ) {
      let obj3 = { ...editedVehicle }
      obj3[fieldName] = value
      setEditedVehicleData(obj3)
    }
    let obj = { ...car }
    obj['information'][fieldName] = value
    setCarData(obj)
  }

  function viewInspectionReport() {
    if (car?.inspection?.id) {
      retrieveInspection(car.inspection.id)
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

  function getInspectors() {
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
          retrieveCar(String(router.query.id))
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

  const viewDocuments = () => {
    retrieveCarDocuments(car?.id)
      .then((res) => {
        if (res.status) {
          setVehicleDocuments(res?.data?.results || [])
          showModal('vehicleDocuments', 'Vehicle Documents')
        } else {
          toast.error(res.data)
        }
      })
      .catch((error) => {
        toast.error(error)
      })
  }

  const retrieveDocuments = () => {
    retrieveCarDocuments(car?.id)
      .then((res) => {
        if (res.status) {
          setVehicleDocuments(res?.data?.results || [])
        } else {
          toast.error(res.data)
        }
      })
      .catch((error) => {
        toast.error(error)
      })
  }

  const addNewDocument = () => {
    const document = {
      asset: null,
      name: '',
      description: '',
      car: null,
      document_type: RequiredCarDocuments.Others
    }
    let docs = [...vehicleDocuments, document]
    setVehicleDocuments(docs)
  }

  const addDocument = (document: any) => {
    let docs = [...vehicleDocuments]
    docs =
      docs.findIndex((a) => a?.name === document?.name) === -1
        ? [...docs, document]
        : docs
    setVehicleDocuments(docs)
  }

  const removeDocument = (document: any) => {
    let docs = [...vehicleDocuments]
    if (document?.id) {
      deleteCarDocument(document?.id)
        .then((res) => {
          if (res.status) {
            toast.success('Deleted successfully!')
          } else {
            toast.error(res.data)
          }
        })
        .catch((error) => {
          toast.error(error)
        })
        .finally(() => {
          retrieveDocuments()
        })
    } else {
      docs = docs.filter((a) => a?.name !== document?.name)
      setVehicleDocuments(docs)
    }
  }

  const updateDocumentValue = (idx: number, field: string, value: string) => {
    let docs = [...vehicleDocuments]
    docs[idx][field] = value
    docs[idx]['is_modified'] = true
    setVehicleDocuments(docs)
  }

  const uploadDocument = (idx) => {
    setDocIdx(idx)
    setIsSaving(true)
    hiddenFileInput2.current.click()
  }

  const verifyDocument = (id: any) => {
    if (id) {
      updateCarDocument(id, { is_verified: true })
        .then((res) => {
          if (res.status) {
            toast.success(`Verified successfully!`)
          } else {
            toast.error(res.data)
          }
        })
        .catch((error) => {
          toast.error(error)
        })
        .finally(() => {
          retrieveDocuments()
        })
    }
  }

  const saveDocuments = () => {
    setIsSaving(true)
    let newDocs = vehicleDocuments.filter((x) => x?.id == null)
    newDocs = newDocs.map((doc) => {
      return {
        name: doc?.name,
        description: doc?.description,
        is_verified: doc?.is_verified,
        document_type: doc?.document_type,
        asset: doc?.asset,
        car: car?.id
      }
    })
    createCarDocument(newDocs)
      .then((res) => {
        if (res.status) {
          toast.success(`Created documents`)
        } else {
          toast.error(res.data)
        }
      })
      .catch((error) => {
        toast.error(error)
      })
      .finally(() => {
        retrieveDocuments()
      })

    vehicleDocuments.forEach((doc, idx) => {
      if (doc?.id) {
        if (doc?.is_modified) {
          const d = {
            name: doc?.name,
            description: doc?.description
          }
          updateCarDocument(doc?.id, d)
            .then((res) => {
              if (res.status) {
                toast.success(`Updated ${doc?.name}`)
              } else {
                toast.error(res.data)
              }
            })
            .catch((error) => {
              toast.error(error)
            })
            .finally(() => {
              retrieveDocuments()
            })
        }
      }
      // else {
      //     const d = {
      //         name: doc?.name,
      //         description: doc?.description,
      //         is_verified: doc?.is_verified,
      //         document_type: doc?.document_type,
      //         asset: doc?.asset,
      //         car: car?.id,
      //     }
      //     createCarDocument(d)
      //         .then((res) => {
      //             if (res.status) {
      //                 toast.success(`Created ${d?.name}`)
      //             } else {
      //                 toast.error(res.data)
      //             }
      //         })
      //         .catch((error) => {
      //             toast.error(error)
      //         })
      //         .finally(() => {
      //             retrieveDocuments()
      //         })
      // }
      if (idx >= vehicleDocuments.length - 1) {
        setIsSaving(false)
        setModalState(false)
      }
    })
  }

  const downloadDocument = (resourceUrl: string) => {
    if (resourceUrl && String(resourceUrl).startsWith('http')) {
      let link = document.createElement('a')
      link.href = resourceUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      toast.dismiss()
      toast.error('Invalid image url')
    }
  }

  useEffect(() => {
    setCarId(pageId)
    retrieveCar(pageId)
  }, [])

  // @ts-ignore
  return (
    <MainLayout>
      <Container>
        <CPToast />
        {!pageLoading && (
          <>
            {createSale && (
              <CreateSale
                car={car}
                modalOpen={true}
                onClick={() => setCreateSale(false)}
              />
            )}
            {createTrade && (
              <CreateTrade car={car} onClick={() => setCreateTrade(false)} />
            )}
            <input
              type="file"
              accept="image/*,application/pdf"
              ref={hiddenFileInput2}
              onChange={handleFileChange2}
              style={{ display: 'none' }}
            />
            <Header>
              <Typography variant="h4">
                <b>{trimString(carId)}</b>
              </Typography>
            </Header>
            <Breadcrumbs>
              <img
                loading="lazy"
                src="/icons/Inventory-Black.svg"
                width={'20px'}
                height={'18px'}
                style={{ marginRight: '12px' }}
              />
              <div
                onClick={() => {
                  handleNavigation('/inventory')
                }}
              >
                <span className="text">Inventory</span>
                <span className="separator"></span>
              </div>
              <div
                onClick={() => {
                  handleNavigation('/inventory/car-listings')
                }}
              >
                <span className="text" style={{ textTransform: 'capitalize' }}>
                  {status}
                </span>
                <span className="separator"></span>
              </div>
              <div>
                <span className="text">{trimString(carId)}</span>
                <span className="separator"></span>
              </div>
            </Breadcrumbs>
            <Body>
              <ActionBar>
                <div className="vehicle-info">
                  <Image src="/images/Toyota-Full.png" height={11} width={40} alt=""/>
                  <Typography variant="h5" style={{ marginLeft: 20 }}>
                    {car?.name || 'NA'}
                  </Typography>
                </div>
                <div className="button-group">
                  {car?.inspection?.id && (
                    <Button
                      text="Inspection Report"
                      width={160}
                      outlined={true}
                      marginRight="16px"
                      disabled={!car?.inspection?.id}
                      onClick={() => viewInspectionReport()}
                    />
                  )}

                  {!car?.inspection?.id && (
                    <Button
                      text="Add Inspection Report"
                      width={210}
                      outlined={true}
                      marginRight="16px"
                      onClick={() => getInspectors()}
                    />
                  )}

                  <Button
                    text="Delete Car Profile"
                    width={160}
                    outlined={true}
                    marginRight="16px"
                    bgColor={t.alertError}
                    onClick={() => {
                      showModal('deleteCarProfile', '')
                    }}
                  />
                  <Button
                    text="Edit Images"
                    width={135}
                    outlined={true}
                    marginRight="16px"
                    onClick={() => {
                      setEditedCarData({})
                      showModal(
                        'editImages',
                        'Edit Car Images',
                        'Upload minimum of 5 images to complete profile'
                      )
                    }}
                  />
                  <Button
                    text="Edit Details"
                    width={135}
                    outlined={true}
                    marginRight="16px"
                    onClick={() => {
                      setEditedCarData({})
                      showModal('editDetails', 'Edit Car Profile')
                    }}
                  />
                  <Button
                    text="Car Documents"
                    width={150}
                    outlined={true}
                    onClick={() => {
                      viewDocuments()
                    }}
                  />
                </div>
              </ActionBar>
              <SplitContainer>
                <div className="left">
                  <Flex>
                    <div className="slideshow">
                      <img
                        loading="lazy"
                        className="main"
                        src={car.pictures[carouselIdx]}
                        height={255}
                        width="100%"
                        alt=""
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
                        {car.pictures.map((img, i) => (
                          <img
                            loading="lazy"
                            src={img}
                            className="image"
                            key={i}
                            alt={'image' + i}
                          />
                        ))}
                      </ImageGrid>
                    </div>
                    <Button
                      text="Create Sales Profile"
                      width="100%"
                      outlined={true}
                      disabled={
                        !car?.inspection ||
                        car?.inspection?.status !==
                          InspectionStates.COMPLETED ||
                        car?.status === CarStates.SOLD
                      }
                      title={
                        !car?.inspection ||
                        car?.inspection?.status !== InspectionStates.COMPLETED
                          ? 'Inspection must be completed'
                          : ''
                      }
                      onClick={() => setCreateSale(true)}
                    />
                    <Button
                      text="Maintenance Record"
                      width="100%"
                      outlined={true}
                      marginTop={16}
                      disabled={
                        !car?.inspection ||
                        car?.inspection?.status === InspectionStates.PENDING ||
                        car?.status === CarStates.SOLD
                      }
                      title={
                        !car?.inspection ||
                        car?.inspection?.status === InspectionStates.PENDING
                          ? 'Inspection must be completed'
                          : ''
                      }
                      marginBottom={30}
                      onClick={() =>
                        handleNavigation(
                          `/inventory/car-profile/${car.id}/maintenance-record?status=${status}`
                        )
                      }
                    />
                    <CheckItem
                      style={{
                        background:
                          status === 'car listings' ? t.alertSuccessLite : ''
                      }}
                    >
                      <span>Car Listings</span>
                      <Checkbox
                        color="primary"
                        checked={car.status === CarStates.NEW.valueOf()}
                        disabled
                      />
                    </CheckItem>
                    <CheckItem
                      style={{
                        background:
                          status === 'under inspection'
                            ? t.alertSuccessLite
                            : ''
                      }}
                    >
                      <span>Under Inspection</span>
                      <Checkbox
                        color="primary"
                        checked={
                          car.status === CarStates.ONGOING_INSPECTION.valueOf()
                        }
                        disabled
                      />
                    </CheckItem>
                    <CheckItem
                      style={{
                        background:
                          status === 'available for trade'
                            ? t.alertSuccessLite
                            : ''
                      }}
                    >
                      <div className="multi">
                        <span className="title">Available for Trade</span>
                        <span className="success">
                          controlled by created trade
                        </span>
                      </div>
                      <Checkbox
                        color="primary"
                        checked={
                          car.status === CarStates.AVAILABLE.valueOf() ||
                          car.status === CarStates.INSPECTED.valueOf()
                        }
                        disabled
                      />
                    </CheckItem>
                    <CheckItem
                      style={{
                        background:
                          status === 'ongoing trade' ? t.alertSuccessLite : ''
                      }}
                    >
                      <div className="multi">
                        <span className="title">Ongoing Trade</span>
                        <span className="danger">system controlled</span>
                      </div>
                      <Checkbox
                        color="primary"
                        checked={
                          car.status === CarStates.ONGOING_TRADE.valueOf()
                        }
                        disabled
                      />
                    </CheckItem>
                    <CheckItem
                      style={{
                        background: status === 'sold' ? t.alertSuccessLite : ''
                      }}
                    >
                      <div className="multi">
                        <span className="title">Sold</span>
                        <span className="danger">system controlled</span>
                      </div>
                      <Checkbox
                        color="primary"
                        checked={car.status === CarStates.SOLD.valueOf()}
                        disabled
                      />
                    </CheckItem>
                    <CheckItem
                      style={{
                        background:
                          status === 'archived' ? t.alertSuccessLite : ''
                      }}
                    >
                      <span>Add to Archived</span>
                      <Checkbox
                        color="primary"
                        checked={car.status === CarStates.ARCHIVED.valueOf()}
                        disabled
                      />
                    </CheckItem>
                  </Flex>
                </div>
                <div className="right">
                  <Detail>
                    <div className="key">Date Added</div>
                    <div className="value">
                      {humanReadableDate(car?.created)}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Vehicle ID</div>
                    <div className="value">
                      {trimString(car?.information?.id) || 'NA'}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Vehicle Identification Number</div>
                    <div className="value">{car?.vin || 'NA'}</div>
                  </Detail>
                  <Detail>
                    <div className="key">Number of Seats</div>
                    <div className="value">NA</div>
                  </Detail>
                  <Detail>
                    <div className="key">Make</div>
                    <div className="value">
                      {car?.information?.brand?.name || 'NA'}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Model</div>
                    <div className="value">
                      {car?.information?.brand?.model || 'NA'}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Year</div>
                    <div className="value">
                      {car?.information?.brand?.year || 'NA'}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Color</div>
                    <div className="value">
                      {getColorName(car?.colour) || 'NA'}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Body Type</div>
                    <div className="value">
                      {car?.information?.car_type || 'NA'}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Fuel Type</div>
                    <div className="value">
                      {car?.information?.fuel_type || 'NA'}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Transmission Type</div>
                    <div className="value">
                      {car?.information?.transmission || 'NA'}
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Current Mileage</div>
                    <div className="value">
                      {formatNumber(car?.information?.mileage) || 'NA'} Km
                    </div>
                  </Detail>
                  <Detail>
                    <div className="key">Vehicle Age</div>
                    <div className="value">
                      {formatNumber(car?.information?.age) || 'NA'}
                    </div>
                  </Detail>
                  <Detail style={{ alignItems: 'end' }}>
                    <div className="key">Description</div>
                    <div className="value" style={{ marginLeft: '25px' }}>
                      {car?.information?.description || car?.description || 'NA'}
                    </div>
                  </Detail>
                  {[
                    CarStates.NEW,
                    CarStates.ONGOING_INSPECTION,
                    CarStates.AVAILABLE,
                    CarStates.ALL,
                    CarStates.INSPECTED
                  ].includes(car?.status) && (
                    <Button
                      text="Create Trade"
                      width="100%"
                      marginTop={30}
                      disabled={
                        (car?.status !== CarStates.AVAILABLE &&
                          car?.status !== CarStates.INSPECTED &&
                          !car?.bought_price) ||
                        car?.inspection?.status !== InspectionStates.COMPLETED
                      }
                      title={
                        car?.status !== CarStates.AVAILABLE &&
                        car?.status !== CarStates.INSPECTED &&
                        !car?.bought_price
                          ? 'Vehicle should be available for trade and must have been inspected'
                          : ''
                      }
                      onClick={() => setCreateTrade(true)}
                    />
                  )}
                  {[
                    CarStates.ONGOING_TRADE,
                    CarStates.BOUGHT,
                    CarStates.SOLD
                  ].includes(car?.status) && (
                    <Button
                      text="View Trade"
                      width="100%"
                      marginTop={30}
                      onClick={() => handleNavigation(`/trade/${carId}`)}
                    />
                  )}
                </div>
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
                  <Typography variant="h5" style={{ fontWeight: 600 }}>
                    {modalTitle}
                  </Typography>
                  <Image
                    src="/icons/Cancel-Black.svg"
                    width={25}
                    height={25}
                    onClick={() => setModalState(false)}
                    style={{ cursor: 'pointer' }}
                    alt=""
                  />
                </ModalBodyHeader>
                <Typography variant="inherit" style={{ marginBottom: 20 }}>
                  {modalTitle !== '' ? modalTagline : ''} &nbsp;
                </Typography>
                {modalView === 'vehicleDocuments' && (
                  <div style={{ marginTop: '30px', marginBottom: '30px' }}>
                    <Autocomplete
                      id="combo-box-demo"
                      options={carDocuments.filter(
                        (x) =>
                          vehicleDocuments.findIndex(
                            (a) => a.name === x.name
                          ) == -1
                      )}
                      getOptionLabel={(option) => option.name}
                      style={{ width: 900, marginBottom: '20px' }}
                      value={documentValue}
                      disabled={
                        carDocuments.filter(
                          (x) =>
                            vehicleDocuments.findIndex(
                              (a) => a.name === x.name
                            ) == -1
                        ).length < 1
                      }
                      onChange={(event: any, newValue: any | null) => {
                        addDocument(newValue)
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Required Documents"
                          placeholder="Required Documents"
                          variant="outlined"
                        />
                      )}
                    />

                    <FlexRow style={{ marginBottom: 20 }}>
                      {/*<HeaderText>Documents</HeaderText>*/}
                      <IconPill onClick={() => addNewDocument()}>
                        Add Document
                        <Add className="icon" />
                      </IconPill>
                    </FlexRow>

                    {vehicleDocuments.map((doc, idx) => (
                      <div key={idx}>
                        <InputGridX key={idx}>
                          <TextField
                            className="text-field"
                            fullWidth
                            placeholder={doc?.name || `Document ${idx + 1}`}
                            label={doc?.name || `Document ${idx + 1}`}
                            value={doc?.name}
                            disabled={
                              doc?.is_preloaded ||
                              carDocuments.findIndex(
                                (a) => a?.name === doc?.name
                              ) >= 0 ||
                              doc?.is_verified
                            }
                            onChange={(e) =>
                              updateDocumentValue(idx, 'name', e.target.value)
                            }
                          />
                          <TextField
                            className="text-field"
                            fullWidth
                            placeholder={'Description'}
                            label={'Description'}
                            value={doc?.description}
                            disabled={
                              doc?.is_preloaded ||
                              carDocuments.findIndex(
                                (a) => a?.name === doc?.name
                              ) >= 0 ||
                              doc?.is_verified
                            }
                            onChange={(e) =>
                              updateDocumentValue(
                                idx,
                                'description',
                                e.target.value
                              )
                            }
                          />
                          <div className="input">
                            <Button
                              text={doc?.is_verified ? 'Verified' : 'Verify'}
                              outlined={true}
                              width={71}
                              height={28}
                              borderRadius="8px"
                              bgColor={t.alertSuccess}
                              disabled={!doc?.id || doc?.is_verified}
                              title={
                                'Document is either verified or has not been saved'
                              }
                              onClick={() => verifyDocument(doc?.id)}
                            />
                            <Button
                              text={
                                !!doc?.asset
                                  ? 'Download'
                                  : idx === docIdx && isSaving
                                  ? '...'
                                  : 'Upload'
                              }
                              outlined={true}
                              width={80}
                              height={28}
                              borderRadius="8px"
                              onClick={() =>
                                doc?.asset
                                  ? downloadDocument(doc?.asset)
                                  : uploadDocument(idx)
                              }
                            />
                            <Button
                              text={'Delete'}
                              outlined={true}
                              width={71}
                              height={28}
                              borderRadius="8px"
                              bgColor={t.alertError}
                              onClick={() => removeDocument(doc)}
                            />
                          </div>
                        </InputGridX>
                      </div>
                    ))}
                    <Button
                      text={'Save Documents'}
                      width={510}
                      marginLeft="auto"
                      marginRight="auto"
                      marginTop={40}
                      disabled={
                        isSaving ||
                        vehicleDocuments.length < 1 ||
                        vehicleDocuments.some((a) => a?.name === '') ||
                        vehicleDocuments.some((a) => a?.description === '') ||
                        vehicleDocuments.some((a) => a?.asset === null)
                      }
                      onClick={() => saveDocuments()}
                    />
                  </div>
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
                {modalView === 'editDetails' && (
                  <>
                    {/*<HeaderText style={{marginBottom: 10, marginTop: 20}}>Select Car Brand</HeaderText>*/}
                    {/*<FormControl style={{width: 330, marginBottom: 30}}>*/}
                    {/*    <Select*/}
                    {/*        value={carBrand}*/}
                    {/*        onChange={(event) =>*/}
                    {/*            setCarBrand(String(event.target.value))*/}
                    {/*        }*/}
                    {/*        displayEmpty*/}
                    {/*        inputProps={{'aria-label': 'Without label'}}*/}
                    {/*    >*/}
                    {/*        <option value="" disabled>*/}
                    {/*            Car Brand*/}
                    {/*        </option>*/}
                    {/*        <option value={'Toyota Rav4'}>Toyota Rav4</option>*/}
                    {/*        <option value={'Toyoya Sequoia'}>Toyoya Sequoia</option>*/}
                    {/*    </Select>*/}
                    {/*</FormControl>*/}
                    <HeaderText style={{ marginBottom: 10, marginTop: 10 }}>
                      Car Profile Details
                    </HeaderText>
                    <InputGrid>
                      <TextField
                        className="text-field"
                        fullWidth
                        placeholder="VIN"
                        label="VIN"
                        variant="standard"
                        value={car.vin}
                        disabled
                      />
                      <div
                        style={{
                          marginBottom: '5px',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <ColorPickerDropdown
                          onChange={setColor}
                          value={'#000'}
                        />
                        <div
                          style={{
                            width: 40,
                            height: 20,
                            backgroundColor: car?.colour,
                            marginRight: 10,
                            border: '1px solid black'
                          }}
                        />
                        <div style={{ marginLeft: '5px' }}>
                          {car?.colour !== '' && car?.colour !== null
                            ? getColorName(car?.colour)
                            : 'Color not selected'}
                        </div>
                      </div>
                    </InputGrid>
                    <InputGrid>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Transmission
                        </InputLabel>
                        <Select
                          value={car?.information?.transmission
                            .toString()
                            .toLowerCase()}
                          onChange={(event) =>
                            setInfoField('transmission', event.target.value)
                          }
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          variant="standard"
                          label="Transmission"
                          placeholder="Transmission"
                        >
                          <option value="" disabled>
                            Transmission Type
                          </option>
                          <option
                            value={CarTransmissionTypes.MANUAL}
                            selected={
                              String(
                                car?.information?.transmission
                              ).toLowerCase() ===
                              CarTransmissionTypes.MANUAL.toLowerCase()
                            }
                          >
                            Manual
                          </option>
                          <option
                            value={CarTransmissionTypes.AUTOMATIC}
                            selected={
                              String(
                                car?.information?.transmission
                              ).toLowerCase() ===
                              CarTransmissionTypes.AUTOMATIC.toLowerCase()
                            }
                          >
                            Automatic
                          </option>
                          <option
                            value={CarTransmissionTypes.STANDARD}
                            selected={
                              String(
                                car?.information?.transmission
                              ).toLowerCase() ===
                              CarTransmissionTypes.STANDARD.toLowerCase()
                            }
                          >
                            Standard
                          </option>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Fuel Type
                        </InputLabel>
                        <Select
                          value={car?.information?.fuel_type
                            .toString()
                            .toLowerCase()}
                          onChange={(event) =>
                            setInfoField('fuel_type', event.target.value)
                          }
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <option value="" disabled>
                            Fuel Type
                          </option>
                          <option
                            value={FuelTypes.PETROL}
                            selected={
                              String(
                                car?.information?.fuel_type
                              ).toLowerCase() === FuelTypes.PETROL
                            }
                          >
                            Petrol
                          </option>
                          <option
                            value={FuelTypes.DIESEL}
                            selected={
                              String(
                                car?.information?.fuel_type
                              ).toLowerCase() === FuelTypes.DIESEL
                            }
                          >
                            Diesel
                          </option>
                          <option
                            value={FuelTypes.HYBRID}
                            selected={
                              String(
                                car?.information?.fuel_type
                              ).toLowerCase() === FuelTypes.HYBRID
                            }
                          >
                            Hybrid
                          </option>
                          <option
                            value={FuelTypes.LPG}
                            selected={
                              String(
                                car?.information?.fuel_type
                              ).toLowerCase() === FuelTypes.LPG
                            }
                          >
                            LPG
                          </option>
                          <option
                            value={FuelTypes.CNG}
                            selected={
                              String(
                                car?.information?.fuel_type
                              ).toLowerCase() === FuelTypes.CNG
                            }
                          >
                            CNG
                          </option>
                          <option
                            value={FuelTypes.ELECTRIC}
                            selected={
                              String(
                                car?.information?.fuel_type
                              ).toLowerCase() === FuelTypes.ELECTRIC
                            }
                          >
                            Electric
                          </option>
                        </Select>
                      </FormControl>
                    </InputGrid>
                    <InputGrid>
                      <TextField
                        className="text-field"
                        fullWidth
                        placeholder="Vehicle Age"
                        label="Vehicle Age"
                        variant="standard"
                        value={car?.information?.age || 0}
                        onChange={(e) => setInfoField('age', e.target.value)}
                        type="text"
                      />
                      <TextField
                        className="text-field"
                        fullWidth
                        placeholder="Mileage"
                        label="Mileage"
                        variant="standard"
                        value={car?.information?.mileage || 0}
                        onChange={(e) =>
                          setInfoField('mileage', e.target.value)
                        }
                        type="text"
                      />
                    </InputGrid>
                    <InputGrid>
                      <TextField
                        className="text-field"
                        fullWidth
                        placeholder="Bought Price"
                        label="Bought Price"
                        variant="standard"
                        value={car?.bought_price || 0}
                        onChange={(e) =>
                          setField('bought_price', e.target.value)
                        }
                        type="text"
                      />
                    </InputGrid>
                    <HeaderText style={{ marginBottom: 10, marginTop: 10 }}>
                      Vehicle Description
                    </HeaderText>
                    <TextField
                      fullWidth
                      type="textfield"
                      multiline
                      rows={4}
                      placeholder="
                                A detailed vehicle description"
                      value={car?.description}
                      onChange={(e) => setField('description', e.target.value)}
                    ></TextField>
                    <Button
                      text={isSaving ? 'Saving...' : 'Save Changes'}
                      width={510}
                      marginLeft="auto"
                      marginRight="auto"
                      marginTop={40}
                      disabled={
                        isSaving ||
                        (Object.keys(editedVehicle).length < 1 &&
                          Object.keys(editedCar).length < 1)
                      }
                      onClick={() => updateCarData()}
                    />
                  </>
                )}
                {modalView === 'editImages' && (
                  <>
                    <ImageGrid
                      style={{ justifyContent: 'start', maxWidth: 745 }}
                    >
                      {car.pictures.map((url, idx) => (
                        <div className="image" key={idx}>
                          <img loading="lazy" src={url} className="image" />
                          <img
                            loading="lazy"
                            src="/icons/Delete-Circular-Green.svg"
                            className="delete"
                            onClick={() => removePicture(url)}
                          />
                        </div>
                      ))}
                    </ImageGrid>
                    <ImageUpload>
                      <div className="content">
                        <Image
                          src="/images/Upload.png"
                          alt="Upload"
                          height={38}
                          width={44}
                        />
                        <div style={{ marginTop: 10 }}>
                          Upload Vehicle Image
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          ref={hiddenFileInput}
                          multiple={true}
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                        <Button
                          text={isSaving ? 'Uploading...' : 'Upload'}
                          disabled={isSaving}
                          width={128}
                          marginTop={40}
                          onClick={() => handleFileClick(event)}
                        />
                      </div>
                    </ImageUpload>
                    <Button
                      text={isSaving ? 'Saving...' : 'Save Changes'}
                      width={510}
                      marginLeft="auto"
                      marginRight="auto"
                      marginTop={50}
                      disabled={isSaving}
                      onClick={() => saveCarImages()}
                    />
                  </>
                )}
                {modalView === 'deleteCarProfile' && (
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
                        Delete Car Profile
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        style={{ maxWidth: 206, marginBottom: 39 }}
                      >
                        You are about to delete this vehicle profile.
                      </Typography>
                      <Button
                        text={isSaving ? 'Deleting...' : 'Yes, Delete'}
                        width={174}
                        onClick={() => deleteCarProfile()}
                      />
                    </Info>
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
                              car?.pictures.length > 0 ? car.pictures[0] : null
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

export default CarProfilePage

const HeaderText = withStyles({
  root: {
    color: t.lightGrey,
    fontWeight: 'bold',
    display: 'block'
  }
})(Typography)

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
const ImageGrid = styled.div`
  //display: flex;
  //flex-direction: row;
  //flex-wrap: wrap;
  margin-top: 10px;
  //justify-content: space-between;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  .image {
    margin-bottom: 14px;
    object-fit: cover;
    border-radius: 14px;
    height: 130px;
    width: 135px;
    position: relative;

    .delete {
      position: absolute;
      right: 8px;
      top: 8px;
      cursor: pointer;
    }

    &:not(:last-child) {
      margin-right: 14px;
    }
  }

  @media screen and (max-width: 1700px) {
    grid-template-columns: 1fr 1fr 1fr;
    .image {
      width: 85%;
    }
  }

  @media screen and (max-width: 1350px) {
    grid-template-columns: 1fr 1fr;
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
const InputGridX = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 24px;
  margin-bottom: 20px;
  width: 900px;

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

    .title {
      font-weight: bold;
      color: ${t.grey};
      margin-bottom: 10px;
    }
  }

  .right {
    width: 55%;

    .title {
      font-weight: bold;
      color: ${t.grey};
      margin-bottom: 10px;
    }
  }
`
const Detail = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 15px;
  padding-bottom: 5px;
  font-size: 14px;
  border-bottom: 1px solid ${t.extraLiteGrey};
  width: 100%;

  .value {
    font-weight: bold;
  }
`
const CheckItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  font-size: 14px;
  background: ${t.extraLiteGrey};
  height: 45px;
  margin-bottom: 4px;

  .multi {
    .title {
      font-weight: bold;
    }

    .danger,
    .success {
      font-size: 12px;
      margin-left: 4px;
    }

    .danger {
      color: ${t.alertError};
    }

    .success {
      color: ${t.alertSuccess};
    }
  }
`
const ImageUpload = styled.div`
  border: 2px solid ${t.extraLiteGrey};
  border-radius: 14px;
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
const InfoSection = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '20px',
    marginTop: '8px'
  }
})(Grid)
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
