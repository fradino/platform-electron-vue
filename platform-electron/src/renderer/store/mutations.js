export default {
  /**
   * Set the initialized value.
   *
   * @param state
   * @param {Boolean} value
   */
  SET_INITIALIZED(state, value) {
    state.initialized = value
  },

  /**
   * Reset the state object to defaults for databases, tables and results.
   *
   * @param state
   */
  RESET_STATE(state) {
    state.databases = []
    state.tables = []
    state.selected_table = ''
    state.query_results = []
  },

  /**
   * Set the loading value.
   *
   * @param state
   * @param {Boolean} value
   */
  SET_LOADING(state, value) {
    state.loading = value
  },

  /**
   * Set the is_connected value.
   *
   * @param state
   * @param {Boolean} value
   */
  SET_IS_CONNECTED(state, value) {
    state.is_connected = value
  },

  /**
   * Set the array of saved connections.
   *
   * @param state
   * @param {Array} saved_connections
   */
  SET_SAVED_CONNECTIONS(state, saved_connections) {
    state.saved_connections = saved_connections
  },

  /**
   * Set the databases array.
   *
   * @param state
   * @param {Array} databases
   */
  SET_DATABASES(state, databases) {
    state.databases = databases
  },

  /**
   * Set the selected table name.
   *
   * @param state
   * @param {String} table_name
   */
  SET_SELECTED_TABLE(state, table_name) {
    state.selected_table = table_name
  },

  /**
   * Set the query results array.
   *
   * @param state
   * @param {Array} results
   */
  SET_QUERY_RESULTS(state, results) {
    state.query_results = results
  },

  /**
   * Append new query results to the existing ones.
   *
   * @param state
   * @param {Array} results
   */
  UPDATE_QUERY_RESULTS(state, results) {
    state.query_results.push(results)
  },

  /**
   * Remove a result object by given index.
   *
   * @param state
   * @param {Number} index
   */
  REMOVE_QUERY_RESULTS(state, index) {
    state.query_results.splice(index, 1)
  },

  /**
   * Replace a query result object with the new provided object by given index.
   *
   * @param state
   * @param {Number} index
   * @param {Array} new_results
   */
  REPLACE_QUERY_RESULTS(state, {index, new_results}) {
    state.query_results.splice(index, 1, new_results)
  },

  /**
   * Set the tables array.
   *
   * @param state
   * @param {Array} tables
   */
  SET_TABLES(state, tables) {
    state.tables = tables
  },

  /**
   * Set the show new records form flag to true.
   *
   * @param {*} state
   */
  SHOW_NEW_RECORD_FORM(state) {
    state.show_new_record_form = true
  },

  /**
   * Set the show new records form flag to false.
   *
   * @param {*} state
   */
  HIDE_NEW_RECORD_FORM(state) {
    state.show_new_record_form = false
  },

  OPEN_RUN_MODE(state) {
    state.run_mode = true
  },

  CLOSE_RUN_MODE(state) {
    state.run_mode = false
  },

  SET_NAV_DATA(state, data) {
    state.nav_data = data
  },

  ADD_NAV_DATA(state, response) {

    response.results.forEach(function (value, i) {
      var cs=state.nav_data[response.country].children
      cs.push({
        id: 1,
        label: value.platform_type,
        children: []
      })

      var cate=['雷达设备', '通信设备', '导航设备', '敌我识别设备', '光电设备', '水声设备', '电子战设备', '火力设备']

      cate.forEach(function (c, j) {
        var temp={
          id: 2,
          label: c,
          children: []
        }

        value.components.results.forEach(function (d, g) {
          if (d.category===c) {
            temp.children.push({
              id: 3,
              label: d.type,
              children:[]
            })
          }
        })

        cs[cs.length-1].children.push(temp)
      })

      

    })
  },

  SET_CHART_DATA(state, data) {
    state.chart_data = data
    state.is_chart_showed = true
  },



}
