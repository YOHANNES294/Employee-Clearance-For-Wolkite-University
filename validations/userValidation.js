import { Description } from "@mui/icons-material";
import { string } from "prop-types";
import * as yup from "yup";

export const loginSchema = yup.object({
  id: yup.string().required("Id is required"),
  password: yup.string().min(8).max(50).required(),
});

export const verficationSchema = yup.object({
  
  verificationCode: yup.string().min(4).max(10).required(),
  
});
export const newPasswordSchema = yup.object({
  

  newPassword: yup
    .string()
    .required("Enter new password")
    .min(8, "New password must be at least 8 characters")
    .max(50, "New password must be at most 20 characters"),
  confirmPassword: yup
    .string()
    .required("Re enter  your new password")
    .min(8, "New password must be at least 8 characters")
    .max(50, "New password must be at most 20 characters"),
});



export const forgotPassword = yup.object({
  email: yup.string().required("Id is required"),

});

export const personalInfoSchema = yup.object({
 
});

export const personalProfilePic = yup.object({
  profilePic: yup.string().required("profilePic is required"),
});

export const changePasswordSchema = yup.object({
  oldPassword: yup
    .string()
    .required("Old password required")
    .min(8, "Incorrect password")
    .max(50, "Incorrect password"),

  newPassword: yup
    .string()
    .required("Enter new password")
    .min(8, "New password must be at least 8 characters")
    .max(50, "New password must be at most 20 characters"),
  confirmPassword: yup
    .string()
    .required("Re enter  your new password")
    .min(8, "New password must be at least 8 characters")
    .max(50, "New password must be at most 20 characters"),
});


export const announcement = yup.object({
  image: yup.string().required("image is required"),
  title:yup.string().required("title is required"),
  description:yup.string().required("description is required"),

});