/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // update field
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

  // update field
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "date1269603864",
    "max": "",
    "min": "",
    "name": "start_Date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "date826688707",
    "max": "",
    "min": "",
    "name": "end_Date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
})
