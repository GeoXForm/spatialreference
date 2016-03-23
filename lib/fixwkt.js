/**
 * Fixes incorrect WKT Strings
 *
 * @param {string} inWkt - The original well-known text for the projection
 * @param {integer} wkid - The well-known id for the projection
 * @private
 */
module.exports = function (inWkt, wkid) {
  // we have issue projecting this WKID w/o a datum xform
  // FYI there may be other proj codes needed here
  var wkt
  switch (wkid) {
    case 3078:
      wkt = '+proj=omerc +lat_0=45.30916666666666 +lonc=-86 +alpha=337.25556 +k=0.9996 +x_0=2546731.496 +y_0=-4354009.816 + ellps=GRS80 +datum=NAD83 +units=m +no_defs'
      break
    case 28992:
      wkt = '+title=Amersfoort/Amersfoort +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812'
      break
    case 5514:
      wkt = 'PROJCS["S-JTSK_Krovak_East_North",GEOGCS["GCS_S_JTSK",DATUM["Jednotne_Trigonometricke_Site_Katastralni",SPHEROID["Bessel_1841",6377397.155,299.1528128]],TOWGS84[589,76,480,0,0,0,0],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]],PROJECTION["Krovak"],PARAMETER["False_Easting",0],PARAMETER["False_Northing",0],PARAMETER["Pseudo_Standard_Parallel_1",78.5],PARAMETER["Scale_Factor",0.9999],PARAMETER["Azimuth",30.28813975277778],PARAMETER["Longitude_Of_Center",24.83333333333333],PARAMETER["Latitude_Of_Center",49.5],PARAMETER["X_Scale",-1],PARAMETER["Y_Scale",1],PARAMETER["XY_Plane_Rotation",90],UNIT["Meter",1],AUTHORITY["EPSG","102067"]]'
      break
    case 2264:
      wkt = 'PROJCS["NAD_1983_StatePlane_North_Carolina_FIPS_3200_Feet",GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",2000000.002616666],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-79.0],PARAMETER["Standard_Parallel_1",34.33333333333334],PARAMETER["Standard_Parallel_2",36.16666666666666],PARAMETER["Latitude_Of_Origin",33.75],UNIT["Foot_US",0.3048006096012192]]'
      break
    default:
      wkt = inWkt
  }
  // per Melita Kennedy @esri This is the correct datum transformation to NAD83 for the variant of WGS84 used in recent data. See also: http://www.epsg-registry.org/
  if (wkt.match(/NAD83/)) return wkt.replace('TOWGS84[0,0,0,0,0,0,0]', 'TOWGS84[-0.9956,1.9013,0.5215,0.025915,0.009426,0.011599,-0.00062]')
  if (wkt.match(/UTM/)) return wkt.replace('TOWGS84[0,0,0,0,0,0,0]', 'TOWGS84[-0.9956,1.9013,0.5215,0.025915,0.009426,0.011599,-0.00062]')
  return wkt
}
