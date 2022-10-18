import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;
    const [isDragging, setIsDragging] = useState(false)
    const [draggedTo, setDraggedTo] = useState(false)
    let cardClass = "list-card unselected-list-card";

    function handleDeleteSong(event){
        event.stopPropagation();
        
        store.showDeleteSongModal(index);
    }
    function handleClick(event){
        
        if (event.detail === 2) {
            event.stopPropagation();
            store.showEditSongModal(index)
        }
    }

    function handleDragStart(event){
        console.log(event.target)
        event.dataTransfer.setData("song", event.target.id);
        setIsDragging(true)
    }
    function handleDragOver(event){
        event.preventDefault();
        setDraggedTo(true)
    }
    function handleDragEnter(event){
        event.preventDefault();
        setDraggedTo(true)
    }
    function handleDragLeave(event){
        event.preventDefault();
        setDraggedTo(false)
    }
    function handleDrop(event){
        event.preventDefault();
        let end = event.target;
        let endIndex = end.id;
        endIndex = endIndex.substring(end.id.indexOf("-") + 1);
        endIndex = endIndex.replace('-card','')
        endIndex = parseInt(endIndex)
        let startIndex = event.dataTransfer.getData("song");
        startIndex = startIndex.substring(startIndex.indexOf("-") + 1);
        startIndex = startIndex.replace('-card','')
        startIndex = parseInt(startIndex)
        console.log("TARGET INDEX: " + endIndex)
        console.log("SOURCE ID: " + startIndex)
        
        setIsDragging(false)
        setDraggedTo(false)
        if(startIndex !== endIndex){
            store.addMoveSongTransaction(parseInt(startIndex), parseInt(endIndex))
        }
    }

    let itemClass = "playlister-song";
    if(draggedTo){
        itemClass = "playlister-song-dragged-to";
    }
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onClick={handleClick}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick= {handleDeleteSong}
            />
        </div>
    );
}

export default SongCard;