/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1807802844")

  // remove field
  collection.fields.removeById("number542127408")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "json2308610364",
    "maxSize": 0,
    "name": "rules",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1807802844")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number542127408",
    "max": null,
    "min": null,
    "name": "pricePerHour",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("json2308610364")

  return app.save(collection)
})
