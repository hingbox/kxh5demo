;(function($){
  /*jshint validthis: true */
  "use strict";

  var namespace = ".elab.zepto.currencyformat";

  // currencyformat plugin definition
  var old = $.fn.currencyformat;

  $.fn.currencyformat = function (option){
    var args = Array.prototype.slice.call(arguments, 1);
    return this.each(function (){
      var $this = $(this)
      , act = $(this).data('value')
      ;

      try{
        act = parseFloat(act).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        $this.html(act);
      }catch(e){}
    });
  };

  // currencyformat no conflict
  $.fn.currencyformat.noConflict = function (){
    $.fn.currencyformat = old;
    return this;
  };

  $(document).ready(function(){
    $("[data-toggle=\"currency\"]").currencyformat();
  });
})(Zepto);

;(function($){
  var scroll = $.fn.windowScroll;

  var namespace = ".elab.zepto.windowScroll";

  $.fn.windowScroll = function(){
    return this.scroll(function(){
      if($('body').scrollTop() != 0) {
        $('.header').removeClass('header-bg-a').addClass('header-bg-b');
      }else{
        $('.header').removeClass('header-bg-b').addClass('header-bg-a');
      }
    });
  };

  // windowScroll no conflict
  $.fn.windowScroll.noConflict = function (){
    $.fn.windowScroll = scroll;
    return this;
  };
})(Zepto)
