import { Express, Request, Response } from "express";
import mariadb from "mariadb";


// Uložení entry po dohrání lekce
export function saveLessonCompletion(app: Express, pool: mariadb.Pool) {
    app.post("/lessons/complete", async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            const { lesson_id, account_id, score, xp_gained, elo_change } = req.body;

            if (!lesson_id || !account_id) {
                return res.status(400).json({ success: false, message: "Missing required fields." });
            }

            await conn.beginTransaction();

            await conn.query(
                "INSERT INTO predichess_database.lesson_completions (lesson_id, account_id, score) VALUES (?, ?, ?)",
                [lesson_id, account_id, score]
            );

            await conn.query(
                `
                UPDATE predichess_database.account_info 
                SET 
                    elo = elo + ?, 
                    xp = xp + ? 
                WHERE account_id = ?
                `,
                [elo_change, xp_gained, account_id]
            );


            await conn.commit();

            res.status(200).json({
                success: true,
                message: "Completion and stats saved successfully."
            });

        } catch (error) {
            console.error("saveLessonCompletionError: ", error);
            if (conn) await conn.rollback();
            res.status(500).json({
                success: false,
                message: "Failed to save lesson completion: " + error
            });
        } finally {
            if (conn) conn.release();
        }
    });
}