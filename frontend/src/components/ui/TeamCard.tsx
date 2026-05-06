import React from 'react';
import { type TeamMember } from '../../types/car';

const TeamCard: React.FC<{ member: TeamMember }> = ({ member }) => {
    return (
        <div className="contact-card">
            <img src={member.image} alt={member.name} />
            <h4 className="member-name">{member.name}</h4>
            <p className="member-role">{member.role}</p>
            <div className="contact-links">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <span className="separator">|</span>
                <a href={member.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                <div className="member-email">{member.email}</div>
            </div>
        </div>
    );
};

export default TeamCard;
