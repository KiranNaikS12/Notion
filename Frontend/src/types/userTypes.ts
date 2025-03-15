export interface RegistrationFormValues {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    password: string;
    confirmPassword: string;
    role: string;
    interested: string[];
}

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface IFollowing {
    user: string;
    _id: string
}

export interface UserStats {
    articleCount: number;
    followersCount: number;
    followingCount: number;
}