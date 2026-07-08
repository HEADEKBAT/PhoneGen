# GenCore SEO Health Check Report

**Date**: 2026-07-08

**Base URL**: https://www.gencore.space

## Summary

| Metric | Value |
|---|---|
| Pages Discovered | 1944 |
| Locales | en, ru, de, es, fr, pt |
| Checks Run | 16 |
| Overall Score | 99/100 |
| Grade | 🟢 Excellent |
| Issues | 2 |

## Check Results

| Check | Status | Score | Details |
|---|---|---|---|
| Sitemap | ✅ PASS | 100/100 | All pages accounted for in sitemap |
| Robots | ✅ PASS | 100/100 | robots.txt properly configured |
| Metadata | ✅ PASS | 100/100 | All metadata within acceptable ranges |
| Canonical | ✅ PASS | 100/100 | All canonical URLs properly generated |
| Hreflang | ✅ PASS | 100/100 | All hreflang alternates properly generated |
| JSON-LD | ✅ PASS | 100/100 | All pages have proper structured data metadata |
| OpenGraph | ✅ PASS | 100/100 | All OpenGraph tags present |
| Twitter | ✅ PASS | 100/100 | All Twitter card tags present |
| Links | ✅ PASS | 100/100 | No broken or placeholder links found |
| Images | ✅ PASS | 100/100 | All images have alt text |
| Pages | ✅ PASS | 100/100 | All registered pages have corresponding files |
| Generators | ⚠️ WARN | 85/100 | All generators reference valid products; 1 slug collision(s) detected (expected for tool pages) |
| | | | **Affected pages:** |
| | | | `all/?slug=tool` — Slug "tool" shared by 28 generators: address-generic, barcode-codabar, barcode-code128, barcode-code39, barcode-code93, company-generic, barcode-ean13, barcode-ean8, email-generic, barcode-gs1-128, barcode-gtin, barcode-isbn, barcode-ismn, barcode-issn, barcode-itf14, credential-oauth-secret, credential-passphrase, credential-password, barcode-pharmacode, credential-pin, credential-random-token, credential-session-secret, barcode-upca, barcode-upce, user-profile, username-generic, uuid-generic, credential-uuid-v7 (expected for tool pages) |
| Registry | ⚠️ WARN | 85/100 | Slug "tool" shared by 28 generators (expected — "tool" is the barcode studio slug) |
| | | | **Affected pages:** |
| | | | `all/uuid-generator` — SEO page slug "uuid-generator" conflicts with product slug |
| Localization | ✅ PASS | 100/100 | All 6 locale files present and consistent |
| Accessibility | ✅ PASS | 100/100 | Basic a11y checks passed (static analysis) |
| Performance | ✅ PASS | 100/100 | Notable dependencies (may impact bundle): @faker-js/faker, jsbarcode, libphonenumber-js, @types/jsbarcode; 49 client components, dynamic imports: no |
