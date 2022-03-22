// is user logged in?

function authUser(req, res, next){
    if(req.users == null) {
        console.log(req.users)
        res.status(403)
        return res.send('You need to sign in')
    }
    next()
}

module.exports = {
    authUser
}