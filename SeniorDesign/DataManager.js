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

//Add listener to check for mouse click, checkPlanetClick is the function that is executed, found in Planetary Event Listening ection
document.addEventListener('click', checkPlanetClick);

//-----------------------------------------------------------------------------------
scene.position.set(0, -20, 40);

camera.position.setZ(-5);
camera.position.setY(5);


const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, canvas: document.querySelector('#bg')});

renderer.autoClear = false;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);


//Enable WebXR support-------------------------------------
function setupXR(){
    renderer.xr.enabled = true;

    let controller = renderer.xr.getController(0);

    scene.add(controller);

    renderer.xr.setReferenceSpaceType('local')
    //second parameter ensures fact card appears in AR view
    let sceneARButton = ARButton.createButton( renderer, {optionalFeatures: ["dom-overlay"], domOverlay: {root: document.getElementById("ar-overlay")}});
    console.log("Yo" + sceneARButton.innerText);

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

const au = .01;

//planet list
let planets = [];

const earthTexture = new THREE.TextureLoader().load('../Resources/Textures/earthTexture.jpg');
const normalTexture = new THREE.TextureLoader().load('../Resources/Maps/earthNormalMap.tif');

const earthMaterial = createMaterial('texture', earthTexture);

planets[planets.length] = new Planet(.1, 32, 32, au, 0, 10, earthMaterial);
scene.add(planets[planets.length-1].getMesh());
planets[planets.length-1].getMesh().userData.clickable = true;
planets[planets.length-1].getMesh().userData.name = 'Earth';

const sunTexture = new THREE.TextureLoader().load('../Resources/Textures/sun.jpg');
const sunMaterial = createMaterial('texture-basic', sunTexture);
planets[planets.length] = new Planet(.2, 32, 32, 0, 0, 0, sunMaterial);
planets[planets.length-1].getMesh().userData.clickable = true;
planets[planets.length-1].getMesh().userData.name = 'Sun';
scene.add(planets[planets.length-1].getMesh());

const marsTexture = new THREE.TextureLoader().load('../Resources/Textures/marsTexture.jpg');
const marsMaterial = createMaterial('texture', marsTexture);

planets[planets.length] = new Planet(.05, 32, 32, -(au*1.5), 0, 0, marsMaterial);
scene.add(planets[planets.length-1].getMesh());
planets[planets.length-1].getMesh().userData.clickable = true;
planets[planets.length-1].getMesh().userData.name = 'Mars';

const moonTexture = new THREE.TextureLoader().load('../Resources/Textures/moonTexture.jpg');
const moonMaterial = createMaterial('texture', moonTexture);
planets[planets.length] = new Planet(.1*.25, 32, 32, au+8, 0, 0, moonMaterial);
scene.add(planets[planets.length-1].getMesh());

const psycheOrbit = new THREE.Group();

const psycheTexture = new THREE.TextureLoader().load('../Resources/Textures/psycheTexture.jpg');
const psycheMaterial = createMaterial('texture', psycheTexture);
//const psyche = createSTL('../Resources/Models/PsycheModel.stl', 0, 0, -2, psycheMaterial, scene);

//const spaceCraft = createSTL('../Resources/Models/SpaceCraft.stl', 0, 0, 0, psycheMaterial, scene, 0.005, 0.005, 0.005);

//Create Label
const psycheLabelGeometry = new THREE.PlaneGeometry(5, 3);
const psycheLabelTexture = new THREE.TextureLoader().load('../Resources/Textures/psycheLabelTexture.jpg');
const psycheLabelMaterial = new THREE.MeshBasicMaterial({map: psycheLabelTexture});
const psycheLabel = new THREE.Mesh(psycheLabelGeometry, psycheLabelMaterial);
psycheLabel.userData.clickable = true;
psycheLabel.userData.name = 'Psyche';

const loader = new STLLoader();
loader.load(
    '../Resources/Models/PsycheModel.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, psycheMaterial);
        mesh.position.setZ(-(au*2));
        mesh.userData.clickable = true;
        mesh.userData.name = 'Psyche';
        scene.add(mesh);

        mesh.scale.set(.1, .1, .1)

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

const spaceCraftMaterial = new THREE.MeshStandardMaterial({
    color: 0x203354,
    //metalness: .5
});

//todo what exactly is this "mesh" variable doing?
 loader.load(
     '../Resources/Models/SpaceCraft.stl',
     function (geometry) {
         const mesh = new THREE.Mesh(geometry, spaceCraftMaterial);
         mesh.position.setZ(-(au*1.5));
         mesh.position.setX(20);
         mesh.rotateY(48)
         mesh.scale.set( .03, .03, .03 );
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

const light = new THREE.PointLight( 0xF4E99B, 5, 150 );
scene.add( light );

//--------------------------------------------LABELS-------------------------------------------------------

//todo add function to take care of creation of labels

//Earth
const earthLabelGeometry = new THREE.PlaneGeometry(5, 3);
const earthLabelTexture = new THREE.TextureLoader().load('../Resources/Textures/earthLabelTexture.jpg');
const earthLabelMaterial = new THREE.MeshBasicMaterial({map: earthLabelTexture, side: THREE.DoubleSide});
const earthLabel = new THREE.Mesh(earthLabelGeometry, earthLabelMaterial);
earthLabel.position.set(planets[0].getMesh().position.x, planets[0].getMesh().position.y + 8, planets[0].getMesh().position.z);
earthLabel.userData.clickable = true;
earthLabel.userData.name = 'Earth';

//add label to scene
scene.add(earthLabel);

//Mars
const marsLabelGeometry = new THREE.PlaneGeometry(5, 3);
const marsLabelTexture = new THREE.TextureLoader().load('../Resources/Textures/marsLabelTexture.jpg');
const marsLabelMaterial = new THREE.MeshBasicMaterial({map: marsLabelTexture});
const marsLabel = new THREE.Mesh(marsLabelGeometry, marsLabelMaterial);
marsLabel.position.set(planets[2].getMesh().position.x, planets[2].getMesh().position.y + 6, planets[2].getMesh().position.z);
marsLabel.userData.clickable = true;
marsLabel.userData.name = 'Mars';

//add label to scene
scene.add(marsLabel);

//-----------------------------------------------------------------------------------------------------------

const spaceTexture = new THREE.TextureLoader().load('../Resources/Textures/spaceBackground.jpg');
scene.background = spaceTexture;

//--------------------------Planetary Event Listening-------------------------------

//todo generalize isClicked variables into list/dictionary/class to pair with facts and enum of when the fact takes place?
//todo combine facts with images, facts and the images with the planets and give it a type from the enum it belongs to...
// done with constructor taking string for fact, url/file link for image and the enum type it has?

//Earth's facts, images, and variables
let sunIsClicked = false;
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
                    "Resources/Images/marsFact3.jpg",
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
        document.getElementById("toggle-bg-button").innerText = "Background: Off";
    }
    else {
        //update var and hide background
        backgroundOn = true;
        showBG();

        //update button text
        document.getElementById("toggle-bg-button").innerText = "Background: On";
    }
}

///hides the fact card showing the facts and resets all variables
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

//used by showNextFact() to display next fact
let factIndex = 0;
let lastIdentifier = "";

//todo this entire function can be redone, specifically the switch statement to be more general.  Also, what does that else if do?

//takes in a string to determine which planet's fact to display
function showNextFact(planetIdentifier){

    //todo remove hardcoded factIndex value, can be generalized with a list of sorts

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

    //-----TOGGLE BACKGROUND BUTTON-------

    //create space for text
    const toggleBG = document.createElement("div");
    toggleBG.setAttribute("id", "toggle-bg");

    //create text
    const toggleBGButton = document.createElement("button");
    toggleBGButton.setAttribute("id", "toggle-bg-button");
    toggleBGButton.innerText = "Background: On";
    toggleBGButton.addEventListener("click", toggleBackground);

    //add background toggle to text space
    toggleBG.appendChild(toggleBGButton);

    //----------MASTER DIV FOR MISC OVERLAYS----------
    const overlayContainer = document.createElement("div");
    overlayContainer.setAttribute("id", "overlay-container");
    overlayContainer.appendChild(toggleBG);
    overlayContainer.appendChild(prompt);

    //add prompt to scene
    document.getElementById("ar-overlay").appendChild(overlayContainer);
}

const ambientLight = new THREE.AmbientLight(0xFFFDD0, 0.5);
camera.add(ambientLight);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

const earthOrbit = new THREE.Group();
earthOrbit.add(planets[0].getMesh());
earthOrbit.add(planets[3].getMesh());
earthOrbit.add(earthLabel)
scene.add(earthOrbit);

const marsOrbit = new THREE.Group();
marsOrbit.add(planets[2].getMesh());
marsOrbit.add(marsLabel);
scene.add(marsOrbit)

const moonOrbit = new THREE.Group();
moonOrbit.add(planets[3].getMesh());
scene.add(moonOrbit);

const cameraHolder = new THREE.Group();
cameraHolder.add(camera);
cameraHolder.position.set(0, 1, 0);
scene.add(cameraHolder);

function animate(){
    renderer.setAnimationLoop(renderScene)
}

//Updates the positions of all objects and renders
function updatePositions()
{
    planets[0].getMesh().rotation.y += 0.006;
    planets[2].getMesh().rotation.y += 0.006;
    earthOrbit.rotation.y += 0.0005;
    marsOrbit.rotation.y += 0.0004;
    moonOrbit.rotation.y += 0.0005;
    psycheOrbit.rotation.y += 0.0002;
    planets[3].getMesh().rotation.y += 0.006;
    earthLabel.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
    marsLabel.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
    psycheLabel.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));

    renderer.render(scene, camera);
    renderer.autoClear = false;
}

function renderScene() {
    updatePositions();
    controls.update();
}

showOverlays();
animate();
