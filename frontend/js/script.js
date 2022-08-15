// Declare our HTML stuff
const result = document.getElementById('result');

const inputName = document.getElementById('name-input');
const inputPrice = document.getElementById('price-input');
const inputImageURL = document.getElementById('image-url-input');

// Setting up our own coffee data
const latte = {
    name: "Flat White",
    price: 3.00,
    image_url: "https://www.caffesociety.co.uk/assets/recipe-images/latte-small.jpg"
}

// // Setting up our coffee data
// const latte = {
//     name: "Flat White",
//     price: 3.00,
//     image_url: "https://www.caffesociety.co.uk/assets/recipe-images/latte-small.jpg"
// }

const go = document.getElementById('add-coffee');

let renderCoffees = (coffees) => {
    console.log("Rendered coffees")
    coffees.forEach((item) => {
        result.innerHTML += `
        <div class="item">
        <h3>${item.name}</h3>
        <p>$${item.price}</p>
        <img src="${item.image_url}" alt="${item.name}">
        </div>
        `;
    })
}

go.onclick = () => {
    console.log("Clicked");
    $.ajax({
        url: `http://localhost:3100/addCoffee`,
        type: 'POST',
        // We can send objects through to the backend using the data argument
        data: {
            name: inputName.value,
            price: inputPrice.value,
            image_url: inputImageURL.value
        },
        success: () => {
            console.log("Your new coffee was added.");
            // renderCoffees(coffees);
        },
        error: () => {
            console.log("There was a problem uploading the coffee");
        }
    })
}

$.ajax({
    type: 'GET',
    url: "http://localhost:3100/allCoffee",
    // success contains an argument which can be names anything (we've usually used "data")
    success: (coffees) => {
        console.log(coffees);
        renderCoffees(coffees);
    },
    error: (error) => {
        console.log(error);
    }
});