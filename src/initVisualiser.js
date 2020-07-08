import Visualizer from './main'
import audio from './audio/Next Phase Records - Wound Up Beat Tape 2 - 05 Flowtrigger - Dark Soul.mp3'
window.document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('a')
    const audioUrl = audio
    window.vis1 = new Visualizer(canvas, audioUrl)
})
