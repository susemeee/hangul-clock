
import hClock from './hclock'

// TODO add configuration system
let hc = new hClock()
hc.run()

if(hc.debug) {
    window.__hc = hc
}
