import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
function EditSongModal(props) {
    const { song, index } = props;
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    function handleHideEditSongModal(event){
        event.stopPropagation()
        store.hideEditSongModal()
    }
    
    let title = ""
    if(store.indexOfSong != -1 && store.indexOfSong < store.currentList.songs.length){
        title  = store.currentList.songs[store.indexOfSong].title
    }
    let artist = ""
    if(store.indexOfSong != -1 && store.indexOfSong < store.currentList.songs.length){
        title  = store.currentList.songs[store.indexOfSong].artist
    }
    let youtubeid = ""
    if(store.indexOfSong != -1 && store.indexOfSong < store.currentList.songs.length){
        title  = store.currentList.songs[store.indexOfSong].youtubeiD
    }
    return (
        <div 
                class="modal" 
                id="edit-song-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-root" id='verify-delete-list-root'>
                        <div class="modal-north">
                            Edit Song
                        </div>
                        <div class="modal-left">
                            <div class="modal-left-content">
                                Title: <input type="text"  value = {title} class="edit-song-input" id="editTitle" onChange={"hi"}></input>
                            </div>
                        </div>
                        <div class="modal-left">
                            <div class="modal-left-content">
                                Artist: <input type="text" value = {artist} class="edit-song-input" id="editArtist" onChange={"hi"}></input>
                            </div>
                        </div>
                        <div class="modal-left">
                            <div class="modal-left-content">
                                YouTube ID: <input type="text" value = {youtubeid} class="edit-song-input" id="editYouTubeID" onChange={"hi"}></input>
                            </div>
                        </div>
                        <div class="modal-south">
                            <input type="button" 
                                id="delete-list-confirm-button" 
                                class="modal-button" 
                                // onClick={this.handleEditSong}
                                value='Confirm' />
                            <input type="button" 
                                id="delete-list-cancel-button" 
                                class="modal-button" 
                                onClick={handleHideEditSongModal}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
    );
}
export default EditSongModal;