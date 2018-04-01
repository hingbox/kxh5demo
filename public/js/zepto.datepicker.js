;(function($, IScroll, detect){
  /*jshint validthis: true */
  "use strict";

  var namespace = "-elab-zepto-datepicker";
  var currentTime = new Date();
  var currentYear = currentTime.getFullYear();
  var ua = detect.parse(navigator.userAgent);

  function noop() {
  }

  function pauseEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function preventDefault(e){
    e.preventDefault();
  }

  function isLeapYear(year) {
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      return true;
    } else {
      return false;
    }
  }

  function initialize(){
    var me = this
    , opts = this.options
    , $parent = this.$parent
    ;

    $parent.append('<div class="'+ opts.prefixCls +'" style="display:none"></div>');
    this.$body = $parent.find('div.'+opts.prefixCls).first();

    $(document).on(opts['event'],'[data-toggle=\"datepicker\"]',this.onClick.bind(this));
  }

  /**
   * Represents the Zepto DatePicker plugin.
   *
   * @class DatePicker
   * @constructor
   * @param element {Object} The corresponding DOM element.
   * @param options {Object} The options to override default settings.
   * @chainable
   **/
  var DatePicker = function(options){
    this.options = $.extend(true, {}, DatePicker.defaults, $.fn.datepicker.defaults, options);
    this.el = this.options.el;
    this.$parent = $(this.getEl());
  };

  DatePicker.defaults = {
    el:'body',
    prefixCls: 'elab-datepicker',
    className: '',
    onBeforeChange: noop,
    onChange: noop,
    onAfterChange: noop,
    scrollConfig: {
      snap: "li",
      checkDOMChanges: true,
      vScrollbar:false,
      mouseWheel: true,
      scrollX: false,
      scrollY: true,
    }
  };

  DatePicker.prototype.getEl = function(){
    return this.el;
  }

  DatePicker.prototype.onClick = function(e){
    pauseEvent(e);
    this.$e = $(e.target);
    this.initVal = this.$e.val() || '';
    this.init();
  }

  DatePicker.prototype.init = function(){
    this.yearScroll = null;
    this.monthScroll = null;
    this.dayScroll = null;
    this.hourScroll = null;
    this.minuteScroll = null;
    this.initY = null;
    this.initM = null;
    this.initD = null;
    this.initH = null;
    this.initI = null;
    this.initS = null;

    currentTime = new Date();

    var theme = this.$e.data('theme');
    var opts = this.options;
    if(theme){
      opts.theme = theme;
    }

    theme = opts.theme;

    var initVal = this.initVal;
    initVal = initVal.trim();

    if (!opts.curdate && initVal.length > 0) {
      var inputDate = null;
      var inputTime = null;
      if (theme == 'date') {
        inputDate = initVal.split(' ')[0];
        this.initY = parseInt(inputDate.split('-')[0] - parseInt(opts.beginyear)) + 1;
        this.initM = parseInt(inputDate.split('-')[1]);
        this.initD = parseInt(inputDate.split('-')[2]);
      }else if (theme == 'datetime') {
        inputDate = initVal.split(' ')[0];
        this.initY = parseInt(inputDate.split('-')[0] - parseInt(opts.beginyear)) + 1;
        this.initM = parseInt(inputDate.split('-')[1]);
        this.initD = parseInt(inputDate.split('-')[2]);
        inputTime = initVal.split(' ')[1];
        this.initH = parseInt(inputTime.split(':')[0]) + 1;
        this.initI = parseInt(inputTime.split(':')[1]) + 1;
      }else if (theme == 'time') {
        inputTime = initVal;
        this.initH = parseInt(inputTime.split(':')[0]) + 1;
        this.initI = parseInt(inputTime.split(':')[1]) + 1;
      }else if (theme == 'month') {
        inputDate = initVal;
        this.initY = parseInt(inputDate.split('-')[0] - parseInt(opts.beginyear)) + 1;
        this.initM = parseInt(inputDate.split('-')[1]);
      }else{
      }
    } else {
      this.initY = parseInt(currentTime.getFullYear()) - parseInt(opts.beginyear) + 1;
      this.initM = parseInt(currentTime.getMonth()) + 1;
      this.initD = parseInt(currentTime.getDate());
      this.initH = parseInt(currentTime.getHours()) + 1;
      this.initI = parseInt(currentTime.getMinutes()) + 1;
      this.initS = parseInt(currentTime.getSeconds());
    }

    this.show();
    this.destroyScroll();
    this.renderDom();
  };

  DatePicker.prototype.renderDom = function(){
    var mainHtml = [
      '<div class="d-date-box">',
        '<div class="d-date-title">请选择日期</div>',
        '<p class="d-date-info">',
          '<span class="d-day-info"></span>',
          '<span class="d-return-info"></span>',
        '</p>',
      '</div>'
    ].join('');

    var btnHtml  = [
      '<div class="d-date-btns">',
        '<button class="d-btn ok" id="ok',namespace,'">确定</button>',
        '<button class="d-btn cancle" id="cancle',namespace,'">取消</button>',
      '</div>'
    ].join('');

    var dateHtml =[
      '<div class="d-date-wrap">',
        '<div class="d-date-mark"></div>',
        '<div id="year',namespace,'" class="d-year-wrap d-date-cell" >',
          '<ul></ul>',
        '</div>',
        '<div id="month',namespace,'" class="d-month-wrap d-date-cell">',
          '<ul></ul>',
        '</div>',
        '<div id="day',namespace,'" class="d-day-wrap d-date-cell">',
          '<ul></ul>',
        '</div>',
      '</div>'
    ].join('');

    var timeHtml = [
      '<div class="d-date-wrap d-time-wrap">',
        '<div class="d-date-mark"></div>',
        '<div id="hour',namespace,'" class="d-hour-wrap d-date-cell" >',
          '<ul></ul>',
        '</div>',
        '<div id="minute',namespace,'" class="d-minute-wrap d-date-cell">',
          '<ul></ul>',
        '</div>',
      '</div>'
    ].join('');

    var monthHtml = [
      '<div class="d-date-wrap">',
        '<div class="d-date-mark"></div>',
        '<div id="year',namespace,'" class="d-year-wrap d-date-cell" style="width:50%">',
          '<ul></ul>',
        '</div>',
        '<div id="month',namespace,'" class="d-month-wrap d-date-cell" style="width:50%">',
          '<ul></ul>',
        '</div>',
      '</div>'
    ].join('');

    this.$body.html(mainHtml);
    this.$dayInfo  = this.$body.find('span.d-day-info').first();
    this.$returnInfo = this.$body.find('span.d-return-info').first();
    var opts = this.options;
    var $datebox = this.$datebox = this.$body.children('div.d-date-box').first();

    document.addEventListener('touchmove', preventDefault, false);

    switch (opts.theme) {
      case 'date':
        $datebox.append(dateHtml);
        this.createYear();
        this.createMonth();
        this.createDay(opts.monthDay[this.initM - 1]);
        break;
      case 'datetime':
        $datebox.append(dateHtml);
        $datebox.append(timeHtml);
        this.createYear();
        this.createMonth();
        this.createDay(opts.monthDay[this.initM - 1]);
        this.createHour();
        this.createMinute();
        break;
      case 'time':
        $datebox.append(timeHtml);
        this.createHour();
        this.createMinute();
        break;
      case 'month':
        $datebox.append(monthHtml);
        this.createYear();
        this.createMonth();
        break;
      default:
        $datebox.append(dateHtml);
        this.createYear();
        this.createMonth();
        this.createDay(opts.monthDay[this.initM - 1]);
        break;
    }

    $datebox.append(btnHtml);

    this.$ok = $datebox.find('button.ok').first();
    this.$cancle = $datebox.find('button.cancle').first();

    this.$ok.on('click', this.onOkClick.bind(this));
    this.$cancle.on('click', this.onCancleClick.bind(this));

    this.showTxt();
  }

  DatePicker.prototype.createYear = function(){
    var me = this
    , opts = this.options
    , yearId = '#year'+ namespace
    , $year= this.$year = this.$body.find(yearId)
    , yearNum = opts.endyear - opts.beginyear
    , tpl = []
    ;

    tpl.push('<li></li>');

    for (var i = 0; i <= yearNum; i++) {
      tpl.push('<li data-num=' + (opts.beginyear + i) + '>' + (opts.beginyear + i) + '年</li>');
    }

    tpl.push('<li></li>');

    tpl=tpl.join('');
    $year.find('ul').html(tpl);

    this.year = this.initY + opts.beginyear - 1;

    this.yearScroll = new IScroll(yearId, $.extend(true,{},opts.scrollConfig))
    this.yearScroll.on('scrollEnd', this.onYearScrollEnd.bind(this));
    this.yearScroll.scrollTo(0, -(this.initY - 1) * opts.liH);
  };

  DatePicker.prototype.createMonth = function(){
    var me = this
    , opts = this.options
    , monthId = '#month'+ namespace
    , $month= this.$month = this.$body.find(monthId)
    , tpl = []
    ;

    tpl.push('<li></li>');

    for (var i = 1; i < 13; i++) {
      if (i < 10) {
        tpl.push('<li data-num="0' + i + '">0' + i + '月</li>');
      } else {
        tpl.push('<li data-num="' + i + '">' + i + '月</li>');
      }
    };

    tpl.push('<li></li>');

    tpl = tpl.join('');

    $month.find('ul').html(tpl);

    this.month = this.initM <10 ? '0' + this.initM : this.initM;

    this.monthScroll = new IScroll(monthId, $.extend(true,{},opts.scrollConfig))
    this.monthScroll.on('scrollEnd', this.onMonthScrollEnd.bind(this));
    this.monthScroll.scrollTo(0, -(this.initM - 1) * opts.liH);
  };

  DatePicker.prototype.createDay = function(dayNum){
    var me = this
    , opts = this.options
    , dayId = '#day'+ namespace
    , $day= this.$day = this.$body.find(dayId)
    , tpl = []
    ;

    tpl.push('<li></li>');

    for (var i = 1; i <= dayNum; i++) {
      if (i < 10) {
        tpl.push('<li data-num="0' + i + '">0' + i + '日</li>');
      } else {
        tpl.push('<li data-num="' + i + '">' + i + '日</li>');
      }
    };

    tpl.push('<li></li>');

    tpl = tpl.join('');

    $day.find('ul').html(tpl);

    if (this.initD > opts.monthDay[this.initM - 1]) {
      this.initD = 1;
    }

    this.day = this.initD <10 ? '0' + this.initD : this.initD;

    this.dayScroll = new IScroll(dayId, $.extend(true,{},opts.scrollConfig))
    this.dayScroll.on('scrollEnd', this.onDayScrollEnd.bind(this));
    this.dayScroll.scrollTo(0, -(this.initD - 1) * opts.liH);
  };

  DatePicker.prototype.createHour = function(){
    var me = this
    , opts = this.options
    , hourId = '#hour'+ namespace
    , $hour= this.$hour = this.$body.find(hourId)
    , tpl = []
    ;

    tpl.push('<li></li>');

    for (var i = opts.beginhour; i <= opts.endhour; i++) {
      if (i < 10) {
        tpl.push('<li data-num="0' + i + '">0' + i + '时</li>');
      } else {
        tpl.push('<li data-num="' + i + '">' + i + '时</li>');
      }
    };

    tpl.push('<li></li>');

    tpl = tpl.join('');

    $hour.find('ul').html(tpl);

    this.hour = this.initH + opts.beginhour -1;
    this.hour = this.hour < 10 ? '0' + this.hour : this.hour;

    this.hourScroll = new IScroll(hourId,  $.extend(true, {}, opts.scrollConfig));
    this.hourScroll.on('scrollEnd',this.onHourScrollEnd.bind(this));
    this.hourScroll.scrollTo(0, -(this.initH - 1) * opts.liH);
  };

  DatePicker.prototype.createMinute = function(){
    var me = this
    , opts = this.options
    , minuteId = '#minute'+ namespace
    , $minute= this.$minute = this.$body.find(minuteId)
    , tpl = []
    ;

    tpl.push('<li></li>');

    for (var i = opts.beginminute; i <= opts.endminute; i++) {
      if (i < 10) {
        tpl.push('<li data-num="0' + i + '">0' + i + '分</li>');
      } else {
        tpl.push('<li data-num="' + i + '">' + i + '分</li>');
      }
    };

    tpl.push('<li></li>');

    tpl = tpl.join('');

    $minute.find('ul').html(tpl);

    this.minute = this.initI + opts.beginminute -1;
    this.minute = this.minute < 10 ? '0' + this.minute : this.minute;

    this.minuteScroll = new IScroll(minuteId,  $.extend(true, {}, opts.scrollConfig));
    this.minuteScroll.on('scrollEnd',this.onMinuteScrollEnd.bind(this));
    this.minuteScroll.scrollTo(0, -(this.initI - 1) * opts.liH);
  };

  DatePicker.prototype.onYearScrollEnd = function(){
    var me = this
    , opts = this.options
    , y = this.yearScroll.y
    , liH = opts.liH
    , yIndex = Math.floor(-y /liH)
    ;

    this.initY = yIndex + 1;

    if(this.initY <=0){
      return;
    }

    var selected = this.$year.find('li').eq(this.initY).data('num');
    this.year = selected;
    selected = parseInt(selected);

    //判断是否闰年
    if (isLeapYear(selected)) {
      this.options.monthDay[1] = 29;
    } else {
      this.options.monthDay[1] = 28;
    }

    if (this.initM == 2 && opts.theme != 'month') {
      //闰年原因重新渲染2月份天数
      this.createDay(opts.monthDay[1]);
    }
    this.showTxt();
  }

  DatePicker.prototype.onMonthScrollEnd = function(){
    var me = this
    , opts = this.options
    , y = this.monthScroll.y
    , liH = opts.liH
    , mIndex = Math.floor(-y /liH)
    , dayNum = 0
    , oldMonthIndex = this.month
    , oldDayNum = 0
    ;

    oldMonthIndex = parseInt(oldMonthIndex)-1;
    oldDayNum = opts.monthDay[oldMonthIndex];

    this.initM = mIndex + 1;

    if(this.initM <=0){
      return;
    }

    this.month = this.$month.find('li').eq(this.initM).data('num');

    if (opts.theme != 'month') {
      dayNum = opts.monthDay[mIndex];
      if(dayNum != oldDayNum){
        this.createDay(dayNum);
      }
    }

    this.showTxt();
  }

  DatePicker.prototype.onDayScrollEnd = function(){
    this.initD = Math.floor(-this.dayScroll.y / this.options.liH) + 1;
    if(this.initD <=0){
      return;
    }
    this.day = this.$day.find('li').eq(this.initD).data('num');
    this.showTxt();
  }

  DatePicker.prototype.onHourScrollEnd = function(){
    this.initH = Math.floor(-this.hourScroll.y / this.options.liH) + 1;
    if(this.initH <=0){
      return;
    }
    this.hour = this.$hour.find('li').eq(this.initH).data('num');
    this.showTxt();
  }

  DatePicker.prototype.onMinuteScrollEnd = function(){
    this.initI = Math.floor(-this.minuteScroll.y / this.options.liH) + 1;
    if(this.initI <=0){
      return;
    }
    this.minute = this.$minute.find('li').eq(this.initI).data('num');
    this.showTxt();
  }

  DatePicker.prototype.showTxt = function(){
    var me =this
    , opts = this.options
    , y = this.year
    , M = this.month
    , d = this.day
    , h = this.hour
    , m = this.minute
    , date = new Date(y + '-' + M+ '-' + d)
    ;

    switch (opts.theme) {
      case 'date':
        this.$dayInfo.html(opts.days[date.getDay()] + "&nbsp;");
        this.$returnInfo.html(y + '-' + M + '-' + d);
        break;
      case 'datetime':
        this.$dayInfo.html(opts.days[date.getDay()] + "&nbsp;")
        this.$returnInfo.html(y + '-' + M + '-' + d + ' ' + h + ':' + m);
        break;
      case 'time':
        this.$returnInfo.html(h + ':' + m);
        break;
      case 'month':
        this.$returnInfo.html(y + '-' + M);
        break;
      default:
        this.$dayInfo.html(opts.days[date.getDay()] + "&nbsp;");
        this.$returnInfo.html(y + '-' + M + '-' + d);
        break;
    }
  };

  DatePicker.prototype.onChange = function(){

  };

  DatePicker.prototype.onOkClick = function(){
    var me =this
    , opts = this.options
    , y = this.year
    , M = this.month
    , d = this.day
    , h = this.hour
    , m = this.minute
    , val = []
    ;

    this.destroyScroll();
    this.hide();

    var val = [];

    switch (opts.theme) {
      case 'date':
        val = [y, '-', M, '-', d];
        break;
      case 'datetime':
        val = [y, '-', M, '-', d, ' ',h,':',m];
        break;
      case 'time':
        val = [h,':',m];
        break;
      case 'month':
        val = [y,'-',M];
        break;
      default:
        val = [y, '-', M, '-', d];
        break;
    }

    this.$e.val(val.join(''));

    this.options.callBack({
      y:this.year,
      M:this.month,
      d:this.day,
      h:this.hour,
      m:this.minute
    });
  };

  DatePicker.prototype.onCancleClick = function(){
    this.destroyScroll();
    this.hide();
  };

  DatePicker.prototype.destroyScroll = function(){
    document.removeEventListener('touchmove', preventDefault, false);
    [
      this.yearScroll,
      this.monthScroll,
      this.dayScroll,
      this.hourScroll,
      this.minuteScroll
    ].forEach(function(item){
      if (item) {
        item.destroy();
        item=null;
      }
    });
  };

  DatePicker.prototype.show = function(){
    this.$body.css({'display':'block'});
  };

  DatePicker.prototype.hide = function(){
    this.$body.hide();
  };

  // datepicker plugin definition
  var old = $.fn.datepicker;

  $.fn.datepicker = function (option){
    if(this.length == 0){
      return;
    }

    var args = Array.prototype.slice.call(arguments, 1)
    , instance= false
    , options = typeof option === "object" && option
    , el = options ? (options.el || DatePicker.defaults.el) : 'body'
    , $parent = $(el)
    ;

    instance = $parent.data(namespace);

    if (!instance){
      $parent.data(namespace,true);
      instance = new DatePicker(options);
      return initialize.call(instance);
    }

    if (typeof option === "string"){
      return instance[option].apply(instance, args);
    }
  };

  $.fn.datepicker.Constructor = DatePicker;

  $.fn.datepicker.defaults = {
    beginyear: currentYear-100, //日期--年--份开始
    endyear: currentYear+100, //日期--年--份结束
    monthDay: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], //日期--12个月天数(默认2月是28,闰年为29)--份结束
    days: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    beginhour: 0,
    endhour: 23,
    beginminute: 0,
    endminute: 59,
    curdate: false, //打开日期是否定位到当前日期
    liH: 40,
    theme: "date", //控件样式（1：日期(date)，2：日期+时间(datetime),3:时间(time),4:年月(month)）
    event: "click", //打开日期插件默认方式为点击后后弹出日期
    show: true,
    callBack: noop,
  };

  // datepicker no conflict
  $.fn.datepicker.noConflict = function (){
    $.fn.datepicker = old;
    return this;
  };

  $(document).ready(function(){
    $('[data-toggle=\"datepicker\"]').datepicker();
  });
})(Zepto, IScroll || window.IScroll, detect||window.detect)
