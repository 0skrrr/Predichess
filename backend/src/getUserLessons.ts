import { Express, Request, Response } from "express";
import mariadb from "mariadb";

export function getUserLessons(app: Express, pool:  mariadb.Pool) {
    app.get("/lessons/user/:creator_id", async (req, res) => {
        let conn;
        // Výběr všech lekcí, na kterých uživatel stále pracuje
        try {
            conn = await pool.getConnection();
            const {creator_id} = req.params;
            const lessons = await conn.query(
                "SELECT id, title, description, status, is_work_in_progress, created_at, last_saved_at FROM predichess_database.lessons WHERE creator_id = ? AND status=? ORDER BY created_at",
                [creator_id, "draft"]
            )
            console.log("userlessons: ", lessons)
            res.json({
                success: true,
                lessons
            })
        }
        catch (error) {
            console.error("getLessonDataError: ", error);
            res.status(500).json ({
                success: false,
                message: error + "falied to get stuff"
            })
        }finally {
            if (conn) conn.release();
        }
    })
}