export interface FeedCard{
    _id: string;
    userId: string;
    username: string; 
    date: Date; 
    likes: number;
    youLiked: boolean;
    postedPhoto: string;
    userAvatar: string;
}