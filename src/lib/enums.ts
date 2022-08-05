enum CarStatus {
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

enum TradeStatus {
    PENDING = "pending",
    ONGOING = "ongoing",
    COMPLETED = "completed",
    PURCHASED = "purchased",
    CLOSED = "closed",
}

export {
    CarStatus,
    TradeStatus
}