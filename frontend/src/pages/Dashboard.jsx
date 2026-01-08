import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaSpinner, FaFilePdf, FaFileWord } from 'react-icons/fa';

const Dashboard = () => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const fetchContracts = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/contracts', {
                withCredentials: true
            });
            setContracts(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load contracts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf' && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            alert('Only PDF and DOCX files are allowed');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            await axios.post('http://localhost:5000/api/contracts/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });
            fetchContracts(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="container text-center"><FaSpinner className="spin" /> Loading...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Your Contracts</h1>

                <div style={{ position: 'relative' }}>
                    <input
                        type="file"
                        id="file-upload"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                        accept=".pdf,.docx"
                        disabled={uploading}
                    />
                    <label htmlFor="file-upload">
                        <span className="btn" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: uploading ? 'not-allowed' : 'pointer',
                            backgroundColor: 'var(--color-accent-primary)',
                            padding: '0.6em 1.2em',
                            borderRadius: 'var(--border-radius)',
                            color: 'white',
                            fontWeight: 500
                        }}>
                            {uploading ? <FaSpinner className="spin" /> : <FaPlus />}
                            {uploading ? 'Uploading...' : 'Upload Contract'}
                        </span>
                    </label>
                </div>
            </div>

            {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</div>}

            <div className="card" style={{ padding: '0' }}>
                {contracts.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                        No contracts uploaded yet. Upload one to get started!
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #333', color: 'var(--color-text-secondary)' }}>
                                <th style={{ padding: '1rem' }}>Filename</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contracts.map(contract => (
                                <tr key={contract._id} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {contract.filename.endsWith('.pdf') ? <FaFilePdf color="#ef4444" /> : <FaFileWord color="#3b82f6" />}
                                        {contract.filename}
                                    </td>
                                    <td style={{ padding: '1rem' }}>{new Date(contract.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.85rem',
                                            backgroundColor: contract.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' :
                                                contract.status === 'processing' ? 'rgba(59, 130, 246, 0.2)' :
                                                    contract.status === 'failed' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                            color: contract.status === 'completed' ? 'var(--color-success)' :
                                                contract.status === 'processing' ? '#3b82f6' :
                                                    contract.status === 'failed' ? 'var(--color-danger)' : 'var(--color-warning)'
                                        }}>
                                            {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <Link to={`/contract/${contract._id}`} style={{ marginRight: '1rem' }}>Open</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default Dashboard;
