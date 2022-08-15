enum CarStates {
    ALL = '',
    SOLD = 'sold',
    INSPECTED = 'inspected',
    NEW = 'new',
    FAILED_INSPECTION = "failed_inspection",
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

export {
    CarStates,
    TradeStates,
    CarMaintenanceTypes,
    CarTransmissionTypes,
    FuelTypes,
    CarTypes
}