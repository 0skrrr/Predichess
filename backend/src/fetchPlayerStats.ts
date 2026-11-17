
import { Express, Request, Response } from "express";
import mariadb from "mariadb";


// Získání potřebných dat při spuštění lekce
export function getPlayerStats(app: Express, pool: mariadb.Pool) {
    app.get("/account/:accountId/stats", async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            const { accountId } = req.params;


            const results = await conn.query(
                "SELECT elo, xp FROM predichess_database.account_info WHERE account_id = ?",
                [accountId]
            );

            if (!results || results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Account stats not found for the provided ID."
                });
            }

            const stats = results[0];

            res.status(200).json({
                success: true,
                elo: stats.elo,
                xp: stats.xp,
            });

        } catch (error) {
            console.error("getPlayerStatsError: ", error);
            res.status(500).json({
                success: false,
                message: "Failed to retrieve player stats."
            });
        } finally {
            if (conn) conn.release();
        }
    });
}