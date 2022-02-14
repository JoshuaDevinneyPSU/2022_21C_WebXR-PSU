import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { InteractionManager } from "three.interactive";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";

import './style.css'
import Stats from "three/examples/jsm/libs/stats.module";



import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import {ARButton} from "three/examples/jsm/webxr/ARButton";


const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


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

//Enable WebXR support
renderer.xr.enabled = true;
document.body.appendChild( ARButton.createButton( renderer ) );


function onSelectStart() {

    this.userData.isSelecting = true;
    this.userData.skipFrames = 2;

    camera = renderer.xr.getCamera()
}

function onSelectEnd() {

    this.userData.isSelecting = false;

}

let controller = renderer.xr.getController( 0 );
controller.addEventListener( 'selectstart', onSelectStart );
controller.addEventListener( 'selectend', onSelectEnd );
controller.userData.skipFrames = 0;
scene.add( controller );

const cursor = new THREE.Vector3();

function handleController( controller ) {

    const userData = controller.userData;

    cursor.set(0, 0, -0.2).applyMatrix4(controller.matrixWorld);
}

renderer.render(scene, camera);

const au = 20;

const earthTexture = new THREE.TextureLoader().load('../Resources/Textures/earthTexture.jpg');
const normalTexture = new THREE.TextureLoader().load('../Resources/Maps/earthNormalMap.tif');

const earthGeo = new THREE.SphereGeometry(3, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial( {map: earthTexture});
const earth = new THREE.Mesh(earthGeo, earthMaterial);

earth.position.set(au, 0, 10);

scene.add(earth);

const sunTexture = new THREE.TextureLoader().load('../Resources/Textures/sun.jpg');
const sunGeo = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});
const sun = new THREE.Mesh(sunGeo, sunMaterial);
scene.add(sun);

const marsTexture = new THREE.TextureLoader().load('../Resources/Textures/marsTexture.jpg');
const marsGeo = new THREE.SphereGeometry(3/2, 32, 32);
const marsMaterial = new THREE.MeshStandardMaterial({map: marsTexture});
const mars = new THREE.Mesh(marsGeo, marsMaterial);
mars.position.setX(au*1.5);
scene.add(mars);

