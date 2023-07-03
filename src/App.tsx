import { useRef, useEffect, useState } from "react";
import "./App.css";
import ListDropDown from "./components/listDropdown";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [sources, setSources] = useState<MediaDeviceInfo[]>([]);
  const [selectedSource, setSelectedSource] = useState<MediaDeviceInfo | null>(
    null
  );

  const fetchSources = () => {
    window.electronAPI.fetchSources((_event, sources) => {
      setSources(sources);
    });
  };

  const getStream = async () => {
    console.log(selectedSource?.id);

    if (!selectedSource) {
      return;
    }
    try {
      const constraints = {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: selectedSource.id,
          },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        constraints as any
      );

      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Error occurred while playing video:", error);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  useEffect(() => {
    if (selectedSource) {
      getStream();
    }
  }, [selectedSource]);

  return (
    <div className="mx-12 max-w-full h-full">
      <div className="py-8">
        <h1 className="text-center text-3xl text-gray-100 drop-shadow-lg font-bold">
          ⚡️ Electron Screen Recorder
        </h1>
      </div>

      <div
        id="btn"
        className="w-full my-4"
        onClick={() => {
          fetchSources();
        }}
      >
        {sources.length > 0 && (
          <ListDropDown
            sources={sources}
            setSources={setSources}
            selected={selectedSource}
            setSelected={setSelectedSource}
          />
        )}
      </div>

      <div className="w-full relative rounded-md z-[-1]">
        <img
          src="/assets/movie.png"
          alt="Placeholder"
          className="absolute inset-0 object-cover w-full h-full opacity-50 rounded-md"
        />
        <video
          ref={videoRef}
          className="object-cover w-full h-full"
          src=""
        ></video>
      </div>
    </div>
  );
}

export default App;
