import * as Yup from 'yup';


export const validationSchema = (step: number) => Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  dob: Yup.string()
    .required('Date of birth is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Confirm Password does not match")
    .required("Confirm Password is required"),
  role: Yup.string().when([], {
    is: () => step === 2,
    then: (schema) => schema.required('Role is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  interested: Yup.array().when([], {
    is: () => step === 2,
    then: (schema) => schema.min(1, 'Please select at least one interest').required('Interests are required'),
    otherwise: (schema) => schema.notRequired()
  })
});

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
})

