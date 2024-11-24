import React, { createContext, useState, useContext } from "react";

export interface ZoomBlock {
  id: number;
  startTime: number;
  endTime: number;
  x: number;
  y: number;
  scale: number;
}

interface ZoomContextType {
  zoomBlocks: ZoomBlock[];
  addZoomBlock: (block: ZoomBlock) => void;
  updateZoomBlock: (id: number, updatedBlock: Partial<ZoomBlock>) => void;
  deleteZoomBlock: (id: number) => void;
}

const ZoomContext = createContext<ZoomContextType | undefined>(undefined);

export const ZoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zoomBlocks, setZoomBlocks] = useState<ZoomBlock[]>([]);

  const addZoomBlock = (block: ZoomBlock) => {
    setZoomBlocks((prev) => [...prev, block]);
  };

  const updateZoomBlock = (id: number, updatedBlock: Partial<ZoomBlock>) => {
    setZoomBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, ...updatedBlock } : block))
    );
  };

  const deleteZoomBlock = (id: number) => {
    setZoomBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  return (
    <ZoomContext.Provider value={{ zoomBlocks, addZoomBlock, updateZoomBlock, deleteZoomBlock }}>
      {children}
    </ZoomContext.Provider>
  );
};

export const useZoomContext = () => {
  const context = useContext(ZoomContext);
  if (!context) throw new Error("useZoomContext must be used within a ZoomProvider");
  return context;
};
