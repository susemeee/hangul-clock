import * as cs from './constants'

class Util {
    static loadStyleSheet(src, onLoadcb) {
        if (document.createStyleSheet){
            document.createStyleSheet(src)
        }
        else {
            let css = $('<link rel="stylesheet" href="'+src+'" type="text/css" media="screen" />')
            css.on('load', onLoadcb)
            $('head').append(css)
        }
    }
}

export default class hClock {
    get debug() { return false }
    get order() { return 'lite' }

    constructor() {
        moment.locale('ko')

        if(this.debug) {
            this.__moment = moment
        }

        this.synchronized = null
        this.container = $('body')
        this.container.addClass('hide')

        Util.loadStyleSheet(cs.stylesheetPath, () => {
            $(cs.templates.profile()).prependTo(this.container)
        })
        this.templateBase = $(cs.templates.parent())
        this.templateBase.prependTo(this.container)

        for(let i in cs.order[this.order]) {
            let han = cs.encodedOrder[this.order][i]
            this.templateBase.append($(cs.templates.element(
                ['han', han.byName, han.byIndex],
                cs.order[this.order][i]
            )))
        }

        $(window).load(() => {
            this.showContainer()
        })
    }

    showContainer() {
        setTimeout(() => {
            this.container.removeClass('hide')
        }, 100)
    }

    toggle(n) {
        this.templateBase.find('.han').eq(n).toggleClass('on')
    }

    run() {
        this.update()
        if(this.synchronized === null) {
            this.synchronize()
        } else {
            this.synchronized = setInterval(this.update.bind(this), cs.duration[this.order])
        }
    }

    synchronize() {
        if(this.synchronized !== null) {
            clearInterval(this.synchronized)
        }

        let now = moment()
        let nowNextTick = moment().minutes(Math.floor(now.minutes() / 5) * 5).seconds(0)
        if((now - nowNextTick) > 0) {
            nowNextTick.add(5, 'minutes')
        }
        this.synchronized = true

        setTimeout(this.run.bind(this), nowNextTick - now)
        // console.log(nowNextTick - now)
        // console.log(nowNextTick.format())
    }

    _applyHardMap(index, num, type) {
        if(type == 'minute' && this.order == 'lite') {
            num = Math.floor(num / 5) * 5
        }

        let tests = cs.hardMap[this.order]
        for(let test of tests) {
            if(test.type == type &&
                (test.val === num || (typeof(test.val) === 'object' && test.val.indexOf(num) > -1))
            ) {
                if(test.off.indexOf(index) != -1) {
                    return false
                }
            }
        }

        return true
    }

    _convert(num, type) {
        let _map = cs.hmap[type]
        if(type == 'minute' && this.order == 'lite') {
            num = Math.floor(num / 5) * 5
        }

        let _mapGet = (val) => {
            let word = _map[Math.floor(val)]
            return word ? word.split('') : []
        }

        let r = []
        if(type == 'hour') {
            r.push.apply(r, _mapGet(num))
        } else if(type == 'minute') {
            r.push.apply(r, [..._mapGet(num % 10), ..._mapGet(num / 10)])
        }
        // 십
        r.push(type =='minute' && num >= 10 ? cs.hmap.minute[10] : null)
        // 시분
        r.push(type == 'hour' ? cs.hmap.si : (num == 0 ? null : cs.hmap.bun))
        return r.filter((val) => {
            return val !== null
        })
    }

    _find(time, type) {
        let hms = time[type]()

        hms = type == 'hour' ? hms % 12 : hms
        let wording = this._convert(hms, type)

        let indexOfAll = (arr, val) => {
            return arr.reduce(function(a, e, i) {
                if (e === val) {
                    a.push(i)
                }
                return a
            }, [])
        }

        return wording.reduce((prev, current) => {
            prev.push.apply(prev, indexOfAll(cs.order[this.order], current))
            return prev
        }, []).filter((index) => {
            return this._applyHardMap(index, hms, type)
        }).map((filteredIndex) => {
            return cs.encodedOrder[this.order][filteredIndex].byIndex
        })
    }

    update(givenTime) {
        if(givenTime && this.synchronized !== null) {
            clearInterval(this.synchronized)
        }

        let time = givenTime || moment()
        // console.log(time.format('LT'))

        // breathing change
        if(this.order == 'lite') {
            let bindex = time.minute() == 0 ? 14 : 24
            this.templateBase.find('.han').removeClass('breathing')
            this.templateBase.find('.han').eq(bindex).addClass('breathing')
        }

        // on change
        let targets = ['hour', 'minute'].map((type) => {
            return this._find(time, type)
        })
        targets[0].push.apply(targets[0], targets[1])

        let target = '.' + targets[0].join(', .')
        this.templateBase.find('.han').removeClass('on')
        this.templateBase.find(target).addClass('on')
    }
}
