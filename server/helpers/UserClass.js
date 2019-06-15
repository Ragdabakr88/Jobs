class User{
    constructor(){
        //when user connect the room  push him im globalArray 
        this.globalArray = [];
    }
    EnterRoom(id,name,room){
        const user = {id,name,room};
        this.globalArray.push(user);
        return user;
    }

    GetUserId(id){
        const socketId = this.globalArray.filter(userId => userId.id === id)[0];
        return socketId ;
    }

    RemoveUser(id){
        const user = this.GetUserId(id);
        if(user){
        this.globalArray.filter(userId => userId.id !== id);
        }
        return user ;//return disconnected user
    }

    GetList(room){
        const roomName = this.globalArray.filter(user => user.room === room);
        const names = roomName.map(user => user.name);
        return names;
    }
}
module.exports = {User};