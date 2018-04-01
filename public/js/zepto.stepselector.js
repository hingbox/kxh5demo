;(function ($) {
  /*jshint validthis: true */
  'use strict';
  var namespace = "-elab-zepto-stepselector";

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
    , prefixCls = opt.prefixCls
    , disabled = opt.disabled
    , range = opt.range
    , step = opt.step
    , marks = opt.marks
    , tipFormatter = opt.tipFormatter
    ;


    tpl.push('<div class="elab-stepslector">');
    tpl.push('<ul class="elab-stepslector-steps">');

    var key;
    var mark;
    var keyNum;
    var clazz;
    var markKeies = Object.keys(marks);

    for(var i=0; i<markKeies.length; i++){
      key = markKeies[i];
      mark = marks[key];
      if(key === '0')continue;
      keyNum = parseInt(key);

      clazz = keyNum < this.initialWidth
        ? "step-undone"
        : (keyNum > this.initialWidth
          ? "step-done"
          : "step-active"
        );

      tpl.push([
        '<li class="step ', clazz ,'" style="width:',mark['width'],'%;">',
          '<p>',mark['txt'],'</p>',
          '<div class="step-dot"></div>',
        '</li>'
      ].join(''));
    }

    tpl.push('</ul>');
    tpl.push('<div class="elab-stepslector-progress">');
    tpl.push('<p class="elab-stepslector-progress-bar">');
    tpl.push('<span class="elab-stepslector-progress-highlight" style="width: '+ this.initialWidth+'%;"></span>');
    tpl.push('</p>');
    tpl.push('</div>');
    tpl.push('</div>');

    this.$e = $(tpl.join(''));
    this.$parent.append(this.$e);
    this.$steps = this.$e.find('ul.elab-stepslector-steps>li');
    this.$process = this.$e.find('span.elab-stepslector-progress-highlight').first();

    var edom = this.edom =  this.$e[0];
    edom.ontouchstart = disabled ? noop : this.onTouchStart.bind(this);
    edom.onmousedown  = disabled ? noop : this.onMouseDown.bind(this);
  };

  /**
   * Represents the Zepto StepSelector plugin.
   *
   * @class StepSelector
   * @constructor
   * @param element {Object} The corresponding DOM element.
   * @param options {Object} The options to override default settings.
   * @chainable
   **/
  var StepSelector = function(element, options){
    this.$parent = $(element);
    this.options = $.extend(true, {}, StepSelector.defaults, options);

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
      'txt': '',
      'width': 0,
      'idx': 0,
      'visible': false
    };

    var defaultValueStr = defaultValue.toString();

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
        'idx': i,
        'visible': true
      };
    }

    marks['100'] = {
      'val': null,
      'txt': opt.nilText,
      'width': v1,
      'idx': steps.length,
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

  StepSelector.defaults = {
    prefixCls: 'elab-stepslector',
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
    onBeforeChange: noop,
    onChange: noop,
    onAfterChange: noop,
    tipFormatter: function(v){return v;},
    included: true,
    disabled: false,
    dots: false,
    range: false,
    allowCross: true
  };


  StepSelector.prototype.isChanged = function(){
    var newValue = this.getValue();
    var oldValue = this.oldValue;

    //console.log('newValue='+JSON.stringify(newValue));
    //console.log('oldValue='+JSON.stringify(oldValue));

    if(this.options.range){
      return newValue[0] != oldValue[0] || newValue[1] != oldValue[1];
    }else{
      return newValue != oldValue;
    }
  }
  StepSelector.prototype.setState = function(state){
    Object.assign(this.state, state||{});
  }

  StepSelector.prototype.getClosestPoint = function(val){
    var marks = this.options.marks;
    var points = Object.keys(marks).map(parseFloat);

    var diffs = points.map(function(point){
      return Math.abs(val - point);
    });

    var idx = diffs.indexOf(Math.min.apply(Math, diffs));
    if(idx==0){
      idx = 1;
    }

    return points[idx];
  }

  StepSelector.prototype.onChange = function(state){
    var opt = this.options;
    var isNotControlled = !('value' in opt);
    if (isNotControlled) {
      this.setState(state);
    } else if (state.handle) {
      this.setState({handle: state.handle});
    }

    var changedValue = this.getValue();
    if(this.isChanged()){
      var closestPoint = this.getClosestPoint(changedValue);
      this.state.upperBound = closestPoint;

      this.$process.css('width',closestPoint+'%');

      var mark = opt.marks[closestPoint.toString()];
      var idx = mark.idx;
      var $this;

      this.$steps.each(function(index){
        $this = $(this);
        if(idx < index){
          $this.removeClass('step-undone').removeClass('step-active').addClass('step-done');
        }else if(idx == index){
          $this.addClass('step-active');
        }else{
          $this.removeClass('step-done').removeClass('step-active').addClass('step-undone');
        }
      });

      opt.onChange(mark.val);
    }

    this.oldValue = changedValue;
  }

  StepSelector.prototype.onMouseMove = function(e) {
    var position = getMousePosition(e);
    this.onMove(e, position);
  }

  StepSelector.prototype.onTouchMove = function(e) {
    if (isNotTouchEvent(e)) {
      this.end('touch');
      return;
    }

    var position = getTouchPosition(e);
    this.onMove(e, position);
  }

  StepSelector.prototype.onMove = function(e, position) {
    pauseEvent(e);
    var props = this.options;
    var state = this.state;

    var diffPosition = position - this.startPosition;
    var diffValue = diffPosition / this.getrangerLength() * (props.max - props.min);

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

  StepSelector.prototype.onTouchStart = function(e) {
    if (isNotTouchEvent(e)) return;

    var position = getTouchPosition(e);
    this.onStart(position);
    this.addDocumentEvents('touch');
    pauseEvent(e);
  }

  StepSelector.prototype.onMouseDown = function(e) {
    var position = getMousePosition(e);
    this.onStart(position);
    this.addDocumentEvents('mouse');
    pauseEvent(e);
  }

  StepSelector.prototype.onStart = function(position) {
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

    this.setState({
      handle: valueNeedChanging,
      recent: valueNeedChanging
    });

    var oldValue = state[valueNeedChanging];
    if (value === oldValue) return;

    var param = {};
    param[valueNeedChanging] = value;

    this.onChange(param);
  }

  StepSelector.prototype.getValue = function() {
    var upperBound = this.state.upperBound;
    var lowerBound = this.state.lowerBound;
    return this.options.range ? [lowerBound, upperBound] : upperBound;
  }

  StepSelector.prototype.getrangerLength = function() {
    var ranger = this.$e[0];
    if (!ranger) {
      return 0;
    }

    return ranger.clientWidth;
  }

  StepSelector.prototype.getrangerStart = function() {
    var position = this.$e.position();
    return position.left;
  }

  StepSelector.prototype.getPrecision = function() {
    var props = this.options;
    var stepString = props.step.toString();
    var precision = 0;
    if (stepString.indexOf('.') >= 0) {
      precision = stepString.length - stepString.indexOf('.') - 1;
    }
    return precision;
  }

  StepSelector.prototype.isValueOutOfBounds = function(value, props) {
    return value < props.min || value > props.max;
  }

  StepSelector.prototype.trimAlignValue = function(v, nextProps) {
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

  StepSelector.prototype.calcOffset = function(value) {
    var min = this.options.min;
    var max = this.options.max;
    var ratio = (value - min) / (max - min);
    return ratio * 100;
  }

  StepSelector.prototype.calcValue = function(offset) {
    var min = this.options.min;
    var max = this.options.max;
    var ratio = offset / this.getrangerLength();
    return ratio * (max - min) + min;
  }

  StepSelector.prototype.calcValueByPos = function(position) {
    var pixelOffset = position - this.getrangerStart();
    var nextValue = this.trimAlignValue(this.calcValue(pixelOffset));
    return nextValue;
  }

  StepSelector.prototype.addDocumentEvents = function(type) {
    if (type === 'touch') {
      // just work for chrome iOS Safari and Android Browser
      //this.onTouchMoveListener = window.addEventListener(document, 'touchmove', this.onTouchMove.bind(this));
      //this.onTouchUpListener = window.addEventListener(document, 'touchend', this.end.bind(this, 'touch'));
      this.edom.addEventListener('touchmove', this.onTouchMove.bind(this));
      this.edom.addEventListener('touchend', this.end.bind(this, 'touch'));
    } else if (type === 'mouse') {
      //this.onMouseMoveListener = window.addEventListener(document, 'mousemove', this.onMouseMove.bind(this));
      //this.onMouseUpListener = window.addEventListener(document, 'mouseup', this.end.bind(this, 'mouse'));
      this.edom.addEventListener('mousemove', this.onMouseMove.bind(this));
      this.edom.addEventListener('mouseup', this.end.bind(this, 'mouse'));
    }
  }

  StepSelector.prototype.removeEvents= function(type) {
    if (type === 'touch') {
      //this.onTouchMoveListener.remove();
      //this.onTouchUpListener.remove();
      this.edom.removeEventListener('touchmove', this.onTouchMove.bind(this));
      this.edom.removeEventListener('touchend', this.end.bind(this, 'touch'));
    } else if (type === 'mouse') {
      //this.onMouseMoveListener.remove();
      //this.onMouseUpListener.remove();
      this.edom.removeEventListener('mousemove', this.onMouseMove.bind(this));
      this.edom.removeEventListener('mouseup', this.end.bind(this, 'mouse'));
    }
  }

  StepSelector.prototype.end = function(type) {
    this.removeEvents(type);
    this.options.onAfterChange(this.getValue());
    this.setState({handle: null});
  }

  // StepSelector plugin definition
  var old = $.fn.stepselector;

  $.fn.stepselector = function (option){
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
        instance = new StepSelector(this, options);
        return initialize.call(instance);
      }else{
        $this.find('.elab-stepslector').remove();
        instance = new StepSelector(this, options);
        return initialize.call(instance);
      }

      if (typeof option === "string"){
        return instance[option].apply(instance, args);
      }
    });
  }

  $.fn.stepselector.Constructor = StepSelector;

  //stepselector no conflict
  $.fn.stepselector.noConflict = function (){
    $.fn.stepselector = old;
    return this;
  };

})(Zepto);
