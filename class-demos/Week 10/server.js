// how do we know this is a npm project?
// A: Because the project has a package.json file. That file stores the project name, dependencies, scripts, and other npm settings.

// what command do we run to start an npm project?
// A: npm init 

// how do we create the node_modules folder if it doesn't exist?
// A:npm install

// what does the below chunk of code do?
// A: These lines import the libraries/packages we need into the project.
const express = require('express');
const multer = require('multer');
const nunjucks = require('nunjucks');
const nedb = require('@seald-io/nedb');

// what is app?
// A:app is the Express application object. It is what we use to create routes, configure settings, and run the server.
const app = express();
// what is database?
// A: database is a NeDB database object. It connects to a file called data.db
const database = new nedb({ filename: 'data.db', autoload: true });

// what is this configuring?
// A: This configures multer so uploaded files are saved into the public/uploads folder
const upload = multer({
	dest: 'public/uploads',
});

// what do each of these statements do?
// write the answer next to the line of code
app.use(express.static('public')); // A: Lets Express serve static files like CSS, images, JavaScript, and uploaded files from the public folder.

app.use(express.urlencoded({ extended: true })); // A: Lets Express read form data sent from forms using req.body.

app.set('view engine', 'njk'); // A: Sets Nunjucks (.njk files) as the template view engine.

nunjucks.configure('views', {
	autoescape: true,
	express: app,
}); // A: Configures Nunjucks to use the views folder and connect it to the Express app.

// what type of request is this? what does it do?
// A: This is a GET request that runs when someone visits the homepage "/"
app.get('/', (request, response) => {
	// how many different responses can we write? list them.
	// A:response.send()
	// response.render()
	// response.json()
	// response.redirect()
	// response.sendFile()
	// response.end()

	// how many parameters does response.render use? list them.
	// A:The name of the template file
	// 2. An object with data to send into the template

	// write out the render for index.njk using the database
	database.find({}, (err, foundInDatabase) => {
		response.render('index.njk', { sendingToClient: foundInDatabase});
	});
});

// what are the three parameters in this function?
// A: 1. '/upload' = the route path
// 2. upload.single('theimage') = middleware that uploads one file from the form field named "theimage"
// 3. (req, res) => {} = callback function that runs after the upload
app.post('/upload', upload.single('theimage'), (req, res) => {
	let currentDate = new Date();

	// what type of data structure is this?
	// A: This is an object 
	let data = {
		dataCaption: req.body.text,
		date: currentDate.toLocaleString(),
		timestamp: currentDate.getTime(),
	};

	// why do we write this if statement?
	// A: This is written so the image only gets added if the user actually uploaded a file.
	if (req.file) {
		data.image = '/uploads/' + req.file.filename;
	}

	// what does the insert function do?
	// A: it saves the data object into the database 
	database.insert(data);

	res.redirect('/');
});

// what does the number signify?
// A: 6001  is the port number the server runs on 
// how do we access this on the web?
// A: The web can be accessed by going to http://localhost:6001 in the browser.
app.listen(6001, () => {
	console.log('server started on port 6001');
});

// continue answering the questions in the index.njk
