// NOTE: REMEMBER TO CTRL+C THE TERMINAL TO END THE SERVER EACH DAY

// Setting up our dependencies
// The packages that we install in the terminal go into package.json and the dependencies of those packages will show up in package-lock.json

const express = require('express');
const app = express();
const port = 3100;
const cors = require('cors');
// Passes info from frontend to backend
const bodyParser = require('body-parser');
// This is our middleware for talking to MongoDB
const mongoose = require('mongoose');

// Grab our config file (username and password)
const config = require('./config.json');
console.log(config);

// Schemas (Setting up the structure of the data, rules.)
// Every Scheme needs a capital letter
// Telling it where our model is
const Coffee = require('./models/coffee.js');

// Start our dependencies
// Body parser will run our JSON through the front end
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Start our server
app.listen(port, () => {
    // This log will show up in the terminal
    // Use "npm run go" in the terminal which will grab "go" under "scripts" in the package.json file
    console.log(`Server is running on port ${port}`);
})

// CONNECTING TO MongoDB
// We'll push this part to an external file that won't be pushed to github
// Cluster name: Cluster0
// Username: phoebejt
mongoose.connect(
    `mongodb+srv://${config.username}:${config.password}@cluster0.woogxfc.mongodb.net/?retryWrites=true&w=majority`,
    // { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    // Then is what will run then after you've successfully set up the function before it
    console.log(`You've connected to MongoDB`);
}).catch((err) => {
    // Catch is used to return any errors
    console.log(`DB connection error ${err}`);
})

// const addCoffeeButton = getElementById('add-coffee');

// Setting up a route/endpoint which the frontend will feed through
// app.post will send data to the database
app.post('/addCoffee', (req, res) => {
    // Create a new instance of the Coffee SChema
    const newCoffee = new Coffee({
        // Give our new coffee the details we sent from the front end
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        image_url: req.body.image_url
    });
    // Save new coffee to database
    // use the variable declared above
    newCoffee.save()
        .then((result) => {
            console.log(`Added a new coffee successfully!`);
            // return back to the front end what just happened
            res.send(result);
        })
        .catch((err) => {
            console.log(`Error ${err.message}`);
        });
});

// Grab coffee from Mongo DB
// Here, we're setting up the allCoffee route that we add onto localhost:<port>
app.get('/allCoffee', (req, res) => {
    // .find will search for all the coffees
    Coffee.find()
        // .then chains functions
        // result comes from Mongoose, it comes out of .find
        .then(result => {
            // Send back the result of the search to the user
            res.send(result)
        })
})