const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require("jsonwebtoken");
require('dotenv').config()





const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())
 


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sarjove.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//___________________________________________________________________

const userCollection = client.db("planifyDB").collection("user");
const taskCollection = client.db("planifyDB").collection("task");









app.get('/users' ,async(req,res) =>  {
    // const className = req.params;
    // const query = {className: className };
    const result = await userCollection.find().toArray()
    res.send(result);
  })
  
  //updating user in db
  app.post("/users", async (req, res) => {
    const user = req.body;
    //insert email if user doesn't exists;
    const query = { email: user.email };
    const existingUser = await userCollection.findOne(query);
    if (existingUser) {
      return res.send({ message: "user already exists", insertedId: null });
    }
    const result = await userCollection.insertOne(user);
    res.send(result);  
  });
  //checking
  //adding task on the collection
  app.post('/addTodo', async(req,res) =>{
    const task = req.body;
    const result = await taskCollection.insertOne(task)
    res.send(result)
    // console.log(task);
  })

  //getting task by user id
  app.get('/getTask' , async(req,res) => {
    const email = req.query ;
    console.log(email);
    const result = await taskCollection.find(email).toArray()
    // console.log(result);
    res.send(result)
  })

  app.patch('/updateStatus/:id' , async (req, res) => {
    const id = req.params.id;  
    const filter = { _id: new ObjectId(id) };

    const status = req.body;
    const updatedDoc = { $set: { status: status.status } }    
  const result = await taskCollection.updateOne(filter, updatedDoc);
  res.send(result);
 
  
  });
  
  //get single task data
  app.get('/singleTask/:id' , async(req,res) =>{
    const id = req.params.id;
    console.log(id)
    const query = {_id: new ObjectId(id)}
    const result = await taskCollection.findOne(query)
    // console.log(result);
    res.send(result)
  } )

  app.patch('/updateTodo/:id' , async(req,res ) => {
    const id = req.params.id
    console.log(id);
    
    const filter = {_id: new ObjectId(id)}

  const query = req.body
  const updatedDoc = {
    $set: { 
      taskName: query.taskName,
      description: query.description,
      deadline: query.deadline,
      priority: query.priority
    },
  }; 
const result = await taskCollection.updateOne(filter ,updatedDoc)
   

    res.send(result)
  })



  app.delete("/deleteTask/:id",  async (req, res) => {
    const id = req.params.id;
    console.log('466 nmbr', id);
    const query = { _id: new ObjectId(id) };
    console.log('468 nmbr',query);
    const result = await taskCollection.deleteOne(query);
    res.send(result);
  });






//____________________________________________________________________


app.get('/' , (req,res) => {
    res.send('Planify is planning')
})

app.listen(port , () => {
    console.log(`Planify is giving plans on port ${port}`)
})