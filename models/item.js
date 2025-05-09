const mongoose = require("mongoose")

//Creating items schema
const itemSchema = new mongoose.Schema({
  itemName: {type: String, require: true},
  description: {type: String, require: true},
  locationFound: {type: String, default: ''},
  dateFound: {type: Date, require: true},
  claimed: {type: Boolean, default: false},
}, {Timestamp: true})

//Utilizing the schema as a model
const Item = mongoose.model("Item", itemSchema)

//Export the model
module.exports = {
  Item
}
