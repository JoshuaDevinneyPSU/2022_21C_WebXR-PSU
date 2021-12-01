const THREE = require('three');

//get physical specifications from user and create a planet with them
function addPlanet( radius, widthSegments, heightSegments, xPosition, yPosition, zPosition ){

    //check that radius is greater than zero
    if(radius <= 0)
        throw("Invalid radius");

    //create initial geometry and material
    let planetGeo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    let planetMaterial = new THREE.MeshStandardMaterial( {color: "blue"});

    //create mesh out of geometry and material
    let planet = new THREE.Mesh(planetGeo, planetMaterial);

    //set specified position
    planet.position.set(xPosition, yPosition, zPosition);

    //return created planet
    return planet;
}

module.exports = {
    addPlanet
}