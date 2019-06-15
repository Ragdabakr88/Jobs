import { User } from '../auth/shared/auth.model';
export class Job {
    static readonly CATEGORIES = [
        "المحاسبة والمالية" ,
        "العمل الكتابي وإدخال البيانات" ,
        "التدريس والتدريب",
        "الموارد البشرية",
        "تكنولوجيا المعلومات وأجهزة الكمبيوتر",
        "الترجمه",
        "التصميم والجرافيك",
        "الهندسه",
        "الصحه والتمريض",
        "حرف ومهن عامه",
];
	id:string;
	title:string;
    user:User;
    max:number;
    min:number;
	category:string;
	type:string;
	createdAt:string;
    description:string;
    tag:string;
    address:string;
    expireDate:string;
    email:string;
}
