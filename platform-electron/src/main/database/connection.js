import mysql from 'mysql'

const extractCount = (response) => response['results'][0]['count(1)']

export default {
  /**
   * Create a connection to a database for the given credentials.
   * If a connection already exists, disconnect and create a new connection.
   *
   * When calling the callback, we can pass in an argument to make it handle an error.
   *
   * @param {Object} credentials
   * @param {Function} callback
   */
  createConnection(credentials, callback) {
    this.database = credentials.database
    this.credentials = credentials

    if (this.connection) {
      try {
        this.disconnect()
      } catch (error) {
        return callback(error)
      }
    }

    this.connection = mysql.createConnection(credentials)

    return this.connection.connect(callback)
  },

  /**
   * A wrapper method for the createConnection method that returns a Promise.
   *
   * @returns {Promise}
   */
  connect(credentials) {
    return new Promise((resolve, reject) => {
      this.createConnection(credentials, function (error) {
        if (error) {
          console.error('connect', error)
          reject({success: false, message: error.message || error.sqlMessage || error.code})
        } else {
          resolve({success: true, message: 'Successfully connected.'})
        }
      })
    })
  },

  disconnect() {
    this.connection.end(function (error) {
      if (error) {
        console.error('disconnect', error)
        throw error
      }
    })

    this.connection = undefined
  },

  /**
   * Execute a prepared query.
   *
   * @param {String} query Prepared query
   * @returns {Promise}
   */
  executeQuery(query) {
    return new Promise((resolve, reject) => {
      this.connection.query(query, function (error, results, fields) {
        if (error) {
          reject({success: false, message: error.sqlMessage})
        } else {
          resolve({success: true, results, fields})
        }
      })
    })
  },

  /**
   * Count table records and resolve it as a number.
   *
   * @param {String} table Table  name
   *
   * @returns {Promise<Number>}
   */
  count(table) {
    const query = mysql.format('SELECT count(1) FROM ??', [table])

    return this.executeQuery(query)
      .then(response => extractCount(response))
  },

  /**
   * Get all the databases for the connection.
   *
   * @returns {Promise}
   */
  databases() {
    return this.executeQuery('SHOW DATABASES')
  },

  /**
   * Get all the tables for the current database.
   *
   * @returns {Promise}
   */
  tables() {
    return this.executeQuery('SHOW TABLES')
  },

  /**
   * Change the database for the current connection.
   *
   * @param {String} database Database name
   * @returns {Promise}
   */
  changeDatabase(database) {
    return new Promise((resolve, reject) => {
      this.connection.changeUser({database}, function (error) {
        if (error) {
          reject({success: false, message: error.sqlMessage})
        } else {
          resolve({success: true})
        }
      })
    })
  },

  /**
   * Change to the given database and get all it's tables.
   *
   * @param {String} database Database name
   * @returns {Promise}
   */
  tablesForDatabase(database) {
    return this.changeDatabase(database)
      .then(() => this.tables())
  },

  /**
   * Perform a select query for a table.
   *
   * @param {String} table Table name
   * @param {Number} limit
   * @param {Number} offset
   *
   * @returns {Promise}
   */
  getTableData(table, limit = 10, offset = 0) {
    const query = mysql.format('SELECT * FROM ?? LIMIT ? OFFSET ?', [table, limit, offset])

    return Promise.all([this.executeQuery(query), this.count(table)])
      .then(responses => Object.assign(responses[0], {total_results: responses[1]}))
  },

  /**
   * Perform a describe query for a table.
   *
   * @param {String} table Table name
   *
   * @returns {Promise}
   */
  describeTable(table) {
    const query = mysql.format('DESCRIBE ??', [table])

    return this.executeQuery(query)
  },

  /**
   * Prepare and execute an insert query.
   *
   * @param {String} table Table name
   * @param {Object} data key:value pairs of data to be inserted
   *
   * @returns {Promise}
   */
  insert(table, data) {
    const query = mysql.format('INSERT INTO ?? SET ?', [table, data])

    return this.executeQuery(query)
  },

  /**
   * Get nav data
   *
   * @param {country} country select
   */
  searchByCountry(country) {
    const query1 = mysql.format('SELECT platform_type FROM base_info where `attr_info_nationality` = ?', [country])
    const query2 = mysql.format('SELECT count(1) FROM base_info where `attr_info_nationality` = ?', [country])
    return Promise.all([this.executeQuery(query1), this.executeQuery(query2)
      .then(response => extractCount(response))])
      .then(responses => Object.assign(responses[0], {total_results: responses[1]}))
  },

  /**
   * Get nav data(Components)
   *
   * @param platform_type
   */
  searchComponentsByType(platform_type) {
    const query = mysql.format('SELECT category,type FROM components where belong_to_type=?', [platform_type])
    return this.executeQuery(query)
  },

  /**
   * getPlatformInfo
   * @param platform_type
   * @returns {*|Promise}
   */
  getPlatformInfo(platform_type){
    const query = mysql.format('SELECT * FROM base_info where platform_type=?', [platform_type])
    return this.executeQuery(query)
  },

  getPlatformTE(platform_type){
    const query = mysql.format('SELECT time,event FROM platform_time_event where belong_to_type = ?', [platform_type])
    return this.executeQuery(query)
  }

}
