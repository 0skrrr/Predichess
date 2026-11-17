
import type { HomeLesson} from "./Home";
import {getTranslations} from "../../support_scripts/languages";

// Formátování času
const formatDate = (dateString: string | undefined): string => {
    if (dateString) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString();
        }
    }
    return "N/A";
};


export function LessonCard ({ lesson }: { lesson: HomeLesson }) {

    // Nastavení proměnných
    const displayDate = lesson.completed_at || lesson.last_saved_at;
    const dateLabel = lesson.completed_at ? getTranslations().home.lessonCompleted : getTranslations().home.lessonLastSaved;

    const statusTag = lesson.status === "draft" ? "Draft" :
        lesson.is_work_in_progress ? "WIP" :
            lesson.completed_at ? "Completed" :
                "Published";

    // Render
    return (
        <div className="lesson-home-card">
            <p className="home-lesson-title">{lesson.title}</p>
            <p className="home-lesson-description">{lesson.description || getTranslations().home.lessonNoDescription}</p>

            <p className="lesson-difficulty-tag">
                {getTranslations().home.lessonDifficultyTitle} {lesson.difficulty || getTranslations().home.lessonNA}
            </p>

            <p className="lesson-status-tag">
                {getTranslations().home.lessonStatusTitle} {statusTag}
            </p>

            <p className="lesson-date">
                {dateLabel}: {formatDate(displayDate)}
            </p>
        </div>
    );
};