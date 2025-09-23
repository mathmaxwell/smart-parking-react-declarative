/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2134717934")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool3285195208",
    "name": "isBus",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2134717934")

  // remove field
  collection.fields.removeById("bool3285195208")

  return app.save(collection)
})
