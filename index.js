const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pabg0.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const database = client.db('carMechanics');
        const servicesCollection = database.collection('services');

        // POST API
        app.post('/services', async(req, res) => {
            const service = req.body;
            console.log('hitted', service);
            // res.send('post hitted');
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Runnig Genius Server');
});

app.listen(port, () => {
    console.log("Running on port ", port);
})