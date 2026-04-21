import "dotenv/config";
import cors from "cors";
import express from "express";

import { routes } from "@/main/router/index.routes";

const app = express();

const parsedOrigins = process.env.CORS_ORIGIN?.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const corsOptions: cors.CorsOptions = {
	origin: parsedOrigins && parsedOrigins.length > 0 ? parsedOrigins : true,
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(routes);

export { app };