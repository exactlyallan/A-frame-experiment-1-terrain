/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// Enable .html reloading for dev
__webpack_require__(2)

// Get Styles
__webpack_require__(3)

// A-Frame Requried in Head, import components here
console.log("Starting Custom Aframe Code...")

__webpack_require__(4)


setTimeout(function(){

	var terrain = document.querySelector('.terrain');
	terrain.setAttribute('terrain', {color: 'blue', width: 100, depth: 100})

}, 2000)

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n  <meta name=\"author\" content=\"exactly.allan@gmail.com\">\n  <meta name=\"description\" content=\"Terrain AFrame\">\n  <script src=\"https://aframe.io/releases/0.6.1/aframe.min.js\"></script>\n</head>\n<body>\n  <h1 class=\"test-header\">Terrain in A-Frame</h1>\n    <a-scene>\n      <a-box position=\"-1 0.5 -3\" rotation=\"0 45 0\" color=\"#4CC3D9\"></a-box>\n      <a-sphere position=\"0 1.25 -5\" radius=\"1.25\" color=\"#EF2D5E\"></a-sphere>\n      <a-sky color=\"#ECECEC\"></a-sky>\n      <a-entity debug class=\"terrain\" terrain=\"width: 50; depth: 50; magnitude: 2; animate: false; color: #b70000\"></a-entity>\n    </a-scene>\n</body>\n</html>";

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var ImprovedNoise = __webpack_require__(5)


// Terrain Component
AFRAME.registerComponent('terrain', {
  schema: {
    width: {type: 'number', default: 10},
    depth: {type: 'number', default: 10},
    magnitude: {type: 'number', default: 1 },
    animate: {type: 'boolean', default: true },
    color: {type: 'color', default: '#b70000'}
  },
  init: function () {
    var data = this.data
    var el = this.el
    this.counter = 0;

    var worldWidth = this.data.width
    var worldDepth = this.data.depth

    var color3 = new THREE.Color();
    color3.setStyle(this.data.color)

    this.material = new THREE.MeshPhongMaterial({
        wireframe: true,
        color: color3
    });
   
    this.terrainGeo = new THREE.PlaneBufferGeometry(worldWidth, worldDepth, worldWidth - 1, worldDepth - 1)

    this.terrainMesh = new THREE.Mesh(this.terrainGeo, this.material);

    // Set mesh on entity
    el.setObject3D('mesh', this.terrainMesh)


  },
  // Perlin noise magic, Requires ImprovedNoise.js https://gist.github.com/mrdoob/518916
  generateHeight: function(width, depth) {

  	console.log("Updating height data...")

    var size = width * depth
    var data = new Uint8Array(size)
    var perlin = new ImprovedNoise()
    var quality = 2
   	var z = Math.random()

	for (var j = 0; j < 4; j++) {

	    for (var i = 0; i < size; i++) {

	        var x = i % width,
	            y = ~~(i / width);

	        data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality)

	    }

	    quality *= 1.8 // wavy-ness 

	}
	return data

  },
  // checks if close enough to zero
  isEpsilon: function(number) {
    return Math.abs(number) < 0.001;
  },
  update: function (oldData) {

  	var data = this.data
  	var el = this.el
  	var heightMultiplier = this.data.magnitude 

    // Geometry-related properties changed. Update the geometry.
    if (data.width !== oldData.width ||
        data.height !== oldData.height ||
        data.depth !== oldData.depth) {

	    var worldWidth = this.data.width
	    var worldDepth = this.data.depth

	    this.heightData = this.generateHeight(worldWidth, worldDepth)

	    this.terrainGeo = new THREE.PlaneBufferGeometry(worldWidth, worldDepth, worldWidth - 1, worldDepth - 1)
	    this.terrainGeo.rotateX(-Math.PI / 2); // specify which vertice set is 'up'


	    this.vertices = this.terrainGeo.attributes.position.array


	    // Note: BufferGeo, hence the +=3
	    for (var i = 0, j = 0, l = this.vertices.length; i < l; i++, j += 3) {

	        this.vertices[j + 1] = this.heightData[i] * heightMultiplier; // vertices[j + 1] for terrainGeo.rotateX
	    }

	    el.getObject3D('mesh').geometry = this.terrainGeo;


    }

    // Material-related properties changed. Update the material.
    if (data.color !== oldData.color) {
        var color3 = new THREE.Color();
    	color3.setStyle(this.data.color)
      	el.getObject3D('mesh').material.color = color3;
    }
  

  },
  remove: function () {
    this.el.removeObject3D('mesh');
  },
  tick: function (time, timeDelta) {
    
    var heightMultiplier = this.data.magnitude 
   	var worldWidth = this.data.width
	var worldDepth = this.data.depth
 	var heightData = this.heightData;
 	var vertices = this.vertices
 	var terrainMesh = this.terrainMesh

 	this.counter = this.counter + 0.0025;
    var osilate = Math.cos(this.counter);

    // check if near zero to update heightmap data
    if (this.isEpsilon(osilate)) {
        heightData = this.generateHeight(worldWidth, worldDepth);
    }

    // update verts
    for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {

        vertices[j + 1] = heightData[i] * osilate * heightMultiplier;
    }

    terrainMesh.geometry.attributes.position.needsUpdate = true;
   

  }
});



/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = ImprovedNoise

// http://mrl.nyu.edu/~perlin/noise/

function ImprovedNoise() {

	var p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
		 23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
		 174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
		 133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
		 89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
		 202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
		 248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
		 178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
		 14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
		 93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

	for (var i=0; i < 256 ; i++) {

		p[256+i] = p[i];

	}

	function fade(t) {

		return t * t * t * (t * (t * 6 - 15) + 10);

	}

	function lerp(t, a, b) {

		return a + t * (b - a);

	}

	function grad(hash, x, y, z) {

		var h = hash & 15;
		var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
		return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);

	}

	return {

		noise: function (x, y, z) {

			var floorX = Math.floor(x), floorY = Math.floor(y), floorZ = Math.floor(z);

			var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;

			x -= floorX;
			y -= floorY;
			z -= floorZ;

			var xMinus1 = x -1, yMinus1 = y - 1, zMinus1 = z - 1;

			var u = fade(x), v = fade(y), w = fade(z);

			var A = p[X]+Y, AA = p[A]+Z, AB = p[A+1]+Z, B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;

			return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), 
							grad(p[BA], xMinus1, y, z)),
						lerp(u, grad(p[AB], x, yMinus1, z),
							grad(p[BB], xMinus1, yMinus1, z))),
					lerp(v, lerp(u, grad(p[AA+1], x, y, zMinus1),
							grad(p[BA+1], xMinus1, y, z-1)),
						lerp(u, grad(p[AB+1], x, yMinus1, zMinus1),
							grad(p[BB+1], xMinus1, yMinus1, zMinus1))));

		}
	}
}


/***/ })
/******/ ]);