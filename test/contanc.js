/**
 * Created by Yuan on 2016/8/27.
 */
/*
var str = " 封城!";
console.log(str.indexOf("封城"));   //6
if(str.indexOf("封城")!=-1){
    console.log("包含");
}else{
    console.log("不包含");
}
*/
var obj = {socketid:111,cid:111,place:124,name:'wallace'}
var oo = JSON.stringify(obj)
var delBox = ['socketid','cid','place']
delBox.map((item,index)=>{
    delete  obj[item]
})
console.log('obj',obj)
console.log('oo',JSON.parse(oo))