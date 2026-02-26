// 1. import libaries
// import the express libary
const express = require('express');

// import  our database libary
let nedb = require("@seald-io/nedb");

//import our templatin libary
let nunjucks = require('nunjucks')

//2. initalize libary settings
let app = express() //sets up our express application

// sets up our database variable that we are storing data in an external file
let database = new nedb({ filename: "data.db", autoload: true });

// setting up nunjucks temp
nunjucks.configure("views", {
    autoescape: true,
    express: app,
});
//eexpress will use the temp engine of nunjucks
app.set('view engine', 'njk')

// 3. middleware: settings for our appplication
app.use(express.static("assets"));
app.use(express.urlencoded({ extended: true }));

// 4. routes
app.get('/', (request, response) => {
    //any database manipulation needs to happen before sending the response
    database.insert({ data: "hello" });
    //inside of a request, this alwasy need to go at the end
    response.send('<h1>hi</h1>')
})
app.get('/data', (request, response) => {
    //first param: obkect we are lookking for
    //second param: calback function, action to happen once i find that data
    let query = {}
    database.find(query, (error, foundData) => {
        //checking for an error
        if (error) {
            response.send("error");
        } else {
            //send back the found data in json format
            //format my found data in json
            let formattedJSON = {
                allData: foundData,
            };
            response.json(formattedJSON);
        }
    });
});
app.get('/guestbook', (request, response) => {
    //use the rendr function to convert any special.njk server to html
    //second param is an object that represent the data that is going to be populated on client side
    //serverdata
    response.render("guestbook.njk", { serverData: "<h1>hello</h1>" })
});

app.post('/sign', (request, response) => {
    console.log(request.body)
    // processing the body of my requesy in the formar i want displayed as json
    let guestSignature = {
        guestName: request.body.guest,
        guestMessage: request.body.guestMessage,
    };

    //staring the data in the database
    database.insert(guestSignature);

    //ssend user back to the guestbook 
    response.redirect('/guestbook')

});

app.get('/display-guest-messages', (request, response) => {
    let query = {
        guestName: { $exists: true }
    }
    database.find(query, (error, foundData) => {
        if (error) {
            response.redirect('/guestbook')
        } else {
            //response.json(foundData);
            console.log(foundData)
            response.render('messages.njk', { messages: foundData })
        }
    })
})

//last: start our server
app.listen(9001, () => {
    console.log("server is now running");
})