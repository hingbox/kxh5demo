;(function ($, Messenger) {
  /*jshint validthis: true */
  'use strict';
  var namespace = "-elab-zepto-modal";

  function noop() {
  }


  /**
   * Represents the Zepto Modal plugin.
   *
   * @class StepSelector
   * @constructor
   * @param element {Object} The corresponding DOM element.
   * @param options {Object} The options to override default settings.
   * @chainable
   **/
  var Modal = function(element, options){
    this.$e = $(element);
    this.options = $.extend(true, {}, Modal.defaults, options);
    this.el = this.options.el;
    this.$parent = $(this.getEl());
  }

  Modal.defaults = {
    el:'body',
    prefixCls: 'elab-modal',
    confirmLoading:true,
    iframe:false,
    url:'',
    content:'Hello World!',
    className: '',
    okTxt: '确定',
    cancelTxt: '取消',
    visible: true,
    title:'',
    nohead:true,
    nofoot:true,
    noBorder:true
    width:520,
    onOk:noop,
    onCancel: noop
  };

  Modal.prototype.getEl = function(){
    return this.el;
  }

  // modal plugin definition
  var old = $.fn.modal;

  $.fn.modal = function (option){
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
        $this.data(namespace, true);
        instance = new Modal(this, options);
        return initialize.call(instance);
      }

      if (typeof option === "string"){
        return instance[option].apply(instance, args);
      }
    });
  }


  $.fn.modal.Constructor = Modal;

  // modal no conflict
  $.fn.stepselector.noConflict = function (){
    $.fn.modal = old;
    return this;
  };

})(Zepto, Messenger||window.Messenger);
