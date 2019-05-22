import { ArticleData } from '../article/article.interface';

export interface UserData {
    username: string;
    email: string;
    token: string;
    bio: string;
    image?: string;
    favorites?: ArticleData[];
}

export interface UserRO {
    user: UserData;
}
