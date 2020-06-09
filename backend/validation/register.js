const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    //convert fields to string
    data.name = !isEmpty(data.name)?data.name:"";
    data.email = !isEmpty(data.email)?data.email:"";
    data.password = !isEmpty(data.password)?data.password:"";
    data.password2 = !isEmpty(data.password2)?data.password2:"";

    //check for name
    if(Validator.isEmpty(data.name))
    {
        errors.name = "Name field is required";
    }

    //Email Check
    if(Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    }
    else if(!Validator.isEmail(data.email))
    {
        errors.email = "Email is invalid";
    }

    //password check
    if(Validator.isEmpty(data.password))
    {
        errors.password = "Password field is required";
    }

    //confirm password
    if(Validator.isEmpty(data.password2))
    {
        errors.password2 = "confirm password field is required";
    }

    //password validation
    if(!Validator.isLength(data.password , {min:6 , max:30})) 
    {
        errors.password = "Password must be at least 6 characters";
    }

    //checking password match 
    if(!Validator.equals(data.password , data.password2))
    {
        errors.password2 = "Password does not match";
    }

    return{
        errors,
        isValid:isEmpty(errors)
    };
};