const moonTexture = new THREE.TextureLoader().load('../Resources/Textures/moonTexture.jpg');
const moonGeo = new THREE.SphereGeometry(3*.25, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({map: moonTexture});
const moon = new THREE.Mesh(moonGeo, moonMaterial);
moon.position.setX(au+8);
scene.add(moon);

const psycheTexture = new THREE.TextureLoader().load('../Resources/Textures/psycheTexture.jpg')
const psycheGeo = new THREE.DodecahedronGeometry(1);
const psycheMaterial = new THREE.MeshStandardMaterial({map: psycheTexture});
const psyche = new THREE.Mesh(psycheGeo, psycheMaterial);
psyche.position.setX(au*2.5);
scene.add(psyche);

earth.position.setX(au)

const loader = new STLLoader()
loader.load(
    '../Resources/Models/PsycheModel.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, psycheMaterial)
        mesh.position.setX(au*2.5)
        scene.add(mesh)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

const stats = Stats()
document.body.appendChild(stats.dom)

const light = new THREE.PointLight( 0xF4E99B, 5, 150 );
scene.add( light );

//enable EventListeners for meshes
interactionManager.add(earth);
interactionManager.add(mars);
interactionManager.add(sun);

//create labels for planetary bodies
//Earth
const earthLabelGeometry = new THREE.PlaneGeometry(5, 3);
const earthLabelTexture = new THREE.TextureLoader().load('../Resources/Textures/earthLabelTexture.jpg');
const earthLabelMaterial = new THREE.MeshBasicMaterial({map: earthLabelTexture, side: THREE.DoubleSide});
const earthLabel = new THREE.Mesh(earthLabelGeometry, earthLabelMaterial);
earthLabel.position.set(earth.position.x, earth.position.y + 5, earth.position.z);

//create the backside of the label
const earthLabelReverse = earthLabel.clone();
earthLabelReverse.rotation.y += 3.141;
earthLabelReverse.position.set(earth.position.x, earth.position.y + 5, earth.position.z - 0.01);

//add labels to scene
scene.add(earthLabel);
scene.add(earthLabelReverse);

//Mars
const marsLabelGeometry = new THREE.PlaneGeometry(5, 3);
const marsLabelTexture = new THREE.TextureLoader().load('../Resources/Textures/marsLabelTexture.jpg');
const marsLabelMaterial = new THREE.MeshBasicMaterial({map: marsLabelTexture});
const marsLabel = new THREE.Mesh(marsLabelGeometry, marsLabelMaterial);
marsLabel.position.set(mars.position.x, mars.position.y + 5, mars.position.z);

//create the backside of the label
const marsLabelReverse = marsLabel.clone();
marsLabelReverse.rotation.y += 3.141;
marsLabelReverse.position.set(mars.position.x, mars.position.y + 5, mars.position.z - 0.01);

//add labels to scene
scene.add(marsLabel);
scene.add(marsLabelReverse);

//Psyche
const psycheLabelGeometry = new THREE.PlaneGeometry(5, 3);
const psycheLabelTexture = new THREE.TextureLoader().load('../Resources/Textures/psycheLabelTexture.jpg');
const psycheLabelMaterial = new THREE.MeshBasicMaterial({map: psycheLabelTexture});
const psycheLabel = new THREE.Mesh(psycheLabelGeometry, psycheLabelMaterial);
psycheLabel.position.set(psyche.position.x, psyche.position.y + 5, psyche.position.z);

//create the backside of the label
const psycheLabelReverse = psycheLabel.clone();
psycheLabelReverse.rotation.y += 3.141;
psycheLabelReverse.position.set(psyche.position.x, psyche.position.y + 5, psyche.position.z - 0.01);

//add labels to scene
scene.add(psycheLabel);
scene.add(psycheLabelReverse);

const spaceTexture = new THREE.TextureLoader().load('../Resources/Textures/spaceBackground.jpg');
//scene.background = spaceTexture;

//let sunIsChecked = true;

// sun.addEventListener('click', (event) => {
//     if(sunIsChecked){
//         scene.remove(gridHelper);
//         sunIsChecked = false;
//     }
//     else{
//         scene.add(gridHelper);
//         sunIsChecked = true;
//     }
// });

//--------------------------Planetary Event Listening-------------------------------

//Earth's facts, images, and variables
let earthIsClicked = false;
const earthFacts = ["The Psyche mission will begin by launching from our home planet Earth!",
                    "This is the Psyche spacecraft. It is an unmanned orbiting spacecraft",
                    "The current launch date is set for August 01, 2022"];
const earthImages = ["Resources/Images/earthFact1.jpeg",
                     "Resources/Images/earthFact2.jpeg",
                     "Resources/Images/earthFact3.jpeg"];

//Mars' facts, images, and variables
let marsIsClicked = false;
const marsFacts = ["The Psyche spacecraft will fly by Mars on its way to Psyche",
                   "The fly by will give the spacecraft the extra speed it needs for its journey",
                   "The fly by is expected to happen sometime in 2023"];
const marsImages = ["Resources/Images/marsFact1.jpeg",
                    "Resources/Images/marsFact2.jpeg",
                    "Resources/Images/marsFact3.jpeg"];

//handle the user clicking on the Earth Model
earth.addEventListener("click", (event) => {
    if(earthIsClicked){
        //executes the hideFactCard function and sets earth clicked to false
        hideFactCard();
    }
    else {
        //executes the showFactCard function, sets earth clicked to true, shows next fact
        earthIsClicked = true;
        showFactCard("Earth");
        showNextFact("Earth");
    }
});

//handle the user clicking on the Mars Model
mars.addEventListener("click", (event) => {
    if(marsIsClicked){
        //executes the hideFactCard function and sets earth clicked to false
        hideFactCard();
    }
    else {
        //executes the showFactCard function, sets earth clicked to true, shows next fact
        marsIsClicked = true;
        showFactCard("Mars");
        showNextFact("Mars");
    }
});

//hides the fact card showing the facts and resets all variables
function hideFactCard()
{
    factIndex = 2;
    document.getElementById('fact-card').innerText = '';
    earthIsClicked = false;
    marsIsClicked = false;
}

//occurs when the Earth model is clicked, shows the card containing the facts pertaining to Earth
//pass the name of the planet in the planetIdentifier parameter
function showFactCard(planetIdentifier)
{
    //clear fact card first if in use by another planet
    document.getElementById('fact-card').innerText = '';
    //create elements to add to upper-left div
    //create outer div and set attributes
    const outerCardDiv = document.createElement("div");
    outerCardDiv.setAttribute("class", "card");

    //create image and set attributes
    const factCardImage = document.createElement("img");
    //factCardImage.setAttribute("src",
    //    "https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500");
    factCardImage.setAttribute("class", "card-img-top");
    factCardImage.setAttribute("id", "card-img");

    //create card body where fact will display and set attributes
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.setAttribute("class", "card-body");

    //create card body text and add to card body div
    const cardBodyDivPar = document.createElement("p");
    cardBodyDivPar.setAttribute("class", "card-text");
    cardBodyDivPar.setAttribute("id", "fact-text");
    //const cardBodyText = document.createTextNode("The Psyche mission will begin by launching from our home planet Earth!");
    //cardBodyDivPar.appendChild(cardBodyText);
    cardBodyDiv.appendChild(cardBodyDivPar);

    //create fact card button div
    const cardButtonDiv = document.createElement("div");
    cardButtonDiv.setAttribute("class", "card-button-container");

    //create buttons and button text
    const cardCloseButton = document.createElement("button");
    const cardReadMoreButton = document.createElement("button");
    const cardCloseButtonText = document.createTextNode("Close");
    const cardReadMoreButtonText = document.createTextNode("Read More");
    cardCloseButton.setAttribute("class", "control-button");
    cardReadMoreButton.setAttribute("class", "control-button");

    //add text to buttons
    cardCloseButton.appendChild(cardCloseButtonText);
    cardReadMoreButton.appendChild(cardReadMoreButtonText);
    cardButtonDiv.appendChild(cardCloseButton);
    cardButtonDiv.appendChild(cardReadMoreButton);

    //append everything to outer div
    outerCardDiv.appendChild(factCardImage);
    outerCardDiv.appendChild(cardBodyDiv);
    outerCardDiv.appendChild(cardButtonDiv);

    //append to element in HTML
    const factCard = document.getElementById('fact-card');
    factCard.appendChild(outerCardDiv);

    //add EventListeners to buttons
    cardCloseButton.addEventListener("click", hideFactCard);
    cardReadMoreButton.addEventListener("click", function(){showNextFact(planetIdentifier)});
}

//used by showNextFact() to display next fact
let factIndex = 0;
let lastIdentifier = "";

//takes in a string to determine which planet's fact to display
function showNextFact(planetIdentifier){

    //increment factIndex and update lastIdentifier
    if (factIndex == 2){
        factIndex = 0;
    }
    else if (planetIdentifier != lastIdentifier)
    {
        console.log("different identifier, setting factIndex to 0");
        factIndex = 0;
        lastIdentifier = planetIdentifier;
    }
    else
    {
        factIndex++;
    }

    console.log("Updating " + planetIdentifier + " with factIndex: " + factIndex);
    //change behavior depending on identifier passed
    let factToDisplay;
    switch (planetIdentifier)
    {
        //display appropriate fact and image
        case "Earth":
            factToDisplay = document.createTextNode(earthFacts[factIndex]);
            document.getElementById("fact-text").innerHTML = "";
            document.getElementById("fact-text").appendChild(factToDisplay);
            document.getElementById("card-img").setAttribute("src", earthImages[factIndex]);
            break;
        case "Mars":
            factToDisplay = document.createTextNode(marsFacts[factIndex]);
            document.getElementById("fact-text").innerHTML = "";
            document.getElementById("fact-text").appendChild(factToDisplay);
            document.getElementById("card-img").setAttribute("src", marsImages[factIndex]);
            break;
        default:
            console.log("Error in showNextFact switch");
    }
}

//----------------------------------------------------------------------------

// const ambientLight = new THREE.AmbientLight(0xFFFFFF);
// camera.add(ambientLight);
// scene.add(ambientLight);

//const gridHelper = new THREE.GridHelper(400, 100);
//scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);


var earthOrbit = new THREE.Group();
earthOrbit.add(earth);
earthOrbit.add(moon);
earthOrbit.add(earthLabel);
earthOrbit.add(earthLabelReverse);
scene.add(earthOrbit);

var marsOrbit = new THREE.Group();
marsOrbit.add(mars);
marsOrbit.add(marsLabel);
marsOrbit.add(marsLabelReverse);
scene.add(marsOrbit)

var moonOrbit = new THREE.Group();
moonOrbit.add(moon);
scene.add(moonOrbit);

var psycheOrbit = new THREE.Group();
psycheOrbit.add(psyche);
psycheOrbit.add(psycheLabel);
psycheOrbit.add(psycheLabelReverse);
scene.add(psycheOrbit);

function animate(){
    renderer.setAnimationLoop(render)
}

function render() {
    requestAnimationFrame( animate );

    earth.rotation.y += 0.003;
    mars.rotation.y += 0.003;
    earthOrbit.rotation.y += 0.0005;
    marsOrbit.rotation.y += 0.0004;
    moonOrbit.rotation.y += 0.0005;
    psycheOrbit.rotation.y += 0.0002;
    moon.rotation.y += 0.003;
    psyche.rotation.y += 0.003;
    controls.update();

    interactionManager.update();

    handleController( controller );

    stats.update();

    renderer.render(scene, camera);
}
animate();

/*
//WebXR animation implementation
renderer.setAnimationLoop( function () {

    renderer.render(scene, camera);
    earth.rotation.y += 0.003;
    mars.rotation.y += 0.003;
    earthOrbit.rotation.y += 0.0005;
    marsOrbit.rotation.y += 0.0004;
    moonOrbit.rotation.y += 0.0005;
    psycheOrbit.rotation.y += 0.0002;
    moon.rotation.y += 0.003;
    psyche.rotation.y += 0.003;
    controls.update();
    interactionManager.update();

});
*/
