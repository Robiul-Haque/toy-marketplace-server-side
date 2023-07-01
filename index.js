const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Toy World express js server is running');
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nt7otjy.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const toyDB = client.db("toyDB");
        const toyCollection = toyDB.collection("toy");


        app.get('/toy/:activeTab', async (req, res) => {
            const activeTab = req.params.activeTab;
            console.log(activeTab);
            const result = await toyCollection.find({ category: activeTab }).toArray();
            res.send(result);
        });

        app.get('/toy-car-details/:toyId', async (req, res) => {
            const toyId = req.params.toyId;
            const result = await toyCollection.findOne({ _id: new ObjectId(toyId) });
            res.send(result);
        });

        app.get('/all-toy', async (req, res) => {
            const result = await toyCollection.find().toArray();
            res.send(result);
        });

        app.get('/my-toy/:userEmail', async (req, res) => {
            const userEmail = req.params.userEmail;
            if (userEmail) {
                const result = await toyCollection.find({ email: userEmail }).toArray();
                res.send(result);
            } else {
                res.status(404).send('User email not found');
            }
        });

        app.get('/my-toy', async (req, res) => {
            const result = await toyCollection.find().toArray();
            res.send(result);
        });

        app.get('/toy-details/:toyId', async (req, res) => {
            const toyId = req.params.toyId;
            const result = await toyCollection.findOne({ _id: new ObjectId(toyId) });
            res.send(result);
        });

        app.get('/updating-my-toy/:toyId', async (req, res) => {
            const toyId = req.params.toyId;
            const result = await toyCollection.findOne({ _id: new ObjectId(toyId) });
            res.send(result);
        });

        app.post('/update-my-toy/:toyId', async (req, res) => {
            const toyId = req.params.toyId;
            const updateToyData = req.body;
            const query = { _id: new ObjectId(toyId) };
            const option = { upsert: true };
            const updateToy = {
                $set: {
                    seller_name: updateToyData.seller_name,
                    email: updateToyData.email,
                    category: updateToyData.category,
                    name: updateToyData.name,
                    image: updateToyData.image,
                    price: updateToyData.price,
                    quantity: updateToyData.quantity,
                    rating: updateToyData.rating,
                    description: updateToyData.description
                }
            }
            const result = await toyCollection.updateOne(query, updateToy, option);
            res.send(result);
        });

        app.delete('/delete-my-toy/:toyId', async (req, res) => {
            const toyId = req.params.toyId;
            const query = { _id: new ObjectId(toyId) };
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        });

        app.get('/toy-details/:toyId', async (req, res) => {
            const toyId = req.params.toyId;
            const result = await toyCollection.findOne({ _id: new ObjectId(toyId) });
            res.send(result);
        });

        app.post('/add-toy', async (req, res) => {
            const addToyData = req.body;
            const result = await toyCollection.insertOne(addToyData);
            res.send(result);
        });

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Toy World express js server is running on port ${port}`);
});


