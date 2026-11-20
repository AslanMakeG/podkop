import { ValidationResult } from './types';

export function validateDomain(
  domain: string,
  allowDotTLD = false,
  allowPatterns = false,
): ValidationResult {
  const domainRegex =
    /^(?=.{1,253}(?:\/|$))(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)\.)+(?:[a-zA-Z]{2,}|xn--[a-zA-Z0-9-]{1,59}[a-zA-Z0-9])(?:\/[^\s]*)?$/;

  if (allowDotTLD) {
    const dotTLD = /^\.[a-zA-Z]{2,}$/;
    if (dotTLD.test(domain)) {
      return { valid: true, message: _('Valid') };
    }
  }

  if (allowPatterns) {
    const dotSuffixRegex =
      /^(?=.{2,253}$)\.(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*(?:[a-zA-Z]{2,}|xn--[a-zA-Z0-9-]{1,59}[a-zA-Z0-9])$/;
    if (dotSuffixRegex.test(domain)) {
      return { valid: true, message: _('Valid') };
    }

    const keywordRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$/;
    if (keywordRegex.test(domain)) {
      return { valid: true, message: _('Valid') };
    }

    if (
      domain.includes('*') &&
      domain.length <= 253 &&
      !domain.includes('..') &&
      /^[a-zA-Z0-9.*-]+$/.test(domain) &&
      /[a-zA-Z0-9]/.test(domain)
    ) {
      return { valid: true, message: _('Valid') };
    }
  }

  if (!domainRegex.test(domain)) {
    return { valid: false, message: _('Invalid domain address') };
  }

  const hostname = domain.split('/')[0];
  const parts = hostname.split('.');

  const atLeastOneInvalidPart = parts.some((part) => part.length > 63);

  if (atLeastOneInvalidPart) {
    return { valid: false, message: _('Invalid domain address') };
  }

  return { valid: true, message: _('Valid') };
}
