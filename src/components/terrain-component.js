var ImprovedNoise = require('improved-noise')


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

