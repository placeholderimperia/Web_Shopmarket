
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
- Load products from JSON (`assets/data/products.json`) and add filters (Fuse.js).
- Swap custom hero with Swiper.js for richer controls & A11y.
- Add JSON-LD `Product` schema for better SEO.

## [0.3.0] - 2025-09-10
### Added
- Products **grid** rendered from JS array (`header.js`) with responsive **3/2/1** columns.
- Product card component: badges, perks, formatted prices and CTA.

### Changed
- First product image → `assets/pics/iphone-14-pro-deeppurple.jpg`.
- Cleaned stray static `.product-card` from HTML; grid now renders only from data.

## [0.2.0] - 2025-09-09
### Added
- Hero slider (autoplay, dots, swipe, pause-on-hover).
- Desktop categories sidebar: sticky & always open.
- Mobile categories panel: off-canvas + overlay.

## [0.1.0] - 2025-09-08
### Added
- Initial scaffold: header (logo, search, promo pill, quick icons, locale), main nav, base styles and layout.
