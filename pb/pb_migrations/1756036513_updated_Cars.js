/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_318297498")

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_381019410",
    "hidden": false,
    "id": "relation2363381545",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_318297498")

  // remove field
  collection.fields.removeById("relation2363381545")

  return app.save(collection)
})
