import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
function EditSongModal(props) {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();
    
    
    function handleHideEditSongModal(event){
        event.stopPropagation()
        store.hideEditSongModal()
    }
    
    function handleConfirmEditSong(event){
        event.stopPropagation()
        let title = document.getElementById("editTitle").value
        let artist = document.getElementById("editArtist").value
        let youtubeid = document.getElementById("editYouTubeID").value
        store.confirmEditSong(title, artist, youtubeid)
    }
    function handleNewTitle(event) {
        document.getElementById("editTitle").value = event.target.value
    }
    function handleNewArtist(event) {
        document.getElementById("editArtist").value = event.target.value
    }
    function handleNewYoutubeID(event) {
        document.getElementById("editYouTubeID").value = event.target.value
    }
    
    // if(store.indexOfSong !== -1 && store.indexOfSong < store.currentList.songs.length){
    //     title  = store.currentList.songs[store.indexOfSong].title
    //     console.log("pls work")
    // }
    let artist = ""
    if(store.indexOfSong !== -1 && store.indexOfSong < store.currentList.songs.length){
        artist  = store.currentList.songs[store.indexOfSong].artist
    }
    let youtubeid = ""
    if(store.indexOfSong !== -1 && store.indexOfSong < store.currentList.songs.length){
        youtubeid  = store.currentList.songs[store.indexOfSong].youTubeId
    }
    return (
        <div 
                class="modal" 
                id="edit-song-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-root" id='edit-song-root' >
                        <div class="modal-north">
                            Edit Song
                        </div>
                        <div class="modal-left">
                            <div class="modal-left-content">
                                Title: <input type="text" class="edit-song-input" onfocus="" id="editTitle" onChange={handleNewTitle}></input>
                            </div>
                        </div>
                        <div class="modal-left">
                            <div class="modal-left-content">
                                Artist: <input type="text" defaultValue = {artist} class="edit-song-input" id="editArtist" onChange={handleNewArtist}></input>
                            </div>
                        </div>
                        <div class="modal-left">
                            <div class="modal-left-content">
                                YouTube ID: <input type="text" defaultValue = {youtubeid} class="edit-song-input" id="editYouTubeID" onChange={handleNewYoutubeID}></input>
                            </div>
                        </div>
                        <div class="modal-south">
                            <input type="button" 
                                id="delete-list-confirm-button" 
                                class="modal-button" 
                                onClick={handleConfirmEditSong}
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