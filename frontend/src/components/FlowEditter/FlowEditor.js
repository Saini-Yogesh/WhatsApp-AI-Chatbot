import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    Background,
    Controls,
    MiniMap
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";
import "./FlowEditor.css";

const nodeTypes = { custom: CustomNode };
const BASE_URL = process.env.REACT_APP_BASE_URL;

const FlowEditor = ({ flow_id, business_id }) => {

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [flowId, setFlowId] = useState(flow_id);
    const [loading, setLoading] = useState(false);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const addNode = () => {
        const id = `node_${nodes.length + 1}`;
        const newNode = {
            id,
            type: "custom",
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: {
                id,
                label: "New Question?",
                responses: ["Yes", "No", "Other"],
                onChange: (text) => updateNodeLabel(id, text),
                onResponseChange: (index, text) => updateResponse(id, index, text),
                onDelete: () => deleteNode(id),
            },
        };
        setNodes((nds) => [...nds, newNode]);
    };

    const updateNodeLabel = (id, text) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, label: text } } : node
            )
        );
    };

    const updateResponse = (id, index, text) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === id
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            responses: node.data.responses.map((resp, i) => (i === index ? text : resp)),
                        },
                    }
                    : node
            )
        );
    };

    const deleteNode = (id) => {
        setNodes((nds) => nds.filter((node) => node.id !== id));
        setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    };

    const onConnect = (params) => {
        const { sourceHandle } = params;

        // If connecting to a full box, allow it (target should be a full node)
        if (!sourceHandle) {
            setEdges((eds) => addEdge({ ...params }, eds));
        } else {
            // Otherwise, enforce connections only from responses
            setEdges((eds) => addEdge({ ...params, label: sourceHandle.split("-")[1] }, eds));
        }
    };

    const saveFlow = async () => {
        setLoading(true);
        const flowData = { id: flowId, nodes, edges };
        // console.log("Saving flow:", flowData);

        try {
            const res = await fetch(`${BASE_URL}/api/flows/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(flowData)
            });

            const responseData = await res.json();
            if (responseData.id) {
                setFlowId(responseData.id); // Store ID for future updates
            }

            alert(responseData.message);
        } catch (error) {
            console.error("Error saving flow:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        const fetchFlow = async () => {
            if (!flowId) return;
            try {
                const res = await fetch(`${BASE_URL}/api/flows/get/${flowId}`);
                const data = await res.json();
                if (data && data.nodes) {
                    // Re-assign event handlers
                    const updatedNodes = data.nodes.map((node) => ({
                        ...node,
                        data: {
                            ...node.data,
                            onDelete: () => deleteNode(node.id), // Re-add onDelete function
                            onChange: (text) => updateNodeLabel(node.id, text),
                            onResponseChange: (index, text) => updateResponse(node.id, index, text),
                        }
                    }));

                    setNodes(updatedNodes);
                    setEdges(data.edges);
                    setFlowId(data._id); // Store document ID
                }
            } catch (error) {
                console.error("Error fetching flow:", error);
            }
        };

        fetchFlow();
    }, [flowId]);


    return (
        <div className="flow-container">
            <div className="flow-continer-navbar">
                <button onClick={addNode} className="btn">Add Question</button>
                <button onClick={saveFlow} className="btn" disabled={loading}>{!loading ? "Save" : "Saving..."}</button>
            </div>
            <div className="flow-editor">
                <ReactFlow
                    nodes={nodes.length === 0 ? [{
                        id: "start-node",
                        type: "default",
                        data: { label: "Start your flow" },
                        position: { x: 300, y: 200 },
                        draggable: false
                    }] : nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Background />
                    <Controls
                        style={{
                            background: "rgba(0, 0, 0, 0.7)",
                            padding: "8px 12px",
                            borderRadius: "10px",
                            display: "flex",
                            gap: "10px"
                        }}
                    />
                    <MiniMap
                        nodeStrokeColor={(node) => (node.type === "custom" ? "#ffa726" : "#ffffff")}
                        nodeColor={(node) => (node.type === "custom" ? "#ffa726" : "#ffffff")}
                        nodeBorderRadius={2}
                        position="bottom-right"
                    />

                </ReactFlow>
            </div>
        </div >
    );
};

export default FlowEditor;
