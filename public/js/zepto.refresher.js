;(function($, detect){
  /*jshint validthis: true */
  "use strict";

  var namespace = ".elab.zepto.refresher";

  var ua = detect.parse(navigator.userAgent);

  function noop() {
  }

  function initialize(){
    var me = this
    , opts = this.options
    , $e = this.$e
    ;

    $('body').addClass('refresher');

    $e.wrap('<div class="refresher-wrapper"><div class="refresher-scroller" /></div>');
    this.$scroller = $e.parent();
    this.$wrapper = this.$scroller.parent();

    if(opts.pullUp){
      this.$scroller.append(['<div class="pull-up invisible"><span class="pull-up-icon"></span><span class="pull-up-label">',this.options.pullUpText,'</span></div>'].join(''));
      this.$pullUp = this.$scroller.children('div.pull-up').first();
      this.pullUpEl = this.$pullUp[0];
    }

    if(opts.pullDown){
      this.$scroller.prepend(['<div class="pull-down scrolled-up"><span class="pull-down-icon"></span><span class="pull-down-label">',this.options.pullDownText,'</span></div>'].join(''));
      this.$pullDown = this.$scroller.children('div.pull-down').first();
      this.pullDownEl = this.$pullDown[0];
      this.pullDownOffset = this.pullDownEl.offsetHeight;
    }

    var iscroll = this.iScroll = new IScroll(this.$wrapper[0], this.options.scrollConfig);

    iscroll.on('refresh',    this.onIScrollRefresh.bind(this));
    iscroll.on('scrollStart',this.onIScrollScrollStart.bind(this));
    iscroll.on('scroll',     this.onIScrollScroll.bind(this));
    iscroll.on('scrollEnd',  this.onIScrollScrollEnd.bind(this));

    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
  }

  /**
   * Represents the Zepto refresher plugin.
   *
   * @class refresher
   * @constructor
   * @param element {Object} The corresponding DOM element.
   * @param options {Object} The options to override default settings.
   * @chainable
   **/
  var Refresher = function(element,options){
    this.options = $.extend(true, {}, Refresher.defaults, options);
    this.$e = $(element);
  };

  Refresher.defaults = {
    pullUp:true,
    pullDown:true,
    pullThreshold: 5,
    pullUpText: '上拉加载更多',
    pullDownText: '下拉刷新',
    pullUpReleaseText: '释放后加载更多',
    pullDownReleaseText: '释放后刷新',
    pullDownWaitText:'正在刷新',
    pullUpWaitText:'正在加载',
    pullDownActionHandler: noop,
    pullUpActionHandler: noop,
    onScrollStart:noop,
    onScroll:noop,
    onScrollEnd:noop,
    scrollConfig:{
      probeType:2,
      bounceTime: 250,
      bounceEasing: 'quadratic',
      mouseWheel:true,
      disableMouse: ua.device.type === "Mobile",
      //tab:true,
      //scrollbars:true,
      //fadeScrollbars:true,
      //interactiveScrollbars:false,
      click: true,
    }
  };

  Refresher.prototype.getEl = function(){
    return this.el;
  };

  Refresher.prototype.hidePullDown = function (time,refresh) {
    if(!this.options.pullDown)return;
    var me = this;
    this.pullDownEl.style.transitionDuration=(time>0?time+'ms':'');
    this.pullDownEl.style.marginTop='';
    this.pullDownEl.className = 'pull-down scrolled-up';

    // If refresh==true, refresh again after time+10 ms to update iScroll's "scroller.offsetHeight" after the pull-down-bar is really hidden...
    // Don't refresh when the user is still dragging, as this will cause the content to jump (i.e. don't refresh while dragging)
    if (refresh) setTimeout(function(){me.iScroll.refresh();},time+10);
  };

  Refresher.prototype.showPullDown = function (className) {
    // Shows pullDownEl with a given className
    this.pullDownEl.style.transitionDuration='';
    this.pullDownEl.style.marginTop='';
    this.pullDownEl.className = 'pull-down '+className;
  }

  Refresher.prototype.refresh = function () {
    this.iScroll.refresh();
    this.pullUpEl.className = 'pull-up invisible';
    //this.pullDownEl.className = 'pull-down invisible';
  }

  Refresher.prototype.onIScrollRefresh = function(){
    var me = this;
    if (this.options.pullDown && this.pullDownEl.className.match('loading')) {
      this.$pullDown.find('.pull-down-label').html(this.options.pullDownText);
      if (this.iScroll.y>=0) {
        // The pull-down-bar is fully visible:
        // Hide it with a simple 250ms animation
        this.hidePullDown(250,true);

      } else if (this.iScroll.y > - this.pullDownOffset) {
        // The pull-down-bar is PARTLY visible:
        // Set up a shorter animation to hide it

        // Firt calculate a new margin-top for pullDownEl that matches the current scroll position
        this.pullDownEl.style.marginTop = this.iScroll.y+'px';

        // CSS-trick to force webkit to render/update any CSS-changes immediately: Access the offsetHeight property...
        this.pullDownEl.offsetHeight;

        // Calculate the animation time (shorter, dependant on the new distance to animate) from here to completely 'scrolledUp' (hidden)
        // Needs to be done before adjusting the scroll-positon (if we want to read this.y)
        var animTime=(250*(this.pullDownOffset+this.y)/this.pullDownOffset);

        // Set scroll positon to top
        // (this is the same as adjusting the scroll postition to match the exact movement pullDownEl made due to the change of margin-top above, so the content will not "jump")
        this.iScroll.scrollTo(0,0,0);

        // Hide pullDownEl with the new (shorter) animation (and reset the inline style again).
        setTimeout(function() {	// Do this in a new thread to avoid glitches in iOS webkit (will make sure the immediate margin-top change above is rendered)...
          this.hidePullDown(animTime,true);
        },0);

      } else {
        // The pull-down-bar is completely off screen:
        // Hide it immediately
        this.hidePullDown(0,true);
        // And adjust the scroll postition to match the exact movement pullDownEl made due to change of margin-top above, so the content will not "jump"
        this.iScroll.scrollBy(0,this.pullDownOffset,0);
      }
    }
    if (this.options.pullUp && this.pullUpEl.className.match('loading')) {
      this.pullUpEl.className = 'pull-up';
      //'Pull up to load more...'
      this.$pullUp.find('.pull-up-label').html(this.options.pullUpText);
    }
  };

  Refresher.prototype.onIScrollScrollStart = function(){
    // Store the scroll starting point to be able to track movement in 'scroll' below
    this.scrollStartPos = this.iScroll.y;
    this.options.onScrollStart();
  };

  Refresher.prototype.onIScrollScroll = function(){
    var me = this;
    if (this.options.pullDown || this.options.pullUp) {
      if((this.scrollStartPos==0)&&(this.iScroll.y==0)) {
        // 'scroll' called, but scroller is not moving!
        // Probably because the content inside wrapper is small and fits the screen, so drag/scroll is disabled by iScroll

        // Fix this by a hack: Setting "myScroll.hasVerticalScroll=true" tricks iScroll to believe
        // that there is a vertical scrollbar, and iScroll will enable dragging/scrolling again...
        this.iScroll.hasVerticalScroll=true;

        // Set scrollStartPos to -1000 to be able to detect this state later...
        this.scrollStartPos=-1000;
      } else if ((this.scrollStartPos==-1000)
        && (((!this.options.pullUp)
        && (!this.pullDownEl.className.match('flip'))
        && (this.iScroll.y<0))|| ((!this.options.pullDown)
        && (!this.pullUpEl.className.match('flip'))
        && (this.iScroll.y>0)))) {
        // Scroller was not moving at first (and the trick above was applied), but now it's moving in the wrong direction.
        // I.e. the user is either scrolling up while having no "pull-up-bar",
        // or scrolling down while having no "pull-down-bar" => Disable the trick again and reset values...
        this.iScroll.hasVerticalScroll=false;
        this.scrollStartPos=0;
        this.iScroll.scrollBy(0,-this.iScroll.y, 0);	// Adjust scrolling position to undo this "invalid" movement
      }
    }

    if (this.options.pullDown) {
      if (this.iScroll.y > this.pullDownOffset + this.options.pullThreshold
        && ! this.pullDownEl.className.match('flip')) {
        this.showPullDown('flip');

        // Adjust scrolling position to match the change in pullDownEl's margin-top
        this.iScroll.scrollBy(0,-this.pullDownOffset, 0);

        this.$pullDown.find('.pull-down-label').html(this.options.pullDownReleaseText);
      } else if (this.iScroll.y < 0
        && this.pullDownEl.className.match('flip')) {
        // User changes his mind...
        this.hidePullDown(0,false);

        // Adjust scrolling position to match the change in pullDownEl's margin-top
        this.iScroll.scrollBy(0,this.pullDownOffset, 0);

        this.$pullDown.find('.pull-down-label').html(this.options.pullDownText);
      }
    }

    if (this.options.pullUp) {
      if (this.iScroll.y < (this.iScroll.maxScrollY - this.options.pullThreshold)
        && !this.pullUpEl.className.match('flip')) {
        this.pullUpEl.className = 'pull-up flip';
        this.$pullUp.find('.pull-up-label').html(this.options.pullUpReleaseText);
      } else if (this.iScroll.y > (this.iScroll.maxScrollY + this.options.pullThreshold)
        && this.pullUpEl.className.match('flip')) {
        this.pullUpEl.className = 'pull-up';
        this.$pullUp.find('.pull-up-label').html(this.options.pullUpText);
      }
    }

    this.options.onScroll();
  }

  Refresher.prototype.onIScrollScrollEnd = function(){
    var me = this;
    if (this.options.pullDown && this.pullDownEl.className.match('flip')) {
      this.showPullDown('loading');
      this.$pullDown.find('.pull-down-label').html(this.options.pullDownWaitText);
      this.options.pullDownActionHandler.call(this); // Execute custom function (ajax call?)
    }
    if (this.options.pullUp && this.pullUpEl.className.match('flip')) {
      this.pullUpEl.className = 'pull-up loading';
      this.$pullUp.find('.pull-up-label').html(this.options.pullUpWaitText);
      this.options.pullUpActionHandler.call(this); // Execute custom function (ajax call?)
    }
    if (this.scrollStartPos=-1000) {
      // If scrollStartPos=-1000: Recalculate the true value of "hasVerticalScroll" as it may have been
      // altered in 'scroll' to enable pull-to-refresh/load when the content fits the screen...
      this.iScroll.hasVerticalScroll = this.iScroll.options.scrollY && this.iScroll.maxScrollY < 0;
    }
    this.options.onScrollEnd();
  }

  // refresher plugin definition
  var old = $.fn.refresher;

  $.fn.refresher = function(option){
    if(!IScroll){
      console.log("iScroll.js required");
      return;
    }

    var args = Array.prototype.slice.call(arguments, 1);

    return this.each(function (){
      var $this = $(this)
      , instance = $this.data(namespace)
      , options = typeof option === "object" ? option : {}
      ;

      if (!instance){
        $this.data(namespace,true);
        instance = new Refresher(this, options);
        return initialize.call(instance);
      }

      if (typeof option === "string"){
        return instance[option].apply(instance, args);
      }
    });
  };

  $.fn.refresher.Constructor = Refresher;

  // refresher no conflict
  $.fn.refresher.noConflict = function (){
    $.fn.refresher = old;
    return this;
  };
})(Zepto, detect||window.detect);
