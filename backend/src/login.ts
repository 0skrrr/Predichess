import { Express, Request, Response } from "express";
import mariadb from "mariadb";
import {hashPassword} from "./hashPassword.js";


export function login (app: Express, pool:  mariadb.Pool)  {
    app.post("/login", async(req,res) => {
        let conn;
        console.log("login: ", req, res);
        try {
            const {email, password} = req.body;
            conn = await pool.getConnection();
            const [userIds] = await conn.query(
                "SELECT id FROM predichess_database.accounts where email = ?",
                [email]
            )
            if (userIds) {

                // Získání obou hashů
                const hashedPassword = hashPassword(password);
                const [hashedPasswordDB] = await conn.query(
                    "SELECT password_hash FROM predichess_database.accounts where id = ?",
                    [userIds.id]
                )

                // Porovnání hesel
                if (hashedPassword == hashedPasswordDB.password_hash) {

                    // Vybrání ID toho uživatele
                    const [userId] = await conn.query(
                        "SELECT id FROM predichess_database.accounts where email = ?",
                        [email]
                    )
                    res.json({
                        success: true,
                        message: "Logged in successfully",
                        value: userId.id
                    })
                } else {
                    res.status(200).json ({
                        success: false,
                        field: "password",
                        message: "wrong password"
                    })
                }

            } else if (!userIds) {

                res.status(300).json ({
                    success: false,
                    field: "email",
                    message: "user doesnt exist"
                })
            }

        } catch (error) {
            res.status(500).json ({
                success: false,
                field: "general",
                message: error
            })
        }finally {
            if (conn) conn.release();
        }

    })
}