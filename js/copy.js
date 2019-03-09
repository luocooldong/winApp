/**
 * @description 获取剪贴板内容 (粘贴)
 */
function getClipbordText() {
    if(!window.plus) return;
    if(mui.os.android) {
        var Context = plus.android.importClass("android.content.Context");
        var main = plus.android.runtimeMainActivity();
        var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
        return plus.android.invoke(clip, "getText");
    } else {
        var UIPasteboard = plus.ios.importClass("UIPasteboard");
        var generalPasteboard = UIPasteboard.generalPasteboard();
        // 设置/获取文本内容:
        //generalPasteboard.setValueforPasteboardType("testValue", "public.utf8-plain-text");
        //var _val = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");
        //TODO 应用在后台的时候获取剪切版数据被系统限制了，只有在app内才能访问接口
        var _val=generalPasteboard.plusCallMethod({valueForPasteboardType:"public.utf8-plain-text"});
        console.log("ios复制返回的数据是：",_val); 
        return _val || '';
    }
}

/**
 * @description 设置剪贴板内容（复制）  
 */
function setClipbordText(txt) {
    if(!window.plus) return;
    if(mui.os.android) {
	    var Context = plus.android.importClass("android.content.Context");
	    var main = plus.android.runtimeMainActivity();
	    var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
	    plus.android.invoke(clip,"setText",txt);
    } else {
        var UIPasteboard  = plus.ios.importClass("UIPasteboard");
		var generalPasteboard = UIPasteboard.generalPasteboard();
		generalPasteboard.setValueforPasteboardType(txt,"public.utf8-plain-text");
    }
}