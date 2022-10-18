import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_SONG: "MARK_SONG"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        selectedPlaylist: null,
        indexOfSong: -1,
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedPlaylist: null,
                    indexOfSong: -1
                });
            }
            case GlobalStoreActionType.UPDATE_PLAYLIST_SONGS: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedPlaylist: store.selectedPlaylist,
                    indexOfSong: -1
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedPlaylist: store.selectedPlaylist,
                    indexOfSong: -1
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    selectedPlaylist: store.selectedPlaylist,
                    indexOfSong: -1
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedPlaylist: store.selectedPlaylist,
                    indexOfSong: -1
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedPlaylist: payload,
                    indexOfSong: -1
                });
            }
            // PREPARE TO DELETE A SONG
            case GlobalStoreActionType.MARK_SONG: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedPlaylist: store.selectedPlaylist,
                    indexOfSong: payload
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    selectedPlaylist: store.selectedPlaylist,
                    indexOfSong: -1
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    selectedPlaylist: store.selectedPlaylist,
                    indexOfSong: -1
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    store.createNewList = function () {
        let playlistNum = store.idNamePairs.length + 1;
        let newPlayList = {
            name: "Untitled " + playlistNum,
            songs: []
        };
        console.log("hi")
        async function asyncCreateNewList(newPlayList) {
            const response = await api.createPlaylist(newPlayList);
            if (response.data.success) {
                let idNum = store.idNamePairs.push(response.data.playlist);

                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: {
                        idNamePairs: idNum,
                        playlist: response.data.playlist
                    },
                });
                let playlistID = response.data.playlist._id
                store.setCurrentList(playlistID)
            }
        }
        asyncCreateNewList(newPlayList);
    }
    store.addSong = function () {
        let id = store.currentList._id
        let newSong = {
            title: "Untitled",
            artist: "Untitled",
            youTubeId: "dQw4w9WgXcQ"
        };
        async function asyncAddSong(id) {
            let response = await api.getPlaylistById(id);
            let playlist = response.data.playlist
            console.log(playlist)
            if (response.data.success) {
                let currentPlaylist = store.currentList
                currentPlaylist.songs.push(newSong)

                playlist.songs = currentPlaylist.songs
                console.log(currentPlaylist)
                console.log(playlist)
                async function updatePlaylist(playlist) {
                    response = await api.updatePlaylistById(id, playlist);
                    if (response.data.success) {
                        console.log(response.data.playlist)
                        storeReducer({
                            type: GlobalStoreActionType.UPDATE_PLAYLIST_SONGS,
                            payload: currentPlaylist
                        });
                    }
                }
                updatePlaylist(playlist)
            }
        }
        asyncAddSong(id);
    }
    store.showEditSongModal = function (index) {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: index
        });
        console.log(store.indexOfSong)

        document.getElementById("editTitle").value = store.currentList.songs[index].title
        document.getElementById("editArtist").value = store.currentList.songs[index].artist
        document.getElementById("editYouTubeID").value = store.currentList.songs[index].youTubeId
        let modal = document.getElementById("edit-song-modal")
        modal.classList.add("is-visible")

    }
    store.confirmEditSong = function (newTitle, newArtist, newYoutubeid) {
        let id  = store.currentList._id
        console.log(newTitle)
        async function asyncConfirmEditSong(id) {
            let response = await api.getPlaylistById(id);
            let playlist = response.data.playlist

            if (response.data.success) {
                let editedSong = {
                    title: newTitle,
                    artist: newArtist,
                    youTubeId: newYoutubeid
                };
                let currentPlaylist = store.currentList
                currentPlaylist.songs[store.indexOfSong] = editedSong

                
                async function updatePlaylist(currentPlaylist) {
                    response = await api.updatePlaylistById(id, currentPlaylist);
                    if (response.data.success) {
                        console.log(response.data.playlist)
                        storeReducer({
                            type: GlobalStoreActionType.UPDATE_PLAYLIST_SONGS,
                            payload: currentPlaylist
                        });  
                        let modal = document.getElementById("edit-song-modal")
                        modal.classList.remove("is-visible")  
                    }
                }
                updatePlaylist(currentPlaylist)
            }
        }
        asyncConfirmEditSong(id);
    }
    store.hideEditSongModal = function () {
        let modal = document.getElementById("edit-song-modal")
        modal.classList.remove("is-visible")
    }
    store.showDeleteSongModal = function (index) {
        console.log(index)

        let modal = document.getElementById("delete-song-modal")
        modal.classList.add("is-visible")
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: index
        });
        console.log(store.indexOfSong)
    }

    store.hideDeleteSongModal = function () {
        let modal = document.getElementById("delete-song-modal")
        modal.classList.remove("is-visible")
    }

    store.confirmDeleteSong = function () {
        let id = store.currentList._id
        async function asyncDeleteSongModal(id) {
            let response = await api.getPlaylistById(id);
            let playlist = response.data.playlist

            if (response.data.success) {
                let currentPlaylist = store.currentList
                currentPlaylist.songs.splice(store.indexOfSong, 1)
                playlist.songs = currentPlaylist.songs
                async function updatePlaylist(playlist) {
                    response = await api.updatePlaylistById(id, playlist);
                    if (response.data.success) {
                        console.log(response.data.playlist)
                        storeReducer({
                            type: GlobalStoreActionType.UPDATE_PLAYLIST_SONGS,
                            payload: currentPlaylist
                        });
                        let modal = document.getElementById("delete-song-modal")
                        modal.classList.remove("is-visible")
                    }
                }
                updatePlaylist(playlist)
            }
        }
        asyncDeleteSongModal(id);
    }
    store.moveSong = function (startIndex, endIndex){
        let id = store.currentList._id
        async function asyncMoveSong(id) {
            let response = await api.getPlaylistById(id);
            

            if (response.data.success) {
                let playlist = response.data.playlist
                let temp = playlist.songs[startIndex]
                playlist.songs[startIndex] = playlist.songs[endIndex]
                playlist.songs[endIndex] = temp
                async function updatePlaylist(playlist) {
                    response = await api.updatePlaylistById(id, playlist);
                    if (response.data.success) {
                        console.log(response.data.playlist)
                        storeReducer({
                            type: GlobalStoreActionType.UPDATE_PLAYLIST_SONGS,
                            payload: playlist
                        });
                    }
                }
                updatePlaylist(playlist)
            }
        }
        asyncMoveSong(id);
        
        
    }
    store.showDeleteListModal = function (id) {
        async function asyncshowDeleteListModal(id) {
            let response = await api.getPlaylistById(id);
            
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (response.data.success) {
                    let modal = document.getElementById("delete-list-modal")
                    modal.classList.add("is-visible")
                    storeReducer({
                        type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                        payload: playlist
                    });
                }
                console.log(store.currentList)
            }
        }
        asyncshowDeleteListModal(id);
    }

    store.hideDeleteListModal = function () {
        let modal = document.getElementById("delete-list-modal")
        modal.classList.remove("is-visible")
    }
    store.confirmDeleteList = function () {
        let id = store.selectedPlaylist._id
        async function asyncDeleteListModal(id) {
            let response = await api.deletePlaylist(id);
            console.log(response)
            if (response.data.success) {
                let modal = document.getElementById("delete-list-modal")
                modal.classList.remove("is-visible")
                store.loadIdNamePairs()
            }
        }
        asyncDeleteListModal(id);
    }
    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function () {
        return store.currentList.songs.length;
    }

    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.updateIndex = function (index){
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: index
        });
    }
    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {

    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}