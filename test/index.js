
const test = require('tape')
const SpatialReference = require('../src/index')
const wkidHash = new Map()
wkidHash.set(2927, 'PROJCS["NAD83(HARN) / Washington South (ftUS)",GEOGCS["NAD83(HARN)",DATUM["NAD83_High_Accuracy_Regional_Network",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[-0.9956,1.9013,0.5215,0.025915,0.009426,0.011599,-0.00062],AUTHORITY["EPSG","6152"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4152"]],UNIT["US survey foot",0.3048006096012192,AUTHORITY["EPSG","9003"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",47.33333333333334],PARAMETER["standard_parallel_2",45.83333333333334],PARAMETER["latitude_of_origin",45.33333333333334],PARAMETER["central_meridian",-120.5],PARAMETER["false_easting",1640416.667],PARAMETER["false_northing",0],AUTHORITY["EPSG","2927"],AXIS["X",EAST],AXIS["Y",NORTH]]')

// set up a fake db object with the methods the constructor is looking for
var db = {
  getWKT: function (wkid, callback) {
    const wkt = wkidHash.get(wkid)
    if (!wkt) return callback(null, undefined)
    callback(null, wkt)
  },
  insertWKT: function (wkid, wkt, callback) {
    wkidHash.set(wkid, wkt)
    callback(null)
  }
}

var sr = new SpatialReference({db: db})

test('translating wkid to wkt', function (t) {
  t.test('when the wkid is in the db', function (t) {
    t.plan(2)
    sr.wkidToWkt(2927, function (err, wkt) {
      t.equals(err, null)
      t.equals(wkt, 'PROJCS["NAD83(HARN) / Washington South (ftUS)",GEOGCS["NAD83(HARN)",DATUM["NAD83_High_Accuracy_Regional_Network",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[-0.9956,1.9013,0.5215,0.025915,0.009426,0.011599,-0.00062],AUTHORITY["EPSG","6152"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4152"]],UNIT["US survey foot",0.3048006096012192,AUTHORITY["EPSG","9003"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",47.33333333333334],PARAMETER["standard_parallel_2",45.83333333333334],PARAMETER["latitude_of_origin",45.33333333333334],PARAMETER["central_meridian",-120.5],PARAMETER["false_easting",1640416.667],PARAMETER["false_northing",0],AUTHORITY["EPSG","2927"],AXIS["X",EAST],AXIS["Y",NORTH]]')
    })
  })

  t.test('when the wkid is not in the db, but is in ESRI current', function (t) {
    t.plan(4)
    sr.wkidToWkt(4269, function (err, wkt) {
      t.equals(err, null)
      t.equals(wkt, 'GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]')
      t.equals(err, null)
      t.equals(wkidHash.get(4269), 'GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]')
    })
  })

  t.test('when the wkid is not in the db, but is in ESRI deprecated', function (t) {
    t.plan(4)
    sr.wkidToWkt(102645, function (err, wkt) {
      t.equals(err, null)
      t.equals(wkt, 'PROJCS["NAD_1983_StatePlane_California_V_FIPS_0405_Feet",GEOGCS["GCS_North_American_1983",DATUM["North_American_Datum_1983",SPHEROID["GRS_1980",6378137,298.257222101]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["False_Easting",6561666.666666666],PARAMETER["False_Northing",1640416.666666667],PARAMETER["Central_Meridian",-118],PARAMETER["Standard_Parallel_1",34.03333333333333],PARAMETER["Standard_Parallel_2",35.46666666666667],PARAMETER["Latitude_Of_Origin",33.5],UNIT["Foot_US",0.30480060960121924],AUTHORITY["EPSG","102645"]]')
      t.equals(err, null)
      t.equals(wkidHash.get(102645), 'PROJCS["NAD_1983_StatePlane_California_V_FIPS_0405_Feet",GEOGCS["GCS_North_American_1983",DATUM["North_American_Datum_1983",SPHEROID["GRS_1980",6378137,298.257222101]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["False_Easting",6561666.666666666],PARAMETER["False_Northing",1640416.666666667],PARAMETER["Central_Meridian",-118],PARAMETER["Standard_Parallel_1",34.03333333333333],PARAMETER["Standard_Parallel_2",35.46666666666667],PARAMETER["Latitude_Of_Origin",33.5],UNIT["Foot_US",0.30480060960121924],AUTHORITY["EPSG","102645"]]')
    })
  })
})

test('direct esri lookup', function (t) {
  t.test('when the wkid is not deprecated', function (t) {
    t.plan(2)
    sr.esriLookup(4269, function (err, wkt) {
      t.equals(err, null)
      t.equals(wkt, 'GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]')
    })
  })
})
