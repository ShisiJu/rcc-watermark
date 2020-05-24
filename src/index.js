
import RccWatermark from './watermark'


let wm = new RccWatermark({
  el: '.watermark',
  content: [{ type: 'img', url: 'http://localhost:3000/static/js/img.png', width: 200, height: 150 }, 'hello', 'world']
})

wm.addWatermark()