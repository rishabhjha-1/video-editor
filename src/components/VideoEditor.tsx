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

  // Handle video upload
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  // Add a new zoom block with overlap validation
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
      //   alert("A zoom block with the same or overlapping time range already exists.");
      //   return;
      setStartTime((prev) => prev + 5);
      setEndTime((prev) => prev + 5);
    }

    setZoomBlocks((prev) => [...prev, newBlock]);
  };

  // Update an existing zoom block with overlap validation
  const updateZoomBlock = (id: number, updatedBlock: Partial<ZoomBlock>) => {
    const updatedBlocks = zoomBlocks.map((block) =>
      block.id === id ? { ...block, ...updatedBlock } : block
    );

    const updatedBlockIndex = updatedBlocks.findIndex(
      (block) => block.id === id
    );
    if (
      updatedBlockIndex !== -1 &&
      isTimeRangeOverlapping(updatedBlocks[updatedBlockIndex], id)
    ) {
      //   alert("A zoom block with the same or overlapping time range already exists.");
      setStartTime((prev) => prev + 5);
      setEndTime((prev) => prev + 5);
      return;
    }

    setZoomBlocks(updatedBlocks);
  };

  // Delete a zoom block
  const deleteZoomBlock = (id: number) => {
    setZoomBlocks((prev) => prev.filter((block) => block.id !== id));
    setSelectedBlock(null);
  };

  // Check if a time range overlaps with existing blocks
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

  // Compute zoom styles for the video preview
  const renderZoomStyle = (): React.CSSProperties | undefined => {
    if (!videoRef.current || !currentZoom) return undefined;
    const { x, y, scale } = currentZoom;
    return {
      transformOrigin: `${x}px ${y}px`,
      transform: `scale(${scale})`,
    };
  };

  // Video playback logic
  const handleTimeUpdate = () => {
    const currentTime = videoRef.current?.currentTime || 0;
    const activeBlock = zoomBlocks.find(
      (block) => currentTime >= block.startTime && currentTime < block.endTime
    );
    setCurrentZoom(activeBlock || null);
  };

  const [currentZoom, setCurrentZoom] = useState<ZoomBlock | null>(null);

  return (
    <div style={{ padding: "20px" }}>
      {/* Video Upload */}
      <div>
        {videoFile ? (
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              height: "auto",
            }}
          >
            <video
              ref={videoRef}
              src={URL.createObjectURL(videoFile)}
              controls
              onTimeUpdate={handleTimeUpdate}
              style={{
                width: "100%",
                transition: "transform 0.2s",
                ...renderZoomStyle(),
              }}
            />
          </div>
        ) : (
          <input type="file" accept="video/*" onChange={handleVideoUpload} />
        )}
      </div>

      {/* Timeline */}
      <Timeline
        zoomBlocks={zoomBlocks}
        onAddBlock={() => addZoomBlock(startTime, endTime)}
        onSelectBlock={setSelectedBlock}
        onUpdateBlock={updateZoomBlock}
      />

      {/* Zoom Editor */}
      {selectedBlock && (
        <ZoomEditor
          block={selectedBlock}
          onUpdate={updateZoomBlock}
          onDelete={deleteZoomBlock}
        />
      )}
    </div>
  );
};

export default VideoEditor;
