import {
  FormControl,
  InputLabel,
  Modal,
  Select,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core'
import Image from 'next/image'
import { t } from '../../styles/theme'
import Button from './Button'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import styled from 'styled-components'
import { retrieveVINDetails } from '../../services/vehicle'
import { resizeFile, uploadFile } from '../../services/upload'
import ntc from '../../lib/ntc'
import { trimString } from '../../helpers/formatters'
import { createCar } from '../../services/car'
import { createVehicle } from '../../services/vehicle'
import { UploadTypes } from '../../lib/enums'
import { getColorName } from '../../helpers/utils'
import ColorPickerDropdown from '../charts/ColorPickerDropdown'

const AddCarProfile = ({ modalOpen = true, onClick }) => {
  const router = useRouter()
  let [uploadedPictures, setUploadedPictures] = useState([])
  const [modalView, setModalView] = useState('createCarProfile')
  const [carColor, setCarColor] = useState('')
  const [transmissionType, setTransmissionType] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [seatNumber, setSeatNumber] = useState(4)
  const [vin, setVin] = useState(null)
  const [licence_plate, setPlate] = useState(null)
  const [bought_price, setPrice] = useState(null)
  const [car, setCar] = useState({
    engine: null,
    transmission: null,
    car_type: null,
    fuel_type: null,
    mileage: 0,
    age: 0,
    description: null,
    trim: null,
    year: 0,
    model: null,
    manufacturer: null,
    make: null,
    vin: vin
  })

  const [addVehicleInfo, setAddVehicleInfo] = useState({
    engine: '',
    transmission: '',
    car_type: '',
    fuel_type: fuelType,
    mileage: null,
    age: null,
    description: null,
    trim: '',
    manufacturer: '',
    vin: '',
    specifications: null,
    drive_type: '',
    last_service_date: null,
    last_service_mileage: null,
    previous_owners: null,
    num_of_cylinders: null,
    engine_power: '',
    torque: null,
    brand: {
      name: '',
      model: '',
      year: null
    }
  })

  const handleVehicleInfo = (event) => {
    setAddVehicleInfo({
      ...addVehicleInfo,
      [event.target.name]: event.target.value
    })
  }

  const [isLoading, setLoading] = useState(false)
  const [isUploading, setisUploading] = useState(false)
  const options = {
    createCarProfile: {
      title: '',
      description: ''
    },
    fetchedCarProfile: {
      title: 'Fetched Car Profile',
      description: ''
    },
    addCarInfo: {
      title: 'Add New Vehicle Information',
      description: ''
    },
    uploadCarImages: {
      title: 'Upload Car Images',
      description: 'Upload minimum of 3 images to complete profile '
    }
  }

  console.log(addVehicleInfo)
  const hiddenFileInput = useRef(null)

  const handleNavigation = (action: string) => {
    router.push(`${action}`).then(() => {})
  }

  const handleFileClick = (event) => {
    hiddenFileInput.current.click()
  }

  const handleFileChange = (event) => {
    const fileUploaded = event.target.files
    handleFile(fileUploaded)
  }

  const handleFile = (files) => {
    files = Array.from(files)
    const arr = files.map((a) => {
      return {
        secure_url: URL.createObjectURL(a),
        file: a
      }
    })
    setUploadedPictures([...uploadedPictures, ...arr])
  }

  const fetchCar = () => {
    setLoading(true)
    retrieveVINDetails(vin, { vin })
      .then((response) => {
        if (response.status) {
          setCar(response.data)
          setModalView('fetchedCarProfile')
        } else {
          toast.error(response.data)
        }
      })
      .catch((error) => {
        toast.error(error.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function removePicture(id) {
    const arr = uploadedPictures.filter((a) => a.secure_url !== id)
    setUploadedPictures(arr)
  }

  function setColor(colorCode) {
    setCarColor(colorCode)
  }

  function saveCarProfile() {
    setLoading(true)
    setisUploading(true)
    const data = {
      vin: vin,
      car_pictures: [],
      colour: carColor,
      licence_plate: licence_plate
    }
    if (bought_price) {
      data['bought_price'] = bought_price
    }
    if (uploadedPictures.length > 0) {
      uploadedPictures.forEach(async (picture) => {
        const p = await resizeFile(picture?.file, {
          width: 950,
          height: 500,
          format: 'WEBP'
        })
        // uploadFile(p, UploadTypes.CAR, vin)
        //     .then((res) => {
        //         if (res.status) {
        //             data.car_pictures.push(res.data?.secure_url)
        //         } else {
        //             toast.error(res.data)
        //         }
        //     })
        //     .catch((error) => {
        //         toast.error(error)
        //     })
        const res = await uploadFile(p, UploadTypes.CAR, vin)
        if (res.status) {
          data.car_pictures.push(res.data?.secure_url)
          if (data.car_pictures.length === uploadedPictures.length) {
            createCar(data)
              .then((response) => {
                if (response.status) {
                  toast.success('Created Successfully!')
                  onClick()
                  if (response.data?.id) {
                    handleNavigation(
                      `/inventory/car-profile/${response.data.id}?status=car listings`
                    )
                  }
                } else {
                  toast.error(response.data)
                }
              })
              .catch((error) => {
                toast.error(error)
              })
              .finally(() => {
                setisUploading(false)
                setLoading(false)
              })
          }
        } else {
          toast.error(res.data)
        }
      })
    } else {
      createCar(data)
        .then((response) => {
          if (response.status) {
            toast.success('Created Successfully!')
            onClick()
            if (response.data?.id) {
              handleNavigation(
                `/inventory/car-profile/${response.data.id}?status=car listings`
              )
            }
          } else {
            toast.error(response.data)
          }
        })
        .catch((error) => {
          toast.error(error)
        })
        .finally(() => {
          setisUploading(false)
          setLoading(false)
        })
    }
  }

  const setCarDetail = (key, value) => {
    let c = { ...car }
    c[key] = value
    setCar(c)
  }

  const createVehicleInfo = () => {
    setLoading(true);
    const data = addVehicleInfo;
    
    createVehicle(data)
      .then((response) => {
        if(response.status){
          toast.success('Created Vehicle Successfully!')
          onClick()
        }
        else{
          toast.error(response.data)
        }
      })
      .catch((error) => {
        toast.error(error)
      })
      .finally(() => {
        setLoading(false)
      })

    // const timer = setTimeout(() => {
    //   setLoading(false)
    // }, 3000); // Replace 3000 with the desired time in milliseconds

    // return () => clearTimeout(timer);


    
    // .createVehicle()
  }

  // @ts-ignore
  return (
    <>
      <Modal
        open={true}
        onClose={() => {
          onClick()
        }}
      >
        <ModalBody>
          <ModalBodyHeader>
            <Typography variant="h5" style={{ fontWeight: 600 }}>
              {options[modalView].title}
            </Typography>
            <Image
              src="/icons/Cancel-Black.svg"
              width={25}
              height={25}
              onClick={() => onClick()}
              style={{ cursor: 'pointer' }}
              alt=""
            />
          </ModalBodyHeader>
          <Typography variant="inherit" style={{ marginBottom: 20 }}>
            {options[modalView].title !== ''
              ? options[modalView].description
              : ''}{' '}
            &nbsp;
          </Typography>
          {modalView === 'createCarProfile' && (
            <>
              <Info>
                <img
                  loading="lazy"
                  src="/images/Fetched-car-Green.png"
                  alt="Trash"
                  height={98}
                  width={98}
                />
                <Typography
                  variant="h6"
                  style={{ marginTop: 48, marginBottom: 16 }}
                >
                  Upload Vehicle Info
                </Typography>
                <Typography
                  variant="subtitle2"
                  style={{ maxWidth: 206, marginBottom: 39 }}
                >
                  Kindly provide the registration number (VIN) of the car below
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter VIN number"
                  label="Enter VIN number"
                  onChange={(e) => {
                    if (
                      e.target.value === '' ||
                      e.target.value === null ||
                      e.target.value === undefined
                    ) {
                      setVin(null)
                    } else {
                      setVin(e.target.value)
                    }
                  }}
                />
                <Button
                  text={isLoading ? 'Loading...' : 'Fetch Car Information'}
                  width={372}
                  marginTop={30}
                  disabled={vin === null}
                  onClick={() => fetchCar()}
                />

                <Typography style={{ marginTop: 10, marginBottom: 10 }}>
                  or
                </Typography>

                <Button
                  text={'Add Car Information'}
                  width={372}
                  onClick={() => setModalView('addCarInfo')}
                />
              </Info>
            </>
          )}
          {modalView === 'fetchedCarProfile' && (
            <>
              {/*<HeaderText style={{marginBottom: 10, marginTop: 20}}>Number Plate</HeaderText>*/}
              {/*<TextField placeholder='Number Plate' label='Number Plate'*/}
              {/*           style={{width: 330, marginBottom: 30}}*/}
              {/*           value={licence_plate} onChange={(e) => setPlate(e.target.value)}/>*/}
              <HeaderText style={{ marginBottom: 10, marginTop: 10 }}>
                Vehicle Info
              </HeaderText>
              <InputGrid>
                <TextField
                  className="text-field"
                  fullWidth
                  label="Number Plate"
                  placeholder="Number Plate"
                  value={licence_plate}
                  variant="standard"
                  error={
                    !new RegExp(/(^[A-Z]{3}-[0-9]{3}[A-Z])\w+/g).test(
                      licence_plate
                    )
                  }
                  onChange={(e) => {
                    setPlate(e.target.value)
                  }}
                />
                <TextField
                  className="text-field"
                  type="text"
                  fullWidth
                  label="Bought Price"
                  placeholder="Bought Price"
                  value={bought_price}
                  variant="standard"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </InputGrid>
              <InputGrid>
                <TextField
                  className="text-field"
                  fullWidth
                  disabled
                  label="VIN"
                  placeholder="VIN"
                  value={vin}
                  variant="standard"
                />
                <div
                  style={{
                    marginBottom: '5px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <ColorPickerDropdown onChange={setColor} value={'#000'} />
                  <div
                    style={{
                      width: 40,
                      height: 20,
                      backgroundColor: carColor,
                      marginRight: 10,
                      border: '1px solid black'
                    }}
                  />
                  <div style={{ marginLeft: '5px' }}>
                    {carColor !== '' && carColor !== null
                      ? getColorName(carColor)
                      : 'Color not selected'}
                  </div>
                </div>
              </InputGrid>
              <InputGrid>
                <TextField
                  className="text-field"
                  fullWidth
                  disabled
                  label="Transmission Type"
                  placeholder="Transmission Type"
                  value={car?.transmission || 'NA'}
                  variant="standard"
                />
                <TextField
                  className="text-field"
                  fullWidth
                  disabled
                  label="Fuel Type"
                  placeholder="Fuel Type"
                  value={car?.fuel_type || 'NA'}
                  variant="standard"
                />
              </InputGrid>
              <InputGrid>
                <TextField
                  className="text-field"
                  fullWidth
                  disabled
                  label="Vehicle Engine"
                  placeholder="Vehicle Engine"
                  value={car?.engine || 'NA'}
                  variant="standard"
                />
                <FormControl fullWidth>
                  <Select
                    value={seatNumber}
                    onChange={(event) =>
                      setSeatNumber(Number(event.target.value))
                    }
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    label="Number of Seats"
                    placeholder="Number of Seats"
                    variant="standard"
                  >
                    <option value="" disabled>
                      Number of Seats
                    </option>
                    <option value={'4'}>4</option>
                    <option value={'5'}>5</option>
                    <option value={'6'}>6</option>
                    <option value={'7'}>7</option>
                    <option value={'8'}>8</option>
                    <option value={'9'}>9</option>
                    <option value={'10'}>10</option>
                    <option value={'11'}>11</option>
                    <option value={'12'}>12</option>
                  </Select>
                </FormControl>
              </InputGrid>
              <InputGrid>
                <TextField
                  className="text-field"
                  fullWidth
                  disabled
                  label="Make"
                  placeholder="Make"
                  value={car?.make || 'NA'}
                  variant="standard"
                />
                <TextField
                  className="text-field"
                  fullWidth
                  label="Current Mileage"
                  placeholder="Current Mileage"
                  value={car?.mileage || 'NA'}
                  variant="standard"
                  type="text"
                  onChange={(e) => setCarDetail('mileage', e.target.value)}
                />
              </InputGrid>
              <InputGrid>
                <TextField
                  className="text-field"
                  fullWidth
                  disabled
                  label="Year"
                  placeholder="Year"
                  value={car?.year || 'NA'}
                  variant="standard"
                />
                <TextField
                  className="text-field"
                  fullWidth
                  disabled
                  label="Model"
                  placeholder="Model"
                  value={car?.model || 'NA'}
                  variant="standard"
                />
              </InputGrid>
              <Button
                text="Proceed"
                width={510}
                marginLeft="auto"
                marginRight="auto"
                marginTop={40}
                disabled={
                  !licence_plate ||
                  !carColor ||
                  !car?.mileage ||
                  !new RegExp(/(^[A-Z]{3}-[0-9]{3}[A-Z])\w+/g).test(
                    licence_plate
                  )
                }
                onClick={() => setModalView('uploadCarImages')}
              />
            </>
          )}

          {modalView === 'addCarInfo' && (
            <>
              <HeaderText style={{ marginBottom: 10, marginTop: 10 }}>
                Add New Vehicle Info
              </HeaderText>
              <InputGrid>
                <TextField
                  className="text-field"
                  fullWidth
                  label="VIN"
                  placeholder="VIN"
                  variant="standard"
                  name="vin"
                  value={addVehicleInfo?.vin}
                  onChange={handleVehicleInfo}
                  error={!addVehicleInfo?.vin}
                  helperText={!addVehicleInfo?.vin ? '*Please enter VIN' : ''}
                />

                <TextField
                  className="text-field"
                  fullWidth
                  label="Vehicle Engine"
                  placeholder="Vehicle Engine"
                  variant="standard"
                  name="engine"
                  value={addVehicleInfo?.engine}
                  onChange={handleVehicleInfo}
                  error={!addVehicleInfo?.engine}
                  helperText={
                    !addVehicleInfo?.engine
                      ? '*Please enter the vehicle engine'
                      : ''
                  }
                />
              </InputGrid>
              <InputGrid>
                <FormControl fullWidth>
                  <InputLabel variant="standard">
                    <span style={{ color: 'red' }}>*</span>Transmission
                  </InputLabel>
                  <Select
                    name="transmission"
                    value={addVehicleInfo?.transmission}
                    onChange={handleVehicleInfo}
                    variant="standard"
                    error={!addVehicleInfo?.transmission}
                  >
                    <option value={'manual'}>Manual</option>
                    <option value={'automatic'}>Automatic</option>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel variant="standard">
                    <span style={{ color: 'red' }}>*</span>Car Type
                  </InputLabel>
                  <Select
                    name="car_type"
                    value={addVehicleInfo?.car_type}
                    onChange={handleVehicleInfo}
                    variant="standard"
                    error={!addVehicleInfo?.car_type}
                  >
                    <option value={'suv'}>Suv</option>
                    <option value={'saloon'}>Saloon</option>
                    <option value={'minivan'}>Minivan</option>
                    <option value={'convertible'}>Convertible</option>
                    <option value={'hatchback'}>Hatchback</option>
                    <option value={'pickup'}>Pickup</option>
                    <option value={'coupe'}>Coupe</option>
                  </Select>
                </FormControl>
              </InputGrid>
              <InputGrid>
                <FormControl fullWidth>
                  <InputLabel variant="standard">
                    <span style={{ color: 'red' }}>*</span>Fuel Type
                  </InputLabel>
                  <Select
                    name="fuel_type"
                    value={addVehicleInfo?.fuel_type}
                    onChange={handleVehicleInfo}
                    variant="standard"
                    error={!addVehicleInfo?.fuel_type}
                  >
                    <option value={'petrol'}>Petrol</option>
                    <option value={'diesel'}>Diesel</option>
                    <option value={'cng'}>CNG</option>
                    <option value={'lpg'}>LPG</option>
                    <option value={'electric'}>Electric</option>
                    <option value={'hybrid'}>Hybrid</option>
                  </Select>
                </FormControl>

                <TextField
                  className="text-field"
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                  fullWidth
                  label="Mileage"
                  placeholder="Mileage"
                  variant="standard"
                  name="mileage"
                  value={addVehicleInfo?.mileage}
                  onChange={(event) =>
                    setAddVehicleInfo({
                      ...addVehicleInfo,
                      [event.target.name]: Number(event.target.value)
                    })
                  }
                  error={!addVehicleInfo?.mileage}
                  helperText={
                    !addVehicleInfo?.mileage ? '*Please enter mileage' : ''
                  }
                />
              </InputGrid>

              <InputGrid>
                <TextField
                  className="text-field"
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                  fullWidth
                  label="Age"
                  placeholder="Age"
                  variant="standard"
                  name="age"
                  value={addVehicleInfo?.age}
                  onChange={(event) =>
                    setAddVehicleInfo({
                      ...addVehicleInfo,
                      [event.target.name]: Number(event.target.value)
                    })
                  }
                />
                <TextField
                  className="text-field"
                  type="number"
                  fullWidth
                  label="Year"
                  placeholder="Year"
                  variant="standard"
                  name="year"
                  value={addVehicleInfo?.brand.year}
                  onChange={(event) => {
                    const brand = {
                      ...addVehicleInfo.brand,
                      [event.target.name]: Number(event.target.value)
                    }
                    setAddVehicleInfo({ ...addVehicleInfo, brand: brand })
                  }}
                  error={!addVehicleInfo?.brand.year}
                  helperText={
                    !addVehicleInfo?.brand.year
                      ? '*Please enter the vehicle year'
                      : ''
                  }
                />
              </InputGrid>
              <InputGrid>
                <TextField
                  className="text-field"
                  fullWidth
                  label="Trim"
                  placeholder="Trim"
                  variant="standard"
                  name="trim"
                  value={addVehicleInfo?.trim}
                  onChange={handleVehicleInfo}
                  error={!addVehicleInfo?.trim}
                  helperText={
                    !addVehicleInfo?.trim ? '*Please enter vehicle trim' : ''
                  }
                />
                <TextField
                  className="text-field"
                  fullWidth
                  label="Manufacturer"
                  placeholder="Manufacturer"
                  variant="standard"
                  type="text"
                  name="manufacturer"
                  value={addVehicleInfo?.manufacturer}
                  onChange={handleVehicleInfo}
                  error={!addVehicleInfo?.manufacturer}
                  helperText={
                    !addVehicleInfo?.manufacturer
                      ? '*Please enter the vehicle manufacturer'
                      : ''
                  }
                />
              </InputGrid>
              <InputGrid>
                <TextField
                  className="text-field"
                  fullWidth
                  label="Brand Name"
                  placeholder="Brand Name"
                  variant="standard"
                  name="name"
                  value={addVehicleInfo?.brand.name}
                  onChange={(event) => {
                    const brand = {
                      ...addVehicleInfo.brand,
                      [event.target.name]: event.target.value
                    }
                    setAddVehicleInfo({ ...addVehicleInfo, brand: brand })
                  }}
                  error={!addVehicleInfo?.brand.name}
                  helperText={
                    !addVehicleInfo?.brand.name
                      ? '*Please enter the brand name'
                      : ''
                  }
                />
                <TextField
                  className="text-field"
                  fullWidth
                  label="Brand Model"
                  placeholder="Model"
                  variant="standard"
                  name="model"
                  value={addVehicleInfo?.brand.model}
                  onChange={(event) => {
                    const brand = {
                      ...addVehicleInfo.brand,
                      [event.target.name]: event.target.value
                    }
                    setAddVehicleInfo({ ...addVehicleInfo, brand: brand })
                  }}
                  error={!addVehicleInfo?.brand.model}
                  helperText={
                    !addVehicleInfo?.brand.model
                      ? '*Please enter the brand model'
                      : ''
                  }
                />
              </InputGrid>
              <InputGrid>
                <TextField
                  className="text-field"
                  fullWidth
                  label="Drive Type"
                  placeholder="Drive Type"
                  variant="standard"
                  name="drive_type"
                  value={addVehicleInfo?.drive_type}
                  onChange={handleVehicleInfo}
                  error={!addVehicleInfo?.drive_type}
                  helperText={
                    !addVehicleInfo?.drive_type
                      ? '*Please enter the drive type'
                      : ''
                  }
                />

<TextField
                  className="text-field"
                  fullWidth
                  label="Engine Power"
                  placeholder="Engine Power"
                  variant="standard"
                  name="engine_power"
                  value={addVehicleInfo?.engine_power}
                  onChange={handleVehicleInfo}
                />
               
                {/* <TextField
                 id="my-datefield"
                  className="text-field"
                  type="date"
                  fullWidth
                  label="Last Service Date"
                  placeholder="Last Service Date"
                  variant="standard"
                  name="last_service_date"
                  value={addVehicleInfo?.last_service_date}
                  onChange={handleVehicleInfo}
                  error={!addVehicleInfo?.last_service_date}
                  helperText={
                    !addVehicleInfo?.last_service_date
                      ? '*Please enter the last service date'
                      : ''
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                /> */}
              </InputGrid>
              {/* <InputGrid>
                <TextField
                  className="text-field"
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                  fullWidth
                  label="Last Service Mileage"
                  placeholder="Last Service Mileage"
                  variant="standard"
                  name="last_service_mileage"
                  value={addVehicleInfo?.last_service_mileage}
                  onChange={(event) =>
                    setAddVehicleInfo({
                      ...addVehicleInfo,
                      [event.target.name]: Number(event.target.value)
                    })
                  }
                />

                <TextField
                  className="text-field"
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                  fullWidth
                  label="Previous Owners"
                  placeholder="Previous Owners"
                  variant="standard"
                  name="previous_owners"
                  value={addVehicleInfo?.previous_owners}
                  onChange={(event) =>
                    setAddVehicleInfo({
                      ...addVehicleInfo,
                      [event.target.name]: Number(event.target.value)
                    })
                  }
                  error={!addVehicleInfo?.previous_owners}
                  helperText={
                    !addVehicleInfo?.previous_owners
                      ? '*Please enter the number of previous owners'
                      : ''
                  }
                />
              </InputGrid> */}
              <InputGrid>
                <TextField
                  className="text-field"
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                  fullWidth
                  label="Number of Cylinders"
                  placeholder="Number of Cylinders"
                  variant="standard"
                  name="num_of_cylinders"
                  value={addVehicleInfo?.num_of_cylinders}
                  onChange={(event) =>
                    setAddVehicleInfo({
                      ...addVehicleInfo,
                      [event.target.name]: Number(event.target.value)
                    })
                  }
                  error={!addVehicleInfo?.num_of_cylinders}
                  helperText={
                    !addVehicleInfo?.num_of_cylinders
                      ? '*Please enter the number of cylinders'
                      : ''
                  }
                />
                
              </InputGrid>
              {/* <InputGrid>
                <TextField
                  className="text-field"
                  fullWidth
                  label="Specifications"
                  placeholder="Specifications"
                  variant="standard"
                  name="specifications"
                  value={addVehicleInfo?.specifications}
                  onChange={handleVehicleInfo}
                />

                {/* <TextField
                  className="text-field"
                  fullWidth
                  label="Torque"
                  placeholder="Torque"
                  variant="standard"
                  name="torque"
                  value={addVehicleInfo?.torque}
                  onChange={handleVehicleInfo}
                /> 
              </InputGrid> */}
              {/* <InputGrid>
                <TextField
                  className="text-field"
                  fullWidth
                  label="Description"
                  placeholder="A Short Description"
                  variant="standard"
                  name="description"
                  value={addVehicleInfo?.description}
                  onChange={handleVehicleInfo}
                  error={!addVehicleInfo?.description}
                  helperText={
                    !addVehicleInfo?.description
                      ? '*Please enter a short description of the vehicle'
                      : ''
                  }
                />
              </InputGrid> */}

              <Button
                text={isLoading ? 'Saving ...' : 'Create Vehicle Info'}
                width={510}
                marginLeft="auto"
                marginRight="auto"
                marginTop={40}
                disabled={
                  isLoading ||
                  !addVehicleInfo?.transmission || 
                  !addVehicleInfo?.car_type ||
                  !addVehicleInfo?.fuel_type ||
                  !addVehicleInfo?.mileage ||
                  !addVehicleInfo?.trim ||
                  !addVehicleInfo?.vin ||
                  !addVehicleInfo?.drive_type ||
                  !addVehicleInfo?.num_of_cylinders ||
                  !addVehicleInfo?.brand.name ||
                  !addVehicleInfo?.brand.model ||
                  !addVehicleInfo?.brand.year

                
                }
                onClick={() => createVehicleInfo()}
              />
            </>
          )}

          {modalView === 'uploadCarImages' && (
            <>
              <ImageGrid style={{ justifyContent: 'start', maxWidth: 745 }}>
                {uploadedPictures.map((image, idx) => (
                  <div className="image" key={idx}>
                    <img
                      loading="lazy"
                      src={image.secure_url}
                      className="image"
                    />
                    <img
                      loading="lazy"
                      src="/icons/Delete-Circular-Green.svg"
                      className="delete"
                      onClick={() => removePicture(image.secure_url)}
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
                  <div style={{ marginTop: 10 }}>Upload Vehicle Image</div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={hiddenFileInput}
                    multiple={true}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <Button
                    text={isUploading ? 'Uploading ...' : 'Upload'}
                    disabled={isUploading}
                    width={128}
                    marginTop={40}
                    onClick={() => handleFileClick(event)}
                  />
                </div>
              </ImageUpload>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
              >
                <Button
                  text={isLoading ? 'Saving ...' : 'Skip'}
                  width={200}
                  marginLeft="auto"
                  marginRight="10px"
                  marginTop={50}
                  outlined={true}
                  disabled={isLoading}
                  onClick={() => saveCarProfile()}
                />
                <Button
                  text={isLoading ? 'Saving ...' : 'Create Car Profile'}
                  width={200}
                  marginLeft="auto"
                  marginRight="auto"
                  marginTop={50}
                  disabled={uploadedPictures.length < 3 || isLoading}
                  onClick={() => saveCarProfile()}
                />
              </div>
            </>
          )}
        </ModalBody>
      </Modal>
    </>
  )
}
export default AddCarProfile

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
const HeaderText = withStyles({
  root: {
    color: t.lightGrey,
    fontWeight: 'bold',
    display: 'block'
  }
})(Typography)
const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
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
    flex-direction: column;
    align-items: end;
    justify-content: space-between;
    height: 39px;
    margin: 10px auto;
  }
`
const ImageGrid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
  justify-content: space-between;

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
