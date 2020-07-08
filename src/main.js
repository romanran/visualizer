'use strict'
window.AudioContext = window.AudioContext || window.webkitAudioContext
export default class Visualizer {
    constructor(canvas, audioUrl) {
        this.canvas = canvas
        this.audioUrl = audioUrl
        this.audioBuffer = null
        this.ctx = canvas.getContext('2d')
        this.canvasSize = { width: 1000, height: 400 }
        canvas.width = this.canvasSize.width
        canvas.height = this.canvasSize.height
        this.audioContext = new AudioContext()
        this.analyser = this.audioContext.createAnalyser()
        this.source = this.audioContext.createBufferSource() // creates a sound source
        this.source.connect(this.audioContext.destination) // connect the source to the context's destination (the speakers)
        this.source.connect(this.analyser) // connect the source to the context's destination (analyser)
        // this.analyser.connect(this.audioContext)
        this.analyser.fftSize = 256
        this.loaded = false

        this.init()
    }
    async init() {
        await this.#loadAudio()
        this.play()
        this.draw()
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
        // this.analyser.connect(this.audioContext.destination)
    }
    draw() {
        const dataArray = new Float32Array(this.analyser.frequencyBinCount)
        this.ctx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height)
        this.analyser.getFloatFrequencyData(dataArray)
        this.drawLine(dataArray, this.analyser.frequencyBinCount)
        window.requestAnimationFrame(this.draw.bind(this))
    }
    drawLine(data, bufferLength) {
        const sliceWidth = this.canvasSize.width / bufferLength
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
            const v = -data[i] / 128.0
            const y = (v * this.canvasSize.height) / 2

            if (i === 0) {
            } else {
            }

            x += sliceWidth
        }
        this.ctx.stroke()
    }
}
