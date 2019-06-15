module.exports = function(io, User, _){
    const user = new User();
    io.on("connection" ,function(socket){
        // console.log("User connected");
        socket.on('refresh',function(data){
            console.log("data",data);
            io.emit('refreshPage',{}); //io.emit can all users see the post in same time when it added
        });

        socket.on('online',function(data){
            console.log("data",data);
            user.EnterRoom(socket.id,data.user,data.room);
            const list = user.GetList(data.room);
            io.emit('usersOnline', _.uniq(list));
        });

        socket.on('disconnected',function(){
           const UserOut =  user.RemoveUser(socket.id);
           console.log(UserOut);
           if(UserOut){
            const userItem = user.GetList(UserOut.room);
            const arr = _.uniq(userItem);
            _.remove(arr, n => n === UserOut.name);
            io.emit('usersOnline' ,arr);
             }
        });
    });
};