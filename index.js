var request = require('request')
var esriCodes = require('esri-proj-codes')

/**
 * SpatialReference constructor, exposes translation methods
 *
 * @param {object} options - can pass in a db and a logger
 */
function SpatialReference (options) {
  if (!(this instanceof SpatialReference)) return new SpatialReference(options)
  if (options.db && options.db.getWKT && options.db.insertWKT) {
    this.db = options.db
  } else if (options.db) {
    throw new Error('Passed in db does not support getWKT or insertWKT')
  }
  this.logger = options.logger
}

/**
 * Translates a well-known spatial reference id to the well-known text format. Uses a db connection, where available.
 *
 * @param {integer} wkid - the well known id you wish to translate
 * @param {function} callback - calls back with an error or well-known text
 */
SpatialReference.prototype.wkidToWkt = function (wkid, callback) {
  var self = this
  // wkid's over 32767 are exclusively esri codes see: http://gis.stackexchange.com/a/18675
  if (wkid >= 32767) return self.esriLookup(wkid, callback)
  if (self.db) {
    self._getFromDb(wkid, function (err, wkt) {
      if (err) {
        self._getFromApi(wkid, function (err, wkt) {
          if (err) return self._handleApiError(err, callback)
          self._insertIntoDb(wkid, wkt, callback)
        })
      } else {
        callback(null, wkt)
      }
    })
  } else {
    self._getFromApi(wkid, function (err, wkt) {
      if (err) return self._handleApiError(err, callback)
      callback(null, wkt)
    })
  }
}

/**
 * Looks up a WKID from the esri-proj-codes module
 * @param {integer} wkid - the epsg well-known id to be translated
 * @param {function} callback - calls back with the well-known text for the spatial reference or an error
 */
SpatialReference.prototype.esriLookup = function (wkid, callback) {
  var sr = esriCodes.lookup(wkid)
  if (!sr) {
    this._log('error', 'WKT not found for WKID: ' + wkid)
    return callback(new Error('WKT not found'))
  }
  callback(null, sr.wkt)
}

/**
 * Logs errors from requests to the spatialreference.org API then calls back with error
 *
 * @param {error} err - an http response error
 * @param {function} callback - calls back with the http error
 * @private
 */
SpatialReference.prototype._handleApiError = function (err, callback) {
  this._log('Error', 'Request for WKT from API failed: ' + err.message)
  callback(new Error('Unable to get WKID from the DB or API'))
}

/**
 * Makes a http request to spatialreference.org for epsg well-known text
 *
 * @param {integer} wkid - the epsg well-known id to be translated
 * @param {function} callback - calls back with the well-known text for the spatial reference or an error
 * @private
 */
SpatialReference.prototype._getFromApi = function (wkid, callback) {
  var url = 'http://spatialreference.org/ref/epsg/' + wkid + '/ogcwkt/'
  this._req(url, callback)
}

/**
 * Wraps request to make testing easier
 *
 * @param {string} url - the url to request
 * @param {function} callback - callsback with an error or the response body
 * @private
 */
SpatialReference.prototype._req = function (url, callback) {
  request.get(url, function (err, res, body) {
    if (err) return callback(err)
    callback(null, body)
  })
}

/**
 * Queries the db for espg well-known text
 *
 * @param {integer} wkid - the epsg well-known id to be translated
 * @param {function} callback - calls back with the well-known text for the spatial reference or an error
 * @private
 */
SpatialReference.prototype._getFromDb = function (wkid, callback) {
  var self = this
  self.db.getWKT(wkid, function (err, wkt) {
    if (err || !wkt) {
      self._log('error', 'Unable to get WKT from the db. ' + err.message)
      return callback(new Error('Unable to get WKT from the db'))
    }
    callback(null, wkt)
  })
}

SpatialReference.prototype._insertIntoDb = function (wkid, wkt, callback) {
  var self = this
  self.db.insertWKT(wkid, wkt, function (err) {
    if (err) self._log('error', 'Failed to insert WKT into database: ' + wkid + ' ' + wkt + ', ' + err.message)
    callback(err, wkt)
  })
}

/**
 * Logs using the passed in logger if available, else logs using console.error
 *
 * @param {string} level - the log level to use
 * @param {string} message - the message to log
 */
SpatialReference.prototype._log = function (level, message) {
  if (!this.logger) return console.error(message)
  this.logger.log(level, message)
}

module.exports = SpatialReference
