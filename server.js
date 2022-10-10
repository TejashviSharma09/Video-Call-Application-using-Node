const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

// EJS as View Engine, it will look for 'EJS view template' in a folder named 'view' ONLY 
app.set('view engine', 'ejs')
// Static files(Images, CSS files, JS files) in 'public' folder
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomID: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomID, userID) => {
        socket.join(roomID)
        socket.to(roomID).broadcast.emit('user-connected', userID)

        socket.on('disconnect', () => {
            socket.to(roomID.broadcast.emit('user-disconnected', userID))
        })
    })
})

server.listen(3000)