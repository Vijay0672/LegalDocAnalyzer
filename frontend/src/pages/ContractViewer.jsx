import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import NoteEditor from '../components/NoteEditor';

const ContractViewer = () => {
    const { id } = useParams();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/contracts/${id}`, {
                    withCredentials: true
                });
                setContract(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load contract');
            } finally {
                setLoading(false);
            }
        };

        // Poll if processing
        fetchContract();
        const interval = setInterval(() => {
            fetchContract();
        }, 5000); // Refresh every 5s to check for analysis completion

        return () => clearInterval(interval);
    }, [id]);

    if (loading && !contract) return <div className="container text-center"><FaSpinner className="spin" /> Loading...</div>;
    if (error) return <div className="container text-center" style={{ color: 'var(--color-danger)' }}>{error}</div>;
    if (!contract) return null;

    return (
        <div className="container" style={{ maxWidth: '1400px' }}>
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                <FaArrowLeft /> Back to Dashboard
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(300px, 1fr)', gap: '2rem', height: '80vh' }}>

                {/* Document View Placeholder -> In real app, render PDF/DOCX here */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                        <h2>{contract.filename}</h2>
                        <span style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: '1rem',
                            fontSize: '0.85rem',
                            backgroundColor: contract.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: contract.status === 'completed' ? 'var(--color-success)' : '#3b82f6'
                        }}>
                            {contract.status}
                        </span>
                    </div>

                    <div style={{
                        flexGrow: 1,
                        backgroundColor: '#fff',
                        color: '#000',
                        borderRadius: '4px',
                        padding: '2rem',
                        overflowY: 'auto',
                        fontFamily: 'Georgia, serif',
                        lineHeight: '1.6'
                    }}>
                        {/* Note: Rendering actual PDF/DOCX requires a dedicated viewer library like react-pdf. 
                 For now, we'll display the extracted clauses if available, or a placeholder. 
                 Since we extract text for AI, we can show that text. 
                 But wait, we didn't store the full raw text in the specific Contract model for viewing, 
                 we stored clauses. Let's show clauses if analysis is done. */}

                        {contract.status === 'processing' && (
                            <div style={{ textAlign: 'center', marginTop: '20%' }}>
                                <FaSpinner className="spin" size={40} style={{ color: 'var(--color-accent-primary)' }} />
                                <p style={{ marginTop: '1rem' }}>AI is analyzing this document...</p>
                            </div>
                        )}

                        {contract.status === 'completed' && (
                            <div>
                                <h3>Contract Analysis View</h3>
                                <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '2rem' }}>
                                    Note: This view highlights extracted clauses. Original file download is not yet implemented.
                                </p>

                                {contract.clauses?.length > 0 ? contract.clauses.map((clause, idx) => (
                                    <div key={idx} style={{
                                        marginBottom: '1.5rem',
                                        padding: '1rem',
                                        backgroundColor: clause.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.1)' :
                                            clause.riskLevel === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                                        borderLeft: `4px solid ${clause.riskLevel === 'high' ? 'var(--color-danger)' :
                                            clause.riskLevel === 'medium' ? 'var(--color-warning)' : 'var(--color-success)'
                                            }`
                                    }}>
                                        <p>{clause.text}</p>
                                    </div>
                                )) : (
                                    <p>No specific clauses extracted.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Analysis Sidebar */}
                <div className="card" style={{ overflowY: 'auto', height: '100%' }}>
                    <h3>AI Insights</h3>

                    {contract.status === 'processing' ? (
                        <p style={{ color: 'var(--color-text-secondary)' }}>Analysis in progress...</p>
                    ) : (
                        <>
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Summary</h4>
                                <p style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>{contract.summary}</p>
                            </div>

                            <div>
                                <h4 style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Risk Assessment & Notes</h4>
                                {contract.clauses?.filter(c => c.riskLevel !== 'low').length === 0 && (
                                    <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <FaCheckCircle style={{ color: 'var(--color-success)' }} />
                                        <p style={{ fontSize: '0.9rem' }}>No significant risks detected.</p>
                                    </div>
                                )}

                                {contract.clauses?.map((clause, idx) => (
                                    <div key={idx} style={{
                                        marginBottom: '1rem',
                                        padding: '1rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: '8px',
                                        border: `1px solid ${clause.riskLevel === 'high' ? 'var(--color-danger)' :
                                            clause.riskLevel === 'medium' ? 'var(--color-warning)' :
                                                clause.riskLevel === 'low' ? 'var(--color-success)' : '#444'}`
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <FaExclamationTriangle style={{
                                                color: clause.riskLevel === 'high' ? 'var(--color-danger)' :
                                                    clause.riskLevel === 'medium' ? 'var(--color-warning)' : 'var(--color-success)'
                                            }} />
                                            <span style={{
                                                fontWeight: 'bold',
                                                fontSize: '0.85rem',
                                                color: clause.riskLevel === 'high' ? 'var(--color-danger)' :
                                                    clause.riskLevel === 'medium' ? 'var(--color-warning)' : 'var(--color-success)',
                                                textTransform: 'uppercase'
                                            }}>
                                                {clause.riskLevel} Risk
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{clause.riskReason}</p>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', borderTop: '1px solid #444', paddingTop: '0.5rem', marginBottom: '0.5rem' }}>
                                            "{clause.text.substring(0, 100)}..."
                                        </div>

                                        {/* Draft.js Note Editor */}
                                        <NoteEditor
                                            contractId={id}
                                            clauseId={clause._id}
                                            initialNote={clause.notes}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default ContractViewer;
