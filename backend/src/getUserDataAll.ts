import { Express, Request, Response } from "express";
import mariadb from "mariadb";

export function getUserDataAll(app: Express, pool:  mariadb.Pool) {
    app.get("/user/:userId", async (req, res) => {
        let conn;
        console.log("getUserDataAll: ", req, res);
        try {
            conn = await pool.getConnection();
            const {userId} = req.params;
            // Získání všeho
            const [userProfileData] = await conn.query(
                "SELECT a.username, a.created_at, ai.elo, ai.xp, ai.country_code, ai.bio FROM predichess_database.accounts a INNER JOIN predichess_database.account_info ai ON a.id = ai.account_id WHERE a.id = ?;",
                [userId]
            )
            const [recentlyCompletedLessons] = await conn.query(
                "SELECT l.id, l.title, l.description, l.difficulty, l.category, l.average_rating, lc.completed_at, lc.score FROM predichess_database.lesson_completions lc INNER JOIN predichess_database.lessons l ON lc.lesson_id = l.id WHERE lc.account_id = ?  ORDER BY lc.completed_at DESC LIMIT 2;",
                [userId]
            )
            const [recentlyWorkedOnLessons] = await conn.query(
                "SELECT l.id, l.title, l.description, l.difficulty, l.category, l.average_rating, l.status, l.is_work_in_progress, l.last_saved_at, l.published_at FROM predichess_database.lessons l WHERE l.creator_id = ? AND l.status= ? ORDER BY l.last_saved_at DESC LIMIT 2;",
                [userId, "draft"]
            )

            // Vrácení všeho
            res.json({
                success: true,
                userProfileData,
                recentlyCompletedLessons,
                recentlyWorkedOnLessons,
            })
        }
        catch (error) {
            res.status(500).json ({
                success: false,
                message: error + "Failed to retrieve user data."
            })
        }finally {
            if (conn) conn.release();
        }
    })
}