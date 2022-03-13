import * as THREE from "three";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";

//get physical specifications from user and create a planet with them
export function createPlanet( radius, widthSegments = 32, heightSegments = 32, xPosition, yPosition, zPosition, material){

    //todo assert test that radius, x, y and z position are non-null?

    //check that radius is greater than zero
    if(radius <= 0)
        throw("Invalid radius");

    //create initial geometry and material
    let planetGeo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    //create mesh out of geometry and material
    let planet = new THREE.Mesh(planetGeo, material);

    //set specified position
    planet.position.set(xPosition, yPosition, zPosition);

    //return created planet
    return planet;
}

export function createMaterial(type, material){
    let planetMaterial = null;

    if(type == 'texture'){
        planetMaterial = new THREE.MeshStandardMaterial({map: material});
    }
    else if(type == 'color'){
        planetMaterial = new THREE.MeshStandardMaterial({color: material});
    }
    else if(type == 'texture-basic'){
        planetMaterial = new THREE.MeshBasicMaterial({map: material});
    }
    else{
        planetMaterial = new THREE.MeshBasicMaterial({color: material});
    }

    return planetMaterial;
}

export function createSTL(path, xPos, yPos, zPos, material, scene, xScale = 1, yScale = 1, zScale = 1, orbit){

    //todo assert test that x, y, z pos are non-null? others user are non-null? ie path, scene, material, orbit

    const loader = new STLLoader();
    let stlMesh = null;
    loader.load(
        path,
        function (geometry) {
            stlMesh = new THREE.Mesh(geometry, material);
            stlMesh.position.set(xPos, yPos, zPos);
            stlMesh.scale.set( xScale, yScale, zScale );
            orbit.add(stlMesh);
            scene.add(stlMesh);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.log(error);
        }
    )
    return orbit;
}

export function createTexture(path){
    let texture = new THREE.TextureLoader().load(path);
    return texture;
}

function attachCard(){

}

function createCard(){

}



// module.exports = {
//     createSTL,
//     createPlanet,
//     createMaterial,
//     createTexture
// }