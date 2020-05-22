import { isEmpty } from './util'

// options 
const DISPLAY = {
  cross: 'cross',
  line: 'line'
}

let options = {
  el: '.watermark',
  setting: {
    display: DISPLAY.cross,
    containerWidth: 0.2,  // 大于1的取px, 小于等于1的取比例
    containerHeight: 120,
    canvasWidth: 300,
    canvasHeight: 200,
    canvasOffsetX: 10,
    canvasOffsetY: 20,
    startX: 200, // 大于1的取px, 小于等于1的取比例
    startY: 100, // 大于1的取px, 小于等于1的取比例
    // 旋转角度 顺时针为正
    textRotate: -20,
    // 透明度
    alpha: 0.1,
  },
  content: [{ type: 'img', url: '/img/logo.png' }, '2020年', 'ID: steven.ju']
}

class RccWatermark {

  constructor(options = {}) {
    this.checkOptions(options)
    this.paramsSetting = options.setting
    this.el = options.el
  }

  checkOptions(options) {
    if (isEmpty(options.el)) {
      throw 'el 参数不能为空'
    }
  }

  addWatermark() {
    // this.unit = this.initUnit()
    // this.fullEl(this.unit)
    let elements = document.querySelectorAll(this.el)
    elements.forEach(elem => {
      let rects =  elem.getClientRects()
      console.log(rects)
    })
  }

  initUnit() {
    let canvas = RccWatermark.canvas
    let ctx = canvas.getContext('2d');
    let setting = this.getActualSetting()
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let rotate = settings.textRotate * Math.PI / 180;
    ctx.rotate(rotate);
    ctx.globalAlpha = 0.1;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '18px Arial';
    // ctx.drawImage(settings.pic, offset.x + 0, offset.y + 80, 80, 30);
    // ctx.fillText('ID: ' + settings.username, offset.x + 0, offset.y + 125);
    // ctx.fillText(settings.datetime, offset.x + 0, offset.y + 150);

    let dataURL = canvas.toDataURL('image/png');


  }


  fullEl(unit) {
    let top = 0
    let left = 0
    this.imgData = dataURL;
    var imgElement = `<img src="${this.imgData} style='display:block;position:absolute; z-index:0; top: "`

    "<img src='" + this.imgData + "' style='display:block;position:absolute; z-index:0; top:" +
      (set.containerTop + y) + 'px; left:' + (set.containerLeft + x) + "px' />";

    this.fillDOM.append(imgElement);
  }
  // 设置全局的默认参数
  setDefaultSetting(pDefaultSetting) {
    RccWatermark.defaultSetting = pDefaultSetting
  }

  // 获取全局默认参数
  getDefaultSetting() {
    return RccWatermark.defaultSetting
  }

  // 获取实际使用的参数 
  getActualSetting() {
    return Object.assign({}, RccWatermark.defaultSetting, this.paramsSetting)
  }

}



RccWatermark.defaultSetting = options

RccWatermark.directlyAdd = options => {
  new RccWatermark(options)
}


RccWatermark.canvas = null

RccWatermark.initCanvas = function () {
  let canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  document.querySelector('body').append(canvas);
  RccWatermark.canvas = canvas;
}

RccWatermark.initCanvas()

export default RccWatermark