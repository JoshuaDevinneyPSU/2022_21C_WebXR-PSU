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

const earthTexture = new THREE.TextureLoader().load('earthTexture.jpg');
const normalTexture = new THREE.TextureLoader().load('earthNormalMap.tif');

const earthGeo = new THREE.SphereGeometry(3, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial( {map: earthTexture,
    normalMap: normalTexture});
const earth = new THREE.Mesh(earthGeo, earthMaterial);
earth.position.set(15, 0, 10)
scene.add(earth);

const sunTexture = new THREE.TextureLoader().load('sun.jpg');
const sunGeo = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({map: sunTexture});
const sun = new THREE.Mesh(sunGeo, sunMaterial);
scene.add(sun);

const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientLight);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

var orbit = new THREE.Group();
orbit.add(earth);
scene.add(orbit);

function animate() {
    requestAnimationFrame( animate );
    earth.rotation.y += 0.01;
    orbit.rotation.y += 0.01;

    controls.update();

    renderer.render(scene, camera);
}

animate();