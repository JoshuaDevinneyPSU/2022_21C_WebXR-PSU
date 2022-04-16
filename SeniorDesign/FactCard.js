export default class FactCard{

    #fact;
    #imageLocation;

    constructor(fact, imageLocation) {
        this.#fact = fact;
        this.#imageLocation = imageLocation;
    }

    getFact(){
        return this.#fact;
    }

    getFactImage(){
        return this.#imageLocation;
    }

}