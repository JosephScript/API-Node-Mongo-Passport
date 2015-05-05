module.exports = {
    IsAuthenticated: function (req,res,next){
        if(req.isAuthenticated()){
            next();
        }else{
            res.render('login.ejs')
        }
    }
};