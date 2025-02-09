import * as Yup from 'yup';

export const articleFormValidation = Yup.object({
    title: Yup.string()
      .required('Title is Required')
      .min(3, 'Title must be at least have 3 characters'),
    category: Yup.string()
       .required('Category is Required')

})