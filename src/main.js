'use strict'
window.AudioContext = window.AudioContext || window.webkitAudioContext
import Dot from './Dot'
import { generateColors } from './colors'

export default class Visualizer {
    constructor(canvas, audioUrl, smoothing = 0.1) {
        this.canvas = canvas
        this.audioUrl = audioUrl
        this.audioBuffer = null
        this.ctx = canvas.getContext('2d')
        this.canvasSize = { width: 1000, height: 400 }
        this.dotSize = 1.5
        this.smoothing = smoothing
        canvas.width = this.canvasSize.width
        canvas.height = this.canvasSize.height
        this.audioContext = new AudioContext()
        this.analyser = this.audioContext.createAnalyser()
        this.source = this.audioContext.createBufferSource() // creates a sound source
        this.source.connect(this.audioContext.destination) // connect the source to the context's destination (the speakers)
        this.source.connect(this.analyser) // connect the source to the context's destination (analyser)
        // this.analyser.connect(this.audioContext)
        this.analyser.fftSize = 2048
        this.analyser.smoothingTimeConstant = this.smoothing
        this.loaded = false
        this.dots = []
        this.dotsTime = 30
        this.colors = generateColors('#5500FF', '#ffee00', this.dotsTime)

        this.init()
    }
    async init() {
        await this.#loadAudio()
        this.play()
        window.setTimeout(() => {
            this.#draw()
        }, 10)
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
        this.analyser.getFloatFrequencyData(dataArray)

        this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height)
        this.#drawNewdots(dataArray, this.analyser.frequencyBinCount)
        this.#drawOlddots()
        window.requestAnimationFrame(this.#draw.bind(this))
        // console.log(dataArray)
    }
    #drawOlddots() {
        this.dots = this.dots.filter((dot) => dot.age < dot.maxAge)
        for (let dot of this.dots) {
            const color = dot.getColor()
            this.#drawdot(dot.x, dot.y, dot.size, color)
            dot.age++
            dot.size = this.dotSize * (1 - dot.age / dot.maxAge)
        }
    }
    #drawdot(x, y, size, color) {
        this.ctx.beginPath()
        this.ctx.arc(x, y, size, 0, 2 * Math.PI)
        this.ctx.fillStyle = color
        this.ctx.fill()
    }
    #drawNewdots(data, bufferLength) {
        const sliceWidth = (this.canvasSize.width / bufferLength) * 6
        let x = 0

        for (let i = 0; i < bufferLength; i = i + 6) {
            const percent = (data[i] + 180) / 180
            // if (i === 6 * 150) {
            //     console.log(percent, data[i], 180)
            // }
            const y = this.canvasSize.height - percent * this.canvasSize.height
            this.#drawdot(x, y, this.dotSize, '#ffffff')
            this.dots.push(new Dot(x, y, this.dotSize, this.dotsTime, this.colors))

            x += sliceWidth
        }
    }
}
