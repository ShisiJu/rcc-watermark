const ContentType = {
  text: 'text',
  img: 'img'
}


const mediaTypeHandler = {
  [ContentType.img]: function (url) {
    let img = new Image()
    img.src = url;
    img.onload = function () {
    };
  }
}


class WatermarkContent {
  constructor(param) {
    this.param = param
    this.initContentByParam()
  }

  initContentByParam() {
    if (typeof this.param === 'string') {
      this.type = ContentType.text
      this.value = this.param
      this.height = 20
      return
    }

    if (typeof this.param === 'object') {
      this.type = this.param.type
      this.handleMediaType()
      return
    }
  }

  handleMediaType() {
    // this.value = mediaTypeHandler[this.type](this.param.url)
    this.width = this.param.width
    this.height = this.param.height
  }

  getValue() {
    return new Promise(resolve => {

      if (this.isText()) {
        resolve(this.value)
        return
      }

      if (this.isImg()) {
        let img = new Image()
        img.setAttribute("crossOrigin",'Anonymous')
        img.src = this.param.url
        img.onload = function () {
          resolve(img)
        };
      }
    }, err => {
      console.log(err)
    })
  }

  isText() {
    return this.type === ContentType.text
  }

  isImg() {
    return this.type === ContentType.img
  }

  // 在canvas上画图
  draw(canvasCtx, setting) {

    return this.getValue().then(value => {
      // 
      console.log('getValue回调', value)
      if (this.isText()) {
        canvasCtx.fillText(value, setting.x, setting.y);
        return
      }

      if (this.isImg()) {
        canvasCtx.drawImage(value, setting.x, setting.y, this.width, this.height);
      }
    })
  }
}



export default WatermarkContent