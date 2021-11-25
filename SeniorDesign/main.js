import './style.css'

import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const earthGeo = new THREE.SphereGeometry(3, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial( {color: 0x30D5C8});
const earth = new THREE.Mesh(earthGeo, earthMaterial);
scene.add(earth);

const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientLight);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame( animate );

    controls.update();


    renderer.render(scene, camera);
}

animate();