interface MetaBarProps {
    title: string;
    description: string;
    points: number;
    timer: string;
    lessonElo: number;
}
// Komponent zobrazující statistiky nahoře obrazovky

export function LessonTopBar({
      title = "Lesson Title",
      description = "Description loading...",
      points = 0,
      timer = "00:00",
      lessonElo = 1200
                              }: MetaBarProps) {
    return (
        <div className="lp-bar">
            <div className="lp-header">
                <h1 className="lp-headline">{title}</h1>
                <p className="lp-subtitle">{description}</p>
            </div>

            <div className="lp-stats">
                <MetaItem label="Points" value={points.toString()} />
                <MetaItem label="Difficulty" value={lessonElo.toString()} />
                <MetaItem label="Time" value={timer} />
            </div>
        </div>
    );
}

const MetaItem = ({
                      label,
                      value,
                      icon,
                      highlight
}: {
    label: string,
    value: string,
    icon?: string,
    highlight?: boolean
}) => (
    <div className="lp-stat-block">
        <span className="lp-stat-label">{label}</span>
        <span className={`lp-stat-value ${highlight ? 'lp-text-green' : ''}`}>
            {icon} {value}
        </span>
    </div>
);