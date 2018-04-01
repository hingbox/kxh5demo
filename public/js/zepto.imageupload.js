;(function($, elab, FileAPI){
  /*jshint validthis: true */
  "use strict";

  var namespace = ".elab.zepto.imageupload";

  function noop(){
  }

  function isString(v){
    return Object.prototype.toString.call(v) ==='[object String]';
  }

  function isNotTouchEvent(e) {
    return e.touches.length > 1 || (e.type.toLowerCase() === 'touchend' && e.touches.length > 0);
  }

  function pauseEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  };

  function initialize(){
    var me = this
    , opt = this.options
    , $list = this.$list = $(opt.template.list)
    , $hidden = this.$hidden= this.$list.find('input[type=hidden]')
    , imgname
    , imgurl
    ;

    this.$e.append($list);

    if(opt.disableDelete){
      $list.addClass('elab-upload-delete-disabled');
    }

    if(this.initImages.length > 0){
      for(var i = 0; i< this.initImages.length; i++){
        imgname = this.initImages[i];
        imgurl = this.initImageUrls[i];
        if(imgname.length > 0 && imgurl.length > 0){
          this.addItem(imgname, imgurl);
        }
      }
    }

    this.addEmptyItem();
  }

  /**
   * Represents the Zepto ImageUpload plugin.
   *
   * @class ImageUpload
   * @constructor
   * @param element {Object} The corresponding DOM element.
   * @param options {Object} The options to override default settings.
   * @chainable
   **/
  var ImageUpload = function(element, options){
    var opt = this.options = $.extend(true, {}, ImageUpload.defaults, options);

    var $e = this.$e = $(element)
    , url = $e.data('url')
    , paramStr = $e.data('params') || ''
    , imgsize = $e.data('imgsize') || '75'
    , maxnum = $e.data('maxnum') || '1'
    , defimg = $e.data('defimg') || false
    , maxsize = $e.data('maxsize') || opt.maxSize
    , disableDelete = $e.data('disabledelete') || false
    , imgs = $e.data('imgs') || opt.imgs || ''
    , imgurls = $e.data('imgurls') || opt.imgurls || ''
    ;

    try{
      imgsize = parseInt(imgsize);
    }catch(e){
      imgsize = ImageUpload.defaults.imageSize;
    }

    try{
      maxnum = parseInt(maxnum);
    }catch(e){
      maxnum = ImageUpload.defaults.maxNum;
    }

    try{
      maxsize = parseInt(maxsize);
    }catch(e){
      maxsize = ImageUpload.defaults.maxSize;
    }

    if(disableDelete){
      this.options.disableDelete = true;
    }

    paramStr = paramStr.trim();

    var params = {};
    var paramArr = paramStr.split(opt.separators.pa || ";");

    for(var i =0; i< paramArr.length; i++){
      var pair = paramArr[i].trim();
      if(pair.length <1) continue;
      var pairArr = pair.split(opt.separators.kv || "=");
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

    if(isString(imgs) && imgs.length > 0){
      imgs = imgs.split(',');
    }else{
      imgs = [];
    }

    if(isString(imgurls) && imgurls.length >0){
      imgurls = imgurls.split(',');
    }else{
      imgurls = [];
    }

    var len = Math.min(imgs.length, imgurls.length);
    imgs = imgs.splice(0,len);
    imgurls = imgurls.splice(0,len);

    this.params = params;
    this.curNum = 0;
    this.maxNum = maxnum;
    this.imgsize = imgsize;
    this.maxsize = maxsize;
    this.images = [];
    this.imageurls = [];
    this.initImages = imgs;
    this.initImageUrls = imgurls;
    this.url = url || opt.uploadUrl;
    this.defimg = defimg;
  };

  ImageUpload.defaults = {
    maxNum: 1,
    imageSize: 75,
    maxSize:4,//MB
    uploadUrl: 'UnknownUrl',
    disableDelete: false,
    imgs: '',
    imgurls: '',
    params:{},
    separators:{
      kv: '=',
      pa: ';'
    },
    onUploadSuccess:noop,
    imageTransform: {
      type: 'image/jpeg',
      quality: 0.86 // jpeg quality
    },
    template:{
      list:[
        '<div class="elab-upload elab-upload-image">',
          '<input type="hidden" name="file"></input>',
        '</div>'
      ].join(''),
      item:[
        '<div class="elab-upload-item">',
          '<img style="display:none;"></img>',
          '<i class="elab-upload-item-delete icon-fail"></i>',
          '<span>',
            '<div class="elab-upload-drag">',
              '<span role="button" tabindex="0">',
                '<input type="file" style="display:none;" accept="image/*">',
                '<div class="elab-upload-drag-container">',
                  '<i class="icon-plus"></i>',
                '</div>',
              '</span>',
            '</div>',
          '</span>',
        '</div>'
      ].join('')
    }
  };

  ImageUpload.prototype.addImageUrl=function(imageurl){
    this.imageurls.push(imageurl);
  }

  ImageUpload.prototype.addImg=function(img){
    this.images.push(img);
    this.$hidden.val(this.images.join(','));
  }

  ImageUpload.prototype.addItem=function(imgname, imgurl){
    if(this.curNum >= this.maxNum) return;
    var me = this;
    var $item = $(this.options.template.item).css({
      'width' : this.imgsize,
      'height': this.imgsize
    });

    $item.data('idx', this.curNum).addClass('uploaded');

    this.$list.append($item);
    $item.children('img').first().attr('src',imgurl).show();
    $item.children('span').first().hide();

    var item = $item[0];

    item.onmousedown =  this.onMouseDown.bind(this,$item);
    item.ontouchstart = this.onTouchStart.bind(this,$item);

    this.addImg(imgname);
    this.addImageUrl(imgurl);
    this.curNum++;
  }

  ImageUpload.prototype.addEmptyItem=function(){
    if(this.curNum >= this.maxNum) return;
    var me = this;
    var $item = $(this.options.template.item).css({
      'width' : this.imgsize,
      'height': this.imgsize
    });

    $item.data('idx', this.curNum);

    this.$list.append($item);
    if(this.defimg){
      $item.children('img').first().attr('src',this.defimg).show();
    }

    this.curNum++;

    var item = $item[0];

    item.onmousedown =  this.onMouseDown.bind(this,$item);
    item.ontouchstart = this.onTouchStart.bind(this,$item);

    var fileInput = $item.find('input[type=file]').first()[0];

    FileAPI.event.on(fileInput, 'change', function (evt){
      var files = FileAPI.getFiles(evt);
      // Filter and then upload
      FileAPI.filterFiles(files, function (file, info){
        if(/^image/.test(file.type))
        {
        }
        else
        {
          elab.message.error('请选择图片文件');
          return false;
        }

        if(file.size)
        {
          if(file.size < me.maxsize * FileAPI.MB)
          {
            return true;
          }
          else
          {
            elab.message.error('图片文件不能大于2MB');
            return false;
          }
        }
        return true;
      }, function (list, other){
        if(_.isEmpty(list)) return;
        var filename = list[0].name;
        FileAPI.upload({
          url: me.url,
          data: me.params,
          files: {images: list},
          complete: function (err, xhr){
            if( !err ){
              var result = {};

              try{result = JSON.parse(xhr.responseText || xhr.response || xhr.statusText || xhr.responseXML )}catch(e){};
              if(result.success)
              {
                var imgs = result.imgs;
                var imageurl = imgs[0].imageurl;
                var imagename = imgs[0].imagename;
                me.$currentItem.children('img').first().attr('src',imageurl).show();
                me.$currentItem.children('span').first().hide();
                me.$currentItem.addClass('uploaded');
                me.addEmptyItem();
                me.addImageUrl(imageurl);
                me.addImg(imagename);
                //$(document).trigger('imageupload-success',[me.$e, result]);
                me.options.onUploadSuccess(result);
              }
              else
              {
                elab.message.error(result.message||'图片上传失败');
              }
            }
            else{
              elab.message.error('图片上传失败');
            }
          }
        });
      });
    });
  };

  ImageUpload.prototype.browerFile = function(){
    var $this = this.$currentItem;
    if($this.is('.uploaded')){
      if(!this.options.disableDelete){
        var idx = $this.data('idx');
        this.removeItem(idx);
      }
    }else{
      $this.find('input[type=file]').first()[0].click();
    }
  }

  ImageUpload.prototype.onTouchStart = function($item, e) {
    if (isNotTouchEvent(e)) return;
    this.$currentItem = $item;
    this.browerFile();
    pauseEvent(e);
  }

  ImageUpload.prototype.onMouseDown = function($item, e) {
    this.$currentItem = $item;
    this.browerFile();
    pauseEvent(e);
  }

  ImageUpload.prototype.removeItem = function(idx){
    if(idx<0 || idx > this.curNum-1) {
      return;
    }
    var $items = this.$list.children('div.elab-upload-item');
    var $item;
    var oldIdx;
    $items.each(function(index, item){
      $item  = $(item);
      oldIdx = $item.data('idx');
      if(oldIdx > idx){
        $item.data('idx',oldIdx-1);
      }
    });

    $items.eq(idx).remove();

    var i, length, a=[], b=[];

    for (i = 0;i < idx; i++) {
      a[i] = this.images[i];
    }

    for (i = idx+1, length = this.images.length; i < length; i++) {
      a[i-1] = this.images[i];
    }

    this.images = a;

    for (i = 0; i < idx; i++) {
      b[i] = this.images[i];
    }

    for (i = idx+1, length = this.imageurls.length; i < length; i++) {
      b[i-1] = this.imageurls[i];
    }

    this.imageurls = b;

    this.$hidden.val(this.images.join(','));
    this.curNum--;
    if(idx === this.curNum){
      this.addEmptyItem();
    }
  }

  // ImageUpload plugin definition
  var old = $.fn.imageupload;

  $.fn.imageupload = function (option){
    if(this.length == 0){
      return;
    }
    if(!FileAPI){
      console.log("FileAPI required");
      return;
    }

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
        $this.data(namespace, (instance = new ImageUpload(this, options)));
        return initialize.call(instance);
      }

      if (typeof option === "string"){
        return instance[option].apply(instance, args);
      }
    });
  };

  $.fn.imageupload.Constructor = ImageUpload;

  // imageupload no conflict
  $.fn.imageupload.noConflict = function (){
    $.fn.imageupload = old;
    return this;
  };

  $(document).ready(function(){
    $("[data-toggle=\"imageupload\"]").imageupload();
  });

})(window.$||Zepto, window.elab||elab, window.FileAPI||FileAPI);
