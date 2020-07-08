'use strict'
window.AudioContext = window.AudioContext || window.webkitAudioContext
import Dot from './Dot'
import { generateColors } from './colors'

export default class Visualizer {
    constructor(canvas, audioUrl) {
        this.canvas = canvas
        this.audioUrl = audioUrl
        this.audioBuffer = null
        this.ctx = canvas.getContext('2d')
        this.canvasSize = { width: 1000, height: 400 }
        this.dotSize = 2
        canvas.width = this.canvasSize.width
        canvas.height = this.canvasSize.height
        this.audioContext = new AudioContext()
        this.analyser = this.audioContext.createAnalyser()
        this.source = this.audioContext.createBufferSource() // creates a sound source
        this.source.connect(this.audioContext.destination) // connect the source to the context's destination (the speakers)
        this.source.connect(this.analyser) // connect the source to the context's destination (analyser)
        // this.analyser.connect(this.audioContext)
        this.analyser.fftSize = 512
        this.loaded = false
        this.dots = []
        this.dotsTime = 30
        this.colors = generateColors('#ff0000', '#ffff00', this.dotsTime)

        this.init()
    }
    async init() {
        await this.#loadAudio()
        this.play()
        this.#draw()
    }
    #loadAudio() {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest()
            request.open('GET', this.audioUrl, true)
            request.responseType = 'arraybuffer'

            request.onload = () => {
                this.audioContext.decodeAudioData(
                    request.response,
                    (buffer) => {
                        this.audioBuffer = buffer
                        this.source.buffer = this.audioBuffer // tell the source which sound to play
                        this.loaded = true
                        resolve()
                    },
                    (error) => {
                        console.log(error)
                    }
                )
            }
            request.send()
        })
    }
    play() {
        this.source.start(0) // play the source now
    }
    #draw() {
        const dataArray = new Float32Array(this.analyser.frequencyBinCount)
        this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height)
        this.analyser.getFloatFrequencyData(dataArray)
        this.#drawOlddots()
        this.#drawNewdots(dataArray, this.analyser.frequencyBinCount)
        window.requestAnimationFrame(this.#draw.bind(this))
    }
    #drawOlddots() {
        this.dots = this.dots.filter((dot) => dot.age < dot.maxAge)
        for (let dot of this.dots) {
            const color = dot.getColor()
            this.#drawdot(dot.x, dot.y, dot.size - 1, color)
            dot.age++
            // if (this.dots.indexOf(dot) === 900) {
            //     console.log(color, dot.age, this.dots.indexOf(dot))
            // }
        }
    }
    #drawdot(x, y, size, color) {
        this.ctx.beginPath()
        this.ctx.arc(x, y, size, 0, 2 * Math.PI)
        this.ctx.fillStyle = color
        this.ctx.fill()
    }
    #drawNewdots(data, bufferLength) {
        const sliceWidth = this.canvasSize.width / bufferLength
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
            const v = -data[i] / 128.0
            const y = (v * this.canvasSize.height) / 2
            this.#drawdot(x, y, this.dotSize, 'red')

            this.dots.push(new Dot(x, y, this.dotSize, this.dotsTime, this.colors))

            x += sliceWidth
        }
    }
}
