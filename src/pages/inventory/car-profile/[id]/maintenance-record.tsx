import MainLayout from '../../../../components/layouts/MainLayout'
import styled from 'styled-components'
import {
    Typography,
    Modal, Paper, Grid, TextField,
} from '@material-ui/core'
import {t} from '../../../../styles/theme'
import {useRouter} from 'next/router'
import Image from 'next/image'
import {useEffect, useRef, useState} from 'react'
import Button from "../../../../components/shared/Button";
import {withStyles} from "@material-ui/styles";
import {Add, Spa} from "@material-ui/icons";
import {retrieveSingleCar} from "../../../../services/car";
import {toast} from "react-hot-toast";
import {formatNumber, trimString} from "../../../../helpers/formatters";
import {createSparePart, updateSparePart} from "../../../../services/spare-part";
import {createMaintenance, retrieveMaintenances, updateMaintenance} from "../../../../services/maintenance";
import CPToast from "../../../../components/shared/CPToast";
import {uploadFile} from "../../../../services/upload";
import {CarMaintenanceTypes} from "../../../../lib/enums";

function SingleUnderInspectionMaintenancePage({pageId}) {
    const refSparePart = {
        "name": '',
        "partPrice": 0,
        "repairCost": 0,
        "carBrand": '',
        "part_picture": ''
    };
    const refExpense = {
        "expense": '',
        "cost": 0,
    };
    const router = useRouter()
    const [carId, setCarId] = useState(null)
    const status = String(router.query.status).toLowerCase() || 'NA'
    const [spareParts, setSpareParts] = useState([])
    const [expenses, setExpenses] = useState([])
    const [maintenances, setMaintenances] = useState([])
    const [description, setDescription] = useState('')
    const [sparePart, setSparePart] = useState(refSparePart)
    const [expense, setExpense] = useState(refExpense)
    const [car, setCarData] = useState({
        "id": null,
        "maintenance_cost": 0,
        "total_cost": 0,
        "pictures": [],
        "vin": null,
        "information": {
            "id": null,
            "engine": null,
            "transmission": null,
            "car_type": null,
            "fuel_type": null,
            "mileage": null,
            "age": null,
            "description": null,
            "trim": null,
            "year": null,
            "model": null,
            "manufacturer": null,
            "make": null,
            "vin": null,
            "created": null,
            "modified": null,
            "brand": {
                "id": null,
                "created": null,
                "modified": null,
                "name": null,
                "model": null,
                "year": null

            }
        },
        "status": null,
        "bought_price": null,
        "created": null,
        "modified": null,
        "colour": null,
        "cost_of_repairs": null,
        "resale_price": null,
        "inspection_report": null,
        "margin": null,
        "name": null,
        "description": null,
        "licence_plate": null,
        "car_inspector": null
    })
    const [modalOpen, setModalState] = useState(false)
    const [modalView, setModalView] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [modalTagline, setModalTagline] = useState(' Kindly provide the following information below.')
    const [isSaving, setIsSaving] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const hiddenFileInput = useRef(null);
    const [expenseList, setExpenseList] = useState([])
    const [partsList, setPartsList] = useState([])
    const [partIdx, setPartIdx] = useState(0)


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

    const handleChange = (prop, value, idx) => {
        let spp = [...spareParts]
        spp[idx][prop] = value;
        setSpareParts(spp)
    }


    const saveSparePartRecord = () => {

        if (spareParts.length < 1) {
            toast.error("Ensure you have added at least a spare part!")
            return
        }
        spareParts.forEach((spareP) => {
            if (editMode) {
                if (spareP?.id) {
                    updateMaintenance({
                        "maintenance": {
                            "name": spareP.name,
                            "estimated_price": spareP.partPrice,
                            "description": description,
                            "picture": spareP.part_picture,
                        },
                        "car": carId,
                        "type": CarMaintenanceTypes.SPARE_PART,
                    }, spareP?.id)
                        .then((res) => {
                            if (res.status) {
                                toast.success(`Updated part: ${spareP?.name}`)
                                retrieveCarMaintenance(carId)
                            } else {
                                toast.error(res.data)
                            }
                        })
                        .catch((error) => {
                            toast.error(error)
                        })
                } else {
                    createMaintenance({
                        "maintenance": {
                            "name": spareP.name,
                            "estimated_price": spareP.partPrice,
                            "description": description,
                            "picture": spareP.part_picture,
                        },
                        "car": carId,
                        "type": CarMaintenanceTypes.SPARE_PART,
                    })
                        .then((res) => {
                            if (res.status) {
                                toast.success(`Updated part: ${spareP?.name}`)
                                retrieveCarMaintenance(carId)
                            } else {
                                toast.error(res.data)
                            }
                        })
                        .catch((error) => {
                            toast.error(error)
                        })
                }
            } else {
                createMaintenance(
                    {
                        "maintenance": {
                            "name": spareP.name,
                            "estimated_price": spareP.partPrice,
                            "description": description,
                            "picture": spareP.part_picture,
                        },
                        "type": CarMaintenanceTypes.SPARE_PART,
                        "car": carId
                    }
                )
                    .then((res) => {
                        if (!res.status) {
                            toast.error(res.data)
                        } else {
                            toast.success(`Created part: ${spareP?.name}`)
                            retrieveCarMaintenance(carId)
                        }
                    })
                    .catch((error) => {
                        toast.error(error)
                    })
            }
            setModalState(false)
        })
    }

    const saveExpenseRecord = () => {
        setModalState(false)
        expenses.forEach((ex) => {
            if (editMode) {
                if (ex?.id) {
                    updateMaintenance({
                        "maintenance": {
                            "name": ex.expense,
                            "estimated_price": ex.cost,
                            "description": description,
                        },
                        "car": carId,
                        "type": CarMaintenanceTypes.EXPENSE,
                    }, ex?.id)
                        .then((res) => {
                            if (res.status) {
                                toast.success(`Updated expense: ${ex.expense}`)
                                retrieveCarMaintenance(carId)
                            } else {
                                toast.error(res.data)
                            }
                        })
                        .catch((error) => {
                            toast.error(error)
                        })
                } else {
                    createMaintenance({
                        "maintenance": {
                            "name": ex.expense,
                            "estimated_price": ex.cost,
                            "description": description,
                        },
                        "car": carId,
                        "type": CarMaintenanceTypes.EXPENSE,
                    })
                        .then((res) => {
                            if (res.status) {
                                toast.success(`Updated expense: ${ex.expense}`)
                                retrieveCarMaintenance(carId)
                            } else {
                                toast.error(res.data)
                            }
                        })
                        .catch((error) => {
                            toast.error(error)
                        })
                }
            } else {
                createMaintenance({
                    "maintenance": {
                        "name": ex.expense,
                        "estimated_price": ex.cost,
                        "description": description,
                    },
                    "car": carId,
                    "type": CarMaintenanceTypes.EXPENSE,
                })
                    .then((res) => {
                        if (res.status) {
                            toast.success(`Created expense: ${ex.expense}`)
                            retrieveCarMaintenance(carId)
                        } else {
                            toast.error(res.data)
                        }
                    })
                    .catch((error) => {
                        toast.error(error)
                    })
            }
        })
    }

    const addSparePart = () => {
        // if (sparePart?.part_picture === '' || sparePart?.part_picture === null) {
        //     toast.error("Please add spare part image")
        //     return
        // }
        const arr = [...spareParts, sparePart];
        setSpareParts(arr)
        setSparePart(refSparePart)
    }

    const deleteSparePart = (name) => {
        const arr = spareParts.filter(a => a.name !== name);
        setSpareParts(arr)
    }

    const addExpense = () => {
        const arr = [...expenses, expense];
        setExpenses(arr)
        setExpense(refExpense)
    }

    const deleteExpense = (idx) => {
        const arr = expenses.filter((a, i) => i !== idx);
        setExpenses(arr)
    }

    const updateExpense = (idx, field, value) => {
        const arr = [...expenses]
        arr[idx][field] = value;
        setExpenses(arr)
    }

    const retrieveCarMaintenance = (id) => {
        if (id !== null && id !== undefined && id !== '') {
            retrieveMaintenances(50, 0, id)
                .then((response) => {
                    if (response.status) {
                        setMaintenances(response?.data?.results)
                        const exs = response?.data?.results.filter(a => a.type === CarMaintenanceTypes.EXPENSE)
                        const prts = response?.data?.results.filter(a => a.type === CarMaintenanceTypes.SPARE_PART)
                        setSpareParts(prts.map(a => {
                            return {
                                name: a?.maintenance_data?.name,
                                estimated_price: a?.maintenance_data?.estimated_price,
                                partPrice: a?.maintenance_data?.estimated_price,
                                part_picture: a?.maintenance_data?.part_picture,
                                id: a?.id,
                            }
                        }))
                        setExpenseList(exs)
                        setPartsList(prts)
                    } else {
                        toast.error(response.data)
                    }
                })
                .catch((error) => {
                    toast.error(error.data)
                })
        }
    }

    const retrieveCar = (id) => {
        if (id !== null && id !== undefined && id !== '') {
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
        }
    }

    useEffect(() => {
        setCarId(pageId)
        retrieveCar(pageId)
        retrieveCarMaintenance(pageId)
    }, [])

    const calculateTotal = () => {
        const costs = maintenances.map(x => parseFloat(x.cost))
        return costs.reduce((a, b) => a + b, 0)
    }

    const handleFileClick = event => {
        hiddenFileInput.current.click();
    };

    const handleFileChange = event => {
        const fileUploaded = event.target.files[0];
        handleFile(fileUploaded);
    };

    const handleFile = (file) => {
        setIsSaving(true)
        uploadFile(file)
            .then((res) => {
                if (res.status) {
                    let spp = [...spareParts]
                    spp[partIdx]['part_picture'] = res.data?.secure_url;
                    setSpareParts(spp)
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
    }

    return (
        <MainLayout>
            <Container>
                <CPToast/>
                <input
                    type="file"
                    accept="image/*"
                    ref={hiddenFileInput}
                    onChange={handleFileChange}
                    style={{display: 'none'}}
                />
                <Header>
                    <Typography variant="h4">
                        <b>{trimString(carId)}</b>
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
                        <span className="text" style={{textTransform: 'capitalize'}}>{status}</span>
                        <span className="separator"></span>
                    </div>
                    <div>
                        <span className="text">{trimString(carId)}</span>
                        <span className="separator"></span>
                    </div>
                </Breadcrumbs>
                <Body>
                    <TopTab>
                        <VehicleDetails>
                            <img
                                src={car?.pictures.length > 0 ? car.pictures[0] : null}
                                height={91}
                                width={125}
                                style={{borderRadius: '8px'}}
                                alt={car?.information?.manufacturer}
                            />
                            <div className="stats">
                                <img
                                    src="/images/Toyota-Full.png"
                                    width={80}
                                    height={20}
                                    style={{marginBottom: -10}}
                                />
                                <Typography variant="h6" className="trade">
                                    {trimString(car?.information?.id)}
                                </Typography>
                                <Typography variant="h6">{car?.name}</Typography>
                            </div>
                        </VehicleDetails>
                        <div className='flex'>
                            {maintenances.length > 0 && (<>
                                <Button text="Manage Maintenance" width={200} outlined={true} marginRight={10}
                                        onClick={() => {
                                            setEditMode(true)
                                            showModal("createSparePart", "Manage Maintenance Record")
                                        }}/>
                            </>)}
                            <Button text="Go to Car Profile" width={180} outlined={true} marginRight={10}
                                    onClick={() => handleNavigation(`/inventory/car-profile/${carId}?status=${status}`)}/>
                            {maintenances.length > 0 && (
                                <>
                                    <PriceCard>
                                        <Typography variant="body1">Total Maintenance Cost</Typography>
                                        <Typography variant="h5">₦ {formatNumber(calculateTotal())}</Typography>
                                    </PriceCard>
                                </>
                            )}
                        </div>
                    </TopTab>
                    {maintenances.length > 0 && (
                        <>
                            <Typography variant='h5' style={{
                                marginTop: 24,
                                borderBottom: `1px solid ${t.extraLiteGrey}`
                            }}>Description</Typography>
                            <p>
                                {car?.description || 'NA'}
                            </p>
                        </>
                    )}
                    {maintenances.length < 1 && (
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
                {maintenances.length > 0 && (
                    <>
                        <Grid container style={{marginTop: 4}} spacing={3}>
                            <Grid item xs={7}>
                                <Body style={{padding: 15}}>
                                    <Typography variant='h6'>Spare Parts</Typography>
                                    <Grid container spacing={2}>
                                        {partsList.map((sp, idx) => (
                                            <Grid item xs={6} key={idx}>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}>
                                                    <img src={sp?.maintenance_data?.part_picture}
                                                         alt={sp?.maintenance_data?.name} height={93} width={93}/>
                                                    <div style={{
                                                        marginLeft: 10,
                                                        fontWeight: 700,
                                                        textTransform: 'capitalize'
                                                    }}>{sp?.maintenance_data?.name}</div>
                                                </div>
                                                <PriceCard
                                                    style={{
                                                        width: '100%',
                                                        background: t.primaryLite,
                                                        marginTop: '15px'
                                                    }}>
                                                    <Typography variant="body1">Spare Part Cost</Typography>
                                                    <Typography
                                                        variant="h5">₦ {formatNumber(sp?.maintenance_data?.estimated_price)}</Typography>
                                                </PriceCard>
                                                <PriceCard
                                                    style={{
                                                        width: '100%',
                                                        background: t.extraLiteGrey,
                                                        marginTop: '15px'
                                                    }}>
                                                    <Typography variant="body1">Repair Cost</Typography>
                                                    <Typography variant="h5">₦ NA</Typography>
                                                </PriceCard>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Body>
                            </Grid>
                            <Grid item xs={5}>
                                <Body style={{padding: 15}}>
                                    <Typography variant='h6'>Expenses</Typography>
                                    {expenseList.map((ex, i) => (
                                        <Expense key={i}>
                                            <div className="key">{ex?.maintenance_data?.name || 'NA'}</div>
                                            <div className="value">&#8358; {formatNumber(ex.cost)}</div>
                                        </Expense>
                                    ))}
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
                                        }}
                                             onClick={() => showModal("createExpense", "Create Expenses Maintenance Record")}>
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
                                             onClick={() => {
                                                 setEditMode(false)
                                                 showModal("createSparePart", "Create Spare Part Maintenance Record")
                                             }}>
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
                                                src={car?.pictures.length > 0 ? car.pictures[0] : null}
                                                width={185}
                                                height={135}
                                                style={{borderRadius: '8px'}}
                                                alt={car?.information?.make}
                                            />
                                            <div className="stats">
                                                <img
                                                    src="/images/Toyota-Full.png"
                                                    width={80}
                                                    height={22}
                                                    style={{marginBottom: -15}}
                                                />
                                                <Typography variant="h5" className="trade">
                                                    {trimString(car?.id)}
                                                </Typography>
                                                <Typography variant="h6">{car?.name}</Typography>
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
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></TextField>
                                <FlexRow style={{marginBottom: 20}}>
                                    <HeaderText>Spare Part</HeaderText>
                                    <IconPill onClick={addSparePart}>
                                        Add Spare Part
                                        <Add className="icon"/>
                                    </IconPill>
                                </FlexRow>
                                {/*<InputGrid>*/}
                                {/*    <TextField*/}
                                {/*        className="text-field"*/}
                                {/*        fullWidth*/}
                                {/*        placeholder="Spare Part"*/}
                                {/*        value={sparePart.name}*/}
                                {/*        onChange={handleChange('name')}*/}
                                {/*    />*/}
                                {/*    <div className="input">*/}
                                {/*        <div className="text">Upload Image</div>*/}
                                {/*        <Button*/}
                                {/*            text={isSaving ? 'Uploading...' : 'Upload'}*/}
                                {/*            outlined={true}*/}
                                {/*            width={71}*/}
                                {/*            height={28}*/}
                                {/*            borderRadius="8px"*/}
                                {/*            onClick={() => handleFileClick(event)}*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*</InputGrid>*/}
                                {/*<div style={{display: 'flex', flexDirection: 'column'}}>*/}
                                {/*    <HeaderText variant="inherit" style={{marginBottom: 8}}>*/}
                                {/*        Costing*/}
                                {/*    </HeaderText>*/}
                                {/*    <InputGrid style={{background: 'white'}}>*/}
                                {/*        <FlexRow>*/}
                                {/*            <div className="currency-box">&#8358;</div>*/}
                                {/*            <TextField*/}
                                {/*                placeholder="Enter cost"*/}
                                {/*                style={{width: 400}}*/}
                                {/*                value={sparePart.partPrice}*/}
                                {/*                onChange={handleChange('partPrice')}*/}
                                {/*                type={'number'}*/}
                                {/*            ></TextField>*/}
                                {/*        </FlexRow>*/}
                                {/*        /!*<FlexRow>*!/*/}
                                {/*        /!*    <div className="currency-box">&#8358;</div>*!/*/}
                                {/*        /!*    <TextField*!/*/}
                                {/*        /!*        placeholder="Enter repair cost"*!/*/}
                                {/*        /!*        style={{width: 400}}*!/*/}
                                {/*        /!*        value={sparePart.repairCost}*!/*/}
                                {/*        /!*        onChange={handleChange('repairCost')}*!/*/}
                                {/*        /!*        type={'number'}*!/*/}
                                {/*        /!*    ></TextField>*!/*/}
                                {/*        /!*</FlexRow>*!/*/}
                                {/*    </InputGrid>*/}
                                {/*</div>*/}
                                {spareParts.map((sp, id) => (
                                    <div key={id}>
                                        <InputGrid style={{marginTop: 14}}>
                                            <TextField
                                                className="text-field"
                                                fullWidth
                                                placeholder="Spare Part"
                                                variant='standard'
                                                value={sp.name}
                                                onChange={(e) => handleChange('name', e.target.value, id)}
                                            />
                                            <div className="input">
                                                <div
                                                    className="text">{`${trimString(sp?.part_picture, 15)}...` || 'NA.png'}</div>
                                                <Button
                                                    text={sp?.part_picture ? "Delete" : "Upload"}
                                                    outlined={true}
                                                    width={71}
                                                    height={28}
                                                    bgColor={sp?.part_picture ? t.alertError : t.primaryDeepBlue}
                                                    borderRadius="8px"
                                                    onClick={() => {
                                                        setPartIdx(id)
                                                        sp?.part_picture ? deleteSparePart(sp.name) : handleFileClick(event)
                                                    }}
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
                                                        placeholder="Enter cost"
                                                        style={{width: 400}} variant='standard'
                                                        value={sp.partPrice}
                                                        onChange={(e) => handleChange('partPrice', e.target.value, id)}
                                                    ></TextField>
                                                </FlexRow>
                                                {/*<FlexRow>*/}
                                                {/*    <div className="currency-box">&#8358;</div>*/}
                                                {/*    <TextField*/}
                                                {/*        placeholder="Enter repair cost"*/}
                                                {/*        style={{width: 400}} variant='standard'*/}
                                                {/*        disabled*/}
                                                {/*        value={sp.repairCost}*/}
                                                {/*    ></TextField>*/}
                                                {/*</FlexRow>*/}
                                            </InputGrid>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    text={(editMode ? 'Update' : 'Create') + " Maintenance Record"}
                                    width={510}
                                    marginLeft="auto"
                                    marginRight="auto"
                                    marginTop={50}
                                    onClick={() =>
                                        saveSparePartRecord()
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
                                                src={car?.pictures.length > 0 ? car.pictures[0] : null}
                                                width={185}
                                                height={135}
                                                style={{borderRadius: '8px'}}
                                                alt={car?.information?.make}
                                            />
                                            <div className="stats">
                                                <img
                                                    src="/images/Toyota-Full.png"
                                                    width={80}
                                                    height={22}
                                                    style={{marginBottom: -15}}
                                                />
                                                <Typography variant="h5" className="trade">
                                                    {trimString(carId)}
                                                </Typography>
                                                <Typography variant="h6">{car?.name}</Typography>
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
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></TextField>
                                <FlexRow style={{marginBottom: 20}}>
                                    <HeaderText>Expenses</HeaderText>
                                    <IconPill onClick={addExpense}>
                                        Add Expense
                                        <Add className="icon"/>
                                    </IconPill>
                                </FlexRow>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    {expenses.map((exp, idx) => (
                                        <InputGrid style={{background: 'white'}} key={idx}>
                                            <FlexRow className='reverse'>
                                                <div className="currency-box">&#8358;</div>
                                                <TextField
                                                    placeholder="Expense"
                                                    label="Expense"
                                                    variant='standard'
                                                    style={{width: 400}}
                                                    type={'text'}
                                                    value={expenses[idx].expense}
                                                    onChange={(e) => updateExpense(idx, 'expense', e.target.value)}
                                                ></TextField>
                                            </FlexRow>
                                            <FlexRow className='reverse'>
                                                <div className="currency-box" onClick={() => deleteExpense(idx)}
                                                     style={{
                                                         color: t.alertError,
                                                         background: 'white',
                                                         cursor: 'pointer'
                                                     }}>&#10006;</div>
                                                <TextField
                                                    placeholder="Cost"
                                                    label="Cost"
                                                    variant='standard'
                                                    style={{width: 400}}
                                                    type={'number'}
                                                    value={expenses[idx].cost}
                                                    onChange={(e) => updateExpense(idx, 'cost', e.target.value)}
                                                ></TextField>
                                            </FlexRow>
                                        </InputGrid>
                                    ))}
                                </div>
                                <Button
                                    text="Create Maintenance Record"
                                    width={510}
                                    marginLeft="auto"
                                    marginRight="auto"
                                    marginTop={50}
                                    onClick={() =>
                                        saveExpenseRecord()
                                    }
                                />
                            </>
                        )}
                    </ModalBody>
                </Modal>
            </Container>
        </MainLayout>
    )
}

export async function getServerSideProps({params}) {
    return {
        props: {
            pageId: params.id
        }
    }
}

export default SingleUnderInspectionMaintenancePage

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
