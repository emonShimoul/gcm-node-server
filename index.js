const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

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

        // GET API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET Single Service
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            console.log('getting...', id);
            const query = { _id:ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async(req, res) => {
            const service = req.body;
            console.log('hitted', service);
            // res.send('post hitted');
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        // DELETE API
        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id) };
            const service = await servicesCollection.deleteOne(query);
            res.json(service);
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

/*

Steps of deploy server in the heroku (can also check the  heroku docs) ->

One Time:
1. open heroku account
2. install heroku software

Every Project:
1. git init
2. .gitignore (node_modules, .env)
3. push everything to git
4. make sure you have this script in package.json file: "start": "node index.js"
5. make sure process.env.PORT is added in the port number option in index.js file
6. heroku login
7. create heroku (onlu one time for a project)
8. command: git push heroku main

Update the Project:
1. save everything and check locally
2. git add, commit and push first
3. git push heroku main 

*/