// NOTE: REMEMBER TO CTRL+C THE TERMINAL TO END THE SERVER EACH DAY



// SETTING UP THE DEPENDENCIES --------------------------------------------------------------------


// The packages that we install in the terminal go into package.json and the dependencies of those packages will show up in package-lock.json

const express = require('express');
const app = express();
const port = 3100;
const cors = require('cors');
// Passes info from frontend to backend
const bodyParser = require('body-parser');
// This is our middleware for talking to MongoDB
const mongoose = require('mongoose');
// bcrypt for encrypting data (passwords)
const bcrypt = require('bcryptjs');

// Grab our config file (username and password)
const config = require('./config.json');



// SCHEMA AND STARTING DEPENDENCIES ---------------------------------------------------------------

// Schemas (Setting up the structure of the data, rules.)
// Every Scheme needs a capital letter
// Telling it where our model is
const Coffee = require('./models/coffee.js');
const User = require('./models/user.js');

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
});



// ADD COFFEE METHOD -----------------------------------------------------------------------------

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



// FIND COFFEE METHOD ----------------------------------------------------------------------------

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



// DELETE COFFEE METHOD -------------------------------------------------------------------------

// Setting up the delete route
// This route will be activated when used in an ajax, etc.
app.delete('/deleteCoffee/:id', (req, res) => {
    // The request variable here contains the ID and you can access it using req.params.id
    const coffeeID = req.params.id;
    // findById looks up a piece of data based on the id argument which we give to it first (coffeeID)
    // If it's successful, it will run a function that provides the details for that coffee (represented by the word "coffee" after "err")
    Coffee.findById(coffeeID, (err, coffeeData) => {
        if (err) {
            console.log(err);
        } else {
            Coffee.deleteOne({ _id: coffeeID })
                .then(() => {
                    console.log("Success! Actually deleted from Mongo DB");
                    // res.send will end the process
                    res.send(coffeeData);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    });
});


// EDIT METHOD -------------------------------------------------------------------------------

app.patch('/updateProduct/:id', (req, res) => {
    // req changes the parameter on frontend
    const idParam = req.params.id;
    Coffee.findById(idParam, (err, coffee) => {
        // const for all the data we're expected
        const updatedProduct = {
            name: req.body.name,
            price: req.body.price,
            image_url: req.body.image_url
        }
        Coffee.updateOne({
            _id: idParam
        }, updatedProduct)
            .then(result => {
                res.send(result);
            })
            .catch(err => result.send(err))
    })
});


// USER REGISTER -----------------------------------------------------------------------------

// Registering a new user on MongoDB

app.post('/registerUser', (req, res) => { // Checking if user is in the DB already

    User.findOne({ username: req.body.username }, (err, userResult) => {

        if (userResult) {
            // send back a string so we can validate the user
            res.send('username exists');
        } else {
            const hash = bcrypt.hashSync(req.body.password); // Encrypt User Password
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                username: req.body.username,
                password: hash,
                profile_img_url: req.body.profile_img_url
            });

            user.save().then(result => { // Save to database and notify userResult
                res.send(result);
            }).catch(err => res.send(err));
        } // Else
    })
}) // End of Create Account


// USER REGISTER -----------------------------------------------------------------------------

app.post('/loginUser', (req, res) => {
    // firstly look for a user with that username
    User.findOne({ username: req.body.username }, (err, userResult) => {
        if (userResult) {
            if (bcrypt.compareSync(req.body.password, userResult.password)) {
                res.send(userResult);
            } else {
                res.send('not authorised');
            } // inner if
        } else {
            res.send('user not found');
        } // outer if
    }) // Find one ends
}); // end of post login

