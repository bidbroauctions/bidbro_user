import {
  Auction,
  AuctionStatus,
  Bid,
  BidStatus,
  PaginationResponse,
  PurchaseStatus,
} from "@/types";

// Helper function to add days to current date
const addDays = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const auctions: Auction[] = [
  {
    id: "3a5aaea8-504a-4404-ad3d-b82574fba5e5",
    lotNumber: "HQ79739309",
    make: "Mercedes Benz",
    model: "C 300",
    slug: "mercedes-benz-c300-2009-gray-3a5aaea8-504a-4404-ad3d-b82574fba5e5",
    description: "This brand new mercedes benz C300 is up for grab",
    yearOfManufacture: "2009",
    yearOfPurchase: "2021",
    purchaseStatus: "BRAND_NEW" as PurchaseStatus,
    status: "IN_PROGRESS" as AuctionStatus,
    functional: "YES",
    currency: "NGN",
    startAmount: 1499.99,
    reservedPrice: 1499.99,
    buyNowAmount: 1499.99,
    buyNowPrice: 1499.99,
    displayStartAmount: true,
    bidStartDate: new Date().toISOString(), // Current date
    bidEndDate: addDays(12), // 12 days from now
    auctionEndDate: addDays(14), // 14 days from now
    conclusionDate: addDays(20), // 20 days from now
    entityId: "19280cd8-ede0-4000-88d7-e7cd021cb501",
    entityType: "USER_ACCOUNT",
    category: {
      id: "3a5aaea8-504a-4404-ad3d-b82574fba5e5",
      createdBy: "3a5aaea8-504a-4404-ad3d-b82574fba5e5",
      name: "Cars",
      slug: "cars",
      description: "All cars types and models",
      isReturnable: true,
      isTaxable: true,
      isStaled: false,
      imageUrl:
        "https://s3.us-west-2.amazonaws.com/files.production.bidbroauctions.com/public/profiles/picture_d1687bfb-0f8d-4ab6-b8e1-d7dfefb8029e.png",
      createdAt: new Date().toISOString(),
      deletedAt: new Date().toISOString(),
    },
    postedBy: {
      id: "3a5aaea8-504a-4404-ad3d-b82574fba5e5",
      accountId: "3a5aaea8-504a-4404-ad3d-b82574fba5e5",
      email: "johnsmith@abc.xyz",
      firstName: "John",
      lastName: "Smith",
      imageUrl:
        "https://s3.us-west-2.amazonaws.com/files.production.bidbroauctions.com/public/profiles/picture_d1687bfb-0f8d-4ab6-b8e1-d7dfefb8029e.png",
    },
    location: {
      placeId: "ChIJOwg_06VPwokRYv534QaPC8g",
      fullAddress: "20 St. Adams Street, GRA, Ikeja, Lagos, Nigeria",
      state: "Lagos",
      country: "Nigeria",
      coordinates: {
        lng: 3.3678,
        lat: 6.5678,
      },
    },
    media: [
      {
        id: "3a5aaea8-504a-4404-ad3d-b82574fba5e5",
        type: "IMAGE_FRONT",
        url: "https://s3.us-west-2.amazonaws.com/files.production.bidbroauctions.com/public/profiles/picture_d1687bfb-0f8d-4ab6-b8e1-d7dfefb8029e.png",
        description: "Front view of mercedes benz c300",
      },
    ],
    createdAt: new Date().toISOString(),
    deletedAt: new Date().toISOString(),
  },
];

export const my_auctions: PaginationResponse<Auction> = {
  name: "string",
  size: 1,
  totalItems: 0,
  nextPage: 0,
  previousPage: 0,
  pageCount: 1,
  page: 1,
  limit: 1,
  records: auctions,
};

export const bids: Bid[] = [
  {
    id: "3a5aaea8-504a-4404-ad3d-b82574fba5e5",
    bidAmount: 1499.99,
    currency: "NGN",
    buyNow: true,
    status: "IN_PROGRESS" as BidStatus,
    owner: {
      id: "3a5aaea8-504a-4404-ad3d-b82574fba5e5",
      accountId: "3a5aaea8-504a-4404-ad3d-b82574fba5e5",
      email: "johnsmith@abc.xyz",
      firstName: "John",
      lastName: "Smith",
      imageUrl:
        "https://s3.us-west-2.amazonaws.com/files.production.bidbroauctions.com/public/profiles/picture_d1687bfb-0f8d-4ab6-b8e1-d7dfefb8029e.png",
    },
    payment: {
      id: "3a5aaea8-504a-4404-ad3d-b82574fba5e5",
      reference: "BB-BID-4a5aaea8-504a-4404-ad3d-b82574fba6e6",
      status: "PENDING",
      transactionAmount: 1499.99,
      currency: "NGN",
    },
    item: auctions[0],
    createdAt: new Date().toISOString(),
    deletedAt: new Date().toISOString(),
  },
];
