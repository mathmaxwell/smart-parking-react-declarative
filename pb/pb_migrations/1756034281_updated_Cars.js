/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_318297498")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "date611193856",
    "max": "",
    "min": "",
    "name": "end_Data",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_318297498")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "date611193856",
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
