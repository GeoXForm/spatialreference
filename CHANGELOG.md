# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased
### Fixed
* Remove async/await and rewrite with promises to support older versions of Node

## [1.1.0] - 2018-07-23
### Changed
* Altered flow: first look in DB, then ESRI codes, then epsg.io
* Use promises, async/await, and as result, compile into a distribution that allow for use in older Node versions

### Added
* Also check ESRI deprecated codes

## [1.0.4] - 2017-03-14
### Fixed
* Use correct translation for non HARD NAD83

## [1.0.3] - 2016-03-25
### Added
* Override wkid: 2264

## [1.0.2] - 2016-01-04
### Fixed
* Add corrections for known problematic wkts

## [1.0.1] - 2015-09-18
### Changed
* Change from spatialreference.org to epsg.io

[1.1.0]: https://github.com/koopjs/spatialreference/compare/v1.0.4...v1.1.0
[1.0.4]: https://github.com/koopjs/spatialreference/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/koopjs/spatialreference/compare/v1.0.3...v1.0.2
[1.0.2]: https://github.com/koopjs/spatialreference/compare/v1.0.2...v1.0.1
[1.0.1]: https://github.com/koopjs/spatialreference/compare/v1.0.0...v1.0.1
