import jsTPS from "../common/jsTPS";

export default class RemoveSong_Transaction extends jsTPS{
    constructor(store, deletedSong, indexOfDeletedSong) {
        super();
        this.store = store;
        this.deletedSong = deletedSong;
        this.indexOfDeletedSong = indexOfDeletedSong;
        
    }

    doTransaction() {
        this.store.confirmDeleteSong();
    }
    
    undoTransaction() {
        this.store.undoDelete(this.indexOfDeletedSong, this.deletedSong);
    }
}