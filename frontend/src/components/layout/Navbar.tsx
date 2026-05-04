import React, { useState, useEffect } from 'react';

const Navbar: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-inner">
                <div className="logo">ELITEVAL.ML</div>
                <button className="nav-cta" onClick={onCtaClick}>Get Estimate</button>
            </div>
        </nav>
    );
};

export default Navbar;
