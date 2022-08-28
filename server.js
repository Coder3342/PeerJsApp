require('dotenv').config()


const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4} = require('uuid');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;
const res = require('express/lib/response');
const { requireAuth } = require('./middleware/jwtAuth')
const { checkUser } = require('./middleware/checkUser')

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

/*Middleware*/
app.use(express.static((__dirname + '/public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use("/peerjs", peerServer);

/*View-engine*/
app.set('view engine', 'ejs');



app.get('*', checkUser)

app.get('/', requireAuth, (req, res) => {
    res.render('home')
})

app.get('/room', requireAuth, (req, res) =>{
    res.redirect(`/room/${uuidV4()}`);
})


app.get('/room/:room', requireAuth, (req, res) =>{
    res.render('room', { roomId: req.params.room})
})



/*Connect to room*/
io.on('connection', (socket) =>{
    socket.on('join-room', (roomId, userId) => {
       socket.join(roomId);
       
       socket.on('ready',()=>{
        socket.broadcast.to(roomId).emit('user-connected', userId);
        })
        
       socket.on('disconnect', () => {
           socket.broadcast.to(roomId).emit('user-disconnected', userId)

       })
    })
})


var listener = server.listen(port);
app.use(routes);
module.exports = listener;