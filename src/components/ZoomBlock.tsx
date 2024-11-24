
import React from "react";
import { ZoomBlock } from "../context/ZoomContext";

interface ZoomEditorProps {
  block: ZoomBlock;
  onUpdate: (id: number, updatedBlock: Partial<ZoomBlock>) => void;
  onDelete: (id: number) => void;
}

const ZoomEditor: React.FC<ZoomEditorProps> = ({ block, onUpdate, onDelete }) => {
  const handleChange = (field: keyof ZoomBlock, value: number) => {
    onUpdate(block.id, { [field]: value });
  };

  return (
    <div style={{ position: "absolute", right: 20, top: 20, border: "1px solid #ccc", padding: 20 }}>
      <h3>Edit Zoom Block</h3>
      <label>
        Start Time:
        <input
          type="number"
          value={block.startTime}
          onChange={(e) => handleChange("startTime", parseFloat(e.target.value))}
        />
      </label>
      <br />
      <label>
        End Time:
        <input
          type="number"
          value={block.endTime}
          onChange={(e) => handleChange("endTime", parseFloat(e.target.value))}
        />
      </label>
      <br />
      <label>
        X Coordinate:
        <input
          type="number"
          value={block.x}
          onChange={(e) => handleChange("x", parseFloat(e.target.value))}
        />
      </label>
      <br />
      <label>
        Y Coordinate:
        <input
          type="number"
          value={block.y}
          onChange={(e) => handleChange("y", parseFloat(e.target.value))}
        />
      </label>
      <br />
      <label>
        Scale Factor:
        <input
          type="number"
          step="0.1"
          value={block.scale}
          onChange={(e) => handleChange("scale", parseFloat(e.target.value))}
        />
      </label>
      <br />
      <button onClick={() => onDelete(block.id)}>Delete</button>
    </div>
  );
};

export default ZoomEditor;
