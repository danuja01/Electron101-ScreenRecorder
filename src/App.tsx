import { useRef, useEffect, useState } from "react";
import "./App.css";
import ListDropDown from "./components/listDropdown";
import { saveAs } from "file-saver";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [sources, setSources] = useState<MediaDeviceInfo[]>([]);
  const [selectedSource, setSelectedSource] = useState<MediaDeviceInfo | null>(
    null
  );

  const [recording, setRecording] = useState(false);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const fetchSources = () => {
    window.electronAPI.fetchSources((_event, sources) => {
      setSources(sources);
    });
    console.log(sources);
  };

  const getStream = async () => {
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

  const startRecording = () => {
    if (recording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      mediaRecorderRef.current?.stream
        .getTracks()
        .forEach((track) => track.stop());
      setRecording(false);
    } else {
      // Start recording
      setRecording(true);
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        const options = { mimeType: "video/webm" };
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            setVideoChunks((prevChunks) => [...prevChunks, event.data]);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(videoChunks, { type: "video/webm" });
          saveAs(blob, "recorded-video.webm");
          setVideoChunks([]);
        };

        mediaRecorder.start();
      }
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

  useEffect(() => {
    console.log(videoChunks);
  }, [videoChunks]);

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
      <button
        className={`${
          recording ? "bg-red-600" : "bg-green-600"
        } text-gray-100 mt-4 px-2 py-2 rounded-md w-24`}
        onClick={startRecording}
      >
        {recording ? "Stop" : "Record"}
      </button>
    </div>
  );
}

export default App;
