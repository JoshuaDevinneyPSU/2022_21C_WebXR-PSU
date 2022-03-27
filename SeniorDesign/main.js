import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { InteractionManager } from "three.interactive";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";

import './style.css'
import Stats from "three/examples/jsm/libs/stats.module";

import {ARButton} from "three/examples/jsm/webxr/ARButton";
import {MeshStandardMaterial, TextGeometry} from "three";
import {TubePainter} from "three/examples/jsm/misc/TubePainter";
import {createMaterial, createPlanet, createSTL} from "./helper-functions.js";
// const createMaterial = require("./helper-functions");
// const createPlanet = require("./helper-functions");


const scene = new THREE.Scene();
const scene2 = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//---------------------------- RAYCASTING SETUP--------------------------------------

//Initialize raycaster and cursor
const raycaster = new THREE.Raycaster();
const rayPointer = new THREE.Vector2();

//Add listener to check for mouse click, checkPlanetClick is the function that is executed, found in Planetary Event Listening ection
document.addEventListener('click', checkPlanetClick);

//-----------------------------------------------------------------------------------

camera.position.setZ(-10);
camera.position.setY(25);

const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, canvas: document.querySelector('#bg')});

renderer.autoClear = false;

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

window.addEventListener('resize', onWindowResize);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

renderer.render(scene, camera);

const au = 20;

const earthTexture = new THREE.TextureLoader().load('../Resources/Textures/earthTexture.jpg');
const normalTexture = new THREE.TextureLoader().load('../Resources/Maps/earthNormalMap.tif');

const earthMaterial = createMaterial('texture', earthTexture);
const earth = createPlanet(3, 32, 32, au, 1, 10, earthMaterial);
earth.userData.clickable = true;
earth.userData.name = 'Earth';
scene.add(earth);

const sunTexture = new THREE.TextureLoader().load('../Resources/Textures/sun.jpg');
const sunMaterial = createMaterial('texture-basic', sunTexture);
const sun = createPlanet(10, 32, 32, 0, 0, 0, sunMaterial);
scene.add(sun);

const marsTexture = new THREE.TextureLoader().load('../Resources/Textures/marsTexture.jpg');
const marsMaterial = createMaterial('texture', marsTexture);
const mars = createPlanet(3/2, 32, 32, -(au*1.5), -1, 0, marsMaterial);
mars.userData.clickable = true;
mars.userData.name = 'Mars';
scene.add(mars);

const moonTexture = new THREE.TextureLoader().load('../Resources/Textures/moonTexture.jpg');
const moonMaterial = createMaterial('texture', moonTexture);
const moon = createPlanet(3*.25, 32, 32, au+8, 0, 0, moonMaterial);
scene.add(moon);

const psycheOrbit = new THREE.Group();

const psycheTexture = new THREE.TextureLoader().load('../Resources/Textures/psycheTexture.jpg');
const psycheMaterial = createMaterial('texture', psycheTexture);
const psyche = createSTL('../Resources/Models/PsycheModel.stl', 0, 0, -2, psycheMaterial, scene);

const spaceCraft = createSTL('../Resources/Models/SpaceCraft.stl', 0, 0, 0, psycheMaterial, scene, 0.005, 0.005, 0.005);

//Create Label
const psycheLabelGeometry = new THREE.PlaneGeometry(5, 3);
const psycheLabelTexture = new THREE.TextureLoader().load('../Resources/Textures/psycheLabelTexture.jpg');
const psycheLabelMaterial = new THREE.MeshBasicMaterial({map: psycheLabelTexture});
const psycheLabel = new THREE.Mesh(psycheLabelGeometry, psycheLabelMaterial);

