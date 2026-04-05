import { TransactionsResponse, TransactionStatus } from "@/types";

export const transactionsResponse: TransactionsResponse = {
  name: "string",
  size: 1,
  totalItems: 0,
  nextPage: 1,
  previousPage: 1,
  pageCount: 1,
  page: 1,
  limit: 1,
  records: [
    {
      id: "3a5aaea8-504a-4404-ad3d-b82574fba5e5",
      reference: "BB_4a5aaea8-504a-4404-ad3d-b82574fba6e6",
      providerReference: "qTPrJoy9Bx",
      entityId: "19287e7f-cc30-4000-84a8-03ca70de3701",
      entityType: "USER_ACCOUNT",
      initiatedBy: "3a5aaea8-504a-4404-ad3d-b82574fba5e5",
      dueAmount: 251.08,
      transactionAmount: 251.08,
      signedAmount: -251.08,
      type: "DEPOSIT",
      provider: "PAYSTACK",
      status: "PENDING" as TransactionStatus,
      note: "Transaction notes",
      currency: "NGN",
      statusReason: "Reason for the current transaction status",
      transactionUrl: "https://checkout.paystack.com/7zu1ot06d0qn9h6",
      createdAt: "1970-01-01T00:00:00.000Z",
      completedAt: "1970-01-01T00:00:00.000Z",
      metadata: [
        {
          name: "meta_name",
          value: "string",
        },
      ],
    },
  ],
};
