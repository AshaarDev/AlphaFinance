import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import "./subcompcss/draggable.css";

const DraggableModal = ({ isOpen, onClose, title, children }) => {
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const nodeRef = useRef(null);
  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 20, y: 60 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Draggable nodeRef={nodeRef} onDrag={handleDrag} position={position}>
      <div ref={nodeRef} className="draggable-modal">
        <div className="modal-navbar">
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </Draggable>
  );
};

export default DraggableModal;
