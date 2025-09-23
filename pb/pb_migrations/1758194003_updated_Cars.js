/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_318297498")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number1803751981",
    "max": null,
    "min": null,
    "name": "startMomentStamp",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number386196829",
    "max": null,
    "min": null,
    "name": "endMomentStamp",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number3778877665",
    "max": null,
    "min": null,
    "name": "startMomentStampDay",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number2649559348",
    "max": null,
    "min": null,
    "name": "endMomentStampDay",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_318297498")

  // remove field
  collection.fields.removeById("number1803751981")

  // remove field
  collection.fields.removeById("number386196829")

  // remove field
  collection.fields.removeById("number3778877665")

  // remove field
  collection.fields.removeById("number2649559348")

  return app.save(collection)
})
