// this is a js file that runs our servers 

//imports the express libary 
const express = require("express");

// initalizes our app as an express server 
const app = express()

//all our files 
app.use(express.static("public"));

//allows us to send and recieve json data 
app.use(express.urlencoded({ extended: true }));

let guestbookMessages = []
// 1st part url, the location where we want to get data from
// 2nd para: function, action to happen when this route is hit
//app.get("/test", callback)

//function callback(request, response){

// }
app.get('/test', (request, response) => {

    //only want to send back one response
    response.send("my server is working!");
});
app.get('/', (request, response) => {
    response.send("i now set up my / route");
});

app.get('/gb', (request, response) => {
    response.sendFile("guestbook.html", { root: "./public" });
});
app.post("/sign", (request, response) => {
    console.log(request.body);

    let guest = request.body.guest;
    let message = request.body.message;

    guestbookMessages.push({
        person: guest,
        note: message
    })
    console.log("sign route has been hit");
    // response.send("hihihihi");
    response.redirect("/gb");
});
app.get('/all-messages', (reqyest, response) => {
    response.json({ allMessages: guestbookMessages })
})
app.listen(8000, () => {
    //when we write console.log inside of our server it willl show up in the terminal
    console.log('server is running')
})