# SpatialReference
> A helper library for translating between spatial reference systems

[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url

[npm-img]: https://img.shields.io/npm/v/spatialreference.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/spatialreference
[travis-img]: https://img.shields.io/travis/koopjs/spatialreference/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/koopjs/spatialreference

## Usage

Basic installation: `npm install spatialreference`

Then to use the module: `var SR = require('spatialreference')`

## API

### wkidToWkt
This method takes a spatial reference system well-known id and gets the well-known text. If the WKID is an esri code, then it will use the esri-proj-codes library. If the WKID is available in a passed in database it will get it from there. Else it will make a request to http://www.spatialreference.org, insert the WKT into the database and return it to the client. 

Example using [koop-pgcache](https://github.com/koopjs/koop-pgcache)
``` javascript
var SpatialReference = require('spatialreference')
var db = require('koop-pgcache')

var sr = new SpatialReference({db: db})

sr.wkidToWkt(2927, function (err, wkt) {
	if (err) return console.error(err)
	console.log(wkt) 
	// 'PROJCS["NAD83(HARN) / Washington South (ftUS)",GEOGCS["NAD83(HARN)",DATUM["NAD83_High_Accuracy_Regional_Network",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6152"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4152"]],UNIT["US survey foot",0.3048006096012192,AUTHORITY["EPSG","9003"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",47.33333333333334],PARAMETER["standard_parallel_2",45.83333333333334],PARAMETER["latitude_of_origin",45.33333333333334],PARAMETER["central_meridian",-120.5],PARAMETER["false_easting",1640416.667],PARAMETER["false_northing",0],AUTHORITY["EPSG","2927"],AXIS["X",EAST],AXIS["Y",NORTH]]'
})
```

### esriLookup
This is a pure wrapper around the [esri-proj-codes library](https://github.com/esri/esri-proj-codes). It gets the esri format of the well-known text for a projection when given the well-known id.

```javascript
var SpatialReference = require('spatialreference')

var sr = new SpatialReference()

sr.esriLookup(2927, function (err, wkt) {
	if (err) return console.error(err)
	console.log(wkt) 
	// PROJCS["NAD_1983_HARN_StatePlane_Washington_South_FIPS_4602_Feet",GEOGCS["GCS_North_American_1983_HARN",DATUM["D_North_American_1983_HARN",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",1640416.666666667],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-120.5],PARAMETER["Standard_Parallel_1",45.83333333333334],PARAMETER["Standard_Parallel_2",47.33333333333334],PARAMETER["Latitude_Of_Origin",45.33333333333334],UNIT["Foot_US",0.3048006096012192]]
})
```

## Thank yous
This module leans heavily on the spatial reference information saved in PostGIS and the data available at spatialreference.org. It would not be possible without those two resources. So thank you to all involved.
