export const formatPhoneNumber = (phoneNumber: string) => {
  // Remove all non-numeric characters
  let cleaned = phoneNumber.replace(/\D/g, "");

  // If it starts with '0', replace it with '234'
  if (cleaned.startsWith("0")) {
    cleaned = `234${cleaned.slice(1)}`;
  }

  // If it starts with '234', keep it as is
  // If it starts with '+234', remove the plus sign
  if (cleaned.startsWith("234")) {
    return `+${cleaned}`;
  }

  // If it starts with something else, assume it's already correct
  return `+${cleaned}`;
};
