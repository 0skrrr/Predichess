import { Express, Request, Response } from "express";
import mariadb from "mariadb";


// Backend funkce pro přidání lekce do DB, i její data

export function addLesson(app: Express, pool:  mariadb.Pool) {
    app.post("/addlesson", async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            const {title, description, creator_id, data} = req.body;
            if (!title || !creator_id) {
                return res.status(400).json({
                    success: false,
                    message: "title and creator_id required"
                })
            }
            const [existingLesson] = await conn.query(
                "SELECT id FROM predichess_database.lessons where title=? AND creator_id=?",
                [title, creator_id]
            )
            if (existingLesson && existingLesson.length > 0) {
                return res.status(200).json({
                    success: false,
                    message: "lesson with this title already exists"
                })
            }
            const result = await conn.query(
                "INSERT INTO predichess_database.lessons (creator_id, title, description, status, is_work_in_progress) VALUES (?,?,?,?,?)",
                [creator_id, title, description || "", "draft", 1]
            )
            const lessonId = result.insertId;
            let dataString: string;

            if (typeof data === "string") {
                dataString = data;
            }
            else {
                dataString = JSON.stringify( data || {
                        steps: [],
                        tasks:[]

                })
            }
            await conn.query(
                "INSERT INTO predichess_database.lesson_data (lesson_id, data) VALUES (?,?)",
                [lessonId, dataString]
            )
            const numLessonId: number = Number(lessonId);
            res.status(404).json({
                success: true,
                message:"lesson created successfully",
                lesson:{
                    id: numLessonId,
                    title,
                    creator_id,
                    status: "draft"
                }
            })

        }
        catch (error) {
            res.status(500).json ({
                success: false,
                message: error + "falied to krieta lesson"
            })
        }finally {
            if (conn) conn.release();
        }
    })
}