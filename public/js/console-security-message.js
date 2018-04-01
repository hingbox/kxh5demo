;(function(){
  var e;
  if(window.console && "undefined" != typeof console.log){
    try{
      (window.parent.__has_console_security_message||window.top.__has_console_security_message)&&(e=true)
    }catch(o){
      e=true;
    }
    if(window.__has_console_security_message||e)return;
    var t="\u6e29\u99a8\u63d0\u793a\uff1a\u8bf7\u4e0d\u8981\u8c03\u76ae\u5730\u5728\u6b64\u7c98\u8d34\u6267\u884c\u4efb\u4f55\u5185\u5bb9\uff0c\u8fd9\u53ef\u80fd\u4f1a\u5bfc\u81f4\u60a8\u7684\u8d26\u6237\u53d7\u5230\u653b\u51fb\uff0c\u7ed9\u60a8\u5e26\u6765\u635f\u5931 \uff01^_^";

    /msie/gi.test(navigator.userAgent)
    ? (console.log(t))
    : (console.log("%c Elab %c Copyright \xa9 2015-%s",'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size:64px;color:#00bbee;-webkit-text-fill-color:#00bbee;-webkit-text-stroke: 1px #00bbee;',"font-size:12px;color:#999999;",(new Date).getFullYear()),console.log("%c "+t,"color:#333;font-size:16px;"));
    window.__has_console_security_message=true;
  }
})();
