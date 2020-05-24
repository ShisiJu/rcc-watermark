
import RccWatermark from './watermark'


let wm = new RccWatermark({
  el: '.watermark',
  setting: {
  },
  content: [{ type: 'img', url: 'http://localhost:3000/static/js/img.png', width: 150, height: 100 }, 'hello', 'world']
})

wm.addWatermark()