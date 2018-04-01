;(function($){
  /*jshint validthis: true */
  "use strict";

  var namespace = ".elab.zepto.ImgReview";

  // passwordstrength plugin definition
  var old = $.fn.imgreview;

  $.fn.imgreview = function (option){
    if(this.length == 0){
      return;
    }

    var $imgreview = $('.elab-imgreview');
    if($imgreview.length > 0){
      $imgreview.remove();
    }

    if(!window.Swiper){
      console.log("Swiper.js required");
      return;
    }

    var options = typeof option === "object" && option
    , $body = $('body')
    ;

    var w = $body.width()
    , groupNames = []
    , groupImgs = {}
    , imgviews = {}
    ;

    this.each(function (idx){
      var $this= $(this)
      , imgsrc = $this.data('src') || $this.attr('src')
      , title = $this.data('title')
      , group = $this.data('group') || 'undefined'
      ;

      if(groupImgs[group]){
        groupImgs[group].push({'title': title,'src': imgsrc});
      }else{
        groupNames.push(group);
        groupImgs[group] = [{'title': title,'src': imgsrc}];
      }

      $this.data('index', groupImgs[group].length-1);
    });

    for(var i = 0; i < groupNames.length; i++){
      var group = groupNames[i]
      , imgs = groupImgs[group] || []
      , tpl = []
      , itemLength = imgs.length>1 ? w-20 : w
      ;
      tpl.push('<div class="elab-imgreview elab-imgreview-hide">');
      tpl.push('<div class="swiper-container">');
      tpl.push('<div class="swiper-wrapper">');

      for(var j = 0; j < imgs.length; j++){
        var item = imgs[j];
        tpl.push([
          '<div class="swiper-slide', " elab-imgreview-item-rear-",imgs.length-1-j, " elab-imgreview-item-front-",j,'" style="width:',w,'px;">',
            '<div>',
              '<h2 style="width:',itemLength,'px;" class="elab-imgreview-title">',item['title'],'</h2>',
              '<img style="width:', itemLength,'px;" src="',item['src'],'"></img>',
            '</div>',
          '</div>'
          ].join('')
        );
      }
      tpl.push('</div>');
      // if(imgs.length>1){
      //   tpl.push('<div class="swiper-button-next"></div>');
      //   tpl.push('<div class="swiper-button-prev"></div>');
      // }
      tpl.push('<div class="tx-c mt-10 elab-imgreview-close-btn"><div class="elab-imgreview-close-btn-txt">x</div></div>');
      tpl.push('</div>');
      tpl.push('</div>');

      var g = imgviews[group] = {
        '$e' : $(tpl.join(''))
      };

      $body.append(g.$e);

      g.$e.data('group', group);
      g.$s = g.$e.find('div.swiper-container').first();

      g.s= new Swiper(g.$s[0],{
        centeredSlides: true
        // ,
        // nextButton: '.swiper-button-next',
        // prevButton: '.swiper-button-prev'
      });

      g.$e.on('click',function(e){
        e.preventDefault();
        // var $t = $(e.target);
        // if($t.is('.swiper-button-prev') ||$t.is('.swiper-button-next')){
        //   return;
        // }
        $(this).addClass('elab-imgreview-hide');
      });
    }

    this.on('click',function(e){
      e.preventDefault();
      var idx = $(this).data('index')
      , group = $(this).data('group')
      , s = imgviews[group].s
      , $s = imgviews[group].$s
      , $e = imgviews[group].$e
      ;

      idx = parseInt(idx);
      $s.css({
        'margin-left':'-'+ Math.round(w/2)+'px',
        'margin-top' :'-'+ Math.round(s.height/2)+'px'
      });

      $e.removeClass('elab-imgreview-hide');
      s.slideTo(idx);
    });
  };

  // imgreview no conflict
  $.fn.imgreview.noConflict = function (){
    $.fn.imgreview = old;
    return this;
  };

  $(document).ready(function(){
    $("img[data-toggle=\"imgreview\"]").imgreview();
  });
})(Zepto);

