import { UserData } from '../user/user.interface';
import {ArticleEntity} from './article.entity';

interface CommentData {
    body: string
}

export interface ArticleData {
    slug: string;
    title: string;
    description: string;
    body?: string;
    tagList?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    favorited?: boolean;
    favoritesCount?: number;
    // author?: UserData;
}

export interface CommentsRO {
    comments: CommentData[]
}

export interface ArticleRO {
    article: ArticleEntity;
}

export interface ArticlesRO {
    articles: ArticleEntity[];
    articlesCount: number
}
