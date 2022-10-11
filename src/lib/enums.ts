enum CarStates {
    ALL = '',
    SOLD = 'sold',
    INSPECTED = 'inspected',
    NEW = 'new',
    FAILED_INSPECTION = "failed_inspection",
    ONGOING_INSPECTION = "ongoing_inspection",
    AVAILABLE = "available",
    ONGOING_TRADE = "ongoing_trade",
    BOUGHT = "bought",
    ARCHIVED = "archived",
}

enum TradeStates {
    PENDING = "pending",
    ONGOING = "ongoing",
    COMPLETED = "completed",
    PURCHASED = "purchased",
    CLOSED = "closed",
}

enum CarMaintenanceTypes {
    SPARE_PART = "spare_part",
    EXPENSE = "expense",
}

enum CarTransmissionTypes {
    MANUAL = "manual",
    AUTOMATIC = "automatic",
    STANDARD = "standard",
}

enum FuelTypes {
    PETROL = "petrol",
    DIESEL = "diesel",
    CNG = "cng",
    LPG = "lpg",
    ELECTRIC = "electric",
    HYBRID = "hybrid"
}

enum CarTypes {
    SUV = "suv",
    SALOON = "saloon",
    MINIVAN = "minivan",
    CONVERTIBLE = "convertible",
    MicroCar = "microcar",
    CityCar = "city_car",
    Hatchback = "hatchback",
    Sedan = "sedan",
    FamilyCar = "family_car",
    MuscleCar = "muscle_car",
    Roadster = "roadster",
    PickUp = "pickup",
    Coupe = "coupe",
}


enum InspectionStates {
    ONGOING = "ongoing",
    COMPLETED = "completed",
    PENDING = "pending",
    EXPIRED = "expired",
}

enum UploadTypes {
    CAR = "car",
    USER = "user",
    CAR_FEATURE = "car-feature",
    CAR_PRODUCT = "car-product",
    CAR_DOCUMENT = "car-document",
    ANY = 'general'
}

enum ActivityTypes {
    Transaction = "transaction",
    TradeUnit = "trade_unit",
    Disbursement = "disbursement",
    CarCreation = "car_creation",
    NewUser = "new_user",
}

enum TransactionStates {
    Unsettled = "unsettled",
    Success = "success",
    Failed = "failed",
    Cancelled = "cancelled",
    Pending = "pending",
}


enum RequiredCarDocuments {
    ProofOfOwnership = "proof_of_ownership",
    AllocationOfLicensePlate = "allocation_of_licence_plate",
    VehicleLicense = "vehicle_license",
    CustomPapersOrPurchaseReceipt = "custom_papers_or_purchase_receipt",
    PoliceCMR = "police_CMR",
    Insurance = "insurance",
    RoadWorthiness = "road_worthiness",
    Others = "others",
    OwnerInformation = "owner_identification"
}

export {
    CarStates,
    TradeStates,
    CarMaintenanceTypes,
    CarTransmissionTypes,
    FuelTypes,
    CarTypes,
    InspectionStates,
    UploadTypes,
    ActivityTypes,
    TransactionStates,
    RequiredCarDocuments
}
