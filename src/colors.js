export let generateColors = function (colorStart, colorEnd, colorCount) {
    const start = convertToRGB(colorStart)
    const end = convertToRGB(colorEnd)
    const midpoints = []
    let alpha = 0.0

    for (let i = 0; i < colorCount; i++) {
        const color = []
        alpha += 1.0 / colorCount

        color[0] = start[0] * alpha + (1 - alpha) * end[0]
        color[1] = start[1] * alpha + (1 - alpha) * end[1]
        color[2] = start[2] * alpha + (1 - alpha) * end[2]

        midpoints.push(convertToHex(color))
    }

    return midpoints
}
function convertToRGB(color) {
    const regex = /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    const colorArray = regex.exec(color).slice(1)
    let rgbArray = []
    for (let i = 0; i < 3; i++) {
        rgbArray.push(Math.floor(parseInt(colorArray[i], 16)))
    }
    return rgbArray
}
function convertToHex(rgb) {
    return '#' + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2])
}

function hex(c) {
    const s = '0123456789abcdef'
    let i = parseInt(c)
    if (i == 0 || isNaN(c)) return '00'
    i = Math.round(Math.min(Math.max(0, i), 255))
    return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16)
}
