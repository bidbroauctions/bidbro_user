import { StaticImageData } from "next/image";

export enum USER_TYPE {
  user = "PUBLIC_USER",
  company = "CORPORATE_USER",
  ADMIN = "ADMIN",
}

export interface ApiErrorResponse<T = unknown> {
  code: string;
  message: string;
  data: T;
  traceId: string;
}

export interface ApiSuccessResponse<T = unknown> {
  message: string;
  data: T;
  success: boolean;
}

export interface Location {
  placeId: string;
  fullAddress: string;
  state: string;
  country: string;
  coordinates: Coordinates;
}

export interface Coordinates {
  lng: number;
  lat: number;
}
export interface ReleasePeriod {
  startAt: string;
  endAt: string;
}
export interface User {
  id: string;
  accountId: string;
  email: string;
  firstName: string;
  lastName: string;
  address: Location;
  gender: string;
  imageUrl: string;
  phone: string;
  dob: string;
  status: UserStatus;
  statusReason: string;
  createdAt: string;
  deletedAt: string;
}
export enum CompanyStatus {
  PARTIAL = "PARTIAL",
  REQUIRE_REVIEW = "REQUIRE_REVIEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface Company {
  id: string;
  name: string;
  address: Location;
  about: string;
  logoUrl: string;
  phone: string;
  email: string;
  website: string;
  authorizationLetter: string;
  status: CompanyStatus;
  createdBy: string;
  createdAt: string;
}

export interface Metadata {
  name: string;
  value: string;
}
export enum UserStatus {
  ACTIVE = "ACTIVE",
  PARTIAL = "PARTIAL",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}

export interface VerifyOtpResponse {
  accountId: string;
  accessType: string;
  status: UserStatus;
  permissions: string[];
  createdAt: string;
  user: User;
  company: Company;
  metadata: Metadata[];
  accessToken: string;
  refreshToken: string;
  sessionExpiresAt: string;
}

export interface FileUploadResponse {
  type: string | AuctionMedia;
  uploadKey?: string;
  contentType?: string;
  description: string;
  isPrivate?: boolean;
  uploadedBy?: string;
  id: string;
  url: string | StaticImageData;
  presignedUrl?: string;
}
export enum PurchaseStatus {
  BRAND_NEW = "BRAND_NEW",
  USED = "USED",
}

export interface Category {
  id: string;
  createdBy: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isReturnable: boolean;
  isTaxable: boolean;
  isStaled: boolean;
  createdAt: string;
  deletedAt?: string;
}

export interface PaginationResponse<T> {
  name: string;
  size: number;
  limit: number;
  page: number;
  pageCount: number;
  previousPage: number | null;
  nextPage: number | null;
  totalItems: number;
  records: T[];
}
export enum AuctionStatus {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  CONCLUDED = "CONCLUDED",
  REJECTED = "REJECTED",
  ACTIONED = "ACTIONED",
  WITHDRAWN = "WITHDRAWN",
  CANCELED = "CANCELED",
}
export const enum AddAuctionModalTypes {
  ACCOUNT_ACCOUNT_DETAILS_WARNING = "ACCOUNT_ACCOUNT_DETAILS_WARNING",
  ACCOUNT_ACCOUNT_DETAILS = "ACCOUNT_ACCOUNT_DETAILS",
  ACCOUNT_ACCOUNT_DETAILS_OTP = "ACCOUNT_ACCOUNT_DETAILS_OTP",
  ACCOUNT_ACCOUNT_DETAILS_SUCCESS = "ACCOUNT_ACCOUNT_DETAILS_SUCCESS",
  ADD_AUCTION_CONFIRMATION = "ADD_AUCTION_CONFIRMATION",
  ADD_AUCTION_SUCCESS = "ADD_AUCTION_SUCCESS",
}
// src/types/AddBankAccountModalTypes.ts

export enum AddBankAccountModalTypes {
  ACCOUNT_ACCOUNT_DETAILS = "ACCOUNT_ACCOUNT_DETAILS",
  ACCOUNT_ACCOUNT_DETAILS_OTP = "ACCOUNT_ACCOUNT_DETAILS_OTP",
  ACCOUNT_ACCOUNT_DETAILS_SUCCESS = "ACCOUNT_ACCOUNT_DETAILS_SUCCESS",
}

