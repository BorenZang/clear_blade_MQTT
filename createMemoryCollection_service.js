/**
 * @typedef {object} Memory_Collection
 * @property {string} data
*/

/**
 * @typedef {object} createMemoryCollectionParams
 * @property {Memory_Collection} item
 * @property {Memory_Collection[]} items
*/

/**
 * Creates items in the "Memory_Collection" collection
 * @param {{ params: createMemoryCollectionParams }} req
 * @param {createMemoryCollectionParams} req.params
 * @param {CbServer.Resp} resp
*/
function createMemoryCollection(req, resp) {
  log(req)
  if (!(req.params.item && !Array.isArray(req.params.item)) && !(req.params.items && Array.isArray(req.params.items))) {
    resp.error('invalid request, expected structure `{ item: { myProp: "", myProp2: "" } }` or `{ items: []}`. Received: ' + JSON.stringify(req.params, null, 2))
  }
  ClearBlade.init({ request: req });

  if (req.params.item) {
    req.params.items = [req.params.item];
  }
  var col = ClearBlade.Collection({ collectionName: 'Memory_Collection' });
  col.create(req.params.items, function(err, data) {
    log(data)
    if (err) {
      resp.error(data);
    } else {
      resp.success(data);
    }
  });
}
