export default class FactCard{

    #fact;
    #timeWindow;
    #imagePathLocation;

    constructor(fact, timeWindow, imagePathLocation) {
        this.#fact = fact;
        this.#timeWindow = timeWindow;
        this.#imagePathLocation = imagePathLocation;
    }

    getFact(){
        return this.#fact;
    }

    getTimeWindow(){
        return this.#timeWindow;
    }

    getPathLocation(){
        return this.#imagePathLocation;
    }

}