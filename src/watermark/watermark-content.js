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
      return
    }

    if (typeof param === 'object') {
      this.type = this.param.type
      this.handleMediaType()
      return
    }
  }

  handleMediaType() {
    this.value = mediaTypeHandler[this.type](this.param.url)
  }

  getValue() {
    return this.value
  }
}