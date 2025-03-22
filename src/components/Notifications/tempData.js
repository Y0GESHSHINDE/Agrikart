export const tempNotifications = [
  {
    _id: "1",
    title: "New Tractor Rental Request",
    message: "John Doe requested to rent your Mahindra Tractor",
    status: "pending",
    relatedTo: "rental_request",
    relatedId: "rent1",
    rentalDetails: {
      message: "I need the tractor for wheat harvesting",
      requestStartDate: "2024-03-25",
      requestEndDate: "2024-03-30",
      totalDays: 5,
      rentalType: "Daily",
      totalCost: 5000
    }
  },
  {
    _id: "2",
    title: "Rental Request Approved",
    message: "Your rental request for the Kubota Tractor has been approved",
    status: "accepted",
    relatedTo: "rental_response",
    relatedId: "rent2",
    rentalDetails: {
      message: "Request approved. Please proceed with payment",
      requestStartDate: "2024-04-01",
      requestEndDate: "2024-04-03",
      totalDays: 2,
      rentalType: "Daily",
      totalCost: 2000
    }
  },
  {
    _id: "3",
    title: "Rental Request Rejected",
    message: "Your request for the John Deere Harvester was rejected",
    status: "rejected",
    relatedTo: "rental_request",
    relatedId: "rent3",
    rentalDetails: {
      message: "Equipment not available",
      requestStartDate: "2024-03-28",
      requestEndDate: "2024-03-29",
      totalDays: 1,
      rentalType: "Daily",
      totalCost: 1000
    }
  },
  {
    _id: "4",
    title: "Urgent Rental Request",
    message: "Urgent request for Rotavator equipment",
    status: "pending",
    relatedTo: "rental_request",
    relatedId: "rent4",
    rentalDetails: {
      message: "Need urgently for field preparation",
      requestStartDate: "2024-03-26",
      requestEndDate: "2024-03-27",
      totalDays: 1,
      rentalType: "Daily",
      totalCost: 1500
    }
  },
  {
    _id: "5",
    title: "Payment Successful",
    message: "Payment received for Tractor rental",
    status: "accepted",
    relatedTo: "payment_confirmation",
    relatedId: "pay1",
    rentalDetails: {
      message: "Thank you for your payment",
      requestStartDate: "2024-04-05",
      requestEndDate: "2024-04-07",
      totalDays: 2,
      rentalType: "Daily",
      totalCost: 3000
    }
  },
  {
    _id: "6",
    title: "New Seeder Request",
    message: "Request for Agricultural Seeder",
    status: "pending",
    relatedTo: "rental_request",
    relatedId: "rent5",
    rentalDetails: {
      message: "Required for sowing season",
      requestStartDate: "2024-04-10",
      requestEndDate: "2024-04-12",
      totalDays: 2,
      rentalType: "Daily",
      totalCost: 2500
    }
  },
  {
    _id: "8",
    title: "Payment Required",
    message: "Payment pending for approved rental request",
    status: "accepted",
    relatedTo: "rental_response",
    relatedId: "rent7",
    rentalDetails: {
      message: "Please complete payment to confirm booking",
      requestStartDate: "2024-04-20",
      requestEndDate: "2024-04-22",
      totalDays: 2,
      rentalType: "Daily",
      totalCost: 4000
    }
  }
];