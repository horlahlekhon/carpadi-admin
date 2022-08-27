import {FormControl, Modal, Select, TextField, Typography, withStyles} from "@material-ui/core";
import Image from "next/image";
import {t} from "../../styles/theme";
import Button from "./Button";
import {useRouter} from "next/router";
import {useRef, useState} from "react";
import {toast} from "react-hot-toast";
import styled from "styled-components";
import {retrieveVINDetails} from "../../services/vehicle";
import {uploadFile} from "../../services/upload";
import ntc from "../../lib/ntc";
import {trimString} from "../../helpers/formatters";
import {createCar} from "../../services/car";
import {UploadTypes} from "../../lib/enums";
import {getColorName} from "../../helpers/utils";

const AddCarProfile = ({modalOpen = true, onClick}) => {
    const router = useRouter()
    let [uploadedPictures, setUploadedPictures] = useState([]);
    const [modalView, setModalView] = useState('createCarProfile')
    const [carColor, setCarColor] = useState('')
    const [transmissionType, setTransmissionType] = useState('')
    const [seatNumber, setSeatNumber] = useState(4)
    const [vin, setVin] = useState(null)
    const [licence_plate, setPlate] = useState(null)
    const [car, setCar] = useState({
            "engine": null,
            "transmission": null,
            "car_type": null,
            "fuel_type": null,
            "mileage": 0,
            "age": 0,
            "description": null,
            "trim": null,
            "year": 0,
            "model": null,
            "manufacturer": null,
            "make": null,
            "vin": vin
        }
    )
    const [isLoading, setLoading] = useState(false)
    const [isUploading, setisUploading] = useState(false)
    const [fuelType, setFuelType] = useState('')
    const options = {
        createCarProfile: {
            title: '',
            description: ''
        },
        fetchedCarProfile: {
            title: 'Fetched Car Profile',
            description: ''
        },
        uploadCarImages: {
            title: 'Upload Car Images',
            description: 'Upload minimum of 3 images to complete profile '
        }
    }

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
        const fileUploaded = event.target.files;
        handleFile(fileUploaded);
    };

    const handleFile = (files) => {
        files = Array.from(files)
        const arr = files.map((a) => {
            return {
                secure_url: URL.createObjectURL(a),
                file: a
            }
        })
        setUploadedPictures([...uploadedPictures, ...arr])
        // setisUploading(true)
        // uploadFile(file, UploadTypes.CAR, vin)
        //     .then((res) => {
        //         if (res.status) {
        //             const arr = [...uploadedPictures, res.data];
        //             setUploadedPictures(arr)
        //         } else {
        //             toast.error(res.data)
        //         }
        //     })
        //     .catch((error) => {
        //         toast.error(error)
        //     })
        //     .finally(() => {
        //         setisUploading(false)
        //     })
    }

    const fetchCar = () => {
        setLoading(true)
        retrieveVINDetails(vin, {vin})
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
        const arr = uploadedPictures.filter(a => a.secure_url !== id);
        setUploadedPictures(arr)
    }

    function setColor(colorCode) {
        setCarColor(colorCode)
    }

    function saveCarProfile() {
        setLoading(true)
        setisUploading(true)
        const data = {
            "vin": vin,
            "car_pictures": [],
            "colour": carColor,
            "licence_plate": licence_plate
        }
        uploadedPictures.forEach(async (picture) => {
            uploadFile(picture?.file, UploadTypes.CAR, vin)
                .then((res) => {
                    if (res.status) {
                        console.log(res.data?.secure_url)
                        data.car_pictures.push(res.data?.secure_url)
                    } else {
                        toast.error(res.data)
                    }
                })
                .catch((error) => {
                    toast.error(error)
                })
            const res = await uploadFile(picture?.file, UploadTypes.CAR, vin);
            if (res.status) {
                data.car_pictures.push(res.data?.secure_url)
                if (data.car_pictures.length === uploadedPictures.length) {
                    createCar(data)
                        .then((response) => {
                            if (response.status) {
                                toast.success('Created Successfully!')
                                onClick()
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

    }

    // @ts-ignore
    return (<>
        <Modal
            open={true}
            onClose={() => {
                onClick()
            }}
        >
            <ModalBody>
                <ModalBodyHeader>
                    <Typography variant="h5" style={{fontWeight: 600}}>
                        {options[modalView].title}
                    </Typography>
                    <Image
                        src="/icons/Cancel-Black.svg"
                        width={25}
                        height={25}
                        onClick={() => onClick()}
                        style={{cursor: 'pointer'}}
                    />
                </ModalBodyHeader>
                <Typography variant="inherit" style={{marginBottom: 20}}>
                    {options[modalView].title !== ''
                        ? options[modalView].description
                        : ''}{' '}
                    &nbsp;
                </Typography>
                {modalView === 'createCarProfile' && (
                    <>
                        <Info>
                            <img
                                src="/images/Fetched-car-Green.png"
                                alt="Trash"
                                height={98}
                                width={98}
                            />
                            <Typography
                                variant="h6"
                                style={{marginTop: 48, marginBottom: 16}}
                            >
                                Upload Vehicle Info
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                style={{maxWidth: 206, marginBottom: 39}}
                            >
                                Kindly provide the registration number (VIN) of the car below
                            </Typography>
                            <TextField fullWidth placeholder='Enter VIN number' label='Enter VIN number'
                                       onChange={(e) => {
                                           if (e.target.value === '' || e.target.value === null || e.target.value === undefined) {
                                               setVin(null)
                                           } else {
                                               setVin(e.target.value)
                                           }
                                       }}/>
                            <Button
                                text={isLoading ? 'Loading...' : "Fetch Car Information"}
                                width={372}
                                marginTop={30}
                                disabled={vin === null}
                                onClick={() => fetchCar()}
                            />
                        </Info>
                    </>
                )}
                {modalView === 'fetchedCarProfile' && (
                    <>
                        <HeaderText style={{marginBottom: 10, marginTop: 20}}>Number Plate</HeaderText>
                        <TextField placeholder='Number Plate' label='Number Plate'
                                   style={{width: 330, marginBottom: 30}}
                                   value={licence_plate} onChange={(e) => setPlate(e.target.value)}/>
                        <HeaderText style={{marginBottom: 10, marginTop: 10}}>Vehicle Info</HeaderText>
                        <InputGrid>
                            <TextField
                                className="text-field"
                                fullWidth
                                disabled
                                label="VIN"
                                placeholder="VIN"
                                value={vin}
                                variant='standard'
                            />
                            <TextField
                                className="text-field"
                                fullWidth
                                placeholder="Color"
                                label={carColor !== '' ? getColorName(carColor) : 'Color'}
                                type='color'
                                variant='standard'
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </InputGrid>
                        <InputGrid>
                            <TextField
                                className="text-field"
                                fullWidth
                                disabled
                                label="Transmission Type"
                                placeholder="Transmission Type"
                                value={car?.transmission || 'NA'}
                                variant='standard'
                            />
                            <TextField
                                className="text-field"
                                fullWidth
                                disabled
                                label="Fuel Type"
                                placeholder="Fuel Type"
                                value={car?.fuel_type || 'NA'}
                                variant='standard'
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
                                variant='standard'
                            />
                            <FormControl fullWidth>
                                <Select
                                    value={seatNumber}
                                    onChange={(event) =>
                                        setSeatNumber(Number(event.target.value))
                                    }
                                    displayEmpty
                                    inputProps={{'aria-label': 'Without label'}}
                                    label='Number of Seats'
                                    placeholder='Number of Seats'
                                    variant='standard'
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
                                variant='standard'
                            />
                            <TextField
                                className="text-field"
                                fullWidth
                                disabled
                                label="Current Mileage"
                                placeholder="Current Mileage"
                                value={car?.mileage || 'NA'}
                                variant='standard'
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
                                variant='standard'
                            />
                            <TextField
                                className="text-field"
                                fullWidth
                                disabled
                                label="Model"
                                placeholder="Model"
                                value={car?.model || 'NA'}
                                variant='standard'
                            />
                        </InputGrid>
                        <Button
                            text="Proceed"
                            width={510}
                            marginLeft="auto"
                            marginRight="auto"
                            marginTop={40}
                            disabled={!licence_plate || !carColor}
                            onClick={() => setModalView('uploadCarImages')}
                        />
                    </>
                )}
                {modalView === 'uploadCarImages' && (
                    <>
                        <ImageGrid style={{justifyContent: 'start', maxWidth: 745}}>
                            {uploadedPictures.map((image, idx) => (
                                <div className='image' key={idx}>
                                    <img src={image.secure_url} className="image"/>
                                    <img src="/icons/Delete-Circular-Green.svg" className='delete'
                                         onClick={() => removePicture(image.secure_url)}/>
                                </div>
                            ))}
                        </ImageGrid>
                        <ImageUpload>
                            <div className='content'>
                                <Image src='/images/Upload.png' alt='Upload' height={38} width={44}/>
                                <div style={{marginTop: 10}}>
                                    Upload Vehicle Image
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={hiddenFileInput}
                                    multiple={true}
                                    onChange={handleFileChange}
                                    style={{display: 'none'}}
                                />
                                <Button text={isUploading ? 'Uploading ...' : 'Upload'} disabled={isUploading}
                                        width={128} marginTop={40}
                                        onClick={() => handleFileClick(event)}/>
                            </div>
                        </ImageUpload>
                        <Button
                            text={isLoading ? 'Saving ...' : 'Create Car Profile'}
                            width={510}
                            marginLeft="auto"
                            marginRight="auto"
                            marginTop={50}
                            disabled={(uploadedPictures.length < 3) || isLoading}
                            onClick={() => saveCarProfile()}
                        />
                    </>
                )}
            </ModalBody>
        </Modal></>)
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
    flex-direction: row;
    align-items: end;
    justify-content: space-between;
    height: 39px;
    margin: auto;
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

        