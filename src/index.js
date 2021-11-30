import { useEffect, useState, useCallback } from "react";
import isEqual from "./isEqual";

if (window) var global = window;
//Set the global/window object to store state. "But muh glowballs!" you say? Look at that uuid. Aint nothing gonna collide with that.
const lsUUID = "___LINKEDSTATE___ef40968a-d9ba-4eef-a1b2-e020c5845fd1";
if (!global[lsUUID]) global[lsUUID] = {};

const awaitSetter = async (key, value) => {
    //If setting a thenable, wait for it to finish before firing.
    let awaitedResource = await value;
    let resource = await awaitedResource;

    _LS_set(key, resource);
};

const updateAllWatchers = (key, value) => {
    //Update all components watching the state
    console.log(global[lsUUID][key].localStateSetters);
    for (const localStateSetter of global[lsUUID][key].localStateSetters) {
        console.log(value);
        localStateSetter(value);
    }
};

const _LS_set = (key, value) => {
    //Set a linked state value by its key, and then update all watching components with this value
    if (value && typeof value.then === "function") {
        awaitSetter(key, value);
        return;
    }

    //Initialize the linked state entry if it doesnt yet exist
    if (!global[lsUUID][key]) global[lsUUID][key] = { currentValue: value, localStateSetters: [] };

    //Deep check the new value for equlity before setting it to avoid unnecessary dom thrashing
    if (isEqual(global[lsUUID][key].currentValue, value)) return;
    global[lsUUID][key].currentValue = value;

    //Update all watching commponents with the new value.
    updateAllWatchers(key, value);
};

const _LS_watch = (key, localStateSetter, initialValue = undefined) => {
    if (key === undefined) return;

    if (!global[lsUUID][key]) {
        //Initialize and exit if this is the only watching component.
        global[lsUUID][key] = { currentValue: initialValue, localStateSetters: [localStateSetter] };
        console.log(global[lsUUID][key]);
        return;
    }

    //Add the local state setter if it doesnt exist yet in the registry.
    if (!global[lsUUID][key].localStateSetters.find((otherStateSetter) => otherStateSetter === localStateSetter)) {
        //Apply current linkedstate value to the new watcher.
        localStateSetter((lastLocalValue) => (isEqual(lastLocalValue, global[lsUUID][key].currentValue) ? lastLocalValue : global[lsUUID][key].currentValue));
        //...then local setter to registry
        global[lsUUID][key].localStateSetters.push(localStateSetter);
    }
};

const _LS_unwatch = (key, localStateSetter) => {
    //Component cleanup when dismounted
    if (key === undefined) return;
    if (!global[lsUUID][key].localStateSetters) return;
    if (global[lsUUID][key].localStateSetters.find((otherStateSetter) => otherStateSetter === localStateSetter)) {
        global[lsUUID][key].localStateSetters = global[lsUUID][key].localStateSetters.filter((otherStateSetter) => otherStateSetter !== localStateSetter);
    }
};

const _LS_get = (key) => {
    //Universal get command of current linked state by key, does not require react to perform.
    console.log(global[lsUUID][key]);
    if (key === undefined || !global[lsUUID][key]) return undefined;

    return global[lsUUID][key].currentValue;
};

//Getter and Setter for the global state
export const linkedState = {
    get: _LS_get,
    set: _LS_set,
};

//Hook for managing the local state
export const useLinkedState = (linkedStateKey, initialValue) => {
    const [localState, setLocalState] = useState(global[lsUUID][linkedStateKey]?.currentValue || initialValue);

    const globalStateUpdater = (newState) => {
        if (typeof newState === "function") {
            const lastState = linkedState.get(linkedStateKey);
            newState = newState(lastState);
        }

        linkedState.set(linkedStateKey, newState);
    };

    useEffect(() => {
        _LS_watch(linkedStateKey, setLocalState, initialValue);
        return () => _LS_unwatch(linkedStateKey, setLocalState);
    }, []);

    return [localState, globalStateUpdater];
};
