import { User } from '../auth/shared/auth.model';
export class Post {

	id:string;
	post:string;
	user:User;
	username:string;
	totalLikes:string;
	createdAt:string;
    comments:[];
    likes:[];
}