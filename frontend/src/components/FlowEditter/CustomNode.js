import React from "react";
import { Handle, Position } from "reactflow";
import "./CustomNode.css";

const CustomNode = ({ data }) => {
    // Function to handle editing response text
    const handleResponseChange = (index, newValue) => {
        if (data.onResponseChange) {
            data.onResponseChange(index, newValue);
        }
    };

    return (
        <div className="node-box">
            {/* Header with Title */}
            <div className="node-header">
                <span className="node-icon">⭕</span>
                <span className="node-title">Question</span>

                {/* Delete Button in the header */}
                <button className="delete-btn" onClick={() => data.onDelete()}>❌</button>
            </div>

            {/* Editable Question */}
            <input
                type="text"
                value={data.label}
                onChange={(e) => data.onChange(e.target.value)}
                className="question-input"
                placeholder="Enter question..."
            />

            {/* Response Options with Individual Outgoing Handles */}
            <div className="response-container">
                {data.responses.map((response, index) => (
                    <div key={index} className="response-option">
                        <div className="response-box">
                            <input
                                type="text"
                                value={response}
                                onChange={(e) => handleResponseChange(index, e.target.value)}
                                className="response-input"
                                placeholder={`Response ${index + 1}`}
                            />
                            {/* Each response has its own handle with a unique ID */}
                            <Handle
                                type="source"
                                position={Position.Right}
                                id={`response-${index}`}
                                className="response-handle"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Incoming Handle for the Whole Box */}
            <Handle
                type="target"
                position={Position.Left}
                className="main-handle"
            />
        </div>
    );
};

export default CustomNode;