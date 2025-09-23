/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number2356538782",
    "max": null,
    "min": null,
    "name": "first_10_minutes",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number2356538782",
    "max": null,
    "min": null,
    "name": "pay_rate",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
