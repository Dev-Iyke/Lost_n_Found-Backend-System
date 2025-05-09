const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
// const {It} = require("./models/item")
const { Item } = require("./models/item")

const app =  express()
app.use(express.json())
dotenv.config()
const url = process.env.MONGODB_URL || "mongodb+srv://loss-n-found:loss-n-found@loss-n-found.rrc0akj.mongodb.net/?retryWrites=true&w=majority&appName=loss-n-found"
const port = process.env.PORT

//Interact with the database using mongoose(connected by connection string)
mongoose.connect(url)
.then(() => {
  console.log("Mongoose Connected to MongoDB...")
  app.listen(port, (e) => {
    if(e){
      console.error("Error - App failed to listen: ", e)
    } else {
      console.log(`Server is listening at port ${port}`)
    }
  })
})
.catch(() => {
  console.error('Mongoose failed to connect to mongoDB')
})


//APIs
app.get("/", (request, response) => {
  response.send("You are connected")
})


//CRUD
// READ: All items
app.get("/items", async (request, response) => {
  const items = await Item.find()
  response.status(200).json({
    success: true,
    items
  })
})

//CREATE: An Item
app.post("/items/create", async(request, response) => {
  if (!request.body){
    return response.status(400).json({
      success: false,
      message: "missing request body"
    })
  }
  const {itemName, description, locationFound, dateFound } = request.body
  if (!itemName || !description){
    return response.status(400).json({
      success: false,
      message: "missing required fields - itemName or description"
    })
  }

  const newItem = {
    itemName,
    description,
    locationFound,
    dateFound: new Date(dateFound)
  }
  // const createdProduct = Item.create(newItem)
  const createdItem = new Item(newItem)
  await createdItem.save()
  return response.status(201).json({
    success: true,
    createdItem
  })
})

// READ: All unclaimed items
app.get("/items/unclaimed", async (request, response) => {
  const unclaimedItems = await Item.find().where({claimed: false})
  response.status(200).json({
    success: true,
    unclaimedItems
  })
})

//READ: View one item by ID
app.get("/items/:id", async (request, response) => {
  const {id} = request.params
  const filteredItem = await Item.findById(id)
  if (!filteredItem){
    return response.status(404).json({
      success: false,
      message: `No item with id: ${id} found`
    })
  }

  return response.status(200).json({
    success: true,
    filteredItem
  })
})


// UPDATE: item’s status as claimed
app.patch("/items/update/:id", async (request, response) => {
  const {id} = request.params
  //Update only claimed status
  const {claimed} = request.body

  const filteredItem = await Item.findById(id)
  if(filteredItem){
    filteredItem.claimed = claimed
    await filteredItem.save()
    return response.status(201).json({
      success: true,
      message: `Item partly updated`,
      filteredItem
    })
  }
  return response.status(404).json({
    success: false,
    message: `item with id: ${id} was not found`
  })

})


//DELETE: Any item entry
app.delete("/items/delete/:id", async (request, response) => {
  const {id} = request.params
  const filteredItem = await Item.findByIdAndDelete(id)
  if(filteredItem){
    return response.status(200).json({
      success: true,
      message: 'Item deleted',
    })
  }
  return response.status(404).json({
    success: false,
    message: 'Item delete failed or item not found',
  })
})

