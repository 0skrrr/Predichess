import { Express, Request, Response } from "express";
import mariadb from "mariadb";


// Funkce pro získání dat lekce
export function getLessonData(app: Express, pool:  mariadb.Pool) {
    app.get("/lessons/:lessonId/data", async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            const {lessonId} = req.params;
            const lessons = await conn.query(
                "SELECT * FROM predichess_database.lessons WHERE id = ?",
                [lessonId]
            );
            if (!lessons || lessons.length === 0) {
                return res.status(404).json ({
                    success: false,
                    message: "No lessons found."
                })
            }
            const [lessonData] = await conn.query(
                "SELECT data FROM predichess_database.lesson_data WHERE lesson_id = ?",
                [lessonId]
            )
            let parsedData;
            if (lessonData) {
                    parsedData = JSON.parse(lessonData.data)
            }
            else {
                parsedData = {
                    steps: [],
                    tasks: []
                };
            }
            res.json({
                success: true,
                lesson: lessons[0],
                steps:parsedData.steps || [],
                tasks: parsedData.tasks || [],
            })


        }
        catch (error) {
            res.status(500).json ({
                success: false,
                message: error + "falied to get stuff"
            })
        }finally {
            if (conn) conn.release();
        }
    })
}