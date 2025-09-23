/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // remove field
  collection.fields.removeById("file3188503279")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number523478787",
    "max": null,
    "min": null,
    "name": "first2hours",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number2675529103",
    "max": null,
    "min": null,
    "name": "start",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number16528305",
    "max": null,
    "min": null,
    "name": "end",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number854345784",
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
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "date1269603864",
    "max": "",
    "min": "",
    "name": "startDate",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "date826688707",
    "max": "",
    "min": "",
    "name": "endDate",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "number1881172524",
    "max": null,
    "min": null,
    "name": "from11To59for10",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // add field
  collection.fields.addAt(5, new Field({
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

  // remove field
  collection.fields.removeById("number523478787")

  // remove field
  collection.fields.removeById("number2675529103")

  // remove field
  collection.fields.removeById("number16528305")

  // remove field
  collection.fields.removeById("number854345784")

  // remove field
  collection.fields.removeById("date1269603864")

  // remove field
  collection.fields.removeById("date826688707")

  // remove field
  collection.fields.removeById("number1881172524")

  return app.save(collection)
})
