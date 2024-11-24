import React from "react";
import { ZoomProvider } from "./context/ZoomContext";
import VideoEditor from "./components/VideoEditor";

const App: React.FC = () => {



  return (
    <ZoomProvider>
      <div className="app">
        <h1>Video Editor</h1>
        <VideoEditor/>
      </div>
    </ZoomProvider>
  );
};

export default App;
