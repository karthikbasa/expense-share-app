import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>© 2025 Siva Basa. All rights reserved.</p>
                <div className="footer-links">
                    <Link to="/privacy">Privacy</Link>
                    <Link to="/terms">Terms</Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
