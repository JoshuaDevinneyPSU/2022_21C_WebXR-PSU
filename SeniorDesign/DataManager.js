import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";
import './style.css'
import {ARButton} from "three/examples/jsm/webxr/ARButton";
import {createMaterial, createPlanet, createSTL} from "./helper-functions.js";


import Planet from "./Planet.js";

const scene = new THREE.Scene();
const scene2 = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//---------------------------- RAYCASTING SETUP--------------------------------------

//Initialize raycaster and cursor
const raycaster = new THREE.Raycaster();
const rayPointer = new THREE.Vector2();

//Add listener to check for mouse click, checkPlanetClick is the function that is executed, found in Planetary Event Listening action
document.body.addEventListener('click', checkPlanetClick);

//stop raycasts from activating planets behind HTML overlays
function disallowRaycast(event){
    event.stopPropagation();
}
//-----------------------------------------------------------------------------------

camera.position.setZ(-2);
camera.position.setY(0);

const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, canvas: document.querySelector('#bg')});

renderer.autoClear = false;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//Enable WebXR support-------------------------------------
function setupXR(){
    renderer.xr.enabled = true;

    let controller = renderer.xr.getController(0);

    scene.add(controller);

    renderer.xr.setReferenceSpaceType('viewer')
    //second parameter ensures fact card appears in AR view
    let sceneARButton = ARButton.createButton( renderer, {optionalFeatures: ["dom-overlay"], domOverlay: {root: document.getElementById("ar-overlay")}});

    //Activate background toggle button when AR mode is entered
    sceneARButton.addEventListener("click", showBackgroundToggle);

    document.body.appendChild( sceneARButton );

    renderer.setAnimationLoop(renderScene);
}
setupXR();

//--------------------------------------------------------

window.addEventListener('resize', onWindowResize);

//execute when the user resizes the window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

renderer.render(scene, camera);

const au = .7;

//planet list
let planets = new Map();

const earthTexture = new THREE.TextureLoader().load('../Resources/Textures/earthTexture.jpg');
const normalTexture = new THREE.TextureLoader().load('../Resources/Maps/earthNormalMap.tif');

const earthMaterial = createMaterial('texture', earthTexture);

planets.set("Earth", new Planet(.1, 32, 32, au, 0, .1, earthMaterial));
scene.add(planets.get("Earth").getMesh());
planets.get("Earth").getMesh().userData.clickable = true;
planets.get("Earth").getMesh().userData.name = "Earth";

const sunTexture = new THREE.TextureLoader().load('../Resources/Textures/sun.jpg');
const sunMaterial = createMaterial('texture-basic', sunTexture);

planets.set("Sun", new Planet(.2, 32, 32, 0, 0, 0, sunMaterial));
planets.get("Sun").getMesh().userData.clickable = false;
planets.get("Sun").getMesh().userData.name = "Sun";
scene.add(planets.get("Sun").getMesh());

const marsTexture = new THREE.TextureLoader().load('../Resources/Textures/marsTexture.jpg');
const marsMaterial = createMaterial('texture', marsTexture);

planets.set("Mars", new Planet(.05, 32, 32, -(au*1.5), 0, 0, marsMaterial));
planets.get("Mars").getMesh().userData.clickable = true;
planets.get("Mars").getMesh().userData.name = "Mars";
scene.add(planets.get("Mars").getMesh());

const moonTexture = new THREE.TextureLoader().load('../Resources/Textures/moonTexture.jpg');
const moonMaterial = createMaterial('texture', moonTexture);

planets.set("Moon", new Planet(.1*.25, 32, 32, au+.15, 0, 0, moonMaterial));
scene.add(planets.get("Moon").getMesh());

const psycheOrbit = new THREE.Group();

const psycheTexture = new THREE.TextureLoader().load('../Resources/Textures/psycheTexture.jpg');
const psycheMaterial = createMaterial('texture', psycheTexture);

