import FactCard from "./FactCard.js";
import * as THREE from "three";

export default class Planet extends THREE.Mesh{


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
    #planetMesh;


    //todo add implementation for the current fact being displayed/iterate through next ones

    #currentFactPosition;

    constructor(radius= 0, widthSegments = 32, heightSegments = 32, xPosition=0, yPosition= 0, zPosition= 0, material= null) {
        super();
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

        //create initial geometry and material
        let planetGeo = new THREE.SphereGeometry(this.#radius, this.#widthSegments, this.#heightSegments);

        //create mesh out of geometry and material
        this.#planetMesh = new THREE.Mesh(planetGeo, this.#material);

        //set specified position
        this.#planetMesh.position.set(this.#xPosition, this.#yPosition, this.#zPosition);
    }


    getMesh(){
        return this.#planetMesh;
    }

    initializeFactCards(facts , imageLocation){

        if(facts.length !== imageLocation.length){
            return;
        }

        for (let count=0;count<facts.length;count++){
            this.addFactCard(facts[count], imageLocation[count]);
        }

    }

    getClicked(){
        return this.#isClicked;
    }

    setClicked(){
        this.#isClicked = !this.#isClicked;
    }

    addFactCard(fact, location){
        this.#factCards[this.#factCards.length] = new FactCard(fact, location);
    }

    resetFactCard(){
        this.#currentFactPosition = 0;
    }

    getFact(){
        return this.#factCards[this.#currentFactPosition].getFact();
    }

    getFactImage(){
        return this.#factCards[this.#currentFactPosition].getFactImage();
    }

    updateFact(){
        if(this.#currentFactPosition === this.#factCards.length-1){
            this.#currentFactPosition = 0;
        }
        else{
            this.#currentFactPosition++;
        }
    }


/*
    createPlanet(){
        //create initial geometry and material
        let planetGeo = new THREE.SphereGeometry(this.#radius, this.#widthSegments, this.#heightSegments);

        //create mesh out of geometry and material
        this.#planetMesh = new THREE.Mesh(planetGeo, this.#material);

        //set specified position
        this.#planetMesh.position.set(this.#xPosition, this.#yPosition, this.#zPosition);

        //return created planet
        return planet;
    }
*/
}