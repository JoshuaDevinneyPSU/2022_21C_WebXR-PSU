const {FactCard} = require("./FactCard");
import * as THREE from "three";

class Planet{


    //private instance variables
    #radius;
    #widthSegments;
    #heightSegments;
    #xPosition;
    #yPosition;
    #zPosition;
    #material;
    #isClicked;
    #factCards;

    //todo add implementation for the current fact being displayed/iterate through next ones

    #currentFactPosition;

    constructor(radius, widthSegments = 32, heightSegments = 32, xPosition, yPosition, zPosition, material) {
        this.#radius = radius;
        this.#widthSegments = widthSegments;
        this.#heightSegments = heightSegments;
        this.#xPosition = xPosition;
        this.#yPosition = yPosition;
        this.#zPosition = zPosition;
        this.#material = material;
        this.#isClicked = false;
        this.#factCards = [];
        this.#currentFactPosition = 0;
    }

    initializeFactCards(filePath){
        //todo add implementation here to add facts from a given file path?
    }

    addFactCard(fact, timeWindow){
        let newFactCard = new FactCard(fact, timeWindow);
        this.#factCards.add(newFactCard);
    }

    getFactCard(index = 0, timeWindow = null){
        if(timeWindow == null){
            //todo add index out of bounds check
            return this.#factCards[index];
        }
    }

    createPlanet(){
        //create initial geometry and material
        let planetGeo = new THREE.SphereGeometry(this.#radius, this.#widthSegments, this.#heightSegments);

        //create mesh out of geometry and material
        let planet = new THREE.Mesh(planetGeo, this.#material);

        //set specified position
        planet.position.set(this.#xPosition, this.#yPosition, this.#zPosition);

        //return created planet
        return planet;
    }

}

module.exports = {
    Planet
};