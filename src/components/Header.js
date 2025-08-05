import React from 'react';
import './Header.css';
import logo from '../assets/formiq-logo.png';

function Header() {
    return (
        <header className="header">
            <img src={logo} alt="FormiQ Logo" className="logo" />
        </header>
    );
}

export default Header;
