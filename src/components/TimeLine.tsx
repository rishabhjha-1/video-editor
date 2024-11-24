import React from "react";
import { ZoomBlock } from "../types";

interface TimelineProps {
  zoomBlocks: ZoomBlock[];
  onAddBlock: () => void;
  onSelectBlock: (block: ZoomBlock) => void;
  onUpdateBlock: (id: number, updatedBlock: Partial<ZoomBlock>) => void;
}

const Timeline: React.FC<TimelineProps> = ({ zoomBlocks, onAddBlock, onSelectBlock, onUpdateBlock }) => {
  // Handles dragging events to update the block's start or end time
  const handleDrag = (id: number, field: keyof ZoomBlock, value: number) => {
    onUpdateBlock(id, { [field]: value });
  };

  // Define the styles object with proper types
  const styles = {
    container: {
      position: "relative" as const,
      height: "50px",
      border: "1px solid #ccc",
      marginTop: "20px",
    },
    block: (startTime: number, endTime: number) => ({
      position: "absolute" as const,
      left: `${startTime}%`,
      width: `${endTime - startTime}%`,
      height: "100%",
      backgroundColor: "rgba(0, 128, 255, 0.5)",
      cursor: "pointer",
    }),
    resizeHandle: {
      position: "absolute" as const,
      width: "10px",
      height: "100%",
      backgroundColor: "blue",
      cursor: "ew-resize",
    },
    addButton: {
      position: "absolute" as const,
      right: "10px",
      top: "10px",
      padding: "10px 20px",
      fontSize: "14px",
      color: "#fff",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "background-color 0.3s ease, transform 0.2s ease",
    },
   
  };

  return (
    <div style={styles.container}>
      {/* Render each zoom block */}
      {zoomBlocks.map((block) => (
        <div
          key={block.id}
          style={styles.block(block.startTime, block.endTime)} // Correctly call the function here
          onClick={() => onSelectBlock(block)}
        >
          {/* Left resize handle */}
          <div
            style={{ ...styles.resizeHandle, left: 0 }}
            draggable
            onDrag={(e) =>
              handleDrag(block.id, "startTime", block.startTime + e.movementX / 10)
            }
          ></div>

          {/* Right resize handle */}
          <div
            style={{ ...styles.resizeHandle, right: 0 }}
            draggable
            onDrag={(e) =>
              handleDrag(block.id, "endTime", block.endTime + e.movementX / 10)
            }
          ></div>
        </div>
      ))}

      <button onClick={onAddBlock} style={styles.addButton}>
        Add Block
      </button>
    </div>
  );
};

export default Timeline;
