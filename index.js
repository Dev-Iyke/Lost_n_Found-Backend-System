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

//READ: All products
// app.get("/all-products", async (request, response) => {
//   const allProducts = await Product.find()
//   response.status(200).json({
//     success: true,
//     allProducts
//   })
// })

//READ: A single product
// app.get("/one-product/:id", async (request, response) => {
//   // if(!request.params || !request.params.id){
//   //   return response.status(400).json({
//   //     success: false,
//   //     message: "Missing request params or parameters"
//   //   })
//   // }
//   const {id} = request.params
//   const filteredProduct = await Product.findById(id)
//   if (!filteredProduct){
//     return response.status(404).json({
//       success: false,
//       message: `No product with id: ${id} found`
//     })
//   }

//   return response.status(200).json({
//     success: true,
//     filteredProduct
//   })
// })

//UPDATE: PUT
// app.put("/full-edit-product/:id", async (request, response) => {
//   const {id} = request.params
//   const {name, price, quantity} = request.body

//   const filteredProduct = await Product.findByIdAndUpdate(
//     id,
//     {name, price, quantity},
//     {new: true}
//   )
//   response.status(201).json({
//     success: true,
//     message: 'Product fully updated',
//     filteredProduct
//   })

// })

//UPDATE: PATCH
// app.patch("/part-edit-product/:id", async (request, response) => {
//   const {id} = request.params
//   //Update only name
//   const {name} = request.body

//   const filteredProduct = await Product.findById(id)
//   if(filteredProduct){
//     filteredProduct.name = name
//     await filteredProduct.save()
//     return response.status(201).json({
//       success: true,
//       message: 'Product partly updated',
//       filteredProduct
//     })
//   }
//   return response.status(404).json({
//     success: false,
//     message: `product with id: ${id} was not found`
//   })

// })


//DELETE
// app.delete("/delete-product/:id", async (request, response) => {
//   const {id} = request.params
//   const filteredProduct = await Product.findByIdAndDelete(id)
//   if(filteredProduct){
//     return response.status(200).json({
//       success: true,
//       message: 'Product deleted',
//     })
//   }
//   return response.status(200).json({
//     success: true,
//     message: 'Product delete failed or product not found',
//   })
// })

