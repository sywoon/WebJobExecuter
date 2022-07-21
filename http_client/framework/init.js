import {Mgr} from "./mgr.js"
import {SyncLoaded} from "./libs/sync_loaded.js"

export function InitFramework(cbk) {
    let mgr = new Mgr()
    let syncLoaded = new SyncLoaded(cbk, mgr)

    syncLoaded.addCheck("mgr")
    mgr.initAll(syncLoaded.cbkListener.bind(syncLoaded, "mgr"))
}

