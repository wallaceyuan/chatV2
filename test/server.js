/**
 * Created by yuan on 2016/4/19.
 */

var User = require('../model/user');


User.findById({code:123},function(err,user){
    console.log(user);
});
