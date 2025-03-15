
export interface IFollowers{
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
    articleCount: number;
    followers: {user: string}[];
    following: {user: string}[]
}