export default class FactCard{

    #fact;
    #timeWindow;

    constructor(fact, timeWindow) {
        this.#fact = fact;
        this.#timeWindow = timeWindow;
    }

    getFact(){
        return this.#fact;
    }

    getTimeWindow(){
        return this.#timeWindow;
    }

}

// module.exports = {
//     FactCard
// };