const THREE = require('three')
const createPlanet = require('../test-functions.js').createPlanet;
const createMaterial = require('../test-functions.js').createMaterial;
const createTexture = require('../test-functions.js').createTexture;
const assert = require('assert')

//Test Suite 1: Three.js functionalities
describe('The THREE object', function() {

    //Test case 1: ensure defined shadowmap
    it('should have a defined BasicShadowMap constant', function() {
        assert.notStrictEqual('undefined', THREE.BasicShadowMap);
    })

    //Test case 2: ensure proper vector creation
    it('should be able to construct a Vector3 with default of x=0', function() {
        const vec3 = new THREE.Vector3();
        assert.strictEqual(0, vec3.x);
    })
})

//Test Suite 2: createPlanet function
describe('createPlanet', function(){

    //Test case 1: make sure provided values are correctly set
    it('Function should set correct x and y coordinates', function (){
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

//Test Suite 5: createMaterial function
describe('createMaterial', function(){

    //Test Case 1: Check that function does not return null
    it('Function should not return null', function (){
        let testMaterial = new THREE.Material();
        testMaterial = createMaterial("texture", testMaterial);
        assert.notStrictEqual(testMaterial, null);
        testMaterial = createMaterial("color", testMaterial);
        assert.notStrictEqual(testMaterial, null);
        testMaterial = createMaterial("texture-basic", testMaterial);
        assert.notStrictEqual(testMaterial, null);
        testMaterial = createMaterial("default", testMaterial);
        assert.notStrictEqual(testMaterial, null);
    })

    //Test Case 2: Check if else default handling
    it('Function should create basic material if unhandled string is passed', function(){
        let testMaterial = new THREE.Material();
        testMaterial = createMaterial("Tuggits", testMaterial);
        console.log();
        assert.strictEqual(testMaterial instanceof THREE.MeshBasicMaterial, true);
    })

    //Test Case 3: Ensure correct Materials are created
    it('Function should return correct material type', function (){
        let testMaterial = new THREE.Material();
        testMaterial = createMaterial("texture", testMaterial);
        assert.strictEqual(testMaterial instanceof THREE.MeshStandardMaterial, true);
        testMaterial = createMaterial("color", testMaterial);
        assert.strictEqual(testMaterial instanceof THREE.MeshStandardMaterial, true);
        testMaterial = createMaterial("texture-basic", testMaterial);
        assert.strictEqual(testMaterial instanceof THREE.MeshBasicMaterial, true);
    })
})

/*
//Test Suite: createTexture function
describe('createTexture', function(){

    //Test Case 1: Check that function does not return null with valid file path
    it('Function should not return null', function (){
        let testTexture = createTexture("Resources/Textures/marsTexture.jpg");
        assert.notStrictEqual(testTexture, null);
    })

    //Test Case 2: Check that function handles invalid file path
    it('Function handles invalid file path', function (){
        let testTexture = createTexture("Resources/Textures/SkippySkipperson.jpg");
        assert.notStrictEqual(testTexture, null);
    })
})
*/