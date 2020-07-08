'use strict'
window.AudioContext = window.AudioContext || window.webkitAudioContext
export default class Visualizer {
    constructor(canvas, audioUrl) {
        this.canvas = canvas
        this.audioUrl = audioUrl
        this.audioBuffer = null
        this.ctx = canvas.getContext('2d')
        canvas.width = 1000
        canvas.height = 400
        this.audioContext = new AudioContext()
        this.source = this.audioContext.createBufferSource() // creates a sound source
        this.source.connect(this.audioContext.destination) // connect the source to the context's destination (the speakers)
        this.loaded = false

        this.init()
    }
    async init() {
        await this.#loadAudio()
        this.play()
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
}
