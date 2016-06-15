if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}

if(!String.prototype.repeat) {
	String.prototype.repeat = function(num) {
		if(num==0) {
			return "";
		}

		var r = this;
		for(var i=1;i<num;i++) {
			r += this;
		}

		return r;
	}
}

if(!String.pad) {
	String.pad = function(str,size,ch,side) {
		if(size <= str.length) {
			return str;
		}

		return ch.repeat(size - str.length) + str;
	}
}
