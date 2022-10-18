import jsTPS from "../common/jsTPS";

export default class AddSong_Transaction extends jsTPS{
    constructor(store, index) {
        super();
        this.store  = store       
        this.oldIndex = index;
    }

    doTransaction() {
        this.store.addSong()
    }
    
    undoTransaction() {
        this.store.confirmDeleteSong();
    }
}