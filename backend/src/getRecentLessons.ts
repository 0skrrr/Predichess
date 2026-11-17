
import { Express, Request, Response } from "express";
import mariadb from "mariadb";


const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

// získání FEN dat pro thumbnail lekce

const getThumbnailFen = (lessonDataString: string | null): string => {
    if (!lessonDataString) {
        return DEFAULT_FEN;
    }

    try {
        const data = JSON.parse(lessonDataString);

        if (data.steps && Array.isArray(data.steps)) {

            const firstBoardStepWithFen = data.steps.find((step: any) =>
                step.type === "board" &&
                step.content &&
                step.content.fen
            );

            if (firstBoardStepWithFen) {
                return firstBoardStepWithFen.content.fen;
            }
        }
    } catch (e) {
        console.error("Error parsing lesson data:", e);
    }

    return DEFAULT_FEN;
};

export function getRecentLessons(app:Express, pool:mariadb.Pool) {
    app.get("/lessons/recent", async(req,res) => {
        let conn;

        try{
            conn = await pool.getConnection();
            const {limit = 20} = req.query;


            const lessons = await conn.query(
                `SELECT
                     l.id,
                     l.title,
                     l.description,
                     l.creator_id,
                     l.created_at,
                     l.published_at,
                     a.username as creator_name,
                     ld.data AS lesson_data
                 FROM predichess_database.lessons l
                          JOIN predichess_database.accounts a ON l.creator_id = a.id
                          LEFT JOIN predichess_database.lesson_data ld ON l.id = ld.lesson_id
                 WHERE l.status = 'published'
                 ORDER BY l.published_at DESC
                 LIMIT ?`,
                [parseInt(limit as string)]
            );


            const lessonWithThumbnails = lessons.map((lesson: any) => {

                const thumbnail_fen = getThumbnailFen(lesson.lesson_data);


                const { lesson_data, ...restOfLesson } = lesson;

                return {
                    ...restOfLesson,
                    thumbnail_fen: thumbnail_fen
                };
            });


            res.json({
                success: true,
                lessons: lessonWithThumbnails
            });
        }
        catch (err) {
            console.error("getRecentLessonsError:", err);
            res.status(500).json({
                success: false,
                message: "Failed to fetch recent lessons"
            });
        } finally {
            if (conn) conn.release();
        }
    });
}