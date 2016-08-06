var jdate = require('jdate').JDate();

module.exports = function(){
	var day = jdate.getDate();
	var mounth = jdate.getMonth();
	var year = jdate.getFullYear();
	return year+'/'+mounth+'/'+day;
}