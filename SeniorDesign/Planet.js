import FactCard from "./FactCard.js";
import * as THREE from "three";
//import * as fs from 'fs';// as fs from "fs";
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

    constructor(radius, widthSegments = 32, heightSegments = 32, xPosition, yPosition, zPosition, material) {
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

    initializeFactCards(filePath){
/*
        var openFile = function(event) {
            var input = event.target;

            var reader = new FileReader();
            reader.onload = function(){
                var text = reader.result;
                console.log(reader.result.substring(0, 200));
            };
            reader.readAsText(input.files[0]);
        };
*/
/*
        fs.readFile('Input.txt', (err, data) => {
            if (err) throw err;

            console.log(data.toString());
        })
*/
        //todo add implementation here to add facts from a given file path?
/*
        let f = new FileReader();
        let file = new File([filePath], filePath);

        f.onload = function (){
            let temp = f.result;
            console.log(temp);
        }

        f.readAsText(file);

        console.log(f.result + "\n\n------------------------------\n\n");
/*
        let temp;
        console.log(
            fetch(filePath)
            .then(response => response.text()).then()
        );
            //.then(text => console.log(text + "\n\n------------------------------\n\n"))
            //.toString()
        //);// =>
*/
    }

    addFactCard(fact){
        let newFactCard = new FactCard(fact, timeWindow);
        this.#factCards.add(newFactCard);
    }

    getFactCard(index = 0){
        if(timeWindow == null){
            //todo add index out of bounds check
            return this.#factCards[index];
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