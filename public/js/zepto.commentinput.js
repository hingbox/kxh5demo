;(function($,elab){
  /*jshint validthis: true */
  "use strict";

  function noop() {
  };

  function isNotTouchEvent(e) {
    return e.touches.length > 1 || (e.type.toLowerCase() === 'touchend' && e.touches.length > 0);
  }

  function pauseEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  };

  var namespace = "-elab-zepto-commentinput";

  function initialize(elements){
    var me = this
    , $e = this.$e
    , tpl = this.options.template
    , $self = this.$self= $(tpl)
    , w = $e.width()
    , forever = this.options.forever || false
    , $element
    , commentText
    ;

    for(var i = 0; i< elements.length; i++){
      $element = $(elements[i]);
      commentText = $element.html();
      commentText = this.convert(commentText);
      $element.html(commentText);
    }

    $self.css('width', w);

    me.isEmojiVisible = false;
    me.forever = forever;
    me.isVisible = false;


    $e.append($self);

    var $sendBtn  = this.$sendBtn  = $self.find('button.button-send').first();
    var $textarea = this.$textarea = $self.find('textarea').first();
    var $emoji = this.$emoji = $self.find('div.item-emoji').first();
    var $keybordBtn = this.$keybordBtn = $self.find('span.emoji-icon>i.icon-keyboard').first();
    var $emojiBtn = this.$emojiBtn = $self.find('span.emoji-icon>i.icon-express').first();

    var emojis = this.options.emojis || [];
    var pageSize = this.options.emojiPageSize || 23;
    var emoji = {}, emojiTpl = [];

    emojiTpl.push('<div class="swiper-container">');
    emojiTpl.push('<div class="swiper-wrapper">');

    for(var i = 0; i< emojis.length;){
      emojiTpl.push('<div class="swiper-slide">');
      emojiTpl.push('<ul>');
      for(var j = 0; j < pageSize && i< emojis.length; j++, i++){
        emoji = emojis[i];
        emojiTpl.push([
          '<li data-name="', emoji['name'], '" class="', emoji['clazz'], '">',
            '<img src="',emoji['url'],'"></img>',
          '</li>'
        ].join(''));
      }
      emojiTpl.push('<li class="commentinput-emoji-delete icon-close"></li>');
      emojiTpl.push('</ul>');
      emojiTpl.push('</div>');
    }
    emojiTpl.push('</div>');
    emojiTpl.push('<div class="swiper-pagination"></div>');
    emojiTpl.push('</div>');

    $emoji.append(emojiTpl.join(''));

    try{
      new Swiper($emoji.children('div.swiper-container').first()[0],{
        pagination: '.swiper-pagination',
      });
    }catch(e){}

    $emoji.find('ul>li').on('click',function(){
      var $this = $(this);
      if($this.is('.commentinput-emoji-delete')){return;}
      var name = $this.data('name');
      var v1 = me.$textarea.val();
      me.$textarea.val(v1 + '['+name+']');
      me.$sendBtn.addClass('button-send-active');
    });

    $emoji.find('ul>li.commentinput-emoji-delete').on('click',function(){
      me.backspace();
    });

    $sendBtn.on('click',function(e){
      if(!$(this).is('.button-send-active')) return;
      elab.mask.show();
      var ajax = me.options.ajax;
      var content = me.$textarea.val();
      var params = $.extend(true,{'content': content},ajax['params']);
      if(ajax['method'].toUpperCase() === 'POST'){
        $.post(ajax['url'], JSON.stringify(params), function(res){
          elab.mask.hide();
          if(!me.forever){
            me.hide();
          }
          me.$textarea.val('');
          me.$textarea.removeAttr("style");
          $(document).trigger('commentinput-send-success',[params,res]);
        });
      }else{
        throw new Error("unsoppourted http method");
      }
    });

    $emojiBtn.on('click',function(){
      me.$emoji.show();
      me.isEmojiVisible = true;
      $(this).hide();
      me.$textarea.blur();
      me.$keybordBtn.show();
    });

    $keybordBtn.on('click',function(){
      me.$emoji.hide();
      me.isEmojiVisible = false;
      $(this).hide();
      me.$emojiBtn.show();
    });

    $textarea.on('keyup',function(){
      var $this = $(this);
      var v = $this.val();
      me.$sendBtn.toggleClass('button-send-active', v.length > 0);
      this.style.height = "5px";
      this.style.height = (this.scrollHeight)+"px";
    });

    $textarea.on('focus', function(){
      if(me.isEmojiVisible){
        me.$emoji.hide();
        me.$keybordBtn.hide();
        me.$emojiBtn.show();
      }
    });

    if(forever){
      me.show();
      $sendBtn.html(this.options.sendBtnTxt);
      $textarea.attr('placeholder',this.options.placeholder);
      $textarea.attr('maxlength', this.options.maxLength);
      return;
    }

    $(document).on('click',':not([data-toggle=\"commentinput\"])', function(e){
      var $this = $(e.target);
      var elementId = $this.data('id-'+namespace) || false;
      if(elementId && elementId == me.elementId && me.isVisible){
        pauseEvent(e);
        return true;
      }
      if(!$this.is('[data-toggle=\"commentinput\"]')
      && !$this.is('div.elab-commentinput')
      && $this.parents('div.elab-commentinput').length <1){
        if(me.isVisible)me.hide();
      }else{
        pauseEvent(e);
      }
      return true;
    });

    $(document).on('show'+namespace, function(event, target){
      var result = me.options.onBeforeShow();
      if(!result){
        return;
      }
      var $t = $(target)
      , sendBtnTxt = $t.data('btntxt') || 'send'
      , placeholder = $t.data('placeholder') || '...'
      , url = $t.data('url')||'unknownurl'
      , method = $t.data('method') || 'POST'
      , paramStr = $t.data('params') || ''
      , maxLength = $t.data('maxlength') || 144
      ;

      me.elementId = $t.data('id-'+namespace) || false;
      me.$sendBtn.html(sendBtnTxt);
      me.$textarea.attr('placeholder',placeholder);
      me.$textarea.attr('maxlength', maxLength);
      me.$textarea.val('');
      paramStr = paramStr.trim();

      var params = {};
      var paramArr = paramStr.split(me.options.separators.pa || ";");

      for(var i =0; i< paramArr.length; i++){
        var pair = paramArr[i].trim();
        if(pair.length <1) continue;
        var pairArr = pair.split(me.options.separators.kv || "=");
        if(pairArr.length == 2){
          var k = pairArr[0].trim(), v = pairArr[1].trim();
          if(k.length > 0){
            Object.defineProperty(params, k , {
              value: v,
              enumerable: true
            });
          }
        }
      }

      $.extend(true, me.options.ajax, {
        'url':url,
        'method': method
      });

      me.options.ajax.params = params;
      me.show();
      pauseEvent(event);
    });
  }

  /**
   * Represents the Zepto CommentInput plugin.
   *
   * @class CommentInput
   * @constructor
   * @param element {Object} The corresponding DOM element.
   * @param options {Object} The options to override default settings.
   * @chainable
   **/
  var CommentInput = function(options){
    this.options = $.extend(true, {}, CommentInput.defaults, $.fn.commentinput.defaults, options);
    this.el = this.options.el;
    this.$e = $(this.getEl());
  };

  CommentInput.defaults = {
    el: 'body',
    forever:false,
    placeholder: '评论...',
    sendBtnTxt: '发送',
    emojiPageSize : 23,
    maxLength: 144,
    separators:{
      kv: '=',
      pa: ';'
    },
    ajax:{
      method:'POST',
      params:{},
      url:''
    },
    onBeforeShow:function(){
      return true;
    },
    template: [
      '<div class="footer-fixbox import-pop elab-commentinput elab-commentinput-hide">',
        '<div class="area-switch">',
          '<div class="item item-conment">',
            '<span class="emoji-icon emoji-icon-right">',
              '<i class="icon-keyboard f28"  style="display:none;"></i>',
              '<i class="icon-express f28"></i>',
              '<button class="button button-send ml-20">发送</button>',
            '</span>',
            '<textarea class="textarea-conment" rows="1"  placeholder="评论..."></textarea>',
          '</div>',
        '</div>',
        '<div class="item-emoji clearfix">',
        '</div>',
      '</div>'
    ].join('')
  };

  CommentInput.prototype.getEl = function(){
    return this.el;
  };

  CommentInput.prototype.destory = function(){
    this.$self.remove();

  }

  CommentInput.prototype.convert = function(v){
    if(Object.prototype.toString.call(v) !=='[object String]'){
      return v;
    }

    var emojis = this.options.emojis || []
    , name
    , emoji
    , idx
    , regxp
    ;

    if(v.lenghth == 0){return;}

    for(var i =0 ;i<emojis.length; i++){
      emoji = emojis[i];
      name = emoji['name'] || '';
      if(name.length == 0) continue;
      idx = v.indexOf('['+name+']');
      if(idx != -1){
        regxp = new RegExp('\\['+name+'\\]', 'g');
        //v = v.replace(regxp, ['<i class="emoji-item ', emoji.clazz,'"></i>'].join(''));
        v = v.replace(regxp, [
          '<i class="emoji-item">',
            '<img src="',emoji['url'],'"></img>',
          '</i>'
        ].join(''));
      }
    }
    return v;
  }

  elab.util.commentconvert = function(v){
    if(Object.prototype.toString.call(v) !=='[object String]'){
      return v;
    }

    var emojis = $.fn.commentinput.defaults.emojis || []
    , name
    , emoji
    , idx
    , regxp
    ;

    if(v.lenghth == 0){return;}

    for(var i =0 ;i<emojis.length; i++){
      emoji = emojis[i];
      name = emoji['name'] || '';
      if(name.length == 0) continue;
      idx = v.indexOf('['+name+']');
      if(idx != -1){
        regxp = new RegExp('\\['+name+'\\]', 'g');
        //v = v.replace(regxp, ['<i class="emoji-item ', emoji.clazz,'"></i>'].join(''));
        v = v.replace(regxp, [
          '<i class="emoji-item">',
            '<img src="',emoji['url'],'"></img>',
          '</i>'
        ].join(''));
      }
    }
    return v;
  };

  CommentInput.prototype.backspace = function(){
    var v = this.$textarea.val() || ''
    , emojis = this.options.emojis || []
    , name
    , emoji
    , idx
    , isOK = false
    ;

    if(v.lenghth == 0){return;}

    for(var i =0 ;i<emojis.length; i++){
      emoji = emojis[i];
      name = emoji['name'] || '';
      if(name.length == 0) continue;
      name = '['+name+']';
      idx = v.lastIndexOf(name);
      if(idx != -1 && idx == v.length - name.length){
        isOK = true;
        break;
      }
    }

    idx = isOK ? idx : (v.length-1);
    v = v.substr(0,idx);
    this.$textarea.val(v);
    this.$sendBtn.toggleClass('button-send-active', v.length > 0);
  };

  CommentInput.prototype.hide = function(){
    this.isVisible = false;
    return this.$self.hide();
  };

  CommentInput.prototype.show = function(){
    this.$self.removeClass('elab-commentinput-hide');
    this.$emoji.hide();
    this.$keybordBtn.hide();
    this.$emojiBtn.show();
    this.isVisible = true;
    return this.$self.show();
  };

  // commentinput plugin definition
  var old = $.fn.commentinput;

  $.fn.commentinput = function (option){
    if(this.length == 0){
      return;
    }

    var $this;
    this.each(function(){
      $this = $(this);
      $this.data('id-'+namespace, new Date().getTime());
    });

    var args = Array.prototype.slice.call(arguments, 1)
    , instance= false
    , options = typeof option === "object" && option
    , $body = $('body')
    ;

    instance = $body.data(namespace);

    if (!instance){
      $body.data(namespace, true);
      instance = new CommentInput(options)
      return initialize.call(instance,this);
    }else{
      $body.find('div.elab-commentinput').remove();
      instance = new CommentInput(options)
      return initialize.call(instance,this);
    }

    if (typeof option === "string"){
      return instance[option].apply(instance, args);
    }
  };

  $.fn.commentinput.Constructor = CommentInput;

  $.fn.commentinput.defaults = {
    emojis:[
      {name:'微笑',   clazz:'emoji-01', url: './img/emoji/24x24/01.gif' },
      {name:'撇嘴',   clazz:'emoji-02', url: './img/emoji/24x24/02.gif' },
      {name:'色',     clazz:'emoji-03', url: './img/emoji/24x24/03.gif' },
      {name:'发呆',   clazz:'emoji-04', url: './img/emoji/24x24/04.gif' },
      {name:'得意',   clazz:'emoji-05', url: './img/emoji/24x24/05.gif' },
      {name:'流泪',   clazz:'emoji-06', url: './img/emoji/24x24/06.gif' },
      {name:'害羞',   clazz:'emoji-07', url: './img/emoji/24x24/07.gif' },
      {name:'闭嘴',   clazz:'emoji-08', url: './img/emoji/24x24/08.gif' },
      {name:'睡',     clazz:'emoji-09', url: './img/emoji/24x24/09.gif' },
      {name:'大哭',   clazz:'emoji-10', url: './img/emoji/24x24/10.gif' },
      {name:'尴尬',   clazz:'emoji-11', url: './img/emoji/24x24/11.gif' },
      {name:'发怒',   clazz:'emoji-12', url: './img/emoji/24x24/12.gif' },
      {name:'调皮',   clazz:'emoji-13', url: './img/emoji/24x24/13.gif' },
      {name:'龇牙',   clazz:'emoji-14', url: './img/emoji/24x24/14.gif' },
      {name:'惊讶',   clazz:'emoji-15', url: './img/emoji/24x24/15.gif' },
      {name:'难过',   clazz:'emoji-16', url: './img/emoji/24x24/16.gif' },
      {name:'酷',     clazz:'emoji-17', url: './img/emoji/24x24/17.gif' },
      {name:'冷汗',   clazz:'emoji-18', url: './img/emoji/24x24/18.gif' },
      {name:'抓狂',   clazz:'emoji-19', url: './img/emoji/24x24/19.gif' },
      {name:'吐',     clazz:'emoji-20', url: './img/emoji/24x24/20.gif' },
      {name:'偷笑',   clazz:'emoji-21', url: './img/emoji/24x24/21.gif' },
      {name:'可爱',   clazz:'emoji-22', url: './img/emoji/24x24/22.gif' },
      {name:'白眼',   clazz:'emoji-23', url: './img/emoji/24x24/23.gif' },
      {name:'傲慢',   clazz:'emoji-24', url: './img/emoji/24x24/24.gif' },
      {name:'饥饿',   clazz:'emoji-25', url: './img/emoji/24x24/25.gif' },
      {name:'困',     clazz:'emoji-26', url: './img/emoji/24x24/26.gif' },
      {name:'酷',     clazz:'emoji-27', url: './img/emoji/24x24/27.gif' },
      {name:'惊恐',   clazz:'emoji-28', url: './img/emoji/24x24/28.gif' },
      {name:'流汗',   clazz:'emoji-29', url: './img/emoji/24x24/29.gif' },
      {name:'憨笑',   clazz:'emoji-30', url: './img/emoji/24x24/30.gif' },
      {name:'大兵',   clazz:'emoji-31', url: './img/emoji/24x24/31.gif' },
      {name:'奋斗',   clazz:'emoji-32', url: './img/emoji/24x24/32.gif' },
      {name:'咒骂',   clazz:'emoji-33', url: './img/emoji/24x24/33.gif' },
      {name:'疑问',   clazz:'emoji-34', url: './img/emoji/24x24/34.gif' },
      {name:'嘘',     clazz:'emoji-35', url: './img/emoji/24x24/35.gif' },
      {name:'晕',     clazz:'emoji-36', url: './img/emoji/24x24/36.gif' },
      {name:'折磨',   clazz:'emoji-37', url: './img/emoji/24x24/37.gif' },
      {name:'衰',     clazz:'emoji-38', url: './img/emoji/24x24/38.gif' },
      {name:'骷髅',   clazz:'emoji-39', url: './img/emoji/24x24/39.gif' },
      {name:'敲打',   clazz:'emoji-40', url: './img/emoji/24x24/40.gif' },
      {name:'再见',   clazz:'emoji-41', url: './img/emoji/24x24/41.gif' },
      {name:'擦汗',   clazz:'emoji-42', url: './img/emoji/24x24/42.gif' },
      {name:'抠鼻',   clazz:'emoji-43', url: './img/emoji/24x24/43.gif' },
      {name:'鼓掌',   clazz:'emoji-44', url: './img/emoji/24x24/44.gif' },
      {name:'糗大了', clazz:'emoji-45', url: './img/emoji/24x24/45.gif' },
      {name:'左哼哼', clazz:'emoji-46', url: './img/emoji/24x24/46.gif' },
      {name:'右哼哼', clazz:'emoji-47', url: './img/emoji/24x24/47.gif' },
      {name:'哈欠',   clazz:'emoji-48', url: './img/emoji/24x24/48.gif' },
      {name:'鄙视',   clazz:'emoji-49', url: './img/emoji/24x24/49.gif' },
      {name:'委屈',   clazz:'emoji-50', url: './img/emoji/24x24/50.gif' },
      {name:'快哭了', clazz:'emoji-51', url: './img/emoji/24x24/51.gif' },
      {name:'阴险',   clazz:'emoji-52', url: './img/emoji/24x24/52.gif' },
      {name:'亲亲',   clazz:'emoji-53', url: './img/emoji/24x24/53.gif' },
      {name:'吓',     clazz:'emoji-54', url: './img/emoji/24x24/54.gif' },
      {name:'可怜',   clazz:'emoji-55', url: './img/emoji/24x24/55.gif' },
      {name:'菜刀',   clazz:'emoji-56', url: './img/emoji/24x24/56.gif' },
      {name:'西瓜',   clazz:'emoji-57', url: './img/emoji/24x24/57.gif' },
      {name:'啤酒',   clazz:'emoji-58', url: './img/emoji/24x24/58.gif' },
      {name:'篮球',   clazz:'emoji-59', url: './img/emoji/24x24/59.gif' },
      {name:'乒乓',   clazz:'emoji-60', url: './img/emoji/24x24/60.gif' },
      {name:'咖啡',   clazz:'emoji-61', url: './img/emoji/24x24/61.gif' },
      {name:'饭',     clazz:'emoji-62', url: './img/emoji/24x24/62.gif' },
      {name:'猪头',   clazz:'emoji-63', url: './img/emoji/24x24/63.gif' },
      {name:'玫瑰',   clazz:'emoji-64', url: './img/emoji/24x24/64.gif' },
      {name:'凋谢',   clazz:'emoji-65', url: './img/emoji/24x24/65.gif' },
      {name:'示爱',   clazz:'emoji-66', url: './img/emoji/24x24/66.gif' },
      {name:'爱心',   clazz:'emoji-67', url: './img/emoji/24x24/67.gif' },
      {name:'心碎',   clazz:'emoji-68', url: './img/emoji/24x24/68.gif' },
      {name:'蛋糕',   clazz:'emoji-69', url: './img/emoji/24x24/69.gif' },
      {name:'闪电',   clazz:'emoji-70', url: './img/emoji/24x24/70.gif' },
      {name:'炸弹',   clazz:'emoji-71', url: './img/emoji/24x24/71.gif' },
      {name:'刀',     clazz:'emoji-72', url: './img/emoji/24x24/72.gif' },
      {name:'足球',   clazz:'emoji-73', url: './img/emoji/24x24/73.gif' },
      {name:'瓢虫',   clazz:'emoji-74', url: './img/emoji/24x24/74.gif' },
      {name:'便便',   clazz:'emoji-75', url: './img/emoji/24x24/75.gif' },
      {name:'月亮',   clazz:'emoji-76', url: './img/emoji/24x24/76.gif' },
      {name:'太阳',   clazz:'emoji-77', url: './img/emoji/24x24/77.gif' },
      {name:'礼物',   clazz:'emoji-78', url: './img/emoji/24x24/78.gif' },
      {name:'拥抱',   clazz:'emoji-79', url: './img/emoji/24x24/79.gif' },
      {name:'强',     clazz:'emoji-80', url: './img/emoji/24x24/80.gif' },
      {name:'弱',     clazz:'emoji-81', url: './img/emoji/24x24/81.gif' },
      {name:'握手',   clazz:'emoji-82', url: './img/emoji/24x24/82.gif' },
      {name:'胜利',   clazz:'emoji-83', url: './img/emoji/24x24/83.gif' },
      {name:'抱拳',   clazz:'emoji-84', url: './img/emoji/24x24/84.gif' },
      {name:'勾引',   clazz:'emoji-85', url: './img/emoji/24x24/85.gif' },
      {name:'拳头',   clazz:'emoji-86', url: './img/emoji/24x24/86.gif' },
      {name:'差劲',   clazz:'emoji-87', url: './img/emoji/24x24/87.gif' },
      {name:'爱你',   clazz:'emoji-88', url: './img/emoji/24x24/88.gif' },
      {name:'不是',   clazz:'emoji-89', url: './img/emoji/24x24/89.gif' },
      {name:'好的',   clazz:'emoji-90', url: './img/emoji/24x24/90.gif' },
      {name:'爱情',   clazz:'emoji-91', url: './img/emoji/24x24/91.gif' },
      {name:'飞吻',   clazz:'emoji-92', url: './img/emoji/24x24/92.gif' },
      {name:'跳跳',   clazz:'emoji-93', url: './img/emoji/24x24/93.gif' },
      {name:'发抖',   clazz:'emoji-94', url: './img/emoji/24x24/94.gif' },
      {name:'怄火',   clazz:'emoji-95', url: './img/emoji/24x24/95.gif' },
      {name:'转圈',   clazz:'emoji-96', url: './img/emoji/24x24/96.gif' },
      {name:'磕头',   clazz:'emoji-97', url: './img/emoji/24x24/97.gif' },
      {name:'回头',   clazz:'emoji-98', url: './img/emoji/24x24/98.gif' },
      {name:'跳绳',   clazz:'emoji-99', url: './img/emoji/24x24/99.gif' },
      {name:'挥手',   clazz:'emoji-100', url: './img/emoji/24x24/100.gif' },
      {name:'激动',   clazz:'emoji-101', url: './img/emoji/24x24/101.gif' },
      {name:'街舞',   clazz:'emoji-102', url: './img/emoji/24x24/102.gif' },
      {name:'献吻',   clazz:'emoji-103', url: './img/emoji/24x24/103.gif' },
      {name:'左太极', clazz:'emoji-104', url: './img/emoji/24x24/104.gif' },
      {name:'右太极', clazz:'emoji-105', url: './img/emoji/24x24/105.gif' }
    ]
  };

  // commentinput no conflict
  $.fn.commentinput.noConflict = function (){
    $.fn.commentinput = old;
    return this;
  };

  $(document).ready(function(){
    var selector = '[data-toggle=\"commentinput\"]';
    $(selector).commentinput();
    $(document).on('click',selector, function(e){
      pauseEvent(e);
      if($(this).data('readonly') === true){
      }else{
        $(document).trigger('show'+namespace,[this]);
      }
    });
  });
})(window.$||Zepto,window.elab||elab);