;(function($){
  /*jshint validthis: true */
  "use strict";

  var namespace = ".elab.zepto.imgmore";

  function initialize(){
    var me = this
    , $e = this.$e
    , opt = this.options
    , imgs = $e.data('imgs')||""
    , $body = $('body')
    ;


    imgs = imgs.trim();
    imgs = imgs.split(opt.separator);

    var tempImgs = [];
    var imgsrc = "";
    for(var i = 0; i<imgs.length; i++){
      imgsrc = imgs[i].trim();
      if(imgsrc.length ===0) continue;
      tempImgs.push(imgsrc);
    }

    imgs = tempImgs;

    var tpl = [];
    var w = $body.width();

    tpl.push('<div class="elab-imgmore elab-imgmore-hide">');
    tpl.push('<div class="swiper-container">');
    tpl.push('<div class="swiper-wrapper">');

    for(var i = 0; i<imgs.length; i++){
      tpl.push(['<div class="swiper-slide'," elab-imgmore-item-rear-",imgs.length-1-i, " elab-imgmore-item-front-",i,'" style="width:',w,'px;">',
        '<div><img style="width:',w-20,'px;" src="',imgs[i],'"></img></div>',
      '</div>'].join(''));
    }

    tpl.push('</div>');
    // if(imgs.length>1){
    //   tpl.push('<div class="swiper-button-next"></div>');
    //   tpl.push('<div class="swiper-button-prev"></div>');
    // }
    tpl.push('<div class="tx-c mt-10 elab-imgmore-close-btn"><div class="elab-imgmore-close-btn-txt">x</div></div>');
    tpl.push('</div>');
    tpl.push('</div>');

    var $imgmore = $(tpl.join(''));
    $body.append($imgmore);

    var $swiper = $imgmore.find('div.swiper-container').first();

    var swiper = new Swiper($swiper[0],{
      centeredSlides: true
      //,
      // nextButton: '.swiper-button-next',
      // prevButton: '.swiper-button-prev'
    });

    $e.on('click',function(e){
      e.preventDefault();
      $swiper.css({
        'margin-left':'-'+ Math.round(w/2)+'px',
        'margin-top' :'-'+ Math.round(swiper.height/2)+'px'
      });
      $imgmore.removeClass('elab-imgmore-hide');
    });

    $imgmore.on('click',function(e){
      e.preventDefault();
      // var $t = $(e.target);
      // if($t.is('.swiper-button-prev') ||$t.is('.swiper-button-next')){
      //   return;
      // }
      $imgmore.addClass('elab-imgmore-hide');
      swiper.slideTo(0);
    });
  }

  /**
   * Represents the Zepto imgmore plugin.
   *
   * @class ImgMore
   * @constructor
   * @param element {Object} The corresponding DOM element.
   * @param options {Object} The options to override default settings.
   * @chainable
   **/
  var ImgMore = function(element, options){
    this.$e = $(element);
    this.options = $.extend(true, {}, ImgMore.defaults, options);
  };

  ImgMore.defaults = {
    separator: ','
  };

  // imgmore plugin definition
  var old = $.fn.imgmore;

  $.fn.imgmore = function (option){
    var args = Array.prototype.slice.call(arguments, 1);
    return this.each(function (){
      var $this = $(this)
      , instance = $this.data(namespace)
      , options = typeof option === "object" && option
      ;

      if (!instance && option === "destroy"){
        return;
      }

      if (!instance){
        $this.data(namespace, (instance = new ImgMore(this, options)));
        return initialize.call(instance);
      }

      if (typeof option === "string"){
        return instance[option].apply(instance, args);
      }
    });
  };


  $.fn.imgmore.Constructor = ImgMore;

  // imgmore no conflict
  $.fn.imgmore.noConflict = function (){
    $.fn.imgmore = old;
    return this;
  };

  $(document).ready(function(){
    $("[data-toggle=\"imgmore\"]").imgmore();
  });
})(Zepto);
