import { isEmpty } from './util'
import WatermarkContent from './watermark-content'
import WatermarkDisplay from './watermark-display'


let options = {
  el: '.watermark',
  setting: {
    display: 'cross',
    containerWidth: 1,  // 大于1的取px, 小于等于1的取比例
    containerHeight: 1,
    canvasWidth: 300,
    canvasHeight: 200,
    canvasOffsetX: 10,
    canvasOffsetY: 80,
    unitOffsetX: 400,
    unitOffsetY: 10,
    startX: 0.25, // 大于1的取px, 小于等于1的取比例
    startY: 20, // 大于1的取px, 小于等于1的取比例
    // 旋转角度 顺时针为正
    textRotate: -20,
    // 透明度
    alpha: 0.1,
  },
  content: [{ type: 'img', url: '/img/logo.png', width: 200, height: 100 },
    '2020年', 'ID: steven.ju']
}

class RccWatermark {

  constructor(options = {}) {
    this.checkOptions(options)
    this.paramsSetting = options.setting
    this.content = options.content
    this.el = options.el
  }

  checkOptions(options) {
    if (isEmpty(options.el)) {
      throw 'el 参数不能为空'
    }
  }

  addWatermark() {
    this.initUnit().then(pDataURL => {
      this.dataURL = pDataURL
    }).then(() => {
      let elements = document.querySelectorAll(this.el)
      elements.forEach(elem => {
        new WatermarkDisplay(elem, this.actualSetting, this.dataURL)
      })
    })
  }

  initCanvasCtx(ctx, canvas) {
    const setting = this.getActualSetting()
    canvas.width = setting.canvasWidth;
    canvas.height = setting.canvasHeight;
    const rotate = setting.textRotate * Math.PI / 180;
    ctx.rotate(rotate);
    ctx.globalAlpha = setting.alpha;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '18px Arial';
  }

  initUnit() {
    let canvas = RccWatermark.canvas
    let ctx = canvas.getContext('2d')
    this.initCanvasCtx(ctx, canvas)
    const setting = this.getActualSetting()

    let yDistance = 0
    let promiseDraw = []
    this.content.forEach((canvasContent, index) => {
      let wmContent = new WatermarkContent(canvasContent)

      let paramSetting = {
        x: setting.canvasOffsetX,
        y: setting.canvasOffsetY + yDistance
      }
      yDistance += wmContent.height
      let promisedDraw = new Promise(resolve => {
        wmContent.draw(ctx, paramSetting).then(() => {
          resolve()
        })
      })

      promiseDraw.push(promisedDraw)
    })

    return Promise.all(promiseDraw).then(() => {
      console.log('toDataURL')
      let dataURL = canvas.toDataURL('image/png')
      return dataURL
    }).catch(err => {
      console.log(err)
    })
  }

  // 获取全局默认参数
  getDefaultSetting() {
    return RccWatermark.defaultSetting
  }

  // 获取实际使用的参数 
  getActualSetting() {
    this.actualSetting = Object.assign({}, RccWatermark.defaultSetting, this.paramsSetting)
    return this.actualSetting
  }

}

RccWatermark.defaultSetting = options.setting;

// 设置全局的默认参数
RccWatermark.setDefaultSetting = (pDefaultSetting) => {
  RccWatermark.defaultSetting = pDefaultSetting
}

// 获取全局默认参数
RccWatermark.getDefaultSetting = () => {
  return RccWatermark.defaultSetting
}

// 直接添加水印
RccWatermark.directlyAdd = options => {
  new RccWatermark(options)
}


RccWatermark.canvas = null

RccWatermark.initCanvas = () => {
  let canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  canvas.crossOrigin = '*';
  document.querySelector('body').append(canvas);
  RccWatermark.canvas = canvas;
}

RccWatermark.initCanvas()
RccWatermark.setDefaultSetting(options.setting)

export default RccWatermark