const loader = new STLLoader();
loader.load(
    '../Resources/Models/PsycheModel.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, psycheMaterial);
        mesh.position.setZ(-(au*2.5));
        mesh.userData.clickable = true;
        mesh.userData.name = 'Psyche';
        scene.add(mesh);

        psycheOrbit.add(mesh);

        psycheLabel.position.set(mesh.position.x, mesh.position.y + 5, mesh.position.z);
        //add label to scene
        scene.add(psycheLabel);
        psycheOrbit.add(psycheLabel);

        scene.add(psycheOrbit);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
   }
)

 loader.load(
     '../Resources/Models/SpaceCraft.stl',
     function (geometry) {
         const mesh = new THREE.Mesh(geometry, psycheMaterial);
         mesh.position.setZ(-(au*2.5));
         mesh.scale.set( .005, .005, .005 );
         scene.add(mesh);

         psycheOrbit.add(mesh);
     },
     (xhr) => {
         console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
     },
     (error) => {
         console.log(error);
     }
)

const cursor = new THREE.Vector3();

renderer.xr.setReferenceSpaceType('unbounded')

function onSelectStart() {

    this.userData.isSelecting = true;
    this.userData.skipFrames = 2;

}

function onSelectEnd() {

    this.userData.isSelecting = false;

}

let controller = renderer.xr.getController( 0 );
controller.addEventListener( 'selectstart', onSelectStart );
controller.addEventListener( 'selectend', onSelectEnd );
controller.userData.skipFrames = 0;
scene.add( controller );

function handleController( controller ) {

    const userData = controller.userData;

    cursor.set( 0, 0, - 0.2 ).applyMatrix4( controller.matrixWorld );

}

const stats = Stats();
document.body.appendChild(stats.dom);

const light = new THREE.PointLight( 0xF4E99B, 5, 150 );
scene.add( light );

//enable EventListeners for meshes
interactionManager.add(earth);
interactionManager.add(mars);
interactionManager.add(sun);

//--------------------------------------------LABELS-------------------------------------------------------

//Earth
const earthLabelGeometry = new THREE.PlaneGeometry(5, 3);
const earthLabelTexture = new THREE.TextureLoader().load('../Resources/Textures/earthLabelTexture.jpg');
const earthLabelMaterial = new THREE.MeshBasicMaterial({map: earthLabelTexture, side: THREE.DoubleSide});
const earthLabel = new THREE.Mesh(earthLabelGeometry, earthLabelMaterial);
earthLabel.position.set(earth.position.x, earth.position.y + 5, earth.position.z);

//add label to scene
scene.add(earthLabel);

//Mars
const marsLabelGeometry = new THREE.PlaneGeometry(5, 3);
const marsLabelTexture = new THREE.TextureLoader().load('../Resources/Textures/marsLabelTexture.jpg');
const marsLabelMaterial = new THREE.MeshBasicMaterial({map: marsLabelTexture});
const marsLabel = new THREE.Mesh(marsLabelGeometry, marsLabelMaterial);
marsLabel.position.set(mars.position.x, mars.position.y + 5, mars.position.z);

//add label to scene
scene.add(marsLabel);

//-----------------------------------------------------------------------------------------------------------

const spaceTexture = new THREE.TextureLoader().load('../Resources/Textures/spaceBackground.jpg');
scene.background = spaceTexture;

//--------------------------Planetary Event Listening-------------------------------

//Earth's facts, images, and variables
let earthIsClicked = false;
const earthFacts = ["The Psyche mission will begin by launching from our home planet Earth!",
                    "This is the Psyche spacecraft. It is an unmanned orbiting spacecraft.",
                    "The current launch date is set for August 01, 2022.",
                    "The Psyche spacecraft features two massive solar panels that total 800 square feet.",
                    "The Psyche spacecraft will relay information back to Earth using cutting-edge laser technology."];
const earthImages = ["Resources/Images/earthFact1.jpeg",
                     "Resources/Images/earthFact2.jpeg",
                     "Resources/Images/earthFact3.jpeg",
                     "Resources/Images/earthFact4.jpg",
                     "Resources/Images/earthFact5.jpg"];

//Mars' facts, images, and variables
let marsIsClicked = false;
const marsFacts = ["The Psyche spacecraft will fly by Mars on its way to Psyche.",
                   "The fly by will give the spacecraft the extra speed it needs for its journey.",
                   "The spacecraft will gain speed from Mars using its gravitational pull. This is called a 'gravity assist.'",
                   "The gravity assist will also save fuel, money, and time.",
                   "The fly by is expected to happen sometime in 2023."];
