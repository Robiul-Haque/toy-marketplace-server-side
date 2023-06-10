const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Toy marketplace express server is running');
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
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const toyDB = client.db("toyDB");
        const toyCollection = toyDB.collection("toy");


        app.get('/toy/:activeTab', async (req, res) => {
            const activeTab = req.params.activeTab;
            console.log(activeTab);
            const result = await toyCollection.find({ category: activeTab }).toArray();
            res.send(result)
        });

        app.post('/add-toy', async (req, res) => {
            const addToyData = req.body;
            const result = await toyCollection.insertOne(addToyData);
            res.send(result)
            console.log(addToyData);
        });

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Toy marketplace express server is running on port ${port}`);
});