export interface Auction {
  id: string;
  lotNumber: string;
  make: string;
  model: string;
  slug: string;
  description: string;
  yearOfManufacture: string;
  yearOfPurchase: string;
  purchaseStatus: PurchaseStatus; // Example: "BRAND_NEW"
  status: AuctionStatus; // Example: "IN_PROGRESS"
  functional: string; // Example: "YES"
  currency: string; // Example: "NGN"
  startAmount: number; // Initial bidding amount
  reservedPrice: number; // Reserved price for the item
  buyNowAmount: number; // Price for immediate purchase
  buyNowPrice: number; // Buy Now price displayed
  displayStartAmount: boolean;
  bidStartDate: string; // ISO format string, e.g., "1970-01-01T00:00:00.000Z"
  bidEndDate: string; // ISO format string, e.g., "1970-01-01T00:00:00.000Z"
  auctionEndDate: string; // ISO format string, e.g., "1970-01-01T00:00:00.000Z"
  conclusionDate: string; // ISO format string, e.g., "1970-01-01T00:00:00.000Z"
  entityId: string; // ID of the entity that owns the auction item
  entityType: string; // Type of the entity, e.g., "USER_ACCOUNT"
  category: Category; // Category information
  postedBy: Partial<User>; // User who posted the auction
  location: Location; // Location information for the auction
  media: Partial<FileUploadResponse>[]; // Array of media objects
  createdAt: string; // Creation timestamp
  deletedAt?: string | null; // Deletion timestamp, can be null
}

export interface Payment {
  id: string;
  reference: string;
  status: string;
  transactionAmount: number;
  currency: string;
}
export interface Bid {
  id: string;
  bidAmount: number;
  currency: string;
  buyNow: boolean;
  status: BidStatus;
  owner: Partial<User>;
  payment: Payment;
  item: Auction;
  createdAt: string;
  deletedAt: string | null;
}
export enum AuctionMedia {
  IMAGE_FRONT = "IMAGE_FRONT",
  IMAGE_BACK = "IMAGE_BACK",
  IMAGE_RIGHT = "IMAGE_RIGHT",
  IMAGE_LEFT = "IMAGE_LEFT",
  IMAGE_INSIDE = "IMAGE_INSIDE",
  IMAGE_OTHER = "IMAGE_OTHER",
  VIDEO = "VIDEO",
}

export enum BidStatus {
  INITIATED = "INITIATED",
  IN_PROGRESS = "IN_PROGRESS",
  AMOUNT_LOCKED = "AMOUNT_LOCKED",
  SELECTED = "SELECTED",
  REFUND_INITIATED = "REFUND_INITIATED",
  REFUND_COMPLETED = "REFUND_COMPLETED",
  REJECTION_INITIATED = "REJECTION_INITIATED",
  REJECTED = "REJECTED",
  RELEASE_INITIATED = "RELEASE_INITIATED",
  WON = "WON",
  LOST = "LOST",
  WITHDRAWN = "WITHDRAWN",
  CANCELED = "CANCELED",
}
export interface BankRecord {
  id: number;
  code: string;
  name: string;
  provider: string;
  country: string;
  currency: string;
  type: string;
}

export interface BankRecordsResponse {
  records: BankRecord[];
}

export interface BankAccountResolveResponse {
  resolved: boolean;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  bankId: number;
}

export interface AddBankAccountResponse {
  id: string;
  bankCode: string;
  provider: string;
  currency: string;
  bankName: string;
  bankLogoUrl: string;
  bankId: string;
  accountNumber: string;
  accountName: string;
  entityId: string;
  entityType: string;
  createdBy: string;
  createdAt: string;
  deletedAt: string;
}
export interface BankAccount {
  id: string;
  bankCode: string;
  provider: string;
  currency: string;
  bankName: string;
  bankLogoUrl: string;
  bankId: string;
  accountNumber: string;
  accountName: string;
  entityId: string;
  entityType: string;
  createdBy: string;
  createdAt: string;
  deletedAt: string;
}

// Response for fetching all bank accounts
export interface BankAccountsResponse extends PaginationResponse<BankAccount> {}
export interface CompanyUpdateRequest {
  name: string;
  address: Location;
  about?: string;
  logoUrl: string;
  phone: string;
  email: string;
  website: string;
  authorizationLetter: string;
}

export interface CompanyUpdateResponse {
  accountId: string;
  accessType: string;
  status: string;
  permissions: string[];
  createdAt: string;
  user: User;
  company: Company;
  metadata: Metadata[];
}
export enum Status {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface Wallet {
  id: string;
  entityId: string;
  entityType: string;
  bookBalance: number;
  availableBalance: number;
  type: string;
  currency: string;
  frozen: boolean;
}

// Response for fetching wallets
export interface WalletsResponse {
  records: Wallet[];
}

export interface TransactionMetadata {
  name: string;
  value: string;
}

export interface Transaction {
  id: string;
  reference: string;
  providerReference: string;
  entityId: string;
  entityType: string;
  initiatedBy: string;
  dueAmount: number;
  transactionAmount: number;
  signedAmount: number;
  type: string;
  provider: string;
  status: TransactionStatus;
  note: string;
  currency: string;
  statusReason: string;
  transactionUrl: string;
  createdAt: string;
  completedAt: string;
  metadata: TransactionMetadata[];
}
export enum TransactionStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  PARTIAL = "PARTIAL",
}

// Response for fetching all transactions
export interface TransactionsResponse extends PaginationResponse<Transaction> {}
