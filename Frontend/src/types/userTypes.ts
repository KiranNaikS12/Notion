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