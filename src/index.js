/* index */

// Imports
import AFRAME from "aframe";
import * as dat from 'dat.gui';
import SimplexNoise from "simplex-noise";
import "./style.css";


/* Dat GUI */
window.onload = function() {

    const gui = new dat.GUI();
    var terrain = document.querySelector('#terrain');

    var eColor = gui.addColor(terrain.getAttribute('rolling-terrain'), 'color');
    var eRadSeg = gui.add(terrain.getAttribute('rolling-terrain'), 'radialSegments', 8, 512).step(16);
    var eHeightSeg = gui.add(terrain.getAttribute('rolling-terrain'), 'heightSegments', 8, 512).step(16);
    var eRad = gui.add(terrain.getAttribute('rolling-terrain'), 'radius', 1, 10).step(0.25);
    var eHeight = gui.add(terrain.getAttribute('rolling-terrain'), 'height', 1, 32).step(1);
    var eValley = gui.add(terrain.getAttribute('rolling-terrain'), 'valley', 0.1, 1.0).step(0.1);
    var eSpeed = gui.add(terrain.getAttribute('rolling-terrain'), 'speed', 0.5, 10.0).step(0.5);


    eColor.onChange(function(value) {
        document.querySelector('#terrain').setAttribute('rolling-terrain', 'color', value)
    });

    eRadSeg.onChange(function(value) {
        document.querySelector('#terrain').setAttribute('rolling-terrain', 'radialSegments', value)
    });

    eHeightSeg.onChange(function(value) {
        document.querySelector('#terrain').setAttribute('rolling-terrain', 'heightSegments', value)
    });

    eRad.onChange(function(value) {
        document.querySelector('#terrain').setAttribute('rolling-terrain', 'radius', value)
    });

    eHeight.onChange(function(value) {
        document.querySelector('#terrain').setAttribute('rolling-terrain', 'height', value)
    });

    eValley.onChange(function(value) {
        document.querySelector('#terrain').setAttribute('rolling-terrain', 'valley', value)
    });

    eSpeed.onChange(function(value) {
        document.querySelector('#terrain').setAttribute('rolling-terrain', 'speed', value)
    });


}

// A-frame custom components
AFRAME.registerComponent('rolling-terrain', {
    schema: {
        radius: { type: 'number', default: 1 },
        height: { type: 'number', default: 2 },
        radialSegments: { type: 'number', default: 16 },
        heightSegments: { type: 'number', default: 8 },
        speed: { type: 'number', default: 1 },
        valley: { type: 'number', default: 0.5 },
        color: { type: 'color', default: '#ffff00' }
    },

    buildGeo: function(data) {

        console.log("building...")

        // generate simplex noise 
        // https://github.com/jwagner/simplex-noise.js
        this.simplex = new SimplexNoise(Math.random)

        // https://threejs.org/docs/index.html#api/en/geometries/CylinderBufferGeometry
        this.geometry = new THREE.CylinderBufferGeometry(data.radius, data.radius, data.height, data.radialSegments, data.heightSegments, true)
        this.geometry.rotateZ(Math.PI / 2)

        let posArray = this.geometry.getAttribute('position').array

        for (let i = 0; i < posArray.length; i += 3) {

            // normalize noise multiplier by x pos
            var sides = 1;
            var middle = data.valley;
            var normLength = THREE.Math.mapLinear(Math.abs(posArray[i]), data.height / 2, 0, sides, middle)

            // use simplex noise to generate height map, min offset from radius * valley generation depending on x pos
            var noise = (this.simplex.noise3D(posArray[i], posArray[i + 1], posArray[i + 2]) + data.radius) * normLength
            var offsetVec = new THREE.Vector3(posArray[i], posArray[i + 1] * noise, posArray[i + 2] * noise)

            // update array
            posArray[i] = offsetVec.x
            posArray[i + 1] = offsetVec.y
            posArray[i + 2] = offsetVec.z
        }

        this.material = new THREE.MeshStandardMaterial({ color: data.color, wireframe: true, depthTest: true, depthWrite: true, roughness: 0.3, metalness: 0 })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
    },

    init: function() {
        var data = this.data
        var el = this.el

        this.buildGeo(data);
        console.log("mesh", this.mesh)
        el.setObject3D('mesh', this.mesh)

    },

    update: function(oldData) {
        var data = this.data
        var el = this.el

        // No need to update.
        if (Object.keys(oldData).length === 0) { return; }

        // Geometry-related properties changed. Update the geometry.
        if (data.radius !== oldData.radius ||
            data.height !== oldData.height ||
            data.radialSegments !== oldData.radialSegments ||
            data.heightSegments !== oldData.heightSegments ||
            data.valley !== oldData.valley) {

            this.buildGeo(data);
            el.setObject3D('mesh', this.mesh)

        }

        // Material-related properties changed. Update the material.
        if (data.color !== oldData.color) {
            el.getObject3D('mesh').material.color = new THREE.Color(data.color)
        }

    },

    remove: function() {
        this.el.removeObject3D('mesh')
    },

    tick: function(time, timeDelta) {
        // rotation
        var roX = this.data.speed / 1000;
        this.el.object3D.rotateX(roX)

    }
});