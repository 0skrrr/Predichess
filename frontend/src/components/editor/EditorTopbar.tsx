import {
    saveLessonData,
    publishLesson,
    createLesson,
    fetchLessonData,
    fetchUserLessons
} from "../../support_scripts/lessonAPI";
import {useEffect, useState} from "react";
import {useLessonContext} from "../../support_scripts/lessonContext";
import type {Lesson} from "../../support_scripts/types";
import {useUserId} from "../../support_scripts/auth";


export function EditorTopbar() {

    const userId = useUserId();
    const {state, dispatch} = useLessonContext();

    const [isOpen, setIsOpen] = useState(false);
    const [dbLessons, setDbLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);

    const currentLesson = state.lessons.find(l => l.id === state.currentLessonId);


    useEffect(() => {
        loadUserLessons();
    }, [userId])

    const handleSelectLesson = async (lessonId: string) => {
        try {
            const data = await fetchLessonData(lessonId);

            dispatch({
                type: "LOAD_LESSON_WITH_DATA",
                lessonId,
                steps: data.steps,
                tasks: data.tasks,
            });

            setIsOpen(false);
        } catch (err) {
            dispatch({ type: "LOAD_LESSON_WITH_DATA", lessonId: "", steps: [], tasks: [] });
        }
    }



    // Načtení uživatelových lekcí
    const loadUserLessons = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const lessons: Lesson[] = await fetchUserLessons(userId);
            setDbLessons(lessons);

            dispatch({
                type: "SET_ALL_LESSONS",
                lessons
            });

            if (lessons.length > 0 && lessons[0].id) {
                await handleSelectLesson(lessons[0].id);
            }

        } catch (err) {
        } finally {
            setLoading(false);
        }
    }


    // Přidání lekce
    const handleAddLesson = async() => {
        try {
            if (!userId) {
                alert("Please log in to create a lesson.");
                return;
            }
            const newTitle = prompt("Enter lesson title");
            if (!newTitle) return

            const lesson = await createLesson(newTitle, userId)

            dispatch({ type: "ADD_LESSON" });

            await loadUserLessons();

            const newLesson = (await fetchUserLessons(userId)).find(l => l.id === lesson.id);

            if (newLesson?.id) {
                await handleSelectLesson(newLesson.id);
            }

            alert("New lesson created")
        } catch(err) {
        }
    }

    // Uložření lekce

    const handleSave = async() => {
        if (!userId || !state.currentLessonId) {
            alert("Cannot save: Lesson not selected or user not logged in.");
            return
        }
        try {
            await saveLessonData(
                state.currentLessonId,
                state,
                userId
            )
            alert("Lesson saved")
        } catch(err) {
        }
    }


    // Publikování lekce
    const handlePublish = async () => {
        if (!userId || !state.currentLessonId) {
            alert("Cannot publish: Lesson not selected or user not logged in.");
            return;
        }

        const description = prompt("Please enter a short description for your lesson (required):");
        if (!description || description.trim() === '') {
            alert("A description is required to publish the lesson.");
            return;
        }

        const eloInput = prompt("Enter the required ELO rating for this lesson (e.g., 1200):");
        if (!eloInput) {
            alert("ELO rating input cancelled. Publishing aborted.");
            return;
        }

        const elo = parseInt(eloInput.trim(), 10);

        if (isNaN(elo) || elo < 0) {
            alert("Invalid ELO rating. Please enter a positive number.");
            return;
        }

        const numericUserId = parseInt(String(userId), 10);
        if (isNaN(numericUserId)) {
            alert("Invalid user ID format.");
            return;
        }

        try {
            await saveLessonData(
                state.currentLessonId,
                state,
                userId
            )

            await publishLesson(
                state.currentLessonId,
                numericUserId,
                elo,
                description
            )

            alert("Lesson published successfully!");
        } catch(err) {
            alert("Failed to publish lesson. Check console for details.")
        }
    }


    // Render
    return (
        <div className="editor-top-bar">
            <div className="editor-top-bar-left">
                <div
                    className="editor-select-lesson"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {!isOpen && (
                        <p>{currentLesson?.title || "No lesson selected"}</p>
                    )}
                </div>
                {isOpen && (
                    <div className="lesson-dropdown">
                        {loading ? (
                            <div className="lesson-dropdown-item">
                                Loading...
                            </div>
                        ): dbLessons.length === 0 ? (
                            <div className="lesson-dropdown-item">
                                No lessons created
                            </div>
                        ): (
                            dbLessons.map(lesson => (
                                <div
                                    key={lesson.id}

                                    // Střídání dropdownu mezi zobrazením a neviditelností
                                    className={`lesson-dropdown-item ${lesson.id === state.currentLessonId ? "active" : ''}`}
                                    onClick={() => handleSelectLesson(lesson.id)}
                                >
                                    {lesson.title}
                                </div>
                            ))
                        )}
                    </div>
                )}
                <button className="editor-add-lesson" onClick={handleAddLesson}>
                    + New Lesson
                </button>
            </div>
            <div className="editor-topbar-right">
                <button className="editor-save" onClick={handleSave}>
                    {"Save"}
                </button>
                <button
                    className="editor-publish"
                    onClick={handlePublish}
                >
                    Publish
                </button>
            </div>
        </div>
    )
}