import { Express, Request, Response } from "express";
import mariadb from "mariadb";


interface LessonSaveBody {
    data: any;
    creator_id: number;
}

interface LessonDBRow {
    id: string;
    creator_id: number;
    title: string;
    description: string;
    status: string;
    is_work_in_progress: number;
}


interface SaveResponse {
    success: boolean;
    message: string;
}
// Uložení dat lekce
export function saveLessonData(app: Express, pool: mariadb.Pool) {
    app.post("/lessons/:lessonId/data", async (
        req: Request<{ lessonId: string }, {}, LessonSaveBody>,
        res: Response<SaveResponse>
    ) => {
        let conn;
        try {
            conn = await pool.getConnection();

            const {lessonId} = req.params;

            const {data, creator_id: creator_id_string} = req.body;

            const creator_id = parseInt(creator_id_string as any, 10);

            const lessons = await conn.query<LessonDBRow[]>(
                "SELECT id, creator_id, title, description, status, is_work_in_progress FROM predichess_database.lessons WHERE id=?",
                [lessonId]
            );

            const lesson = lessons[0];

            if (!lesson) {
                return res.status(404).json({
                    success: false,
                    message: "lesson not found",
                });
            }

            if (lesson.creator_id !== creator_id) {
                return res.status(400).json({
                    success: false,
                    message:"unauthorized",
                });
            }

            let dataString: string;
            if (typeof data === "string") {
                dataString = data;
            } else {
                dataString = JSON.stringify(data);
            }

            await conn.query(
                "INSERT INTO predichess_database.lesson_data (lesson_id, data) VALUES (?,?) ON DUPLICATE KEY UPDATE data = ?, updated_at = now()",
                [lessonId, dataString, dataString]
            );

            await conn.query(
                "UPDATE predichess_database.lessons SET last_saved_at = NOW(), is_work_in_progress = 1 WHERE id = ?",
                [lessonId]
            );

            res.json({
                success: true,
                message:"updated successfully",
            });
        }
        catch (error) {
            console.error("saveLessonError: ", error);
            const errorMessage = (error instanceof Error) ? error.message : String(error);

            res.status(500).json ({
                success: false,
                message: errorMessage + "failed to save lesson",
            });
        }finally {
            if (conn) conn.release();
        }

    });
}