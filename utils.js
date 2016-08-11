var jdate = require('jdate').JDate();
module.exports = {
	convert2eng: function(pstring) {
		var chars = pstring.split('');
		for (var i = 0; i < chars.length; i++) {
			switch (chars[i]) {
				case '۱':
					chars[i] = '1';
					break;
				case '۲':
					chars[i] = '2';
					break;
				case '۳':
					chars[i] = '3';
					break;
				case '۴':
					chars[i] = '4';
					break;
				case '۵':
					chars[i] = '5';
					break;
				case '۶':
					chars[i] = '6';
					break;
				case '۷':
					chars[i] = '7';
					break;
				case '۸':
					chars[i] = '8';
					break;
				case '۹':
					chars[i] = '9';
					break;
				case '۰':
					chars[i] = '0';
			}
		}
		var res = chars.join('');
		return res;
	},

	convert2per: function(estring) {
		var chars = estring.split('');
		for (var i = 0; i < chars.length; i++) {
			switch (chars[i]) {
				case '1':
					chars[i] = '۱';
					break;
				case '2':
					chars[i] = '۲';
					break;
				case '3':
					chars[i] = '۳';
					break;
				case '4':
					chars[i] = '۴';
					break;
				case '5':
					chars[i] = '۵';
					break;
				case '6':
					chars[i] = '۶';
					break;
				case '7':
					chars[i] = '۷';
					break;
				case '8':
					chars[i] = '۸';
					break;
				case '9':
					chars[i] = '۹';
					break;
				case '0':
					chars[i] = '۰';
			}
		}
		var res = chars.join('');
		return res;
	},

	getdate: function() {
		var day = jdate.getDate();
		var mounth = jdate.getMonth();
		var year = jdate.getFullYear();
		return year + '/' + mounth + '/' + day;
	}

}