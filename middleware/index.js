/**
 * Created by Yuan on 2016/3/20.
 */
exports.checkLogin = function(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登录!');
        return res.redirect('/');
    }
    next();
}

exports.checkNotLogin = function(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登录!');
        return res.redirect('back');//返回之前的页面
    }
    next();
}