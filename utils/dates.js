
"use strict"

function toNormalDateString(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
        
    return year + "-" + month + "-" + day;
}

function toNormalDateTimeString(datetime) {
    var datestr = toNormalDateString(datetime);
    
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    
    if (hour < 10)
        hour = "0" + hour;
    if (minute < 10)
        minute = "0" + minute;
    if (second < 10)
        second = "0" + second;
        
    return datestr + " " + hour + ":" + minute + ":" + second;
}

function isDateTimeString(text) {
    if (!text)
        return false;
        
    if (text.length != 19)
        return false;
        
    return text.match(/\d\d\d\d-\d\d-\d\d\s\d\d:\d\d:\d\d/) != null;
}

function toDate(text) {
    var parts = text.split('-');
    
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

function calculateDates(fromDate, days, nperiods) {
    var date = toDate(fromDate);
    var result = [];
    
    for (var k = 0; k < nperiods; k++) {
        date.setDate(date.getDate() + days);
        result.push(toNormalDateString(date));
    }
    
    return result;
}

module.exports = {
    toNormalDateString: toNormalDateString,
    toNormalDateTimeString: toNormalDateTimeString,
    isDateTimeString: isDateTimeString,
    nowString: function () { return toNormalDateTimeString(new Date()); },
    calculateDates: calculateDates
}
