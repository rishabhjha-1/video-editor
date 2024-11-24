
import React from "react";
import { ZoomBlock } from "../context/ZoomContext";

interface TimelineProps {
  zoomBlocks: ZoomBlock[];
  onAddBlock: () => void;
  onSelectBlock: (block: ZoomBlock) => void;
  onUpdateBlock: (id: number, updatedBlock: Partial<ZoomBlock>) => void;
}

const Timeline: React.FC<TimelineProps> = ({ zoomBlocks, onAddBlock, onSelectBlock, onUpdateBlock }) => {
  const handleDrag = (id: number, field: keyof ZoomBlock, value: number) => {
    onUpdateBlock(id, { [field]: value });
  };

  return (
    <div style={{ position: "relative", height: "50px", border: "1px solid #ccc", marginTop: "20px" }}>
      {zoomBlocks.map((block) => (
        <div
          key={block.id}
          style={{
            position: "absolute",
            left: `${block.startTime}%`,
            width: `${block.endTime - block.startTime}%`,
            height: "100%",
            backgroundColor: "rgba(0, 128, 255, 0.5)",
            cursor: "pointer",
          }}
          onClick={() => onSelectBlock(block)}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              width: "10px",
              height: "100%",
              backgroundColor: "blue",
              cursor: "ew-resize",
            }}
            draggable
            onDrag={(e) => handleDrag(block.id, "startTime", block.startTime + e.movementX / 10)}
          ></div>
          <div
            style={{
              position: "absolute",
              right: 0,
              width: "10px",
              height: "100%",
              backgroundColor: "blue",
              cursor: "ew-resize",
            }}
            draggable
            onDrag={(e) => handleDrag(block.id, "endTime", block.endTime + e.movementX / 10)}
          ></div>
        </div>
      ))}
      <button onClick={onAddBlock} style={{ position: "absolute", right: "10px", top: "10px" }}>
        Add Block
      </button>
    </div>
  );
};

export default Timeline;
