/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1807802844")

  // remove field
  collection.fields.removeById("json2308610364")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2308610364",
    "max": 0,
    "min": 0,
    "name": "rules",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1807802844")

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

  // remove field
  collection.fields.removeById("text2308610364")

  return app.save(collection)
})
