;(function($,zxcvbn){
  /*jshint validthis: true */
  "use strict";

  var namespace = ".elab.zepto.passwordstrength";

  function initialize(){
    var me = this
    , tpl = this.options.template
    ;

    this.$e.append(tpl);

    var lis = this.$e.find('li');

    function updateScore(i,score){
      if(i>3){return;}
      lis[3-i].className = score > i ? 'selected' : '';
      updateScore(i+1,score);
    }

    this.$password.bind('keyup',function(e){
      var newValue = $(e.target).val();
      if(newValue){
        var score = zxcvbn(newValue)['score'];
        updateScore(0,score);
      }
      else{
        updateScore(0,0);
      }
    });
  }

  /**
   * Represents the Zepto PasswordStrength plugin.
   *
   * @class PasswordStrength
   * @constructor
   * @param element {Object} The corresponding DOM element.
   * @param options {Object} The options to override default settings.
   * @chainable
   **/
  var PasswordStrength = function(element, options){
    this.$e = $(element);
    this.options = $.extend(true, {}, PasswordStrength.defaults, options);
    var opt = this.options;
    var pid = opt.pid || this.$e.data('pid');
    this.$password = $('#'+pid);
    this.strength = 0;
  };

  PasswordStrength.defaults = {
    pid: null,
    template: [
      '<ul class="password-strength" title="密码强度">',
        '<li></li><li></li><li></li><li></li>',
      '</ul>'
    ].join(''),
  };

  PasswordStrength.prototype.getStrength=function(){
    return this.strength;
  };

  // passwordstrength plugin definition
  var old = $.fn.passwordstrength;

  $.fn.passwordstrength = function (option){
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
        $this.data(namespace, (instance = new PasswordStrength(this, options)));
        return initialize.call(instance);
      }

      if (typeof option === "string"){
        return instance[option].apply(instance, args);
      }
    });
  };


  $.fn.passwordstrength.Constructor = PasswordStrength;

  // passwordstrength no conflict
  $.fn.passwordstrength.noConflict = function (){
    $.fn.passwordstrength = old;
    return this;
  };

})(Zepto,zxcvbn||window.zxcvbn);
