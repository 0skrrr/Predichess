import { useState } from 'react';
import { LessonsList } from './LessonsList';
import { LessonPlayer } from './LessonPlayer';


const mockId = 101;
// Spuštění lekce
export function LearnLayout() {
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

    const handleStartLesson = (lessonId: string) => {
        setActiveLessonId(lessonId);
    };

    const handleExitLesson = () => {
        setActiveLessonId(null);
    };

    if (activeLessonId) {
        return (
            <LessonPlayer
                lessonId={activeLessonId}
                onExit={handleExitLesson}
            />
        );
    }

    return (
        <LessonsList
            onStartLesson={handleStartLesson}
            userId={mockId}
        />
    );
}