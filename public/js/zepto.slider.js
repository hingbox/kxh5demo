;(function ($) {
  /*jshint validthis: true */
  'use strict';
  var namespace = ".elab.zepto.slider";

  function noop() {
  }

  function isNotTouchEvent(e) {
    return e.touches.length > 1 || (e.type.toLowerCase() === 'touchend' && e.touches.length > 0);
  }

  function getTouchPosition(e) {
    return e.touches[0].pageX;
  }

  function getMousePosition(e) {
    return e.pageX;
  }

  function pauseEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function initialize(){
    var me = this
    , opt = this.options
    , tpl = []
    ;

    var handle = this.state.handle
    , upperBound = this.state.upperBound
    , lowerBound = this.state.lowerBound
    ;

    var className = this.options.className
    , prefixCls = this.options.prefixCls
    , disabled = this.options.disabled
    , dots = this.options.dots
    , included = this.options.included
    , range = this.options.range
    , step = this.options.step
    , marks = this.options.marks
    , markDirection = this.options.markDirection
    , max = this.options.max
    , min = this.options.min
    , tipTransitionName = this.options.tipTransitionName
    , tipFormatter = this.options.tipFormatter
    , children = this.options.children
    ;

    var upperOffset = this.calcOffset(upperBound);
    var lowerOffset = this.calcOffset(lowerBound);

    var handleClassName = prefixCls + '-handle';
    var isNoTip = (step === null) || (tipFormatter === null);

    var key;
    var mark;
    var keyNum;
    var clazz;
    var marksKeys = Object.keys(marks);

    var marksCount = marksKeys.length;
    var unit = 100 / (marksCount - 1);
    var markWidth = unit * 0.9;
    var sliderRange = max - min;
    var style;
    var isActived;

    tpl.push('<div class="elab-slider">');

    if(range){
      //upper
      tpl.push('<div class="elab-slider-handle" style="left: '+ this.initialWidth[1] +'%;"></div>');
      //lower
      tpl.push('<div class="elab-slider-handle" style="left: '+ this.initialWidth[0] +'%;"></div>');
      //track
      tpl.push('<div class="elab-slider-track" style="left: '+ this.initialWidth[0] +'%; width: '+ (this.initialWidth[1] - this.initialWidth[0])+'%; visibility: visible;"></div>');
    }else{
      //upper
      tpl.push('<div class="elab-slider-handle" style="left: '+ this.initialWidth +'%;"></div>');
      //track
      tpl.push('<div class="elab-slider-track" style="left: 0%; width: '+ this.initialWidth +'%; visibility: visible;"></div>');
    }

    tpl.push('<div class="elab-slider-step">');

    if(dots){
      for(var i=0; i<marksKeys.length; i++){
        key = marksKeys[i];
        mark = marks[key];
        keyNum = parseInt(key);
        clazz = range
        ? (this.initialWidth[0] <= keyNum && keyNum <= this.initialWidth[1] ? "elab-slider-dot-active" : "" )
        : (this.initialWidth <= keyNum ? "elab-slider-dot-active" : "")
        ;

        tpl.push(['<span class="elab-slider-dot ',clazz,'" style="left:',key,'%;"></span>'].join(''));
      }
    }

    tpl.push('</div>');

    tpl.push(['<div class="elab-slider-mark', 'top' === markDirection ? ' elab-slider-mark-top': '' ,'">'].join(''));
    if(marks){
      for(var i=0; i<marksKeys.length; i++){
        key = marksKeys[i];
        mark = marks[key];
        keyNum = parseInt(key);
        isActived = (!included && keyNum === upperBound) || (included && keyNum <= upperBound && keyNum >= lowerBound);
        tpl.push([
          '<span class="elab-slider-mark-text', (isActived ? ' elab-slider-mark-text-active':''),'"',
           ' style="width:', markWidth,'%;', 'left:',  (keyNum - min) / sliderRange * 100 - markWidth / 2, '%;"',
           ' key="',key,'">',
            mark['txt'],
          '</span>'
        ].join(''));
      }
    }
    tpl.push('</div>');

    tpl.push('</div>');

    this.$e = $(tpl.join(''));
    this.$parent.append(this.$e);
    this.$steps = this.$e.find('div.elab-slider-step>span');
    this.$marks = this.$e.find('div.elab-slider-mark>span');
    this.$upper = this.$e.find('div.elab-slider-handle').first();

    this.$lower = range ? this.$e.find('div.elab-slider-handle').last() : null;
    this.$track = this.$e.find("div.elab-slider-track");
    var edom = this.edom =  this.$e[0];
    edom.ontouchstart = disabled ? noop : this.onTouchStart.bind(this);
    edom.onmousedown  = disabled ? noop : this.onMouseDown.bind(this);
  };

  /**
   * Represents the Zepto Slider plugin.
   *
   * @class Slider
   * @constructor
   * @param element {Object} The corresponding DOM element.
   * @param options {Object} The options to override default settings.
   * @chainable
   **/
  var Slider = function(element, options){
    this.$parent = $(element);
    this.options = $.extend(true, {}, Slider.defaults, options);

    var opt = this.options
    , marks = opt.marks
    , steps = opt.steps
    , range = opt.range
    , min = opt.min
    , max = opt.max
    , initialValue = range ? [min, min] : max
    , defaultValue = opt.defaultValue|| initialValue
    , initialWidth = range ? [0, 100] : 100
    , value = opt.value ||defaultValue
    , returnValue = range ? [,] : 0
    ;

    steps = steps.split(opt.separator);

    var v1 = Math.floor(100/(steps.length + 1))
    , v2 = 100%(steps.length + 1)
    , width = 0
    , key = 0
    ;

    marks['0'] = {
      'val': steps[0],
      'txt': opt.tipFormatter('0'),
      'width': 0,
      'idx': 0,
      'visible': false
    };

    for(var i=0; i< steps.length; i++){
      width =  (i+1) > v2 ? v1 : v1+1;
      key = key + width;

      if(range){
        initialWidth[0] = steps[i] == defaultValue[0].toString() ? key : initialWidth[0];
        initialWidth[1] = steps[i] == defaultValue[1].toString() ? key : initialWidth[1];
        value[0] = steps[i] == defaultValue[0].toString() ? key : value[0];
        value[1] = steps[i] == defaultValue[1].toString() ? key : value[1];
      }else{
        initialWidth = steps[i] == defaultValue.toString() ? key : initialWidth;
        value = steps[i] == defaultValue.toString() ? key : value;
      }

      marks[key.toString()] = {
        'val': steps[i],
        'txt': opt.tipFormatter(steps[i]),
        'width': width,
        'idx': i+1,
        'visible': true
      };
    }

    marks['100'] = {
      'val': null,
      'txt': opt.nilText,
      'width': v1,
      'idx': steps.length+1,
      'visible': true
    };

    this.options.marks = marks;
    this.initialWidth = initialWidth;
    this.returnValue = returnValue;

    var upperBound;
    var lowerBound;

    if (range) {
      lowerBound = this.trimAlignValue(value[0]);
      upperBound = this.trimAlignValue(value[1]);
    } else {
      upperBound = this.trimAlignValue(value);
    }

    var recent;
    if (opt.range && upperBound === lowerBound) {
      if (lowerBound === max) {
        recent = 'lowerBound';
      }
      if (upperBound === min) {
        recent = 'upperBound';
      }
    } else {
      recent = 'upperBound';
    }

    this.oldValue = value;

    this.state = {
      handle: null,
      recent: recent,
      upperBound: upperBound,
      // If StepSelector is not range, set `lowerBound` equal to `min`.
      lowerBound: (lowerBound || min)
    };
  };

  Slider.defaults = {
    prefixCls: 'elab-slider',
    className: '',
    nilText: '',
    defaultValue: 0,
    tipTransitionName: '',
    min: 0,
    max: 100,
    step: 1,
    steps: "0,50,100",
    separator: ',',
    marks: {},
    markDirection:'top',
    onBeforeChange: noop,
    onChange: noop,
    onAfterChange: noop,
    tipFormatter: function(v){return v;},
    included: true,
    disabled: false,
    dots: true,
    range: false,
    allowCross: true
  };

  Slider.prototype.render = function(){
    var opt = this.options
    , lowerBound = this.state.lowerBound
    , upperBound = this.state.upperBound
    ;



    var lower  = this.getClosestPoint(this.state.lowerBound);
    var upper  = this.getClosestPoint(this.state.upperBound);
    var lowerMark = this.options.marks[lower.toString()];
    var upperMark = this.options.marks[upper.toString()];
    var $this;

    if(opt.range){
      this.returnValue = [lowerMark['val'], upperMark['val']];
    }else{
      this.returnValue = upperMark['val'];
    }

    if(!this.state.handle) return;

    /**avoid dead loop*/
    this.state.upperBound = upper;
    this.state.lowerBound = lower;

    this.$steps.each(function(index){
      $this = $(this);
      if(index <= upperMark.idx && lowerMark.idx <= index){
        $this.addClass('elab-slider-dot-active');
      }else{
        $this.removeClass('elab-slider-dot-active');
      }
    });

    this.$upper.css('left', upper+'%');

    if(opt.range){
      this.$lower.css('left', lower+'%');
    }

    this.$track.css({
      'left' : lower+'%',
      'width': (upper - lower) + '%'
    })
  }

  Slider.prototype.isChanged = function(){
    var newValue = this.getValue();
    var oldValue = this.oldValue;

    if(this.options.range){
      return newValue[0] != oldValue[0] || newValue[1] != oldValue[1];
    }else{
      return newValue != oldValue;
    }
  }

  Slider.prototype.setState = function(state){
    Object.assign(this.state, state||{});
    if(this.isChanged()){
      this.render();
    }
  }

  Slider.prototype.getClosestPoint = function(val){
    var marks = this.options.marks;
    var points = Object.keys(marks).map(parseFloat);

    var diffs = points.map(function(point){
      return Math.abs(val - point);
    });

    var idx = diffs.indexOf(Math.min.apply(Math, diffs));

    return points[idx];
  }

  Slider.prototype.onChange = function(state){
    var opt = this.options
    , isNotControlled = !('value' in opt)
    ;

    if (isNotControlled) {
      this.setState(state);
    } else if (state.handle) {
      this.setState({handle: state.handle});
    }

    var changedValue = this.getValue();

    if(this.isChanged()){
      this.options.onChange(this.returnValue);
    }

    this.oldValue = changedValue;
  }

  Slider.prototype.onMouseMove = function(e) {
    var position = getMousePosition(e);
    this.onMove(e, position);
  }

  Slider.prototype.onTouchMove = function(e) {
    if (isNotTouchEvent(e)) {
      this.end('touch');
      return;
    }

    var position = getTouchPosition(e);
    this.onMove(e, position);
  }

  Slider.prototype.onMove = function(e, position) {
    pauseEvent(e);
    var props = this.options;
    var state = this.state;

    var diffPosition = position - this.startPosition;
    var diffValue = diffPosition / this.getSliderLength() * (props.max - props.min);

    var value = this.trimAlignValue(this.startValue + diffValue);
    var oldValue = state[state.handle];
    if (value === oldValue) return;

    if (props.allowCross && value < state.lowerBound && state.handle === 'upperBound') {
      this.onChange({
        handle: 'lowerBound',
        lowerBound: value,
        upperBound: this.state.lowerBound
      });
      return;
    }

    if (props.allowCross && value > state.upperBound && state.handle === 'lowerBound') {
      this.onChange({
        handle: 'upperBound',
        upperBound: value,
        lowerBound: this.state.upperBound
      });
      return;
    }

    var param ={};
    param[state.handle] = value;

    this.onChange(param);
  }

  Slider.prototype.onTouchStart = function(e) {
    if (isNotTouchEvent(e)) return;
    var position = getTouchPosition(e);
    this.onStart(position);
    this.addDocumentEvents('touch');
    pauseEvent(e);
  }

  Slider.prototype.onMouseDown = function(e) {
    var position = getMousePosition(e);
    this.onStart(position);
    this.addDocumentEvents('mouse');
    pauseEvent(e);
  }

  Slider.prototype.onStart = function(position) {
    var props = this.options;
    props.onBeforeChange(this.getValue());

    var value = this.calcValueByPos(position);
    this.startValue = value;
    this.startPosition = position;

    var state = this.state
    , upperBound = state.upperBound
    , lowerBound = state.lowerBound
    ;

    var valueNeedChanging = 'upperBound';
    if (this.options.range) {
      var isLowerBoundCloser = Math.abs(upperBound - value) > Math.abs(lowerBound - value);
      if (isLowerBoundCloser) {
        valueNeedChanging = 'lowerBound';
      }

      var isAtTheSamePoint = (upperBound === lowerBound);
      if (isAtTheSamePoint) {
        valueNeedChanging = state.recent;
      }

      if (isAtTheSamePoint && (value !== upperBound)) {
        valueNeedChanging = value < upperBound ? 'lowerBound' : 'upperBound';
      }
    }

    // this.setState({
    //   handle: valueNeedChanging,
    //   recent: valueNeedChanging
    // });

    /**avoid method rend() call*/
    this.state.handle = valueNeedChanging;
    this.state.recent = valueNeedChanging;

    var oldValue = state[valueNeedChanging];
    if (value === oldValue) return;

    var param = {};
    param[valueNeedChanging] = value;

    this.onChange(param);
  }

  Slider.prototype.getValue = function() {
    var upperBound = this.state.upperBound;
    var lowerBound = this.state.lowerBound;
    return this.options.range ? [lowerBound, upperBound] : upperBound;
  }

  Slider.prototype.getSliderLength = function() {
    var slider = this.$e[0];
    if (!slider) {
      return 0;
    }

    return slider.clientWidth;
  }

  Slider.prototype.getSliderStart = function() {
    var position = this.$e.position();
    return position.left;
  }

  Slider.prototype.getPrecision = function() {
    var props = this.options;
    var stepString = props.step.toString();
    var precision = 0;
    if (stepString.indexOf('.') >= 0) {
      precision = stepString.length - stepString.indexOf('.') - 1;
    }
    return precision;
  }

  Slider.prototype.isValueOutOfBounds = function(value, props) {
    return value < props.min || value > props.max;
  }

  Slider.prototype.trimAlignValue = function(v, nextProps) {
    var state = this.state || {};
    var handle = state.handle
    , lowerBound = state.lowerBound
    , upperBound = state.upperBound
    ;

    var opt = Object.assign({}, this.options, nextProps || {});

    var marks = opt.marks
    , step = opt.step
    , min = opt.min
    , max = opt.max
    , allowCross = opt.allowCross
    ;

    var val = v;
    if (val <= min) {
      val = min;
    }
    if (val >= max) {
      val = max;
    }
    if (!allowCross && handle === 'upperBound' && val <= lowerBound) {
      val = lowerBound;
    }
    if (!allowCross && handle === 'lowerBound' && val >= upperBound) {
      val = upperBound;
    }

    var points = Object.keys(marks).map(parseFloat);

    if (step !== null) {
      var closestStep = Math.round(val / step) * step;
      points.push(closestStep);
    }

    var diffs = points.map(function(point){
      return Math.abs(val - point);
    });

    var closestPoint = points[diffs.indexOf(Math.min.apply(Math, diffs))];

    if(typeof closestPoint !== 'number'){
       return 0;
    }

    return step !== null ? parseFloat(closestPoint.toFixed(this.getPrecision())) : closestPoint;
  }

  Slider.prototype.calcOffset = function(value) {
    var min = this.options.min;
    var max = this.options.max;
    var ratio = (value - min) / (max - min);
    return ratio * 100;
  }

  Slider.prototype.calcValue = function(offset) {
    var min = this.options.min;
    var max = this.options.max;
    var ratio = offset / this.getSliderLength();
    return ratio * (max - min) + min;
  }

  Slider.prototype.calcValueByPos = function(position) {
    var pixelOffset = position - this.getSliderStart();
    var nextValue = this.trimAlignValue(this.calcValue(pixelOffset));
    return nextValue;
  }

  Slider.prototype.addDocumentEvents = function(type) {
    if (type === 'touch') {
      this.edom.addEventListener('touchmove', this.onTouchMove.bind(this));
      this.edom.addEventListener('touchend', this.end.bind(this, 'touch'));
    } else if (type === 'mouse') {
      this.edom.addEventListener('mousemove', this.onMouseMove.bind(this));
      this.edom.addEventListener('mouseup', this.end.bind(this, 'mouse'));
    }
  }

  Slider.prototype.removeEvents= function(type) {
    if (type === 'touch') {
      this.edom.removeEventListener('touchmove', this.onTouchMove.bind(this));
      this.edom.removeEventListener('touchend', this.end.bind(this, 'touch'));
    } else if (type === 'mouse') {
      this.edom.removeEventListener('mousemove', this.onMouseMove.bind(this));
      this.edom.removeEventListener('mouseup', this.end.bind(this, 'mouse'));
    }
  }

  Slider.prototype.end = function(type) {
    this.removeEvents(type);
    this.options.onAfterChange(this.getValue());
    this.setState({handle: null});
  }

  // Slider plugin definition
  var old = $.fn.slider;

  $.fn.slider = function (option){
    var args = Array.prototype.slice.call(arguments, 1);
    return this.each(function (){
      var $this = $(this)
      , instance = $this.data(namespace)
      , options = typeof option === "object" ? option : {}
      ;

      if (!instance && option === "destroy"){
        return;
      }

      if (!instance){
        $this.data(namespace, true);
        instance = new Slider(this, options);
        return initialize.call(instance);
      }else{
        $this.find('.elab-slider').remove();
        instance = new Slider(this, options);
        return initialize.call(instance);
      }

      if (typeof option === "string"){
        return instance[option].apply(instance, args);
      }
    });
  }

  $.fn.slider.Constructor = Slider;

  // range no conflict
  $.fn.slider.noConflict = function (){
    $.fn.slider = old;
    return this;
  };

})(Zepto);
