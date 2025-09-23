/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
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

  // update field
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

  // update field
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

  // update field
  collection.fields.addAt(
		9,
		new Field({
			hidden: false,
			id: 'number464846252',
			max: null,
			min: null,
			name: 'from2Hour',
			onlyInt: false,
			presentable: false,
			required: false,
			system: false,
			type: 'number',
		})
	)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_381019410")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number983691085",
    "max": null,
    "min": null,
    "name": "from_11_to59",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number2656627357",
    "max": null,
    "min": null,
    "name": "from_2_hour",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number5661735",
    "max": null,
    "min": null,
    "name": "after_2_hour",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number464846252",
    "max": null,
    "min": null,
    "name": "from_1_to_2",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
