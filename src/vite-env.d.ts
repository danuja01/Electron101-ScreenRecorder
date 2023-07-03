/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    fetchSources: (
      callback: (event: Electron.IpcRendererEvent, sources: any) => void
    ) => void;
  };
}