const marsImages = ["Resources/Images/marsFact1.jpeg",
                    "Resources/Images/marsFact2.jpeg",
                    "Resources/Images/marsFact3.jpeg",
                    "Resources/Images/marsFact4.jpg",
                    "Resources/Images/marsFact5.JPG"];

//Psyche's facts, images, and variables
let psycheIsClicked = false;
const psycheFacts = ["Psyche lies in the asteroid belt between Mars and Jupiter.",
                     "Psyche is a unique asteroid, rich in metal. Scientists believe that studying it will reveal secrets about the formation of planets.",
                     "The spacecraft is set to arrive at Psyche in 2026, where it will orbit for 21 months.",
                     "As the spacecraft orbits Psyche, it will map the surface and study its properties. Information will be relayed back to Earth for study.",
                     "The name 'Psyche' comes from the Greek goddess of the soul."];
const psycheImages = ["Resources/Images/psycheFact1.jpg",
                      "Resources/Images/psycheFact2.jpg",
                      "Resources/Images/psycheFact3.JPG",
                      "Resources/Images/psycheFact4.jpg",
                      "Resources/Images/psycheFact5.jpg"];

//-----Handle click function using raycasts
function checkPlanetClick(event){

    //get location of mouse and use it to set the raycast
    //extra math is to normalize coordinates to user's screen
    rayPointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(rayPointer, camera);

    //get array of all objects that raycast intersects
    const intersectedObjects = raycaster.intersectObjects( scene.children );

    //if valid planet was clicked, execute
    if(intersectedObjects.length > 0 && intersectedObjects[0].object.userData.clickable)
    {
        const clickedPlanet = intersectedObjects[0];
        console.log(clickedPlanet);

        //Earth Case
        if (clickedPlanet.object.userData.name == 'Earth'){
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
        }
        //Mars Case
        else if(clickedPlanet.object.userData.name == 'Mars'){
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
        }
        //Psyche Case
        else if (clickedPlanet.object.userData.name == 'Psyche') {
            if(psycheIsClicked){
                //executes the hideFactCard function and sets earth clicked to false
                hideFactCard();
            }
            else {
                //executes the showFactCard function, sets earth clicked to true, shows next fact
                psycheIsClicked = true;
                showFactCard("Psyche");
                showNextFact("Psyche");
            }
        }
    }

}

//hides the fact card showing the facts and resets all variables
function hideFactCard()
{
    factIndex = 4;
    document.getElementById('fact-card').innerText = '';
    earthIsClicked = false;
    marsIsClicked = false;
    psycheIsClicked = false;
}

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
    if (factIndex == 4){
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
        case "Psyche":
            factToDisplay = document.createTextNode(psycheFacts[factIndex]);
            document.getElementById("fact-text").innerHTML = "";
            document.getElementById("fact-text").appendChild(factToDisplay);
            document.getElementById("card-img").setAttribute("src", psycheImages[factIndex]);
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

const earthOrbit = new THREE.Group();
earthOrbit.add(earth);
earthOrbit.add(moon);
earthOrbit.add(earthLabel)
scene.add(earthOrbit);

const marsOrbit = new THREE.Group();
marsOrbit.add(mars);
marsOrbit.add(marsLabel);
scene.add(marsOrbit)

const moonOrbit = new THREE.Group();
moonOrbit.add(moon);
scene.add(moonOrbit);

//psycheOrbit.add(psycheLabel);

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
    earthLabel.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
    marsLabel.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
    psycheLabel.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
    controls.update();
    handleController( controller );

    interactionManager.update();

    stats.update();

    renderer.render(scene, camera);
    renderer.autoClear = false;
    renderer.render(scene2, renderer.xr.getCamera())
}
animate();

/*
//WebXR animation implementation
renderer.setAnimationLoop( function () {

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

    renderer.render(scene, camera);
});
*/
