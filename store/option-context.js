'use client'

import { createContext, useReducer } from 'react';

export const OptionContext = createContext({
    mainFolder: "",
    formattedFolder: "",
    uploadFolder: "",
    init: ( initValue ) => {},
    setMainFolder: ( value ) => {},
    setFormattedFolder : ( value ) => {},
    setUploadFolder: () => {},
});

function OptionReducer(state, action) {
    if ( action.type == "INIT" ) {
        state.mainFolder = action.payload.mainFolder;
        state.formattedFolder = action.payload.formattedFolder;
        state.uploadFolder = action.payload.uploadFolder;
    }

    if ( action.type == "SET_MAIN" ) {
        state.mainFolder = action.payload.mainFolder;
    }

    if ( action.type == "SET_FORMATTED" ) {
        state.formattedFolder = action.payload.formattedFolder;
    }

    if ( action.type == "SET_UPLOAD" ) {
        state.uploadFolder = action.payload.uploadFolder;
    }

    return {...state};
}

export default function OptionContextProvider( {children} ) {

    const [ optionState, optionDispatch ] = useReducer( OptionReducer, { mainFolder: "", formattedFolder: "", uploadFolder: "" } )

    function init( initValue ) {
        optionDispatch({
            type: "INIT",
            payload: { mainFolder : initValue.mainFolder, formattedFolder : initValue.formattedFolder, uploadFolder: initValue.uploadFolder }
        });
    }

    function setMainFolder( value ) {
        optionDispatch({
            type: "SET_MAIN",
            payload: { mainFolder : value }
        });
    }

    function setFormattedFolder( value ) {
        optionDispatch({
            type: "SET_FORMATTED",
            payload: { formattedFolder : value }
        });
    }

    function setUploadFolder( value ) {
        optionDispatch({
            type: "SET_UPLOAD",
            payload: { uploadFolder : value }
        });
    }

    const ctxValue = {
        mainFolder: optionState.mainFolder,
        formattedFolder : optionState.formattedFolder,
        uploadFolder : optionState.uploadFolder,
        init,
        setMainFolder,
        setFormattedFolder,
        setUploadFolder,
    }

    return <OptionContext.Provider value={ctxValue}>
        {children}
    </OptionContext.Provider>

}