import React, { useEffect, useReducer, useState} from "react";
import { lessonOperations, intialState} from "../../support_scripts/lessonEditingLogic";
import { fetchLessonData, saveLessonCompletion, fetchPlayerStats } from "../../support_scripts/lessonAPI";
import{useUserId} from "../../support_scripts/auth";
import { LessonTopBar} from "./LessonTopBar";
import { StepSidebar} from "./StepSidebar";
import { EndOfLessonPopup} from "./EndOfLessonPopup";
import { LessonContent} from "./LessonContent";
import {getTranslations} from "../../support_scripts/languages";
import "../../index.css"

interface LessonPlayerProps {
    lessonId: string;
    onExit: () => void;
}

// Soubor řídící celou logiku přehrávání lekce


const getInitialLessonMeta = (lesson: any) => ({
    title: lesson.title,
    description: lesson.description || getTranslations().learn.player.noDescription,
    lessonElo: parseInt(lesson.difficulty, 10) || 1200,
});

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ lessonId, onExit }) => {

    const userId = useUserId();

    const [playerElo, setPlayerElo] = useState(1200);

    const [state, dispatch] = useReducer(lessonOperations, {
        ...intialState,
        steps: [],
        tasks: [],
    });

    const [loading, setLoading] = useState(true);
    const [lessonMeta, setLessonMeta] = useState(getInitialLessonMeta({
        id: "", title: "Loading...", description: "", stepIds: []
    }));

    const [showComplete, setShowComplete] = useState(false);
    const [stats, setStats] = useState({
        points: 0,
        timerSeconds: 0,
        xpGained: 0,
        eloChange: 0,
    });

    useEffect(() => {
        const loadLesson = async () => {
            setLoading(true);
            try {
                if (userId !== null) {
                    try {
                        const playerStats = await fetchPlayerStats(userId);
                        setPlayerElo(playerStats.elo);
                    } catch (e) {
                        console.warn("Failed to fetch player stats. Using default ELO (1200).", e);
                    }
                } else {
                    console.warn("User ID not found. Using default ELO (1200).");
                }

                const data = await fetchLessonData(lessonId);

                dispatch({
                    type: "LOAD_LESSON_WITH_DATA",
                    lessonId: data.lesson.id,
                    steps: data.steps,
                    tasks: data.tasks,
                });

                setLessonMeta(getInitialLessonMeta(data.lesson));
                setStats(prev => ({ ...prev, points: 0, timerSeconds: 0 }));

            } catch (error) {
                console.error("Error loading lesson:", error);
            } finally {
                setLoading(false);
            }
        };
        loadLesson();
    }, [lessonId, userId]);

    useEffect(() => {
        let interval: number | null = null;
        if (!loading && !showComplete) {
            interval = window.setInterval(() => {
                setStats(prev => ({ ...prev, timerSeconds: prev.timerSeconds + 1 }));
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [loading, showComplete]);



    const handleLessonComplete = async () => {
        setShowComplete(true);

        // Logické výpočty po dokončení lekce
        // Úprava statistik hráče
        const lessonElo = lessonMeta.lessonElo;
        const totalPoints = stats.points;
        const timeSpent = stats.timerSeconds;
        const totalSteps = state.steps.length;

        const maxPoints = totalSteps * 10;
        const scoreFactor = Math.min(1.5, totalPoints / maxPoints);

        const timeLimit = totalSteps * 30;
        const timeFactor = Math.max(0.5, 1 - (timeSpent / timeLimit) * 0.5);

        const baseXP = 100;
        const xpGained = Math.round(baseXP * scoreFactor * timeFactor);

        const K_FACTOR = 30;
        const expectedScore = 1 / (1 + Math.pow(10, (lessonElo - playerElo) / 400));
        const actualScore = scoreFactor * 0.8 + 0.2;
        const eloChange = Math.round(K_FACTOR * (actualScore - expectedScore));

        setStats(s => ({
            ...s,
            xpGained: xpGained,
            eloChange: eloChange
        }));

        try {
            await saveLessonCompletion(
                lessonId,
                userId,
                totalPoints,
                timeSpent,
                xpGained,
                eloChange
            );
        } catch (error) {
            console.error("Failed to save lesson completion:", error);
        }
    };

    // Upravení času, ať to nějak vypadá
    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    // Překliknutí dál
    const handleStepSelect = (stepId: string) => {
        dispatch({ type: "SELECT_STEP", stepId });
    };


    // Překliknutí dál nebo ukončení lekce
    const handleNextStep = () => {
        const currentStepIndex = state.steps.findIndex(s => s.id === state.selectedStepId);
        const nextStepIndex = currentStepIndex + 1;

        if (nextStepIndex < state.steps.length) {
            dispatch({ type: "SELECT_STEP", stepId: state.steps[nextStepIndex].id });
        } else {
            handleLessonComplete();
        }
    };

    if (loading) return <div className="lp-loading">{getTranslations().learn.player.loadingLesson} {lessonId}...</div>;

    const activeStep = state.steps.find(s => s.id === state.selectedStepId) || null;
    const isLastStep = state.steps.length > 0 && activeStep?.id === state.steps[state.steps.length - 1].id;
    console.log("activestep: ", activeStep?.content)
    return (
        <div className="lp-container">
            <LessonTopBar
                title={lessonMeta.title}
                description={lessonMeta.description}
                points={stats.points}
                timer={formatTime(stats.timerSeconds)}
                lessonElo={lessonMeta.lessonElo}
            />

            <div className="lp-layout-grid">
                <StepSidebar
                    steps={state.steps}
                    activeStepId={state.selectedStepId}
                    onSelectStep={handleStepSelect}
                />

                <main className="lp-main-content">
                    <LessonContent
                        step={activeStep}
                        onComplete={handleLessonComplete}
                        onNextStep={handleNextStep}
                        isLastStep={isLastStep}
                        addPoints={(pts) => setStats(s => ({...s, points: s.points + pts}))}
                    />
                </main>
            </div>

            {showComplete && (
                <EndOfLessonPopup
                    stats={{
                        points: stats.points,
                        time: formatTime(stats.timerSeconds),
                        xpGained: stats.xpGained,
                        eloChange: stats.eloChange,
                        completion: 100
                    }}
                    onExit={onExit}
                />
            )}
        </div>
    );
};