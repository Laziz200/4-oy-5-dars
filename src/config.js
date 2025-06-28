import {config} from "dotenv";
config();
export const serverConfig = {
    PORT: process.env.PORT || 3000
}