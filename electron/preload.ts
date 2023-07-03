import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  fetchSources: (
    callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void
  ) => {
    ipcRenderer.send("FETCH_SOURCES");
    ipcRenderer.on("SET_SOURCES", callback);
  },
});
