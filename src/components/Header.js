import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../assets/splitzy-logo.png';

function Header({ contextStatus }) {
    const location = useLocation();

    const tabs = [
        { label: 'Home', path: '/' },
        { label: 'Create User', path: '/create-user' },
        { label: 'Create Group', path: '/create-group' },
        { label: 'View Users', path: '/view-users' },
    ];

    return (
        <header className="header">
            <div className="logo-section">
                <img src={logo} alt="Splitzy Logo" className="logo" />
                <p className="logo-description">
                    Split expenses with ease
                </p>
                {contextStatus && (
                    <div className="context-status">
                        <p>{contextStatus}</p>
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
            </nav>
        </header>
    );
}

export default Header;
