
var c;
var t = new Date();
var year = t.getFullYear();
var month = t.getMonth(), dayDate = t.getDate(), monthBox = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    dayDate = dayDate < 10 ? "0" + dayDate : dayDate, today = year + "-" + monthBox[month] + "-" + dayDate;
var hour = t.getHours(),min = t.getMinutes();
console.log(hour+':'+min);