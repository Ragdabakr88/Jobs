export class User{
    _id:string;
    username:string;
    email:string;
    password:string;
    passwordConfirmation:string;
    resetPasswordToken: String;
    resetPasswordExpires: Date;
    followers:User;
    following:User;

}