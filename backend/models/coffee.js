// Every Schema needs the Mongoose dependency
const mongoose = require('mongoose');

// Tell it what kind of properties the Schema is gonna have
// add new mongoose.Schema instead of a normal object format
const coffeeSchema = new mongoose.Schema(
    {
        // Every Schema needs an id
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        image_url: String
    },
    {
        // Part of the MongoDB documentation, they can help us with updated large projects
        versionKey: false
    }
);

// Set up and export telling this JS file to be sent to our main index.js
// First argument is the name of the Schema. This word is up to us but should reflect the type of data
// Second argument is the Schema variable we declared above
module.exports = mongoose.model('Coffee', coffeeSchema)