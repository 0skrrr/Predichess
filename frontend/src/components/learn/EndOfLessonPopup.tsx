import React from 'react';

interface PopupStats {
    points: number;
    time: string;
    xpGained: number;
    eloChange: number;
    completion: number;
}

interface PopupProps {
    stats: PopupStats;
    onExit: () => void;
}
// Popup, ukáže data a umožní návrat pryč ze stránky
export const EndOfLessonPopup: React.FC<PopupProps> = ({ stats, onExit }) => {
    const eloValue = stats.eloChange >= 0 ? `+${stats.eloChange}` : `${stats.eloChange}`;

    return (
        <div className="lp-overlay">
            <div className="lp-content">
                <h2 className="lp-headline">Lesson Complete!</h2>

                <div className="lp-stats-grid">
                    <StatBox label="Points" value={stats.points} />
                    <StatBox label="Time" value={stats.time} />
                    <StatBox label="XP Gained" value={`+${stats.xpGained}`}/>
                    <StatBox label="Elo Change" value={eloValue} />
                </div>

                <div className="lp-actions">
                    <button className="lp-btn-back" onClick={onExit}>Back to Menu</button>
                </div>
            </div>
        </div>
    );
};

const StatBox = ({ label, value}: { label: string, value: string | number}) => {
    return (
        <div className="lp-stat-box">
            <span className="lp-stat-box-label">{label}</span>
            <span className="lp-stat-box-value">{value}</span>
        </div>
    );
};