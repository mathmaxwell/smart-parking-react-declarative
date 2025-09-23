/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_318297498")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "date846737823",
    "max": "",
    "min": "",
    "name": "start_Data",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(6, new Field({
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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_318297498")

  // remove field
  collection.fields.removeById("date846737823")

  // remove field
  collection.fields.removeById("date611193856")

  return app.save(collection)
})
