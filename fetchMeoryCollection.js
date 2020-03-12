/**
 * @typedef {object} Memory_Collection
 * @property {string} memory_total
 * @property {string} memory_available
 * @property {string} memory_used
 * @property {string} memory_percentage
 * @property {string} swap_memory_total
 * @property {string} swap_memory_free
 * @property {string} swap_memory_used
 * @property {string} swap_memory_percentage
 */

 /**
 * @typedef {object} fetchMemoryCollectionParams
 * @property {string} cbQuery
 * @property {number} pageSize
 * @property {number} pageNum
 */

 /**
 * Fetches a list of items from the "Memory_Collection" collection
 * @param {{ params: fetchMemoryCollectionParams | Memory_Collection }} req
 * @param {fetchMemoryCollectionParams | Memory_Collection} req.params
 * @param {CbServer.Resp} resp
 */
function fetchMemoryCollection(req, resp) {
    log(req)  
    ClearBlade.init({ request: req });
  
    var cbQuery = req.params.cbQuery
    var pageSize = req.params.pageSize || 0
    var pageNum = req.params.pageNum || 0
    delete req.params.cbQuery
    delete req.params.pageSize
    delete req.params.pageNum
  
    var query = ClearBlade.Query();
    // allows for complex queries generated from the filter widget
    if (cbQuery) {
      query.query = cbQuery
    }
    // allows basic filtering on any column
    var columnNames = ["memory_total", "memory_available", "memory_used", "memory_percentage", "swap_memory_total", "swap_memory_free", "swap_memory_used", "swap_memory_percentage"]
    columnNames.forEach(function(name) {
      value = req.params[name];
      if(value !== undefined) {
        query.equalTo(name, value);
      }
    })
    if (req.params.pageSize && req.params.pageNum !== undefined) {
      query.setPage(pageSize, pageNum);
    }
  
    var fetchedData;
    var count
    var obj
    var col = ClearBlade.Collection({ collectionName: "Memory_Collection" });
    col.fetch(query, function (err, data) {
      fetchedData = data
      log(data)
      if (err) {
        resp.error(data)
      } else {
        // TOTAL from fetch is just DATA.length, replace it with total that match query
        if(fetchedData && count !== undefined) {
          fetchedData.TOTAL = count
          resp.success(data)
        }
      }
    });
  
    col.count(query, function (err, data) {
      count = data.count
      if (err) {
        resp.error(data)
      } else {
        if(fetchedData && count !== undefined) {
          fetchedData.TOTAL = count
          var message = ClearBlade.Messaging()
          message.publish("analytics", "Latest memory percentage :"+fetchedData.DATA[0].memory_percentage)
          resp.success(fetchedData)
        }
      }
    })
  }
  


