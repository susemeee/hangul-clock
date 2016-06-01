export const hmap = {
    hour: ['열두',
        '한', '두', '세', '네', '다섯', '여섯',
        '일곱', '여덟', '아홉', '열', '열한', '열두',
    ],
    minute: ['',
        '', '이', '삼', '사', '오',
        '육', '칠', '팔', '구', '십',
    ],
    si: '시',
    bun: '분',
}
export const order = {
    lite: [
        '열', '한', '다', '세', '네',
        '두', '여', '섯', '일', '곱',
        '여', '덟', '아', '홉', '시',
        '자', '정', '이', '삼', '십',
        '사', '오', '십', '오', '분',
    ],
    full: [/* TODO */]
}

export const duration = {
    lite: 60 * 5 * 1000,
    full: 60 * 1000,
}

// special exceptions
// 분 : [21,22,23,24]
export const hardMap = {
    lite: [
        {
            type: 'hour',
            val: 6,
            off: [10],
        },
        {
            type: 'hour',
            val: 8,
            off: [6],
        },
        {
            type: 'minute',
            val: [5, 15, 25, 35, 45],
            off: [21],
        },
        {
            type: 'minute',
            val: [15, 40, 45],
            off: [19],
        },
        {
            type: 'minute',
            val: [10, 20, 25, 30, 35],
            off: [22],
        },
        {
            type: 'minute',
            val: [50, 55],
            off: [19],
        },
        {
            type: 'minute',
            val: 50,
            off: [23],
        },
    ],
    full: [],
}

function simpleEncode(han) {
    return 'han-encoded-' + encodeURIComponent(han).replace(/%/g, '').toLowerCase()
}

export const encodedOrder = (() => {
    let result = {}
    for(let i in order) {
        result[i] = order[i].map((elem, elemIndex) => {
            return {
                byName: simpleEncode(elem),
                byIndex: `han-index-${elemIndex}`,
            }
        })
    }
    return result
})()

export const templates = {
    parent: function() { return '<section class="clock-outer"></section>' },
    element: function(elementClasses, elementText = '') {
        let elementClassName = elementClasses.join(' ')
        return `<section class="${elementClassName}">${elementText}</section>`
    },
}

export const stylesheetPath = 'app.css'
