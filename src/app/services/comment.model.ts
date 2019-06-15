import { User } from '../auth/shared/auth.model';
export class Comment {

	id:string;
	userId:User;
	username:string;
	createdAt:string;
    comment:string;
}