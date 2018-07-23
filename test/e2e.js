
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

test('e2e tests', function (t) {
  t.test('when the wkid is not in the db, not in ESRI, call epsg.io', function (t) {
    t.plan(4)
    sr.wkidToWkt(7088, function (err, wkt) {
      t.equals(err, null)
      t.equals(wkt, 'GEOGCS["GRS 1980(IUGG, 1980)",DATUM["unknown",SPHEROID["GRS80",6378137,298.257222101]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433],AUTHORITY["epsg","7088"]]')
      t.equals(err, null)
      t.equals(wkidHash.get(7088), 'GEOGCS["GRS 1980(IUGG, 1980)",DATUM["unknown",SPHEROID["GRS80",6378137,298.257222101]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433],AUTHORITY["epsg","7088"]]')
    })
  })
})
