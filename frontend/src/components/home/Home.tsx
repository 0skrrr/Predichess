import { useState, useEffect } from 'react';
import { apiFetch } from "../../support_scripts/url";
import { getCookie } from "../../support_scripts/getCookie";
import {LessonCard} from "./LessonCard";
import {getTranslations} from "../../support_scripts/languages";


// Nastavení typů
interface UserProfile {
    username: string;
    elo: number;
    xp: number;
    country_code: string;
    bio: string;
    created_at: string;
}

export interface HomeLesson {
    id: number;
    title: string;
    description: string;
    difficulty: string | null;
    category: string | null;
    average_rating: number | null;
    is_work_in_progress?: number;
    last_saved_at?: string;
    published_at?: string;
    status?: string;

    completed_at?: string;
    score?: number;
}
interface FetchResult {
    success: boolean;
    userProfileData: UserProfile;
    recentlyCompletedLessons: HomeLesson[];
    recentlyWorkedOnLessons: HomeLesson[];
}

export function Home() {

    // Inicializace stavových proměných
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [completedLessons, setCompletedLessons] = useState<HomeLesson[]>([]);
    const [workedOnLessons, setWorkedOnLessons] = useState<HomeLesson[]>([]);
    const [error, setError] = useState('');

    // Spuštění funkce hned po renderu
    useEffect(() => {
        fetchUserData();
    }, []);


    // Funkce získávající všechna data o uživateli
    const fetchUserData = async () => {
        try {

            const cookie = getCookie("userId");

            if (!cookie) {
                setError(getTranslations().errors.userIdCookieMissing);
                return;
            }

            // Jednoduchá žádost o data
            const res = await apiFetch("/user/" + cookie);

            if (!res.ok) {
                throw new Error(getTranslations().errors.HTTPError + res.status);
            }

            const result: FetchResult = await res.json();

            if (result.success) {
                // Nastavení všech informací do náležících proměnných

                setProfile(result.userProfileData);
                let wipLessons: HomeLesson[] = [];
                const rawWip = result.recentlyWorkedOnLessons;
                if (Array.isArray(rawWip)) {
                    wipLessons = rawWip;
                } else if (rawWip) {
                    wipLessons = [rawWip];
                }
                setWorkedOnLessons(wipLessons);
                let completed: HomeLesson[] = [];
                const rawCompleted = result.recentlyCompletedLessons;
                if (Array.isArray(rawCompleted)) {
                    completed = rawCompleted;
                } else if (rawCompleted) {
                    completed = [rawCompleted];
                }
                setCompletedLessons(completed);

            } else {
                setError(getTranslations().errors.failedToFetchPlayerStats);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : getTranslations().errors.unknownError);
        }
    };


    if (error) {
        return <div className="text-center">{error}</div>;
    }

    if (!profile) {
        return <div className="text-center">{getTranslations().home.noProfile}</div>;
    }


    // Vrácení všeho, využití LessonCard komponentu
    return (
        <div className="home-div">
            <div className="profile-card">
                <div className="profile-header">
                    <h2 className="username">{profile.username}</h2>
                    <p className="member-since">
                        {getTranslations().home.memberSince} {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-label">{getTranslations().home.elo}</span>
                        <span className="stat-value">
                            {profile.elo}
                        </span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">{getTranslations().home.XP}</span>
                        <span className="stat-value">{profile.xp}</span>
                    </div>
                </div>
            </div>

            <div className="home-other">
                <div className="lessons-section">
                    <p className="lessons-section-header">
                        Last worked on lesson
                    </p>
                    <div className="lesson-list worked-on">
                        {workedOnLessons.length > 0 ? (
                            workedOnLessons.map(lesson => (
                                <LessonCard key={lesson.id} lesson={lesson} />
                            ))
                        ) : (
                            <p className="no-lessons">You haven't started any lessons yet!</p>
                        )}
                    </div>
                </div>
                <div className="lessons-section">
                    <p className="lessons-section-header">
                        Last completed lesson
                    </p>
                    <div className="lesson-list">
                        {completedLessons.length > 0 ? (
                            completedLessons.map(lesson => (
                                <LessonCard key={lesson.id} lesson={lesson} />
                            ))
                        ) : (
                            <p className="no-lessons">Complete your first lesson to see it here!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}