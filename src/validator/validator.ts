import {BlogService} from "../services/blog-service";
import {body, validationResult, CustomValidator} from 'express-validator';
import {UserService} from "../services/user-service";

export const myValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            message: error.msg,
            field: error.param
        };
    },
});

const isWebsiteUrlPattern: CustomValidator = (value: string) => {
    const patternURL = new RegExp(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/);
    if (!patternURL.test(value)) {
        throw new Error()
    }

    return true;
};

const isBodyIdPattern: CustomValidator = async (value: string) => {
    const blogService = new BlogService()
    const blog = await blogService.getOne(value)
    if (!blog) {
        throw new Error()
    }

    return true;
};

const isLoginPattern: CustomValidator = (value: string) => {
    const patternLogin = new RegExp(/^[a-zA-Z0-9_-]*$/);
    if (!patternLogin.test(value)) {
        throw new Error()
    }

    return true;
}

const isEmailPattern: CustomValidator = (value: string) => {
    const patternEmail = new RegExp(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/);
    if (!patternEmail.test(value)) {
        throw new Error()
    }

    return true;
}

const isExistEmail: CustomValidator = async (value: string) => {
    const userService = new UserService()
    const user = await userService.findByEmail(value)
    if (user) {
        throw new Error()
    }

    return true;
}

const isNotExistEmail: CustomValidator = async (value: string) => {
    const userService = new UserService()
    const user = await userService.findByEmail(value)
    if (!user) {
        throw new Error()
    }

    return true;
}

const isConfirmedCode: CustomValidator = async (value: string) => {
    const userService = new UserService()
    const user = await userService.findByCode(value)
    if (user?.isConfirmed) {
        throw new Error()
    }

    return true;
}

const isExistCode: CustomValidator = async (value: string) => {
    const userService = new UserService()
    const user = await userService.findByCode(value)
    if (!user) {
        throw new Error()
    }

    return true;
}

const isConfirmedEmail: CustomValidator = async (value: string) => {
    const userService = new UserService()
    const user = await userService.findByEmail(value)
    if (user?.isConfirmed) {
        throw new Error()
    }

    return true;
}

const isExistLogin: CustomValidator = async (value: string) => {
    const userService = new UserService()
    const user = await userService.findByLogin(value)
    if (user) throw new Error()
    return true
}


export const nameValidation = body('name')
    .trim()
    .isLength({max: 15})
    .withMessage("Name has incorrect length. (Name has more than 15 characters)")
    .notEmpty()
    .withMessage("Name has incorrect length. (Name is empty)")
    .isString()
    .withMessage("Name has incorrect value. (Name isn't string)");

export const descriptionValidation = body('description')
    .trim()
    .isLength({max: 500})
    .withMessage("Name has incorrect length. (Description has more than 500 characters)")
    .notEmpty()
    .withMessage("Name has incorrect length. (Name is empty)")
    .isString()
    .withMessage("Name has incorrect value. (Name isn't string)");

export const websiteUrlValidation = body('websiteUrl')
    .trim()
    .isLength({max: 100})
    .withMessage("YoutubeUrl has incorrect length. (YoutubeUrl has more than 100 characters)")
    .isString()
    .withMessage("YoutubeUrl has incorrect value. (YoutubeUrl is empty)")
    .custom(isWebsiteUrlPattern)
    .withMessage("YoutubeUrl has incorrect value. (YoutubeUrl doesn't match pattern)");

export const titleValidation = body('title')
    .trim()
    .isLength({max: 30})
    .withMessage("Title has incorrect length. (Title has more than 30 characters)")
    .notEmpty()
    .withMessage("Title has incorrect length. (Title is empty)")
    .isString()
    .withMessage("Title has incorrect value. (Title isn't string)");

export const shortDescriptionValidation = body('shortDescription')
    .trim()
    .isLength({max: 100})
    .withMessage("ShortDescription has incorrect length. (ShortDescription has more than 100 characters)")
    .notEmpty()
    .withMessage("ShortDescription has incorrect length. (ShortDescription is empty)")
    .isString()
    .withMessage("ShortDescription has incorrect value. (ShortDescription isn't string)");

export const contentDescriptionValidation = body('content')
    .trim()
    .isLength({max: 1000})
    .withMessage("Content has incorrect length. (Content has more than 1000 characters)")
    .notEmpty()
    .withMessage("Content has incorrect length. (Content is empty)")
    .isString()
    .withMessage("Content has incorrect value. (Content isn't string)");

export const blogIdValidation = body('blogId')
    .trim()
    .isString()
    .withMessage("BlogId has incorrect value. (BlogId doesn't string)")
    .custom(isBodyIdPattern)
    .withMessage("BlogId has incorrect value. (BlogId not found)");

export const loginValidation = body('login')
    .trim()
    .isString()
    .withMessage("Login has incorrect value. (Login doesn't string)")
    .isLength({min: 3, max: 10})
    .withMessage("Login has incorrect value. (Content has less than 3 or more than 10 characters)")
    .custom(isLoginPattern)
    .withMessage("Login has incorrect value. (Login doesn't match pattern)")
    .custom(isExistLogin)
    .withMessage("Login is exist. (This login already exists enter another login)");

export const passwordValidation = body('password')
    .trim()
    .isString()
    .withMessage("Password has incorrect value. (Password doesn't string)")
    .isLength({min: 6, max: 20})
    .withMessage("Password has incorrect value. (Content has less than 6 or more than 20 characters)")

export const emailValidation = body('email')
    .trim()
    .isString()
    .withMessage("Email has incorrect value. (Email doesn't string)")
    .custom(isEmailPattern)
    .withMessage("Email has incorrect value. (Email doesn't match pattern)")
    .custom(isExistEmail)
    .withMessage("Email is exist. (This email already exists enter another email)")
    .custom(isConfirmedEmail)
    .withMessage("Email is confirmed. (This email already confirmed)")


export const emailExistValidation = body('email')
    .trim()
    .isString()
    .withMessage("Email has incorrect value. (Email doesn't string)")
    .custom(isEmailPattern)
    .withMessage("Email has incorrect value. (Email doesn't match pattern)")
    .custom(isNotExistEmail)
    .withMessage("Email is not exist. (This email not exists enter another email)")
    .custom(isConfirmedEmail)
    .withMessage("Email is confirmed. (This email already confirmed)")

export const contentValidation = body('content')
    .trim()
    .isString()
    .withMessage("Content has incorrect value. (BlogId doesn't string)")
    .isLength({min: 20, max: 300})
    .withMessage("Content has incorrect value. (Content has less than 20 or more than 300 characters)")

export const codeConfirmed = body('code')
    .trim()
    .isString()
    .withMessage("Email has incorrect value. (Email doesn't string)")
    .custom(isConfirmedCode)
    .withMessage("Code is confirmed. (This code already confirmed)")
    .custom(isExistCode)
    .withMessage("Code is not exist. (This Code not exists)")


export const blogValidation = [nameValidation, descriptionValidation, websiteUrlValidation];
export const postValidationWithoutBodyId = [titleValidation, shortDescriptionValidation, contentDescriptionValidation];
export const postValidation = [titleValidation, shortDescriptionValidation, contentDescriptionValidation, blogIdValidation];
export const userValidation = [loginValidation, passwordValidation, emailValidation]
export const commentValidation = [contentValidation]
