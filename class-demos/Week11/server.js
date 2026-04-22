const express = require('express')
const nunjucks = require('nunjucks')


// imports new libraries
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express()

// initialize variables using new libraries
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static('public'))
app.set('view engine', 'njk')
nunjucks.configure('views', {
    autoescape: true,
    express: app
})

app.get('/', (request, response) => {
    response.render('index.njk', {numClient: io.engine.clientsCountlientsCount})
})

// checks if a client has been connected
io.on('connection', (socket) => {
    console.log('a user connected');
    console.log('total users ' + io.engine.clientsCount)
    

    socket.on('silly note', (dataFromClient) => { 
        console.log('message: ' + dataFromClient)

        io.emit('server sent data', dataFromClient)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
});


httpServer.listen(3000, () => {
    console.log('server has started in port 3000')
})