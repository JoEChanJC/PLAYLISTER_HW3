import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
function DeleteSongModal(props) {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    function handleHideSongModal(event){
        event.stopPropagation()
        store.hideDeleteSongModal()
    }
    function handleConfirmDeleteSong(event){
        event.stopPropagation()
        store.addRemoveSongTransaction()
    }
    let name = ""
    if(store.indexOfSong !== -1 && store.indexOfSong < store.currentList.songs.length){
        name  = store.currentList.songs[store.indexOfSong].title
    }
    return (
        <div 
                class="modal" 
                id="delete-song-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-root" id='verify-delete-song-root'>
                        <div class="modal-north">
                            Remove Song?
                        </div>
                        <div class="modal-center">
                            <div class="modal-center-content">
                                Are you sure you wish to permanently remove <span style={{ fontWeight: 'bold' }}>{name}</span> from the playlist? 
                            </div>
                        </div>
                        <div class="modal-south">
                            <input type="button" 
                                id="delete-song-confirm-button" 
                                class="modal-button" 
                                onClick={handleConfirmDeleteSong}
                                value='Confirm' />
                            <input type="button" 
                                id="delete-song-cancel-button" 
                                class="modal-button" 
                                onClick={handleHideSongModal}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
    );
}
export default DeleteSongModal;