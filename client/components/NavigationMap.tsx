import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface NavigationMapProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
}

// Map booth names to SVG node IDs
const boothToNodeMapping: { [key: string]: string } = {
  "Entrance": "1",
  "Coffee Shop": "6", 
  "Bathroom": "8",
  "Bakery": "10",
  "Coffee Competition": "14",
  "Interfood": "4",
  "Furnishing": "12",
  "Clean Tech": "16",
  "Hace Administration": "18"
};

const NavigationMap: React.FC<NavigationMapProps> = ({ isOpen, onClose, destination }) => {
  const pathfindingOverlayRef = useRef<SVGSVGElement>(null);

  // Event data from your HTML
  const eventData = {
    nodes: [
      { id: "1", label: "Entrance", x: 1420, y: 800 },
      { id: "2", label: "turn", x: 1420, y: 560 },
      { id: "3", label: "turn", x: 1123, y: 561 },
      { id: "4", label: "Inter food", x: 1123, y: 800 },
      { id: "5", label: "turn", x: 1022, y: 561 },
      { id: "6", label: "Coffee Shop", x: 1020, y: 380 },
      { id: "7", label: "turn", x: 1020, y: 320 },
      { id: "8", label: "Bathroom", x: 1420, y: 300 },
      { id: "9", label: "turn", x: 920, y: 560 },
      { id: "10", label: "Bakery", x: 920, y: 400 },
      { id: "11", label: "turn", x: 540, y: 560 },
      { id: "12", label: "Furnishing", x: 540, y: 740 },
      { id: "13", label: "turn", x: 460, y: 560 },
      { id: "14", label: "Coffee Competition", x: 460, y: 380 },
      { id: "15", label: "turn", x: 160, y: 560 },
      { id: "16", label: "Clean Tech", x: 160, y: 700 },
      { id: "17", label: "turn", x: 80, y: 560 },
      { id: "18", label: "Hace Administration", x: 80, y: 380 }
    ],
    edges: [
      { from: "1", to: "2", distance: 240 },
      { from: "2", to: "1", distance: 240 },
      { from: "2", to: "3", distance: 297.00 },
      { from: "3", to: "2", distance: 297.00 },
      { from: "3", to: "4", distance: 239 },
      { from: "4", to: "3", distance: 239 },
      { from: "3", to: "5", distance: 101 },
      { from: "5", to: "3", distance: 101 },
      { from: "5", to: "6", distance: 181 },
      { from: "6", to: "5", distance: 181 },
      { from: "6", to: "7", distance: 60 },
      { from: "7", to: "6", distance: 60 },
      { from: "7", to: "8", distance: 400 },
      { from: "8", to: "7", distance: 400 },
      { from: "5", to: "9", distance: 102 },
      { from: "9", to: "5", distance: 102 },
      { from: "9", to: "10", distance: 160 },
      { from: "10", to: "9", distance: 160 },
      { from: "9", to: "11", distance: 380 },
      { from: "11", to: "9", distance: 380 },
      { from: "11", to: "12", distance: 180 },
      { from: "12", to: "11", distance: 180 },
      { from: "11", to: "13", distance: 80 },
      { from: "13", to: "11", distance: 80 },
      { from: "13", to: "14", distance: 180 },
      { from: "14", to: "13", distance: 180 },
      { from: "13", to: "15", distance: 300 },
      { from: "15", to: "13", distance: 300 },
      { from: "15", to: "16", distance: 140 },
      { from: "16", to: "15", distance: 140 },
      { from: "15", to: "17", distance: 80 },
      { from: "17", to: "15", distance: 80 },
      { from: "17", to: "18", distance: 180 },
      { from: "18", to: "17", distance: 180 }
    ]
  };

  // Dijkstra's Algorithm
  const dijkstra = (nodes: any[], edges: any[], startId: string, endId: string) => {
    const graph: { [key: string]: { [key: string]: number } } = {};
    nodes.forEach(node => {
      graph[node.id] = {};
    });
    
    edges.forEach(edge => {
      graph[edge.from][edge.to] = edge.distance;
    });

    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const visited = new Set<string>();
    
    nodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
    });
    distances[startId] = 0;

    while (visited.size < nodes.length) {
      let currentNode: string | null = null;
      let minDistance = Infinity;
      
      for (const nodeId of Object.keys(distances)) {
        if (!visited.has(nodeId) && distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          currentNode = nodeId;
        }
      }

      if (currentNode === null || distances[currentNode] === Infinity) {
        break;
      }

      visited.add(currentNode);

      for (const neighbor of Object.keys(graph[currentNode])) {
        if (!visited.has(neighbor)) {
          const newDistance = distances[currentNode] + graph[currentNode][neighbor];
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
            previous[neighbor] = currentNode;
          }
        }
      }
    }

    if (distances[endId] === Infinity) {
      return null;
    }

    const path: string[] = [];
    let current: string | null = endId;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    return {
      path: path,
      distance: distances[endId]
    };
  };

  const getNodeById = (id: string) => {
    return eventData.nodes.find(node => node.id === id);
  };

  const drawNodesAndEdges = (overlaySvg: SVGSVGElement) => {
    // Clear existing content
    overlaySvg.innerHTML = '';
    
    // Draw edges first
    eventData.edges.forEach(edge => {
      const fromNode = getNodeById(edge.from);
      const toNode = getNodeById(edge.to);
      
      if (fromNode && toNode) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fromNode.x.toString());
        line.setAttribute('y1', fromNode.y.toString());
        line.setAttribute('x2', toNode.x.toString());
        line.setAttribute('y2', toNode.y.toString());
        line.setAttribute('class', 'edge-line');
        line.style.stroke = '#ddd';
        line.style.strokeWidth = '2';
        overlaySvg.appendChild(line);
      }
    });
    
    // Draw nodes
    eventData.nodes.forEach(node => {
      if (node.label !== "turn") {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x.toString());
        circle.setAttribute('cy', node.y.toString());
        circle.setAttribute('r', '10');
        circle.style.fill = '#007bff';
        circle.style.stroke = '#fff';
        circle.style.strokeWidth = '3';
        circle.style.opacity = '0.9';
        overlaySvg.appendChild(circle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x.toString());
        text.setAttribute('y', (node.y - 15).toString());
        text.style.fill = '#333';
        text.style.fontSize = '14px';
        text.style.fontWeight = 'bold';
        text.style.textAnchor = 'middle';
        text.style.textShadow = '1px 1px 2px rgba(255,255,255,0.8)';
        text.textContent = node.label;
        overlaySvg.appendChild(text);
      }
    });
  };

  const drawPath = (overlaySvg: SVGSVGElement, path: string[]) => {
    // Remove existing path lines
    const existingPaths = overlaySvg.querySelectorAll('.path-line');
    existingPaths.forEach(path => path.remove());
    
    for (let i = 0; i < path.length - 1; i++) {
      const fromNode = getNodeById(path[i]);
      const toNode = getNodeById(path[i + 1]);
      
      if (fromNode && toNode) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fromNode.x.toString());
        line.setAttribute('y1', fromNode.y.toString());
        line.setAttribute('x2', toNode.x.toString());
        line.setAttribute('y2', toNode.y.toString());
        line.setAttribute('class', 'path-line');
        line.style.stroke = '#ff4444';
        line.style.strokeWidth = '8';
        line.style.strokeLinecap = 'round';
        line.style.fill = 'none';
        line.style.opacity = '0.9';
        overlaySvg.appendChild(line);
      }
    }
  };

  useEffect(() => {
    if (isOpen && destination && pathfindingOverlayRef.current) {
      const overlaySvg = pathfindingOverlayRef.current;
      
      // Draw the map
      drawNodesAndEdges(overlaySvg);
      
      // Find and draw path from Entrance to destination
      const startId = "1"; // Entrance is always node 1
      const destId = boothToNodeMapping[destination];
      
      if (destId) {
        const result = dijkstra(eventData.nodes, eventData.edges, startId, destId);
        if (result) {
          drawPath(overlaySvg, result.path);
        }
      }
    }
  }, [isOpen, destination]);

  if (!isOpen) return null;

  const destNodeId = boothToNodeMapping[destination];
  const pathResult = destNodeId ? dijkstra(eventData.nodes, eventData.edges, "1", destNodeId) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary-blue">
            Navigation to {destination}
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-auto">
          <div className="relative w-fit bg-gray-50">
            {/* Base SVG Map */}
            <svg 
              width="1635" 
              height="1123" 
              viewBox="0 0 1635.2098 1122.8697" 
              xmlns="http://www.w3.org/2000/svg"
              className="block"
            >
              {/* Your existing SVG content */}
              <g transform="translate(373.67806,-14.406722)">
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M -167.10997,291.91839 V 232.13028" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M -167.10997,110.40916 V 50.621046" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M -184.00995,312.02651 V 232.13028" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M -184.00995,110.40916 V 50.621046" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="m -167.10997,291.91839 h 62.50306" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="m -184.00995,312.02651 h 62.52543" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="m -104.60691,291.91839 v 83.11354" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="m -121.48452,312.02651 v 83.11354" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="m -104.60691,642.33577 v 97.32325" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M -121.48452,642.33577 V 760.03526" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M 211.39573,1094.3662 V 760.03526" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M 194.49576,1094.3662 V 739.65902" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M 194.49576,1094.3662 H -57.282514" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M -302.30973,1094.3662 H -319.2097" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M 202.94575,1114.7424 H -57.282514" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M -302.30973,1114.7424 H -319.2097" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M -104.60691,739.65902 H 126.89588" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M -104.60691,760.03526 H 126.89588" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M -175.55996,30.512925 H -319.2097" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M -184.00995,50.621046 H -344.5373" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M -302.30973,706.94984 V 1114.7424" />
                <path style={{fill:"none", stroke:"#000000", strokeWidth:24.4815}} d="M -319.2097,706.94984 V 1114.7424" />
                
                {/* Add labels */}
                <text x="-101.04825" y="175.82744" style={{fontSize:32, fontFamily:"Arial", fill:"#000000"}} transform="scale(0.91311834,1.0951483)">
                  <tspan>Coffee competition</tspan>
                </text>
                <text x="408.62228" y="196.20503" style={{fontSize:32, fontFamily:"Arial", fill:"#000000"}} transform="scale(0.91311834,1.0951483)">
                  <tspan>Bakery</tspan>
                </text>
                <text x="794.72803" y="172.52565" style={{fontSize:32, fontFamily:"Arial", fill:"#000000"}} transform="scale(0.91311834,1.0951483)">
                  <tspan>Coffee shop</tspan>
                </text>
                <text x="281.3071" y="973.31134" style={{fontSize:32, fontFamily:"Arial", fill:"#000000"}} transform="matrix(1.0724345,0,0,1.3779712,106.58519,-357.95182)">
                  <tspan>Inter food</tspan>
                </text>
                <text x="-29.18259" y="849.23175" style={{fontSize:32, fontFamily:"Arial", fill:"#000000"}} transform="scale(0.91311834,1.0951483)">
                  <tspan>Furnishing</tspan>
                </text>
                <text x="-302.51239" y="828.45197" style={{fontSize:32, fontFamily:"Arial", fill:"#000000"}} transform="scale(0.91311834,1.0951483)">
                  <tspan>CleanTech</tspan>
                </text>
                <text x="145.50063" y="257.32196" style={{fontSize:32, fontFamily:"Arial", fill:"#000000"}} transform="matrix(-0.02934773,0.91264661,-1.0945825,-0.03519819,0,0)">
                  <tspan>Hace adminstration</tspan>
                </text>
              </g>
            </svg>
            
            {/* Pathfinding Overlay */}
            <svg 
              ref={pathfindingOverlayRef}
              width="1635" 
              height="1123" 
              viewBox="0 0 1635.2098 1122.8697" 
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-0 left-0 pointer-events-none z-10"
            />
          </div>
        </div>

        {pathResult && (
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <div className="text-lg font-semibold text-blue-800">
              Path Found!
            </div>
            <div className="text-blue-700">
              <p><strong>From:</strong> Entrance</p>
              <p><strong>To:</strong> {destination}</p>
              <p><strong>Total Distance:</strong> {pathResult.distance.toFixed(1)} units</p>
              <p><strong>Route:</strong> {pathResult.path.map(id => {
                const node = getNodeById(id);
                return node?.label === "turn" ? "turn" : node?.label;
              }).join(' → ')}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NavigationMap;
