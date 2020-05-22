/**
 * 给页面添加水印
 */
var Watermark =
  /*#__PURE__*/
  function () {
    "use strict";

    function Watermark() {

      this.defaults = {
        display: 'cross',
        canvasWidth: 300,
        canvasHeight: 140,
        xStart: window.innerWidth / 4,
        xOffset: 200,
        yOffset: 15,
        xCanvasOffset: 50,
        textRotate: -20,
        pic_src: '/images/icc_logo.png',
        username: Cookies.get('remember_user'),
        datetime: new Date()._$format("yyyy-MM-dd hh:mm")
      };
      this.options = {
        canvas: []
      };

      this.actualSetting = {}
    }


    Date.prototype._$format = function (fmt) { //author: meizz 
      var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }

    var _proto = Watermark.prototype;

    /**
     * options
     *  el: '.product_detail', 元素
        xOffset: 0, 左偏移
        xOffset: 0, 右偏移
        id: '', 展示的id
        username: 'jushis', 展示的用户名
        datetime: '2020',  展示的时间
        pic_src: '/imagmes/logo.png' 加载的图片路径
     */
    _proto.init = function init(options) {
      var _this = this;
      jQuery.extend(_this.options, _this.defaults, options);
      var pic = new Image();
      pic.src = _this.options.pic_src;
      _this.options.pic = pic
      pic.onload = function () {
        _this.loadWaterMark()
      };
    };

    _proto.loadWaterMark = function () {
      var settings = this.options;
      if (!settings.el) {
        settings.el = 'body'
      }
      var _this = this;
      var $targetDom = jQuery(settings.el)

      var canvas = _this.__createCanvas($targetDom);
      settings.deg = settings.textRotate * Math.PI / 180;
      settings.pic = settings.pic

      _this.__drawCanvas(canvas, settings);
      _this.canvas = canvas
      canvas.crossOrigin = '*';

      var dataURL = canvas.toDataURL('image/png');
      _this.imgData = dataURL;
      jQuery(_this).css('background', 'none');

      // 遍历多个元素
      for(var i = 0; i < $targetDom.length ; i++) {
        _this.fillDOM = $($targetDom[i]) ;
        _this.filled_status = [];
        _this.fillPage();
      }

      document.onresize = function () {
        console.log(_this);
        _this.fillPage();
      };
    }

    _proto.setActualSetting = function () {
      var width = this.options.width || this.fillDOM.width();
      var height = this.options.height || this.fillDOM.outerHeight();
      if (width < 600) width = 600;
      if (height < 300) height = 300;
      // canvas的宽高, 属于一个单元
      var xSpace = this.canvas.width;
      var ySpace = this.canvas.height;
      // 设置x,y轴开始的位置
      var xStart = this.options.xStart || 0;
      var yStart = this.options.yStart || 0;
      // x,y 的额外的间距
      var xOffset = this.options.xOffset || 0;
      var yOffset = this.options.yOffset || 0;

      this.actualSetting = {
        containerTop: this.fillDOM.position().top,
        containerLeft: this.fillDOM.position().left,
        width: width,
        height: height,
        xSpace: xSpace,
        ySpace: ySpace,
        xStart: xStart,
        yStart: yStart,
        xOffset: xOffset,
        yOffset: yOffset,
      }
    }

    _proto.fillPage = function () {

      this.setActualSetting()

      if (this.options.display === 'cross') {
        this.crossDisplay()
      } else {
        this.lineDisplay()
      }
    }


    _proto.lineDisplay = function () {
      var set = this.actualSetting
      var xSpaceDistance = set.xSpace + set.xOffset
      for (var y = set.yStart; y <= set.height - xSpaceDistance * 0.2; y = (y + xSpaceDistance)) {
        for (var x = set.xStart; x <= set.width - set.xSpace; x = (x + set.xSpace + set.xOffset)) {
          if (this.filled_status.indexOf(x + '-' + y) === -1) {
            var img = "<img src='" + this.imgData + "' style='display:block;position:absolute; z-index:0; top:" +
              (set.containerTop + y) + 'px; left:' + (set.containerLeft + x) + "px' />";

            this.fillDOM.append(img);
            this.filled_status.push(x + '-' + y);
          }
        }
      }
    }

    _proto.crossDisplay = function () {
      var set = this.actualSetting
      var counter = 1
      var xSpaceDistance = set.xSpace + set.xOffset

      for (var y = set.yStart; y <= set.height - xSpaceDistance * 0.2; y = (y + set.ySpace + set.yOffset)) {
        // 奇偶行交替
        counter++
        var xStartDistance = set.xStart + (counter % 2) * xSpaceDistance
        var img = "<img src='" + this.imgData +
          "' style='display:block;position:absolute; z-index:-1; top:" + (set.containerTop + y) + 'px; left:' + (set.containerLeft + xStartDistance) + "px' />";
        this.fillDOM.append(img);
      }
    }

    _proto.__createCanvas = function __createCanvas() {
      var canvas = document.createElement('canvas');
      this.options.canvas.push(canvas);
      canvas.style.display = 'none';
      $('body').append(canvas);
      return canvas;
    };

    // 绘图, 将logo和用户名等信息拼成图片
    _proto.__drawCanvas = function __drawCanvas(canvas, settings) {
      var ctx = canvas.getContext('2d');
      var offset = {
        x: settings.xCanvasOffset || 0,
        y: settings.yCanvasOffset || 0,
      };
      var canvasWidth = settings.canvasWidth
      var canvasHeight = settings.canvasHeight
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.rotate(settings.deg);
      ctx.globalAlpha = 0.1;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = '18px Arial';
      ctx.drawImage(settings.pic, offset.x + 0, offset.y + 80, 80, 30);
      ctx.fillText('ID: ' + settings.username, offset.x + 0, offset.y + 125);
      ctx.fillText(settings.datetime, offset.x + 0, offset.y + 150);
      return canvas
    };

    _proto.__destory = function __destory() {
      jQuery.each(this.options.canvas, function (i, canvas) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.remove();
        canvas = null;
      });
    };

    return Watermark;
  }();
