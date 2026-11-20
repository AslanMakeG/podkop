import { describe, expect, it } from 'vitest';
import { validateDomain } from '../validateDomain';

export const validDomains = [
  ['Simple domain', 'example.com'],
  ['Subdomain', 'sub.example.com'],
  ['With dash', 'my-site.org'],
  ['With numbers', 'site123.net'],
  ['Deep subdomain', 'a.b.c.example.co.uk'],
  ['With path', 'example.com/path/to/resource'],
  ['Punycode RU', 'xn--d1acufc.xn--p1ai'],
  ['Adguard dns', 'dns.adguard-dns.com'],
  ['Nextdns dns', 'dns.nextdns.io/xxxxxxx'],
  ['Long domain (63 chars in label)', 'a'.repeat(63) + '.com'],
];

export const invalidDomains = [
  ['No TLD', 'localhost'],
  ['Only TLD', '.com'],
  ['Double dot', 'example..com'],
  ['Illegal chars', 'exa!mple.com'],
  ['Space inside', 'exa mple.com'],
  ['Ending with dash', 'example-.com'],
  ['Starting with dash', '-example.com'],
  ['Trailing dot', 'example.com.'],
  ['Too short TLD', 'example.c'],
  ['With protocol (not allowed)', 'http://example.com'],
  ['Too long label (>63 chars)', 'a'.repeat(64) + '.com'],
  ['Too long domain (>253 chars)', Array(40).fill('abcdef').join('.') + '.com'],
];

export const dotTLDTests = [
  ['Dot TLD allowed (.net)', '.net', true, true],
  ['Dot TLD not allowed (.net)', '.net', false, false],
  ['Invalid with double dot', '..net', true, false],
  ['Invalid single word TLD (net)', 'net', true, false],
];

export const patternTests = [
  ['Keyword (pinterest)', 'pinterest', true],
  ['Keyword with dash (my-site)', 'my-site', true],
  ['Keyword with digits (2ip)', '2ip', true],
  ['Wildcard subdomain (*.pinterest.ru)', '*.pinterest.ru', true],
  ['Wildcard TLD (pinterest.*)', 'pinterest.*', true],
  ['Wildcard both (*.pinterest.*)', '*.pinterest.*', true],
  ['Wildcard substring (*pinterest*)', '*pinterest*', true],
  ['Wildcard prefix (cdn-*.turbo.cr)', 'cdn-*.turbo.cr', true],
  ['Dot-prefixed domain (.pinterest.ru)', '.pinterest.ru', true],
  ['Reject bare wildcard (*)', '*', false],
  ['Reject wildcard dot (*.*)', '*.*', false],
  ['Reject double dot (*.pinterest..ru)', '*.pinterest..ru', false],
  ['Reject leading dash keyword (-pinterest)', '-pinterest', false],
  ['Reject trailing dash keyword (pinterest-)', 'pinterest-', false],
  ['Reject protocol (http://pinterest.ru)', 'http://pinterest.ru', false],
  ['Reject spaces (* pinterest.ru)', '* pinterest.ru', false],
];

describe('validateDomain', () => {
  describe.each(validDomains)('Valid domain: %s', (_desc, domain) => {
    it(`returns valid=true for "${domain}"`, () => {
      const res = validateDomain(domain);
      expect(res.valid).toBe(true);
    });
  });

  describe.each(invalidDomains)('Invalid domain: %s', (_desc, domain) => {
    it(`returns valid=false for "${domain}"`, () => {
      const res = validateDomain(domain);
      expect(res.valid).toBe(false);
    });
  });

  describe.each(dotTLDTests)(
    'Dot TLD toggle: %s',
    (_desc, domain, allowDotTLD, expected) => {
      it(`"${domain}" with allowDotTLD=${allowDotTLD} → valid=${expected}`, () => {
        const res = validateDomain(domain, allowDotTLD);
        expect(res.valid).toBe(expected);
      });
    },
  );

  describe.each(patternTests)(
    'Domain patterns toggle: %s',
    (_desc, domain, expected) => {
      it(`"${domain}" with allowPatterns=true → valid=${expected}`, () => {
        const res = validateDomain(domain, true, true);
        expect(res.valid).toBe(expected);
      });
    },
  );
});
