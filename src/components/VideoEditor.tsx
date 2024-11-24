import React, { useState, useRef } from "react";
import Timeline from "./TimeLine";
import ZoomEditor from "./ZoomBlock";

interface ZoomBlock {
  id: number;
  startTime: number;
  endTime: number;
  x: number;
  y: number;
  scale: number;
}

const VideoEditor: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [zoomBlocks, setZoomBlocks] = useState<ZoomBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<ZoomBlock | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(5);
  const [currentZoom, setCurrentZoom] = useState<ZoomBlock | null>(null);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;

    const activeBlock = zoomBlocks.find(
      (block) => currentTime >= block.startTime && currentTime < block.endTime
    );

    setCurrentZoom(activeBlock || null);
  };

  const renderZoomStyle = (): React.CSSProperties => {
    if (!currentZoom) {
      return {
        transform: "none",
      };
    }

    const { x, y, scale } = currentZoom;
    return {
      transformOrigin: `${x}px ${y}px`,
      transform: `scale(${scale})`,
    };
  };

  const addZoomBlock = (startTime: number, endTime: number) => {
    const newBlock: ZoomBlock = {
      id: Date.now(),
      startTime: startTime,
      endTime: endTime,
      x: 0,
      y: 0,
      scale: 1.5,
    };

    if (isTimeRangeOverlapping(newBlock)) {
      setStartTime((prev) => prev + 5);
      setEndTime((prev) => prev + 5);
    }

    setZoomBlocks((prev) => [...prev, newBlock]);
  };

  const isTimeRangeOverlapping = (
    block: ZoomBlock,
    excludeId?: number
  ): boolean => {
    return zoomBlocks.some(
      (existingBlock) =>
        existingBlock.id !== excludeId &&
        ((block.startTime >= existingBlock.startTime &&
          block.startTime < existingBlock.endTime) ||
          (block.endTime > existingBlock.startTime &&
            block.endTime <= existingBlock.endTime) ||
          (block.startTime <= existingBlock.startTime &&
            block.endTime >= existingBlock.endTime))
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Video Editor</h1>
      <div style={styles.videoUploadSection}>
        {videoFile ? (
          <div style={styles.videoContainer}>
            <video
              ref={videoRef}
              src={URL.createObjectURL(videoFile)}
              controls
              onTimeUpdate={handleTimeUpdate}
              style={{
                ...styles.video,
                ...renderZoomStyle(),
              }}
            />
          </div>
        ) : (
          <label style={styles.uploadLabel}>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              style={styles.uploadInput}
            />
            Upload Video
          </label>
        )}
      </div>

      <Timeline
        zoomBlocks={zoomBlocks}
        onAddBlock={() => addZoomBlock(startTime, endTime)}
        onSelectBlock={setSelectedBlock}
        onUpdateBlock={() => {}}
      />

      {selectedBlock && (
        <ZoomEditor
          block={selectedBlock}
          onUpdate={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  );
};

const styles:{[key: string]: React.CSSProperties} = {
  container: {
    fontFamily: "'Arial', sans-serif",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    fontSize: "2rem",
    color: "#343a40",
    marginBottom: "20px",
  },
  videoUploadSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  uploadLabel: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  uploadInput: {
    display: "none",
  },
  videoContainer: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    maxWidth: "800px",
    height: "auto",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  video: {
    width: "100%",
    borderRadius: "10px",
    transition: "transform 0.2s",
  },
};

export default VideoEditor;
