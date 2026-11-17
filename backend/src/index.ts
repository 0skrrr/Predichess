import express from "express";
import cors from "cors";
import {pool} from "./db.js";
import {register} from "./register.js";
import {login} from "./login.js";
import {addLesson} from "./addLesson.js";
import {getUserLessons} from "./getUserLessons.js";
import {getLessonData} from "./getLessonData.js";
import {publishLesson} from "./publishLesson.js";
import {saveLessonData} from "./saveLessonData.js";
import {getRecentLessons} from "./getRecentLessons.js";
import{getUserDataAll} from "./getUserDataAll.js";
import{saveLessonCompletion} from "./saveLessonCompletetion.js";
import{getPlayerStats} from "./fetchPlayerStats.js";

export const app = express();
app.use(cors());
app.use(express.json());
app.listen(4000, () => console.log("Backend běží"));

// Funkce spouštějící celý backend
function startApp() {
    register(app, pool);
    login(app,pool);
    addLesson(app,pool);
    getUserLessons(app,pool);
    getLessonData(app,pool);
    publishLesson(app,pool);
    saveLessonData(app,pool);
    getRecentLessons(app,pool);
    getUserDataAll(app,pool);
    saveLessonCompletion(app,pool);
    getPlayerStats(app,pool);
    console.log("Connection pool created.");
}

startApp();




