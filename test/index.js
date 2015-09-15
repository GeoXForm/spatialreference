var SpatialReference = require('../')
var test = require('tape')
var sinon = require('sinon')

// set up a fake db object with the methods the constructor is looking for
var db = {
  getWKT: function () {},
  insertWKT: function () {}
}

var sr = new SpatialReference({db: db})

test('translating wkid to wkt', function (t) {
  t.test('when the wkid is in the db', function (st) {
    st.plan(2)
    sinon.stub(sr, '_getFromDb', function (wkid, callback) {
      callback(null, 'PROJCS["NAD83(HARN) / Washington South (ftUS)",GEOGCS["NAD83(HARN)",DATUM["NAD83_High_Accuracy_Regional_Network",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6152"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4152"]],UNIT["US survey foot",0.3048006096012192,AUTHORITY["EPSG","9003"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",47.33333333333334],PARAMETER["standard_parallel_2",45.83333333333334],PARAMETER["latitude_of_origin",45.33333333333334],PARAMETER["central_meridian",-120.5],PARAMETER["false_easting",1640416.667],PARAMETER["false_northing",0],AUTHORITY["EPSG","2927"],AXIS["X",EAST],AXIS["Y",NORTH]]')
    })
    sr.wkidToWkt(2927, function (err, wkt) {
      st.error(err)
      st.equal(wkt, 'PROJCS["NAD83(HARN) / Washington South (ftUS)",GEOGCS["NAD83(HARN)",DATUM["NAD83_High_Accuracy_Regional_Network",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6152"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4152"]],UNIT["US survey foot",0.3048006096012192,AUTHORITY["EPSG","9003"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",47.33333333333334],PARAMETER["standard_parallel_2",45.83333333333334],PARAMETER["latitude_of_origin",45.33333333333334],PARAMETER["central_meridian",-120.5],PARAMETER["false_easting",1640416.667],PARAMETER["false_northing",0],AUTHORITY["EPSG","2927"],AXIS["X",EAST],AXIS["Y",NORTH]]')
      sr._getFromDb.restore()
    })
  })

  t.test('when the wkid is not in the db', function (st) {
    st.plan(5)
    sinon.stub(sr, '_getFromDb', function (wkid, callback) {
      callback(new Error())
    })

    sinon.stub(sr, '_req', function (url, callback) {
      callback(null, 'PROJCS["NAD83(HARN) / Washington South (ftUS)",GEOGCS["NAD83(HARN)",DATUM["NAD83_High_Accuracy_Regional_Network",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6152"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4152"]],UNIT["US survey foot",0.3048006096012192,AUTHORITY["EPSG","9003"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",47.33333333333334],PARAMETER["standard_parallel_2",45.83333333333334],PARAMETER["latitude_of_origin",45.33333333333334],PARAMETER["central_meridian",-120.5],PARAMETER["false_easting",1640416.667],PARAMETER["false_northing",0],AUTHORITY["EPSG","2927"],AXIS["X",EAST],AXIS["Y",NORTH]]')
    })

    sinon.stub(sr, '_insertIntoDb', function (wkid, wkt, callback) {
      callback(undefined, wkt)
    })

    sr.wkidToWkt(2927, function (err, wkt) {
      st.error(err)
      st.equal(wkt, 'PROJCS["NAD83(HARN) / Washington South (ftUS)",GEOGCS["NAD83(HARN)",DATUM["NAD83_High_Accuracy_Regional_Network",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6152"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4152"]],UNIT["US survey foot",0.3048006096012192,AUTHORITY["EPSG","9003"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",47.33333333333334],PARAMETER["standard_parallel_2",45.83333333333334],PARAMETER["latitude_of_origin",45.33333333333334],PARAMETER["central_meridian",-120.5],PARAMETER["false_easting",1640416.667],PARAMETER["false_northing",0],AUTHORITY["EPSG","2927"],AXIS["X",EAST],AXIS["Y",NORTH]]')
      st.equal(sr._getFromDb.called, true)
      st.equal(sr._insertIntoDb.called, true)
      st.equal(sr._req.called, true)
      sr._insertIntoDb.restore()
      sr._getFromDb.restore()
      sr._req.restore()
    })
  })

  t.test('getting an esri proj code', function (st) {
    st.plan(3)
    sinon.stub(sr, 'esriLookup', function (wkid, callback) {
      callback(null, 'foo')
    })

    sr.wkidToWkt(32767, function (err, wkt) {
      st.error(err)
      st.equal(wkt, 'foo')
      st.equal(sr.esriLookup.called, true)
      sr.esriLookup.restore()
    })
  })
})
