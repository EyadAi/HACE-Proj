import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const pathfindingOverlayRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pathResult, setPathResult] = useState<{ path: string[], distance: number } | null>(null);

  // Event data from your HTML
  const eventData = {
    nodes: [
      { id: "1", label: "Entrance", x: 1420, y: 800 },
      { id: "2", label: "turn", x: 1420, y: 560 },
      { id: "3", label: "turn", x: 1123, y: 561 },
      { id: "4", label: "Interfood", x: 1123, y: 800 },
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

  const clearOverlay = () => {
    if (pathfindingOverlayRef.current) {
      pathfindingOverlayRef.current.innerHTML = '';
    }
  };

  const drawNodesAndEdges = () => {
    const overlaySvg = pathfindingOverlayRef.current;
    if (!overlaySvg) return;

    clearOverlay();
    
    // Draw edges first (light gray)
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
        line.style.stroke = '#e5e7eb';
        line.style.strokeWidth = '2';
        line.style.opacity = '0.6';
        overlaySvg.appendChild(line);
      }
    });
    
    // Draw nodes (only visible locations)
    eventData.nodes.forEach(node => {
      if (node.label !== "turn") {
        // Node circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x.toString());
        circle.setAttribute('cy', node.y.toString());
        circle.setAttribute('r', '12');
        circle.setAttribute('class', 'location-node');
        
        // Different colors for different locations
        if (node.label === "Entrance") {
          circle.style.fill = '#10b981'; // green
        } else if (node.label === destination) {
          circle.style.fill = '#ef4444'; // red for destination
        } else {
          circle.style.fill = '#3b82f6'; // blue
        }
        
        circle.style.stroke = '#ffffff';
        circle.style.strokeWidth = '3';
        circle.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
        overlaySvg.appendChild(circle);
        
        // Node label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x.toString());
        text.setAttribute('y', (node.y - 20).toString());
        text.setAttribute('class', 'location-label');
        text.style.fill = '#1f2937';
        text.style.fontSize = '14px';
        text.style.fontWeight = '600';
        text.style.textAnchor = 'middle';
        text.style.filter = 'drop-shadow(0 1px 2px rgba(255,255,255,0.8))';
        text.textContent = node.label;
        overlaySvg.appendChild(text);
      }
    });
  };

  const drawPath = (path: string[]) => {
    const overlaySvg = pathfindingOverlayRef.current;
    if (!overlaySvg) return;

    console.log('Drawing path:', path); // Debug log
    
    // Remove existing path lines
    const existingPaths = overlaySvg.querySelectorAll('.path-line');
    existingPaths.forEach(line => line.remove());
    
    // Draw path lines
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
        line.style.stroke = '#ef4444';
        line.style.strokeWidth = '6';
        line.style.strokeLinecap = 'round';
        line.style.strokeDasharray = '10,5';
        line.style.opacity = '0.9';
        line.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
        overlaySvg.appendChild(line);
        
        console.log(`Drew line from ${fromNode.label} (${fromNode.x},${fromNode.y}) to ${toNode.label} (${toNode.x},${toNode.y})`);
      }
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  // Main effect that runs when the modal opens
  useEffect(() => {
    if (isOpen && destination) {
      console.log('Modal opened for destination:', destination);
      
      // Small delay to ensure SVG is rendered
      setTimeout(() => {
        drawNodesAndEdges();
        
        // Find and draw path from Entrance to destination
        const startId = "1"; // Entrance is always node 1
        const destId = boothToNodeMapping[destination];
        
        console.log('Looking for path from', startId, 'to', destId, 'for destination:', destination);
        
        if (destId) {
          const result = dijkstra(eventData.nodes, eventData.edges, startId, destId);
          console.log('Pathfinding result:', result);
          
          if (result) {
            setPathResult(result);
            drawPath(result.path);
          } else {
            setPathResult(null);
          }
        } else {
          console.log('No mapping found for destination:', destination);
          setPathResult(null);
        }
      }, 100);
    }
  }, [isOpen, destination]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <DialogHeader className="p-6 pb-4 bg-white border-b border-slate-200">
          <DialogTitle className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Navigation to <span className="text-blue-600">{destination}</span>
          </DialogTitle>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 mt-4">
            <Button
              onClick={handleZoomOut}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <ZoomOut className="w-4 h-4" />
              Zoom Out
            </Button>
            <Button
              onClick={handleResetZoom}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button
              onClick={handleZoomIn}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <ZoomIn className="w-4 h-4" />
              Zoom In
            </Button>
            <span className="text-sm text-slate-600 ml-4">
              Zoom: {Math.round(zoom * 100)}%
            </span>
          </div>
        </DialogHeader>
        
        <div 
          ref={mapContainerRef}
          className="flex-1 overflow-auto bg-white"
          style={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}
        >
          <div 
            className="relative mx-auto"
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: 'center top',
              transition: 'transform 0.3s ease'
            }}
          >
            {/* Base SVG Map */}
            <svg 
              width="1635" 
              height="1123" 
              viewBox="0 0 1635.2098 1122.8697" 
              xmlns="http://www.w3.org/2000/svg"
              className="block drop-shadow-lg"
              style={{ background: 'white', borderRadius: '8px' }}
            >
              <g transform="translate(373.67806,-14.406722)">
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M -167.10997,291.91839 V 232.13028" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M -167.10997,110.40916 V 50.621046" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M -184.00995,312.02651 V 232.13028" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M -184.00995,110.40916 V 50.621046" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="m -167.10997,291.91839 h 62.50306" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="m -184.00995,312.02651 h 62.52543" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="m -104.60691,291.91839 v 83.11354" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="m -121.48452,312.02651 v 83.11354" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="m -104.60691,642.33577 v 97.32325" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M -121.48452,642.33577 V 760.03526" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M 211.39573,1094.3662 V 760.03526" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M 194.49576,1094.3662 V 739.65902" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M 194.49576,1094.3662 H -57.282514" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M -302.30973,1094.3662 H -319.2097" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M 202.94575,1114.7424 H -57.282514" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M -302.30973,1114.7424 H -319.2097" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M -104.60691,739.65902 H 126.89588" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M -104.60691,760.03526 H 126.89588" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M -175.55996,30.512925 H -319.2097" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M -184.00995,50.621046 H -344.5373" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M -302.30973,706.94984 V 1114.7424" />
                <path style={{fill:"none", stroke:"#64748b", strokeWidth:20}} d="M -319.2097,706.94984 V 1114.7424" />
                
                {/* Labels with better styling */}
                <text x="-101.04825" y="175.82744" style={{fontSize:28, fontFamily:"Arial", fill:"#1e293b", fontWeight:600}} transform="scale(0.91311834,1.0951483)">
                  <tspan>Coffee Competition</tspan>
                </text>
                <text x="408.62228" y="196.20503" style={{fontSize:28, fontFamily:"Arial", fill:"#1e293b", fontWeight:600}} transform="scale(0.91311834,1.0951483)">
                  <tspan>Bakery</tspan>
                </text>
                <text x="794.72803" y="172.52565" style={{fontSize:28, fontFamily:"Arial", fill:"#1e293b", fontWeight:600}} transform="scale(0.91311834,1.0951483)">
                  <tspan>Coffee Shop</tspan>
                </text>
                <text x="281.3071" y="973.31134" style={{fontSize:28, fontFamily:"Arial", fill:"#1e293b", fontWeight:600}} transform="matrix(1.0724345,0,0,1.3779712,106.58519,-357.95182)">
                  <tspan>Interfood</tspan>
                </text>
                <text x="-29.18259" y="849.23175" style={{fontSize:28, fontFamily:"Arial", fill:"#1e293b", fontWeight:600}} transform="scale(0.91311834,1.0951483)">
                  <tspan>Furnishing</tspan>
                </text>
                <text x="-302.51239" y="828.45197" style={{fontSize:28, fontFamily:"Arial", fill:"#1e293b", fontWeight:600}} transform="scale(0.91311834,1.0951483)">
                  <tspan>CleanTech</tspan>
                </text>
                <text x="145.50063" y="257.32196" style={{fontSize:28, fontFamily:"Arial", fill:"#1e293b", fontWeight:600}} transform="matrix(-0.02934773,0.91264661,-1.0945825,-0.03519819,0,0)">
                  <tspan>Hace Administration</tspan>
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
              className="absolute top-0 left-0 pointer-events-none"
              style={{ zIndex: 10 }}
            />
          </div>
        </div>

        {/* Enhanced Path Information */}
        {pathResult && (
          <div className="p-6 bg-white border-t border-slate-200">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-bold text-slate-800">Route Found!</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-700">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">From</span>
                  <span className="text-lg font-semibold text-green-600">Entrance</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">To</span>
                  <span className="text-lg font-semibold text-blue-600">{destination}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Distance</span>
                  <span className="text-lg font-semibold text-slate-800">{pathResult.distance.toFixed(1)} units</span>
                </div>
              </div>
              
              <div className="mt-4">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wide block mb-2">Route</span>
                <div className="flex flex-wrap gap-2">
                  {pathResult.path.map((id, index) => {
                    const node = getNodeById(id);
                    const isLast = index === pathResult.path.length - 1;
                    return (
                      <div key={index} className="flex items-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          node?.label === "turn" 
                            ? "bg-slate-200 text-slate-600" 
                            : index === 0 
                              ? "bg-green-100 text-green-800" 
                              : isLast 
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-700"
                        }`}>
                          {node?.label === "turn" ? "↻" : node?.label}
                        </span>
                        {!isLast && <span className="mx-2 text-slate-400">→</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NavigationMap;
