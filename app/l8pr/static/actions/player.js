import * as c from '../constants'
import * as selectors from '../selectors'
import { push } from 'react-router-redux'
import * as contextLoaders from '../utils/api'

export function setPlaylist(playlist) {
    return {
        type: c.SET_PLAYLIST,
        payload: playlist,
    }
}

export function appendToPlaylist(items) {
    return {
        type: c.APPEND_TO_PLAYLIST,
        payload: items,
    }
}

export function insertToPlaylist(items) {
    return {
        type: c.INSERT_TO_PLAYLIST,
        payload: items,
    }
}

export function fillQueueList() {
    return (dispatch, getState) => (
        contextLoaders.lastItemsInLoopr()
        .then((items) => (
            dispatch(appendToPlaylist(items))
        ))
    )
}

export function initQueueList() {
    return (dispatch, getState) => {
        const location = selectors.getLocation(getState())
        const username = location.user || selectors.currentUser(getState()).username
        return Promise.all([
            // LAST USER ITEMS
            contextLoaders.lastUserItems({ username }),
            // SHOWS
            contextLoaders.shows({ username }),
        ])
        // flatten
        .then((results) => ([].concat.apply([], results)))
        // add to playlist
        .then((items) => (dispatch(setPlaylist(items))))
        // set the current item
        .then(() => dispatch(next()))
        // play the first occurence of the asked item
        .then(() => {
            console.log(location)
            if (location.item) {
                const item = selectors.playlist(getState()).find((i) => (i.id.toString() === location.item.toString()))
                if (item) {
                    dispatch(playItem(item))
                }
            }
        })
        // start the player
        .then(() => dispatch(play()))
    }
}

export function playItem(item) {
    return playItems([item])
}

export function playItems(items) {
    return (dispatch) => {
        dispatch(insertToPlaylist(items))
        dispatch(next())
    }
}

export function play() {
    return (dispatch, getState) => {
        dispatch({ type: c.PLAY })
        const show = selectors.currentShow(getState())
        const item = selectors.currentTrack(getState())
        let url = ''
        if (show) {
            url += `/show/${show.id}`
        } if (item) {
            url += `/item/${item.id}`
        }
        dispatch(push(url))
        if (selectors.getPlaylistGroupedByContext(getState()).length < 2) {
            dispatch(fillQueueList())
        }
    }
}

export function togglePlay() {
    return (dispatch, getState) => {
        if (getState().player.playing) {
            dispatch(pause())
        } else {
            dispatch(play())
        }
    }
}

export function toggleMute() {
    return (dispatch, getState) => {
        if (getState().player.muted) {
            dispatch(unmute())
        } else {
            dispatch(mute())
        }
    }
}

export function previousContext() {
    return { type: c.PREVIOUS_CONTEXT }
}

export function nextContext() {
    return { type: c.NEXT_CONTEXT }
}

export function next() {
    return { type: c.NEXT }
}

export function previous() {
    return { type: c.PREVIOUS }
}

export function mute() {
    return { type: c.MUTE }
}

export function unmute() {
    return { type: c.UNMUTE }
}

export function pause() {
    return { type: c.PAUSE }
}
