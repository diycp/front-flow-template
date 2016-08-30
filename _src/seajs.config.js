//开发模式
seajs.develop = true;
// 模块根路径
seajs.root = seajs.develop ? '' : ''; 
// api管理
seajs.api = {
	test: seajs.develop ? '/d' : '/p'
};

seajs.config({
	base: seajs.root + "/modules",
	paths: {
		"js" : seajs.root + "__folder/js",
		"lib": seajs.root + "__folder/lib"
	},
	alias: {
		"audio"		     : "audio/audio",
		"copy"		     : "copy/ZeroClipboard",
		"flv"		     : "flv/flv",
		"hook"	 	     : "hook/hook",
		"jquery" 	     : "jquery/1/jquery.js",
		"validform"      : "validform/validform",
		"My97DatePicker" : "My97DatePicker/WdatePicker",
		"raty"		     : "raty/raty",
		"upload"         : "upload/upload",
		"makethumb"      : "upload/makethumb",
		"localResizeIMG" : "upload/localResizeIMG",
		"video"		     : "video/video",
		"webuploader"    : "webuploader/webuploader"
	},
    localcache:{
        timeout: 2e4
    }
});