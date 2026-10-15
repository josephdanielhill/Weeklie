# Changelog

## [0.1.21](https://github.com/josephdanielhill/Weeklie/compare/v0.1.20...v0.1.21) (2026-10-15)


### Features

* add Changelog link in footer (WEE-1) ([aba30e8](https://github.com/josephdanielhill/Weeklie/commit/aba30e844fa64dd439aeb37f3c6cb37972000234))
* add per-PR preview deploy to Cloudflare Pages (per-issue test URLs) ([8c02ad9](https://github.com/josephdanielhill/Weeklie/commit/8c02ad9facfbfc59500139a09a78f77299cddee7))
* add workflow_dispatch trigger to per-PR preview deploy ([10bc490](https://github.com/josephdanielhill/Weeklie/commit/10bc49029fdf821b4112a61ac08f750cc787475f))
* replace single carry-over +/- with separate hours and minutes controls ([ef35c38](https://github.com/josephdanielhill/Weeklie/commit/ef35c38f8e8a21498885da3e4deb838010afc68c))


### Bug Fixes

* display version from package.json instead of hardcoded string ([a35af6e](https://github.com/josephdanielhill/Weeklie/commit/a35af6e0ee1472a79d12baf6d57137895b799b80))
* prevent deploy workflow from re-triggering on bot version bump ([8cb077a](https://github.com/josephdanielhill/Weeklie/commit/8cb077a4799ded73d1fb8086877e08a0c381862e))
* remove auto-commit from deploy + add safe manual version bump ([3f6295d](https://github.com/josephdanielhill/Weeklie/commit/3f6295df91826180b6bb30c81a0faae84ef3aadc))
* sync package-lock.json to fix CI build ([091a304](https://github.com/josephdanielhill/Weeklie/commit/091a30464c13348f2a2e2f4f3450f7d82a0d8f92))
* use root base path for custom domain, add CNAME ([40301a5](https://github.com/josephdanielhill/Weeklie/commit/40301a5920f8f533ecaffee2aebc4c0bd03e697a))
