const passport=require('passport')
exports.isAuth=(req,res,done)=>
{
    return passport.authenticate('jwt')
}
exports.sanitizeUser=(user)=>{
    return {id:user.id,role:user.role}
}

exports.cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    //TODO: this is temporary token remove it at the end
    token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NGJiY2E4ODFiZTQ0ZmZhZmU2ODhhMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk5NjE5MDk4fQ.qpzFkUyHY45qBRtoXCPQO2O1Id3ml1CdZ9UXMZuBpD4'
    return token;
  };