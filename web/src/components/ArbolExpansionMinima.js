import React, { useState } from 'react';

const ArbolExpansionMinima = ({ nodes, links }) => {
  const [nodePositions, setNodePositions] = useState({
    A: { x: 100, y: 100 },
    B: { x: 300, y: 100 },
    C: { x: 200, y: 200 },
    D: { x: 400, y: 200 },
    E: { x: 300, y: 300 },
  });
  const [draggingNode, setDraggingNode] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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
      {/* Dibujar aristas del árbol */}
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
              stroke="#28a745"
              strokeWidth="4"
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
            <circle cx={x} cy={y} r="20" fill="#28a745" />
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

export default ArbolExpansionMinima;