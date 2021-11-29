import './style.css'

import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { InteractionManager } from "three.interactive";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
});

const interactionManager = new InteractionManager(
    renderer,
    camera,
    renderer.domElement
);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const au = 20;

const earthTexture = new THREE.TextureLoader().load('../Resources/Textures/earthTexture.jpg');
const normalTexture = new THREE.TextureLoader().load('../Resources/Maps/earthNormalMap.tif');

const earthGeo = new THREE.SphereGeometry(3, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial( {map: earthTexture,
    normalMap: normalTexture});
const earth = new THREE.Mesh(earthGeo, earthMaterial);
earth.position.set(au, 0, 10)
scene.add(earth);

const sunTexture = new THREE.TextureLoader().load('../Resources/Textures/sun.jpg');
const sunGeo = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({map: sunTexture});
const sun = new THREE.Mesh(sunGeo, sunMaterial);
scene.add(sun);

const marsGeo = new THREE.SphereGeometry(3/2, 32, 32);
const marsMaterial = new THREE.MeshStandardMaterial({color: 0x934838});
const mars = new THREE.Mesh(marsGeo, marsMaterial);
mars.position.setX(au*1.5);
scene.add(mars);

const moonGeo = new THREE.SphereGeometry(3*.25, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
const moon = new THREE.Mesh(moonGeo, moonMaterial);
moon.position.setX(au+8);
scene.add(moon);

const psycheGeo = new THREE.DodecahedronGeometry(1);
const psycheMaterial = new THREE.MeshStandardMaterial({color: 0x61616C});
const psyche = new THREE.Mesh(psycheGeo, psycheMaterial);
psyche.position.setX(au*2.5);
scene.add(psyche);

earth.position.setX(au)

interactionManager.add(earth);
interactionManager.add(sun);

const spaceTexture = new THREE.TextureLoader().load('../Resources/Textures/spaceBackground.jpg');
scene.background = spaceTexture;

let earthIsChecked = false;
let sunIsChecked = true;

sun.addEventListener('click', (event) => {
    if(sunIsChecked){
        scene.remove(gridHelper);
        sunIsChecked = false;
    }
    else{
        scene.add(gridHelper);
        sunIsChecked = true;
    }
});

//handle the user clicking on the Earth Model
earth.addEventListener("click", (event) => {
    if(earthIsChecked){
        //executes the hideFactCard function
        hideFactCard();
    }
    else {
        //executes the showFactCard function

        //adds the following HTML to the div located on the upper-left corner of the UI
        document.getElementById('fact-card').innerHTML = "<div class=\"card\">\n" +
            "  <img src=\"https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500\" class=\"card-img-top\">\n" +
            "  <div class=\"card-body\">\n" +
            "    <p class=\"card-text\">The Psyche mission will begin by launching from our home planet Earth!</p>\n" +
            "  </div>\n" +
            "  <div class=\"card-button-container\">\n" +
            "    <button class=\"control-button\" id=\"close-button\" type=\"button\" onclick=\"hideFactCard\">Close</button>\n" +
            "    <button class=\"control-button\" id=\"read-more-button\" type=\"button\">Read More</button>\n" +
            "  </div>\n" +
            "</div>\n"

        earthIsChecked = true;

        //showFactCard();

        //adds the event listeners to the correct buttons
        //document.getElementById('read-more-button').addEventListener("click", showNextFact());
    }
});

//hides the fact card showing the Earth facts
function hideFactCard()
{
    document.getElementById('fact-card').innerText = '';
    earthIsChecked = false;
}

//NOT WORKING YET
//occurs when the Earth model is clicked, shows the card containing the facts pertaining to Earth
function showFactCard()
{
    //document.getElementById('close-button').addEventListener("click", hideFactCard());
}

function showNextFact(){
    //document.getElementById('');
}

const ambientLight = new THREE.AmbientLight(0xFFFFFF);
camera.add(ambientLight);
scene.add(ambientLight);

const gridHelper = new THREE.GridHelper(400, 100);
scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

var orbit = new THREE.Group();
orbit.add(earth);
scene.add(orbit);

function animate() {
    requestAnimationFrame( animate );
    earth.rotation.y += 0.01;
    orbit.rotation.y += 0.001;

    controls.update();

    interactionManager.update();

    renderer.render(scene, camera);
}
animate();
