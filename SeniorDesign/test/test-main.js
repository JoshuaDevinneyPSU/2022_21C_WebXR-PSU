const THREE = require('three')
const createPlanet = require('../test-functions.js').createPlanet;
const assert = require('assert')

describe('createPlanet', function() {

    //Test case 1: make sure provided values are correctly set
    it('Function should set correct x and y coordinates', function () {
        let testMesh = new THREE.Mesh();
        testMesh = createPlanet(10, 8, 8, 12, 12, 12);
        assert.strictEqual(testMesh.position.x, 12);
        assert.strictEqual(testMesh.position.y, 12);
        assert.strictEqual(testMesh.position.z, 12);
    })

    //Test case 2: make sure function throws error when radius is zero
    it('Function should throw an error when radius is zero', function(){
        assert.throws(function(){
            createPlanet(0, 8, 8, 12, 12, 12);
            createPlanet(-1, 8, 8, 12, 12, 12);
        })
    })
})