//Create Label for Psyche
const psycheLabelGeometry = new THREE.PlaneGeometry(.4, .2);
const psycheLabelTexture = new THREE.TextureLoader().load('../Resources/Textures/psycheLabelTexture.jpg');
const psycheLabelMaterial = new THREE.MeshBasicMaterial({map: psycheLabelTexture});
const psycheLabel = new THREE.Mesh(psycheLabelGeometry, psycheLabelMaterial);
psycheLabel.userData.clickable = true;
psycheLabel.userData.name = 'Psyche';
planets.set("Psyche", new Planet(0, 0, 0, 0, 0, 0, psycheLabel));

const loader = new STLLoader();
loader.load(
    '../Resources/Models/PsycheModel.stl',
    function (geometry) {
        const psycheMesh = new THREE.Mesh(geometry, psycheMaterial);
        psycheMesh.position.setZ(-(au*1.5));
        psycheMesh.userData.clickable = true;
        psycheMesh.userData.name = 'Psyche';

        scene.add(psycheMesh);

        psycheMesh.scale.set(.04, .04, .04)

        psycheOrbit.add(psycheMesh);

        psycheLabel.position.set(psycheMesh.position.x, psycheMesh.position.y + .4, psycheMesh.position.z);
      
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

const spaceCraftMaterial = new THREE.MeshStandardMaterial({
    color: 0x203354,
    metalness: .5
});

//Create Label
const spacecraftLabelGeometry = new THREE.PlaneGeometry(.4, .2);
const spacecraftLabelTexture = new THREE.TextureLoader().load('../Resources/Textures/spacecraftLabelTexture.jpg');
const spacecraftLabelMaterial = new THREE.MeshBasicMaterial({map: spacecraftLabelTexture});
const spacecraftLabel = new THREE.Mesh(spacecraftLabelGeometry, spacecraftLabelMaterial);
spacecraftLabel.userData.clickable = true;
spacecraftLabel.userData.name = 'Spacecraft';
planets.set("Spacecraft", new Planet(0, 0, 0, 0, 0, 0, spacecraftLabel));

let spacecraftMesh;

 loader.load(
     '../Resources/Models/SpaceCraft.stl',
     function (geometry) {
         spacecraftMesh = new THREE.Mesh(geometry, spaceCraftMaterial);
         spacecraftMesh.position.setZ(-(au*1));
         spacecraftMesh.position.setX(.8);
         spacecraftMesh.rotateY(48)
         spacecraftMesh.scale.set( .0004, .0004, .0004 );
         spacecraftMesh.userData.clickable = true;
         spacecraftMesh.userData.name = "Spacecraft"

         scene.add(spacecraftMesh);

         spacecraftLabel.position.set(spacecraftMesh.position.x, spacecraftMesh.position.y + .4, spacecraftMesh.position.z);

         //add label to scene
         scene.add(spacecraftLabel);

         psycheOrbit.add(spacecraftLabel);

         psycheOrbit.add(spacecraftMesh);
     },
     (xhr) => {
         console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
     },
     (error) => {
         console.log(error);
     }
)

planets.set("Spacecraft", new Planet(0, 0, 0, 0, 0, 0, spacecraftMesh));

const light = new THREE.PointLight( 0xF4E99B, 5, 150 );
scene.add( light );

//--------------------------------------------LABELS-------------------------------------------------------

//Earth
const earthLabelGeometry = new THREE.PlaneGeometry(.4, .2);
const earthLabelTexture = new THREE.TextureLoader().load('../Resources/Textures/earthLabelTexture.jpg');
const earthLabelMaterial = new THREE.MeshBasicMaterial({map: earthLabelTexture, side: THREE.DoubleSide});
const earthLabel = new THREE.Mesh(earthLabelGeometry, earthLabelMaterial);
earthLabel.position.set(planets.get("Earth").getMesh().position.x, planets.get("Earth").getMesh().position.y + .3, planets.get("Earth").getMesh().position.z);
earthLabel.userData.clickable = true;
earthLabel.userData.name = 'Earth';

//add label to scene
scene.add(earthLabel);

//Mars
const marsLabelGeometry = new THREE.PlaneGeometry(.4, .2);
const marsLabelTexture = new THREE.TextureLoader().load('../Resources/Textures/marsLabelTexture.jpg');
const marsLabelMaterial = new THREE.MeshBasicMaterial({map: marsLabelTexture});
const marsLabel = new THREE.Mesh(marsLabelGeometry, marsLabelMaterial);
marsLabel.position.set(planets.get("Mars").getMesh().position.x, planets.get("Mars").getMesh().position.y + .3, planets.get("Mars").getMesh().position.z);
marsLabel.userData.clickable = true;
marsLabel.userData.name = 'Mars';

//add label to scene
scene.add(marsLabel);

//-----------------------------------------------------------------------------------------------------------

const spaceTexture = new THREE.TextureLoader().load('../Resources/Textures/spaceBackground.jpg');
scene.background = spaceTexture;

//--------------------------Planetary Event Listening-------------------------------

//Earth's facts, images, and variables
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

planets.get("Earth").initializeFactCards(earthFacts, earthImages);

//Mars' facts, images, and variables
const marsFacts = ["The Psyche spacecraft will fly by Mars on its way to Psyche.",
                   "The fly by will give the spacecraft the extra speed it needs for its journey.",
                   "The spacecraft will gain speed from Mars using its gravitational pull. This is called a 'gravity assist.'",
                   "The gravity assist will also save fuel, money, and time.",
                   "The fly by is expected to happen sometime in 2023."];
const marsImages = ["Resources/Images/marsFact1.jpeg",
                    "Resources/Images/marsFact2.jpeg",
                    "Resources/Images/marsFact3.jpg",
                    "Resources/Images/marsFact4.jpg",
                    "Resources/Images/marsFact5.JPG"];

planets.get("Mars").initializeFactCards(marsFacts, marsImages);

//Psyche's facts, images, and variables
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

planets.get("Psyche").initializeFactCards(psycheFacts, psycheImages);

const spacecraftFacts = ["The spacecraft will launch from the Kennedy Space Center, Florida, in 2022.",
                         "The body of the spacecraft is slightly bigger than a Smart Car.",
                         "The spacecraft will use solar electric propulsion to travel.",
                         "The spacecraft will test a sophisticated new form of laser communication.",
                         "Among the spacecraft's tools is a gamma ray and neutron spectrometer. This tool will enable the spacecraft to measure Psyche's elemental composition."];
const spacecraftImages = ["Resources/Images/spacecraftFact1.JPG",
                          "Resources/Images/spacecraftFact2.JPG",
                          "Resources/Images/spacecraftFact3.JPG",
                          "Resources/Images/spacecraftFact4.JPG",
                          "Resources/Images/spacecraftFact5.JPG"];

planets.get("Spacecraft").initializeFactCards(spacecraftFacts, spacecraftImages);

//-----Handle click function using raycasts
function checkPlanetClick(event){

    //get location of mouse and use it to set the raycast
    //extra math is to normalize coordinates to user's screen
    rayPointer.set((event.clientX / window.innerWidth) * 2 - 1, -((event.clientY) / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(rayPointer, camera);


    //get array of all objects that raycast intersects
    const intersectedObjects = raycaster.intersectObjects( scene.children );

    //if valid planet was clicked, execute
    if(intersectedObjects.length > 0 && intersectedObjects[0].object.userData.clickable)
    {
        const clickedPlanet = intersectedObjects[0];
        const clickedPlanetName = clickedPlanet.object.userData.name;

        if(clickedPlanetName === ''){
            return;
        }

        console.log(clickedPlanet);

        if(planets.get(clickedPlanetName).getClicked()){
            hideFactCard(clickedPlanetName);
        }
        else{
            showFactCard(clickedPlanetName);
            showNextFact(clickedPlanetName);
        }
    }
}

//hides the fact card showing the facts and resets all variables
function hideBG()
{
    scene.background = null;
}

function showBG()
{
    scene.background = spaceTexture;
}

//keep track of state of background
let backgroundOn = true;

//change background
function toggleBackground(){
    if(backgroundOn) {
        //update var and show background
        backgroundOn = false;
        hideBG();

        //update button text
        document.getElementById("toggle-bg-button").innerText = "Set Background: Off";
    }
    else {
        //update var and hide background
        backgroundOn = true;
        showBG();

        //update button text
        document.getElementById("toggle-bg-button").innerText = "Set Background: On";
    }
}

///hides the fact card showing the facts and resets all variables
function hideFactCard(planetName)
{
    document.getElementById('fact-card').innerText = '';

    if(planetName != null) {
        planets.get(planetName).setClicked();
        planets.get(planetName).resetFactCard();
    }
}

function hideInfoPage()
{
    document.getElementById('info-page').innerText = '';
}

//pass the name of the planet in the planetIdentifier parameter
function showFactCard(planetIdentifier)
{
    hideInfoPage();
    //clear fact card first if in use by another planet
    document.getElementById('fact-card').innerText = '';
    //create elements to add to upper-left div
    //create outer div and set attributes
    const outerCardDiv = document.createElement("div");
    outerCardDiv.setAttribute("class", "card");
    outerCardDiv.addEventListener("click", disallowRaycast);

    //create image and set attributes
    const factCardImage = document.createElement("img");
    factCardImage.setAttribute("class", "card-img-top");
    factCardImage.setAttribute("id", "card-img");

    //create card body where fact will display and set attributes
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.setAttribute("class", "card-body");

    //create card body text and add to card body div
    const cardBodyDivPar = document.createElement("p");
    cardBodyDivPar.setAttribute("class", "card-text");
    cardBodyDivPar.setAttribute("id", "fact-text");
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

function showDisclaimerPage()
{
    hideFactCard();
    //clear fact card first if in use by another planet
    document.getElementById('info-page').innerText = '';

    const outerPageDiv = document.createElement("div");
    outerPageDiv.setAttribute("class", "card");
    outerPageDiv.addEventListener("click", disallowRaycast);

    //create card body where fact will display and set attributes
    const disclaimerBodyDiv = document.createElement("div");
    disclaimerBodyDiv.setAttribute("class", "info-body");

    const disclaimerText = document.createElement("p");
    disclaimerText.setAttribute("id", "disclaimer-page-text");
    disclaimerText.innerText = "This work was created in partial fulfillment of Pennsylvania State University, The Behrend College Capstone Course “SWENG 481/CMPSC 485″. The work is a result of the Psyche Student Collaborations component of NASA’s Psyche Mission (https://psyche.asu.edu). “Psyche: A Journey to a Metal World” [Contract number NNM16AA09C] is part of the NASA Discovery Program mission to solar system targets. Trade names and trademarks of ASU and NASA are used in this work for identification only. Their usage does not constitute an official endorsement, either expressed or implied, by Arizona State University or National Aeronautics and Space Administration. The content is solely the responsibility of the authors and does not necessarily represent the official views of ASU or NASA.";
    disclaimerBodyDiv.appendChild(disclaimerText);

    //create fact card button div
    const cardButtonDiv = document.createElement("div");
    cardButtonDiv.setAttribute("class", "card-button-container");

    //create buttons and button text
    const cardCloseButton = document.createElement("button");
    const cardCloseButtonText = document.createTextNode("Close");
    cardCloseButton.setAttribute("class", "control-button");
    const moreInfoButton = document.createElement("button");
    const moreInfoButtonText = document.createTextNode("Info");
    moreInfoButton.setAttribute("class", "control-button");

    //add text to buttons
    moreInfoButton.appendChild(moreInfoButtonText);
    cardCloseButton.appendChild(cardCloseButtonText);
    cardButtonDiv.appendChild(moreInfoButton);
    cardButtonDiv.appendChild(cardCloseButton);

    //append everything to outer div
    outerPageDiv.appendChild(disclaimerBodyDiv);
    outerPageDiv.appendChild(cardButtonDiv);

    //append to element in HTML
    const infoPage = document.getElementById('info-page');
    infoPage.appendChild(outerPageDiv);

    //add EventListeners to buttons
    cardCloseButton.addEventListener("click", hideInfoPage);
    moreInfoButton.addEventListener("click", showInfoPage);
}

//used by showNextFact() to display next fact
let lastIdentifier = "";

//takes in a string to determine which planet's fact to display
function showNextFact(planetName){

    if (planetName !== lastIdentifier) {
        console.log("different identifier, setting factIndex to 0");
        if(lastIdentifier !== ''){
            planets.get(lastIdentifier).resetFactCard();
        }

        lastIdentifier = planetName;
    }

    //change behavior depending on identifier passed
    let factToDisplay;

    factToDisplay = document.createTextNode(planets.get(planetName).getFact());
    document.getElementById("fact-text").innerHTML = "";
    document.getElementById("fact-text").appendChild(factToDisplay);
    document.getElementById("card-img").setAttribute("src", planets.get(planetName).getFactImage());

    planets.get(planetName).updateFact();
}

function showInfoPage()
{
    hideFactCard();
    //clear fact card first if in use by another planet
    document.getElementById('info-page').innerText = '';

    const outerPageDiv = document.createElement("div");
    outerPageDiv.setAttribute("class", "card");
    outerPageDiv.addEventListener("click", disallowRaycast);

    //create card body where fact will display and set attributes
    const infoBodyDiv = document.createElement("div");
    infoBodyDiv.setAttribute("class", "info-body");

    const nameText = document.createElement("p");
    nameText.setAttribute("id", "info-page-text");
    nameText.innerText = "Designers: Joshua Devinney, Donovan Myers, Alexander Reams, David Yakupkovic";
    infoBodyDiv.appendChild(nameText);

    const sponsorText = document.createElement("p");
    sponsorText.setAttribute("id", "info-page-text");
    sponsorText.innerText = "Sponsored by: Arizona State University and NASA";
    infoBodyDiv.appendChild(sponsorText);

    const linkText = document.createElement("a");
    linkText.setAttribute("id", "info-page-text");
    linkText.innerText = "https://psyche.asu.edu";
    linkText.href = "https://psyche.asu.edu";
    infoBodyDiv.appendChild(linkText);

    //create fact card button div
    const cardButtonDiv = document.createElement("div");
    cardButtonDiv.setAttribute("class", "card-button-container");


    //create buttons and button text
    const cardCloseButton = document.createElement("button");
    const cardCloseButtonText = document.createTextNode("Close");
    cardCloseButton.setAttribute("class", "control-button");
    const disclaimerButton = document.createElement("button");
    const disclaimerButtonText = document.createTextNode("Disclaimer");
    disclaimerButton.setAttribute("class", "control-button");

    //add text to buttons
    disclaimerButton.appendChild(disclaimerButtonText);
    cardCloseButton.appendChild(cardCloseButtonText);
    cardButtonDiv.appendChild(disclaimerButton);
    cardButtonDiv.appendChild(cardCloseButton);

    //append everything to outer div
    outerPageDiv.appendChild(infoBodyDiv);
    outerPageDiv.appendChild(cardButtonDiv);

    //append to element in HTML
    const infoPage = document.getElementById('info-page');
    infoPage.appendChild(outerPageDiv);

    //add EventListeners to buttons
    cardCloseButton.addEventListener("click", hideInfoPage);
    disclaimerButton.addEventListener("click", showDisclaimerPage);
}

//Show the toggle background button in AR mode
function showBackgroundToggle(){

    //create space for text
    const toggleBG = document.createElement("div");
    toggleBG.setAttribute("id", "toggle-bg");

    //create text
    const toggleBGButton = document.createElement("button");
    toggleBGButton.setAttribute("id", "toggle-bg-button");
    toggleBGButton.innerText = "Set Background: On";
    toggleBGButton.addEventListener("click", toggleBackground);

    //add background toggle to text space
    toggleBG.appendChild(toggleBGButton);

    const overlayContainer = document.getElementById("overlay-container");
    overlayContainer.insertBefore(toggleBG, overlayContainer.firstChild);
}

//Create overlaying elements
function showOverlays()
{
    //----------USER PROMPT----------
    //create space for text
    const prompt = document.createElement("div");
    prompt.setAttribute("id", "prompt");

    //create text
    const promptText = document.createElement("p");
    promptText.setAttribute("id", "prompt-text");
    promptText.innerText = "Click on Earth, Mars,\nor Psyche for more info!";

    //add text to text space
    prompt.appendChild(promptText);

    //----------NASA.GOV TEXT----------
    //create space for text
    const NASAprompt = document.createElement("div");
    NASAprompt.setAttribute("id", "NASA-prompt");

    //create text
    const NASApromptText = document.createElement("p");
    NASApromptText.setAttribute("id", "NASA-prompt-text");
    NASApromptText.innerText = "www.nasa.gov";

    //add text to text space
    NASAprompt.appendChild(NASApromptText);

    //-----MORE INFO BUTTON-------
    //create space for text
    const infoBtn = document.createElement("div");
    infoBtn.setAttribute("id", "info");

    //create text
    const infoButton = document.createElement("button");
    infoButton.setAttribute("id", "info-button");
    infoButton.innerText = "More Info";
    infoButton.addEventListener("click", showInfoPage);

    //add background toggle to text space
    infoBtn.appendChild(infoButton);

    //----------MASTER DIV FOR MISC OVERLAYS----------
    const overlayContainer = document.createElement("div");
    overlayContainer.setAttribute("id", "overlay-container");
    overlayContainer.appendChild(infoBtn);
    overlayContainer.appendChild(prompt);

    //Stop raycasts form poking through
    overlayContainer.addEventListener("click", disallowRaycast);

    const copyrightContainer = document.createElement("div");
    copyrightContainer.setAttribute("id", "copyright-overlay");
    copyrightContainer.appendChild(NASAprompt);
    //add prompt to scene
    document.getElementById("ar-overlay").appendChild(overlayContainer);
    document.getElementById("ar-overlay").appendChild(copyrightContainer);
}

const ambientLight = new THREE.AmbientLight(0xFFFDD0, 0.5);
camera.add(ambientLight);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

const earthOrbit = new THREE.Group();
earthOrbit.add(planets.get("Earth").getMesh());
earthOrbit.add(planets.get("Earth").getMesh());
earthOrbit.add(earthLabel)
scene.add(earthOrbit);

const marsOrbit = new THREE.Group();
marsOrbit.add(planets.get("Mars").getMesh());
marsOrbit.add(marsLabel);
scene.add(marsOrbit)

const moonOrbit = new THREE.Group();
moonOrbit.add(planets.get("Moon").getMesh());
scene.add(moonOrbit);

const cameraHolder = new THREE.Group();
cameraHolder.add(camera);
cameraHolder.position.set(0, 0, 0);
scene.add(cameraHolder);

function animate(){
    renderer.setAnimationLoop(renderScene)
}

//Updates the positions of all objects and renders
function updatePositions()
{
    planets.get("Earth").getMesh().rotation.y += 0.006;
    planets.get("Mars").getMesh().rotation.y += 0.006;
    earthOrbit.rotation.y += 0.0005;
    marsOrbit.rotation.y += 0.0004;
    moonOrbit.rotation.y += 0.0005;
    psycheOrbit.rotation.y += 0.0002;
    planets.get("Mars").getMesh().rotation.y += 0.006;
    earthLabel.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
    marsLabel.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
    psycheLabel.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
    spacecraftLabel.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));

    renderer.render(scene, camera);
    renderer.autoClear = false;
}

function renderScene() {
    updatePositions();
    controls.update();
}

showOverlays();
animate();
