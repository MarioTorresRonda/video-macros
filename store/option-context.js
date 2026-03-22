'use client'

import { createContext, useReducer } from 'react';

export const OptionContext = createContext({
    mainFolder: "",
    formattedFolder: "",
    init: ( initValue ) => {},
    setMainFolder: ( value ) => {},
    setFormattedFolder : ( value ) => {}
});

function OptionReducer(state, action) {
    if ( action.type == "INIT" ) {
        state.mainFolder = action.payload.mainFolder;
        state.formattedFolder = action.payload.formattedFolder;
    }

    if ( action.type == "SET_MAIN" ) {
        state.mainFolder = action.payload.mainFolder;
    }

    if ( action.type == "SET_FORMATTED" ) {
        state.formattedFolder = action.payload.formattedFolder;
    }

    return {...state};
}

export default function OptionContextProvider( {children} ) {

    const [ optionState, optionDispatch ] = useReducer( OptionReducer, { mainFolder: "", formattedFolder: "" } )

    function init( initValue ) {
        optionDispatch({
            type: "INIT",
            payload: { mainFolder : initValue.mainFolder, formattedFolder : initValue.formattedFolder, }
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

    const ctxValue = {
        mainFolder: optionState.mainFolder,
        formattedFolder : optionState.formattedFolder,
        init,
        setMainFolder,
        setFormattedFolder
    }

    return <OptionContext.Provider value={ctxValue}>
        {children}
    </OptionContext.Provider>

}