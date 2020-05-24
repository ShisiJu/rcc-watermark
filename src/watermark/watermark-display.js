// options 
const DISPLAY = {
  cross: 'cross',
  line: 'line'
}

class WatermarkDisplay {

  constructor(elem, setting, dataURL) {
    this.container = elem
    this.rects = elem.getClientRects()[0]
    this.setting = setting
    this.dataURL = dataURL
    this[setting.display]()
  }


  getUnit(x, y) {
    let imgElem = new Image()
    imgElem.src = this.dataURL
    imgElem.style.display = 'block'
    imgElem.style.position = 'absolute'
    imgElem.style.zIndex = 0
    imgElem.style.left = x + 'px'
    imgElem.style.top = y + 'px'
    return imgElem
  }

  actualPx(origin, num) {
    if (num > 1) {
      return origin
    }

    // 小于等于1 时, 取原始大小的倍数
    return origin * num
  }

  cross() {
    let setting = this.setting
    let counter = 1
    let yHeigh = this.actualPx(this.rects.height, setting.containerHeight)
    let spaceY = setting.canvasHeight + setting.unitOffsetY
    let offsetX = setting.unitOffsetX
    for (let y = setting.startY; y <= yHeigh; y = y + spaceY) {
      // 奇偶行交替
      counter++
      let x = setting.startY + (counter % 2) * offsetX
      let unit = this.getUnit(x, y + + this.rects.top)
      this.container.append(unit)
    }
  }


  line() {

  }
}


export default WatermarkDisplay
