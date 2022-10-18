import jsTPS from "../common/jsTPS";

export default class EditSong_Transaction extends jsTPS{
    constructor(store, oldSong, index, newTitle, newArtist, newYouTube) {
        super();
        this.store = store;
        this.newTitle = newTitle;
        this.newArtist = newArtist;
        this.newYouTube = newYouTube;

        this.index = index;
        this.oldTitle = oldSong.title;
        this.oldArtist = oldSong.artist;
        this.oldYoutube = oldSong.youTubeId;
        
    }

    doTransaction() {
        this.store.confirmEditSong(this.newTitle,this.newArtist,this.newYouTube);
    }
    
    undoTransaction() {
        this.store.undoEdit(this.index, this.oldTitle, this.oldArtist, this.oldYoutube);
    }
}