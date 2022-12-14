const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const {v4:uuidv4}=require('uuid');
const peerServer =ExpressPeerServer(server,{
    debug:true
})
app.set('view engine','ejs');
app.use(express.static('public'));

app.use('/peerjs',peerServer);
app.get('/',(req,res)=>{
    // res.status(200).send("hello word ")
    // res.render('room');
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})

io.on('connection',socket=>{
    socket.on('join-room' , (roomId,userId)=>{
        socket.join(roomId);
        //we have a user connected
        socket.to(roomId).emit('user-connected',userId);
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message)
        })

    })
})


server.listen(process.env.PORT||3030);



