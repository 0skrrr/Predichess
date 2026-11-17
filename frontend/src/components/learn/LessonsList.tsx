import { useState, useEffect } from "react";
import { fetchRecentLessons} from "../../support_scripts/lessonAPI";
import {ThumbnailBoard} from "./ThumbnailBoard";
import {getTranslations} from "../../support_scripts/languages";

export interface PublicLesson {
    id: number;
    title: string;
    description: string;
    creator_id: number;
    creator_name: string;
    published_at: string;
    thumbnail_fen?: string;
}

interface LessonsListProps {
    onStartLesson: (lessonId: string) => void;
    userId: number;
}

export function LessonsList({ onStartLesson, userId }: LessonsListProps) {
    const [lessons, setLessons] = useState<PublicLesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Načtení ihned
    useEffect(() => {
        loadRecentLessons();
    }, []);

    const loadRecentLessons = async () => {
        try {
            setLoading(true);
            const data = await fetchRecentLessons(20);
            setLessons(data);
        } catch (err) {
            setError(getTranslations().learn.list.failedToLoadLessons);
        } finally {
            setLoading(false);
        }
    };

    const handleLessonClick = (lessonId: number) => {
        onStartLesson(lessonId.toString());
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return getTranslations().learn.list.today;
        if (diffDays === 1) return getTranslations().learn.list.yesterday;
        if (diffDays < 7) return diffDays + getTranslations().learn.list.daysAgo;
        return Math.floor(diffDays / 30) + getTranslations().learn.list.monthsAgo;
    };

    if (loading) return <div>{getTranslations().learn.list.loadingLessons}</div>;
    if (error) return <div>{error}</div>;

    // Render listu
    return (
        <div className="lessons-list">
            <div className="lessons-header">
                <p className="learn-title">{getTranslations().learn.list.recentLessons}</p>
                <p className="learn-subtitle">{getTranslations().learn.list.subtitle}</p>
            </div>

            <div className="lessons-grid">
                {lessons.map(lesson => (
                    <div
                        key={lesson.id}
                        className="lesson-card"
                        onClick={() => handleLessonClick(lesson.id)}
                    >
                        <div className="lesson-thumbnail">
                            <ThumbnailBoard fen={lesson.thumbnail_fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"} />
                        </div>

                        <div className="lesson-card-content">
                            <div className="lesson-card-header">
                                <h3 className="lesson-title">{lesson.title}</h3>
                                {lesson.creator_id === userId && (
                                    <span className="lesson-badge">{getTranslations().learn.list.yourLesson}</span>
                                )}
                            </div>
                            <p className="lesson-description">
                                {lesson.description || getTranslations().learn.list.noDescription}
                            </p>
                            <div className="lesson-card-footer">
                                <div className="lesson-meta">
                                    <span className="creator">
                                        {lesson.creator_name}
                                    </span>
                                    <span className="date">
                                        {formatDate(lesson.published_at)}
                                    </span>
                                </div>
                                <button className="btn-start-lesson">
                                    {getTranslations().learn.list.startLesson}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}