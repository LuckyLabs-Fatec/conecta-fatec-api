import "dotenv/config";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { swaggerDocument } from "@/main/docs/swagger";
import { routes } from "@/main/router/index.routes";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) ?? [];

const corsOptions: cors.CorsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs.json", (_req, res) => {
	res.status(200).json(swaggerDocument);
});

app.use(routes);

export { app };