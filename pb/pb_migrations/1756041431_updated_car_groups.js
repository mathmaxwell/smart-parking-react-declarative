/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // update field
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // update field
  collection.fields.addAt(
		3,
		new Field({
			hidden: false,
			id: 'number983691085',
			max: null,
			min: null,
			name: 'from11To59for10',
			onlyInt: false,
			presentable: false,
			required: false,
			system: false,
			type: 'number',
		})
	)

  return app.save(collection)
})
