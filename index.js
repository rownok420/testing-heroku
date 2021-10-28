const express = require("express");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors")
const app = express();
const port = process.env.PORT || 5000;


// middleware 
app.use(cors())
app.use(express.json())


const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.amu9y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("practice-project");
        const usersCollection = database.collection("users");

        // get api
        app.get("/users", async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        })

        app.get("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)}
            const result = await usersCollection.findOne(query);
            res.json(result)
        })

        // post api
        app.post("/users", async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            console.log(
                `A document was inserted with the _id: ${result.insertedId}`
            );
            res.json(result)
        });

        // UPDATE API
        app.put("/users/:id", async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    Name: updateUser.Name,
                    Email: updateUser.Email,
                    age: updateUser.age,
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            console.log("updated product", req.body);
            res.json(result);
        });


        // delete api 
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query ={ _id: ObjectId(id)}
            const result = await usersCollection.deleteOne(query)
            console.log(result)
            res.json(result)
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Practice project server is started");
});

app.listen(port, () => {
    console.log("Listing to Port", port);
});
