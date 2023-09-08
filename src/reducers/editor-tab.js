const ACTIVATE_TAB = "scratch-gui/navigation/ACTIVATE_TAB";

// Constants use numbers to make it easier to work with react-tabs
const BLOCKS_TAB_INDEX = 0;
const COSTUMES_TAB_INDEX = 1;
const SOUNDS_TAB_INDEX = 2;

const initialState = {
    activeTabIndex: BLOCKS_TAB_INDEX,
};

const reducer = function (state, action) {
    if (typeof state === "undefined") state = initialState;
    switch (action.type) {
        case ACTIVATE_TAB:
            return Object.assign({}, state, {
                activeTabIndex: action.activeTabIndex,
            });
        default:
            return state;
    }
};

const activateTab = function (tab) {
    if (tab == 1) {
        document.getElementById("stageWrapper").style.display = "none";
        document.getElementById("editorWrapper").style.flexBasis =
            "calc(100% / 1)";
    } else if (tab == 2) {
        document.getElementById("stageWrapper").style.display = "none";
        document.getElementById("editorWrapper").style.flexBasis =
            "calc(100% / 1)";
    } else {
        document.getElementById("stageWrapper").style.display = "block";
        document.getElementById("editorWrapper").style.flexBasis =
            "calc(100% / 2.3)";
    }
    return {
        type: ACTIVATE_TAB,
        activeTabIndex: tab,
    };
};

export {
    reducer as default,
    initialState as editorTabInitialState,
    activateTab,
    BLOCKS_TAB_INDEX,
    COSTUMES_TAB_INDEX,
    SOUNDS_TAB_INDEX,
};
