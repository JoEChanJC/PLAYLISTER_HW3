import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let addbuttonclass = "playlister-button";
    let closebuttonclass = "playlister-button";
    let undobuttonclass ="playlister-button";
    let redobuttonclass ="playlister-button";
    
    function handleAdd(){
        store.addAddSongTransaction();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    
    if(!addbuttonclass.includes("disabled")){addbuttonclass += "-disabled"}
    if(!closebuttonclass.includes("disabled")){closebuttonclass += "-disabled"}
    if(!undobuttonclass.includes("disabled")){undobuttonclass += "-disabled"}
    if(!redobuttonclass.includes("disabled")){redobuttonclass += "-disabled"}
    
    let addButtonStatus = true;
    let undoButtonStatus = true;
    let redoButtonStatus = true;
    let closeButtonStatus = true;
    if (store.currentList != null) {
        if(store.isModalShown == true){
            addButtonStatus = true;
            if(!addbuttonclass.includes("disabled")){addbuttonclass += "-disabled"}
            closeButtonStatus = true;
            if(!closebuttonclass.includes("disabled")){closebuttonclass += "-disabled"}
            undoButtonStatus = true;
            if(!undobuttonclass.includes("disabled")){undobuttonclass += "-disabled"}
            redoButtonStatus = true;
            if(!redobuttonclass.includes("disabled")){redobuttonclass += "-disabled"}       
        }
        else{
            addButtonStatus = false;
            addbuttonclass = "playlister-button"
            closeButtonStatus = false;
            closebuttonclass = "playlister-button"
            if(store.canUndo() == false){
                undoButtonStatus = false;
                undobuttonclass = "playlister-button"
            }
            if(store.canRedo() == false){
                redoButtonStatus = false;
                redobuttonclass = "playlister-button"
            }
        }
    }
    else{
        
    }
    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={addButtonStatus}
                value="+"
                className={addbuttonclass}
                onClick={handleAdd}
            />
            <input
                type="button"
                id='undo-button'
                disabled={undoButtonStatus}
                value="⟲"
                className={undobuttonclass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={redoButtonStatus}
                value="⟳"
                className={redobuttonclass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={closeButtonStatus}
                value="&#x2715;"
                className={closebuttonclass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;