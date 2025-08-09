import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Header.css';
import logo from '../assets/splitzy-logo.png';

function Header({ contextStatus, session }) {
    const location = useLocation();

    const tabs = [
        { label: 'Home', path: '/' },
        { label: 'Create User', path: '/create-user' },
        { label: 'Create Group', path: '/create-group' },
        { label: 'View Users', path: '/view-users' },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className="header">
            <div className="logo-section">
                <div className="logo-wrapper">
                    <img src={logo} alt="Splitzy Logo" className="logo" />
                    <div className="logo-meta">
                        <p className="logo-description">Split expenses with ease</p>
                        {contextStatus && (
                            <div className="context-status">
                                <p>{contextStatus}</p>
                            </div>
                        )}
                    </div>
                </div>

                {session && (
                    <div className="user-session">
                        <span className="user-email">{session.user.email}</span>
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>



            <nav className="nav-tabs">
                {tabs.map(tab => (
                    <Link
                        key={tab.path}
                        to={tab.path}
                        className={`nav-tab ${location.pathname === tab.path ? 'active' : ''}`}
                    >
                        {tab.label}
                    </Link>
                ))}
                {session && (
                    <Link
                        to="/account"
                        className={`nav-tab ${location.pathname === '/account' ? 'active' : ''}`}
                    >
                        My Account
                    </Link>
                )}
            </nav>
        </header>
    );
}

export default Header;
