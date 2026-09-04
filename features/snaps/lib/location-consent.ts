export function hasLocationConsent(
  consentAt: string | null | undefined,
): boolean {
  return typeof consentAt === "string" && consentAt.length > 0;
}
