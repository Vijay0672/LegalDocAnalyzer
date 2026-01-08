import React, { useState, useEffect } from 'react';
import { Editor, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import axios from 'axios';
import { FaSave, FaSpinner } from 'react-icons/fa';

const NoteEditor = ({ contractId, clauseId, initialNote }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initialNote) {
            try {
                const contentState = convertFromRaw(JSON.parse(initialNote));
                setEditorState(EditorState.createWithContent(contentState));
            } catch (e) {
                console.error("Failed to parse note:", e);
                // If parsing fails (e.g., old string format), sticky to empty
            }
        }
    }, [initialNote]);

    const handleSave = async () => {
        setSaving(true);
        const contentState = editorState.getCurrentContent();
        const rawContent = JSON.stringify(convertToRaw(contentState));

        try {
            await axios.put(
                `http://localhost:5000/api/contracts/${contractId}/clauses/${clauseId}`,
                { note: rawContent },
                { withCredentials: true }
            );
            // Optionally show success feedback
        } catch (error) {
            console.error("Failed to save note:", error);
            alert("Failed to save note");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ marginTop: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', padding: '0.5rem' }}>
            <div style={{ minHeight: '80px', maxHeight: '150px', overflowY: 'auto', marginBottom: '0.5rem' }}>
                <Editor
                    editorState={editorState}
                    onChange={setEditorState}
                    placeholder="Add your notes here..."
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        padding: '0.3rem 0.8rem',
                        fontSize: '0.8rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                    }}
                >
                    {saving ? <FaSpinner className="spin" /> : <FaSave />}
                    Save Note
                </button>
            </div>
        </div>
    );
};

export default NoteEditor;
