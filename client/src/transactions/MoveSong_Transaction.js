import jsTPS from "../common/jsTPS";

export default class MoveSong_Transaction extends jsTPS{
    constructor(store, startIndex, endIndex) {
        super();
        this.store = store;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        
    }

    doTransaction() {
        this.store.moveSong(this.startIndex, this.endIndex);
        console.log(this.store)
    }
    
    undoTransaction() {
        
        this.store.moveSong(this.endIndex, this.startIndex);
        
    }
}