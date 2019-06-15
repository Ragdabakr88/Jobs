module.exports = function(io){
    io.on("connection" ,function(socket){
        // console.log("User connected");
        socket.on('join', (params) => {
            console.log("params",params);
            socket.join(params.room1);
            socket.join(params.room2);
        });
        socket.on('start_typing', data => {
            console.log("data22",data);
            io.to(data.reciver).emit('is_typing' , data);
        });
    });
};