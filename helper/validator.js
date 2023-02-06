let validateHelper = {};

validateHelper.validateInputs = (email, password=null, name=null, repeatPassword=null)=> {
    let errorObj = {};

    if(email != null && !email.includes("@gmail.com") || email.trim().length == 0) {
        errorObj.email_param = {
            error: 'email is invalid',
            param: "email"
        }
    }
    if(name !== null && name.trim().length < 6) {
        errorObj.name_param = {
            error: 'name should be nore than 6 characters',
            param: "name"
        }
    }

    if(password != null && (password.trim().length == 0 || password.trim().length < 6)) {
        errorObj.password_param = {
            error: 'password should be greater than 6',
            param: "password"
        }
    }

    if(repeatPassword !== null && (repeatPassword.trim().length == 0 || repeatPassword.trim().length < 6 || repeatPassword.trim() != password.trim())) {
        errorObj.repeat_password_param = {
            error: 'repeat_password should be greater than 6 or repeat_password is not matching with password',
            param: "repeatPassword"
        }
    }
    return errorObj;
}

module.exports = validateHelper;