

import { Express, Request, Response } from "express";
import mariadb from "mariadb";
// Publikování lekce
export function publishLesson(app: Express, pool: mariadb.Pool) {
    app.patch("/lessons/:lessonId/publish", async (req, res) => {
        let conn;
        console.log("publishLesson: ", req, res);
        try {
            console.log("ano01")
            conn = await pool.getConnection();
            const { lessonId } = req.params;

            const { creator_id, elo, description } = req.body;

            if (typeof elo !== 'number' || elo < 100 || elo > 3000) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Elo rating provided."
                });
            }
            if (!creator_id) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication failed. Creator ID missing."
                });
            }

            if (!description || typeof description !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: "Missing required lesson description."
                });
            }

            const [lesson] = await conn.query(
                "SELECT creator_id FROM predichess_database.lessons WHERE id = ?",
                [lessonId]
            );

            if (!lesson || lesson.length === 0) {
                return res.status(404).json ({
                    success: false,
                    message: "Lesson not found",
                })
            }
            const actualLesson = Array.isArray(lesson) ? lesson[0] : lesson;

            if (actualLesson.creator_id !== creator_id) {
                return res.status(403).json ({
                    success: false,
                    message: "Unauthorized: User ID does not match lesson creator.",
                })
            }

            const updateResult = await conn.query(
                `
                    UPDATE predichess_database.lessons
                    SET status = ?,
                        is_work_in_progress = ?,
                        published_at = NOW(),
                        difficulty = ?,
                        description = ?
                    WHERE id = ?
                `,
                ["published", 0, elo, description, lessonId]
            );

            if (updateResult.affectedRows === 0) {
            }

            res.status(204).end();

        }
        catch (error) {
            res.status(500).json ({
                success: false,
                message: `Failed to publish lesson: ${error}`
            })
        }finally {
            if (conn) conn.release();
        }
    })
}