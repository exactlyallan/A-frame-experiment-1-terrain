// Enable .html reloading for dev
require('./raw-index.html')

// Get Styles
require('./styles/app.scss')

// A-Frame Requried in Head, import components here
console.log("Starting Custom Aframe Code...")

require('./components/terrain-component.js')


setTimeout(function(){

	var terrain = document.querySelector('.terrain');
	terrain.setAttribute('terrain', {color: 'blue', width: 100, depth: 100})

}, 2000)