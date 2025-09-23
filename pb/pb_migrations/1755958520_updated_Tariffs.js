/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1807802844")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "json4044060355",
    "maxSize": 0,
    "name": "sample",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1807802844")

  // remove field
  collection.fields.removeById("json4044060355")

  return app.save(collection)
})
