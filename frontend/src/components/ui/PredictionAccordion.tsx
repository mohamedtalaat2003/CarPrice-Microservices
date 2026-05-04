import React, { useState } from 'react';

interface AccordionProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

const PredictionAccordion: React.FC<AccordionProps> = ({ title, isOpen, onToggle, children }) => {
    return (
        <div className={`accordion ${isOpen ? 'is-open' : ''}`}>
            <div className="accordion-header" onClick={onToggle}>
                <span className="accordion-title">{title}</span>
                <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && (
                <div className="accordion-content">
                    {children}
                </div>
            )}
        </div>
    );
};

export default PredictionAccordion;
