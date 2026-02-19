import React from 'react';
import './MedicalDisclaimer.css';

const MedicalDisclaimer = () => {
    return (
        <div className="medical-disclaimer">
            <div className="disclaimer-icon">⚠️</div>
            <div className="disclaimer-content">
                <h3 className="disclaimer-title">Medical Disclaimer</h3>
                <p className="disclaimer-text">
                    This tool is for <strong>educational purposes only</strong> and does NOT diagnose diseases
                    or prescribe medications. Always consult a qualified healthcare professional for medical advice,
                    diagnosis, or treatment. In case of emergency, call your local emergency services immediately.
                </p>
            </div>
        </div>
    );
};

export default MedicalDisclaimer;
