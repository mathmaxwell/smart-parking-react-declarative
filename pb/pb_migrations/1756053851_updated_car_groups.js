/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // remove field
  collection.fields.removeById("number464846252")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number464846252",
    "max": null,
    "min": null,
    "name": "qqqq",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
