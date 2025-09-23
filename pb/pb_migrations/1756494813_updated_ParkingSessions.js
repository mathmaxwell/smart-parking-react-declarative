/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2134717934")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number956362861",
    "max": null,
    "min": null,
    "name": "enterMomentStamp",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number3237397382",
    "max": null,
    "min": null,
    "name": "exitMomentStamp",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number2354895654",
    "max": null,
    "min": null,
    "name": "exitMomentStampDay",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number2304693895",
    "max": null,
    "min": null,
    "name": "enterMomentStampDay",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2134717934")

  // remove field
  collection.fields.removeById("number956362861")

  // remove field
  collection.fields.removeById("number3237397382")

  // remove field
  collection.fields.removeById("number2354895654")

  // remove field
  collection.fields.removeById("number2304693895")

  return app.save(collection)
})
