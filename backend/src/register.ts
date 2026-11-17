import { Express, Request, Response } from "express";
import mariadb from "mariadb";
import {hashPassword} from "./hashPassword.js";
import {app} from "./index";

// Nastavení spojení

export function register (app: Express, pool:  mariadb.Pool)  {
    app.post("/register", async(req,res) => {
        let conn;
        try {
            console.log(req.body)

            const {username, email, password} = req.body;

            // Výběr duplicitů
            conn = await pool.getConnection();
            console.log(conn)
            console.log(username)
            const [userIds] = await conn.query(
                "SELECT id FROM predichess_database.accounts where username = ?",
                [username]
            )
            console.log(!userIds)


            if (!userIds) {

                // Výběr duplicitů
                const [emailIds] = await conn.query(
                    "SELECT id FROM predichess_database.accounts where email = ?",
                    [email]
                )
                console.log("emailIds", !emailIds)
                if (!emailIds) {
                    const hashedPassword = hashPassword(password);
                    try {

                        // Vložení dat do databáze
                        const result = await conn.query(
                            "INSERT INTO predichess_database.accounts (username, email, password_hash) VALUES (?, ?, ?)",
                            [username, email, hashedPassword]
                        );

                    } catch (err) {
                        console.log(err)
                    }

                    // Výběr userId pro následné vložení dat na to vázaných
                    const [userId] = await conn.query(
                        "SELECT id FROM predichess_database.accounts where username = ?",
                        [username]
                    )

                    // Vložení dat do databáze
                    const result2 = await conn.query(
                        "INSERT INTO predichess_database.account_info (account_id,country_code, bio, nickname) VALUES (?, ?, ?, ?)",
                        [userId.id, "US", "", username]
                    );

                    res.json({
                        success: true,
                        message: "Registered successfully",
                        value:userId.id
                    })
                }
                else if (emailIds) {
                    res.json({
                        success: false,
                        field:"email",
                        message: "Email already exists!"
                    })
                }
            } else if (userIds) {

                res.status(300).json ({
                    success: false,
                    field: "username",
                    message: "Username already exists!",
                })
            }

        } catch (error) {
            console.log("error"+ error);
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