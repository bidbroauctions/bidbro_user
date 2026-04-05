export function maskEmail(email: string): string {
  const [name, domain] = email.split("@");

  // Mask the first part (before '@') except for the last 4 characters
  const maskedName = name.slice(0, 2).padEnd(name.length, "*");

  // Mask the domain (before the last part)
  const [domainName, domainExt] = domain.split(".");
  const maskedDomain = domainName.slice(0, 1).padEnd(domainName.length, "*");

  return `${maskedName}@${maskedDomain}.${domainExt}`;
}
