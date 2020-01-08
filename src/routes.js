// Import only routes of Express
import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";
import ProviderController from "./app/controllers/ProviderController";
import AppointmentController from "./app/controllers/AppointmentController";
import ScheduleController from "./app/controllers/ScheduleController";
import NotificationController from "./app/controllers/NotificationController";
import AvailableController from "./app/controllers/AvailableController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();
const upload = multer(multerConfig);

// Methods of routes
routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

// Como o middlaware global está sendo colocado nesse ponto
// todas as rotas a partir daqui já contarão com esse middleware
// as rotas anteriores não passarão por esse middleware
routes.use(authMiddleware);

routes.put("/users", UserController.update);

routes.get("/providers", ProviderController.index);
routes.get("/providers/:providerId/available", AvailableController.index);

routes.get("/appointments", AppointmentController.index);
routes.post("/appointments", AppointmentController.store);
routes.delete("/appointments/:id", AppointmentController.delete);

routes.get("/schedule", ScheduleController.index);

routes.get("/notifications", NotificationController.index);
routes.put("/notifications/:id", NotificationController.update);

// Rota files com upload de apenas um arquivo por vez
// O nome do campo que vamos enviar dentro da requisição file
routes.post("/files", upload.single("file"), FileController.store);

export default routes;
