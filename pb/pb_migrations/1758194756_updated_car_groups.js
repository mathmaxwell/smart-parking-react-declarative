/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "number3776780327",
    "max": null,
    "min": null,
    "name": "after61",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "number3289960559",
    "max": null,
    "min": null,
    "name": "from2Hour",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // remove field
  collection.fields.removeById("number3776780327")

  // remove field
  collection.fields.removeById("number3289960559")

  return app.save(collection)
})
