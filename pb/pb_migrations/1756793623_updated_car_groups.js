/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // remove field
  collection.fields.removeById("number2356538782")

  // remove field
  collection.fields.removeById("number983691085")

  // remove field
  collection.fields.removeById("number2656627357")

  // remove field
  collection.fields.removeById("number5661735")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number2356538782",
    "max": null,
    "min": null,
    "name": "first10Minutes",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number983691085",
    "max": null,
    "min": null,
    "name": "from11To59for10",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number2656627357",
    "max": null,
    "min": null,
    "name": "from2Hour",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number5661735",
    "max": null,
    "min": null,
    "name": "from1To2",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
