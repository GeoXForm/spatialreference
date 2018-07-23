const request = require('request')
const fixWkt = require('./fixwkt')
const esriCodes = require('@esri/proj-codes')
const esriCodesDeprecated = require('esri-proj-codes')

/**
 * Define the SpatialReference class
 */
class SpatialReference {
  constructor (options) {
    // If a db was passed in, ensure it has required methods, then add to instance
    if (options.db && options.db.getWKT && options.db.insertWKT) {
      this.db = options.db
    } else if (options.db) {
      throw new Error('Passed in db does not support getWKT or insertWKT')
    }
    // Add optional logger to instance
    this.logger = options.logger
  }

  /**
   * Convert a wkid to a wkt, by 1) looking in db, 2) check ESRI lookups, 3) asking epsg.io
   * @param {integer} wkid
   * @param {function} callback
   */
  async wkidToWkt (wkid, callback) {
    try {
      let wkt
      // is a db used? check there first
      if (this.db) {
        wkt = await getFromDB.call(this, wkid)
        if (wkt) return callback(null, fixWkt(wkt))
      }
      // No db, or not found in DB
      if (!wkt) wkt = getWktFromEsri(wkid) || await getFromApi(wkid)

      // Insert into DB
      if (this.db) {
        return this.db.insertWKT(wkid, wkt, (err) => {
          if (err) log.call(this, 'error', 'Failed to insert WKT into database: ' + wkid + ' ' + wkt + ', ' + err.message)
          callback(err, fixWkt(wkt))
        })
      }
      callback(null, fixWkt(wkt))
    } catch (err) {
      // log
      log(this, 'error', err.message)
      callback(err)
    }
  }

  /**
   * Wrapper around ESRI lookup
   * @param {integer} wkid
   * @param {function} callback
   */
  esriLookup (wkid, callback) {
    const wkt = getWktFromEsri(wkid)
    if (!wkt) {
      log.call(this, 'error', 'WKT not found for WKID: ' + wkid)
      return callback(new Error('WKT not found'))
    }
    callback(null, wkt)
  }
}

/**
 * Check the DB to see if it already contains the wkid
 * @param {integer} wkid
 */
function getFromDB (wkid) {
  return new Promise((resolve, reject) => {
    this.db.getWKT(wkid, function (err, wkt) {
      if (err) reject(err)
      if (!wkt) resolve()
      resolve(wkt)
    })
  })
}

/**
 * Request WKT for a wkid from epsg.io
 * @param {integer} wkid
 */
function getFromApi (wkid) {
  const url = 'http://epsg.io/' + wkid + '.wkt'
  return new Promise((resolve, reject) => {
    request.get(url, function (err, res, body) {
      if (err) reject(err)
      if (res.statusCode >= 400) reject(new Error(`Request to ${url} returned with status ${res.statusCode}.`))
      resolve(body)
    })
  })
}

/**
 * Look in current and deprecated ESRI projection codes
 * @param {integer} wkid
 */
function getWktFromEsri (wkid) {
  const result = esriCodes.lookup(wkid) || esriCodesDeprecated.lookup(wkid)
  if (result) return result.wkt
}

/**
 * Log messages
 * @param {string} level
 * @param {string} message
 */
function log (level, message) {
  if (!this.logger) return console.error(message)
  this.logger.log(level, message)
}

module.exports = SpatialReference
