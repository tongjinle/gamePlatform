/// <reference path="../node_modules/@types/requirejs/index.d.ts" />
require.config({
	paths:{
		"jquery":"../node_modules/jquery/dist/jquery",
		"underscore":"../node_modules/underscore/underscore",
	}
});


require(["index"]);