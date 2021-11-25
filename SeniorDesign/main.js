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

const au = 35;

const sunGeo = new THREE.SphereGeometry(15, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({color: 0xF9D71C})
const sun = new THREE.Mesh(sunGeo, sunMaterial);
scene.add(sun);

const marsGeo = new THREE.SphereGeometry(5/2, 32, 32);
const marsMaterial = new THREE.MeshStandardMaterial({color: 0x934838});
const mars = new THREE.Mesh(marsGeo, marsMaterial);
mars.position.setX(au*1.5);
scene.add(mars);

const moonGeo = new THREE.SphereGeometry(5*.25, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
const moon = new THREE.Mesh(moonGeo, moonMaterial);
moon.position.setX(au+8);
scene.add(moon);

const psycheGeo = new THREE.DodecahedronGeometry(1);
const psycheMaterial = new THREE.MeshStandardMaterial({color: 0x61616C});
const psyche = new THREE.Mesh(psycheGeo, psycheMaterial);
psyche.position.setX(au*2.5);
scene.add(psyche);

const earthGeo = new THREE.SphereGeometry(5, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial( {color: 0x30D5C8});
const earth = new THREE.Mesh(earthGeo, earthMaterial);
earth.position.setX(au)
scene.add(earth);
interactionManager.add(earth);

const spaceTexture = new THREE.TextureLoader().load('../Resources/spaceBackground.jpg');
scene.background = spaceTexture;

let clickCheck = false;

earth.addEventListener("click", (event) => {
    if(clickCheck){
        document.getElementById('test').innerText = ''
        clickCheck = false;
    }
    else {
        document.getElementById('test').innerHTML = "<div class=\"card\" style=\"width: 18rem;\">\n" +
            "  <img src='https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' class=\"card-img-top\">\n" +
            "  <div class=\"card-body\">\n" +
            "    <p class=\"card-text\">The Psyche mission will begin by launching from our home planet Earth!</p>\n" +
            "  </div>\n" +
            "</div>"
        clickCheck = true;
    }
});

const ambientLight = new THREE.AmbientLight(0xFFFFFF);
camera.add(ambientLight);
scene.add(ambientLight);

const gridHelper = new THREE.GridHelper(400, 100);
scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);


function animate() {
    requestAnimationFrame( animate );

    controls.update();

    interactionManager.update();

    renderer.render(scene, camera);
}
animate();
