exports.checkAuthenticatedWithoutRedirect = async (req, res, next) => {

    if (req.isAuthenticated() && req.user && req.user.status ) {
        return next();
    } else {
        try {
            // req.session = null;
            const session = await req.session.destroy();
            const logout = await req.logout();
           
        } catch (e) {
            console.log(e);
        }
    }

}

exports.checkAuthenticated = async (req, res, next) => {

    if (req.isAuthenticated() && req.user && req.user.status ) {
        return next();
    } else {
        try {
            // req.session = null;
            const session = await req.session.destroy();
            const logout = await req.logout();
           
        } catch (e) {
            console.log(e)
        }
    }
    res.redirect('/auth/login');

}

