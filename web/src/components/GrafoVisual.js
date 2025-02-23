import React, { useState, useEffect } from 'react';

const GrafoVisual = ({ nodes, links }) => {
  const [nodePositions, setNodePositions] = useState({});
  const [draggingNode, setDraggingNode] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const initialPositions = {};
    nodes.forEach((node, index) => {
      initialPositions[node.id] = {
        x: 100 + (index % 5) * 100,
        y: 100 + Math.floor(index / 5) * 100,
      };
    });
    setNodePositions(initialPositions);
  }, [nodes]);

  const handleMouseDown = (event, nodeId) => {
    const { clientX, clientY } = event;
    const { x, y } = nodePositions[nodeId];
    setDraggingNode(nodeId);
    setOffset({ x: clientX - x, y: clientY - y });
  };

  const handleMouseMove = (event) => {
    if (draggingNode) {
      const { clientX, clientY } = event;
      setNodePositions((prevPositions) => ({
        ...prevPositions,
        [draggingNode]: { x: clientX - offset.x, y: clientY - offset.y },
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  return (
    <svg
      width="500"
      height="400"
      style={{ border: '1px solid #ccc' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Dibujar aristas */}
      {links.map((link, index) => {
        const source = nodePositions[link.source];
        const target = nodePositions[link.target];
        if (!source || !target) return null;
        return (
          <g key={index}>
            <line
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="#007bff"
              strokeWidth="2"
            />
            <text
              x={(source.x + target.x) / 2}
              y={(source.y + target.y) / 2}
              textAnchor="middle"
              fill="#000"
              fontSize="12"
              dy="-5"
            >
              {link.weight}
            </text>
          </g>
        );
      })}

      {/* Dibujar nodos */}
      {nodes.map((node) => {
        const { x, y } = nodePositions[node.id] || {};
        if (x === undefined || y === undefined) return null;
        return (
          <g
            key={node.id}
            onMouseDown={(event) => handleMouseDown(event, node.id)}
          >
            <circle cx={x} cy={y} r="20" fill="#007bff" />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              fill="#fff"
              fontSize="14"
              dy="5"
            >
              {node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default GrafoVisual;