import './style.css'

import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { InteractionManager } from "three.interactive";
import {dom} from "three/examples/jsm/libs/dat.gui.module";

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

const earthGeo = new THREE.SphereGeometry(3, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial( {color: 0x30D5C8});
const earth = new THREE.Mesh(earthGeo, earthMaterial);
scene.add(earth);
interactionManager.add(earth);

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
            "    <p class=\"card-text\">The Psyche mission will begin from launching from our home planet Earth!</p>\n" +
            "  </div>\n" +
            "</div>"
        clickCheck = true;
    }
});

const ambientLight = new THREE.AmbientLight(0xFFFFFF);
camera.add(ambientLight);
scene.add(ambientLight);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);


function animate() {
    requestAnimationFrame( animate );

    controls.update();

    interactionManager.update();

    renderer.render(scene, camera);
}
animate();
