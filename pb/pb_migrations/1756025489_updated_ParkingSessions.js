/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2134717934")

  // remove field
  collection.fields.removeById("relation2000545437")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2134717934")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_318297498",
    "hidden": false,
    "id": "relation2000545437",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "car",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
