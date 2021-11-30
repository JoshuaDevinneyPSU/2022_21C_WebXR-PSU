const THREE = require('three');
const addPlanet = require('../helper-functions.js').addPlanet;
const assert = require('assert');

describe('addPlanet', function() {

    //Test case 1: make sure provided values are correctly set
    it('Function should set correct x and y coordinates', function () {
        let testMesh = new THREE.Mesh();
        testMesh = addPlanet(10, 8, 8, 12, 12, 12);
        assert.strictEqual(testMesh.position.x, 12);
        assert.strictEqual(testMesh.position.y, 12);
        assert.strictEqual(testMesh.position.z, 12);
    })

    //Test case 2: make sure function throws error when radius is zero
    it('Function should throw an error when radius is zero', function(){
        assert.throws(function(){
            addPlanet(0, 8, 8, 12, 12, 12);
            addPlanet(-1, 8, 8, 12, 12, 12);
        })
    })
})