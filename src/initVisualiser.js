import Visualizer from './main'
import audio from './audio/3.mp3'
window.document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('a')
    const audioUrl = audio
    window.vis1 = new Visualizer(canvas, audioUrl)
})
