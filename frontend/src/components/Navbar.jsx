import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaFileContract, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav style={{
            backgroundColor: 'var(--color-bg-secondary)',
            padding: '1rem 2rem',
            borderBottom: '1px solid #333',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                <FaFileContract style={{ color: 'var(--color-accent-primary)' }} />
                <span>Drop_Analyse</span>
            </Link>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaUserCircle />
                            <span>{user.email}</span>
                        </div>
                        <button onClick={logout} style={{ padding: '0.4em 0.8em', fontSize: '0.9em' }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">
                            <button style={{ padding: '0.4em 0.8em', fontSize: '0.9em' }}>Get Started</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
