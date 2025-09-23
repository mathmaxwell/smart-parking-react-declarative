/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "file3188503279",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "exemplePhoto",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // remove field
  collection.fields.removeById("file3188503279")

  return app.save(collection)
})
