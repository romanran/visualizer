export default class Dot {
    constructor(x, y, size, maxAge, colors) {
        this.x = x
        this.y = y
        this.maxAge = maxAge
        this.age = 0
        this.colors = colors
        this.size = size
    }
    getColor() {
        return this.colors[this.age]
    }
}
