class ValidationService {
    createUserForLogIn(body) {
        if(!(body && this.isValidLogin(body.login) && this.isValidPassword(body.password)))
            return null;
        return {
            login: body.login.toLowerCase(),
            password: body.password
        }
    }
    createUserForCheckIn(body) {
        if(!(body && this.isValidLogin(body.login) && this.isValidPassword(body.password) && this.isValidName(body.name)))
            return null;
        return {
            login: body.login.toLowerCase(),
            password: body.password,
            name: body.name
        }
    }

    isValidLogin(login) {
        return (/\S+@\S+\.\S+/).test(login) && login.length < 25;
    }

    isValidPassword(password) {
        return password && typeof(password) == "string" && password.length > 7 && password.length < 25
    }

    isValidName(name) {
        return name && typeof(name) == "string" && name.length > 1 && name.length < 25
    }

    checkTokeninHeader(strToken) {
        if (!strToken)
            return false;
        let token = strToken.split(' ')[1];
        if (!token)
            return false;
        return token;
    }

    createNews(body) {
        if (!(body && this.isValidStringForNews(body.title, 100) && this.isValidStringForNews(body.titleContent, 200) &&
            this.isValidStringForNews(body.content, Infinity) && this.isValidStringForNews(body.tag, 100)))
            return null;
        return {
            title: body.title,
            titleContent: body.titleContent,
            content: body.content,
            tag: body.tag
        }
    }

    isValidStringForNews(str, maxlength) {
        return typeof(str) == 'string' && str  && str.length < ++maxlength;
    }
}

module.exports = new ValidationService();