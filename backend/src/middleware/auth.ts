import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "No autorizado. Formato de token inválido." });
  }

  const token = bearer.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "No autorizado. Token no proporcionado." });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET no está definido en el entorno");
    }

    const result = jwt.verify(token, secret);
    if (typeof result === "object" && "id" in result) {
      const user = await User.findById((result as any).id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "El Usuario no existe" });
      }
      req.user = user;
      return next();
    } else {
      return res
        .status(401)
        .json({ error: "Token no válido. ID no encontrado." });
    }
  } catch (error) {
    console.error("Error en middleware auth:", error);
    return res.status(500).json({ error: "Token No Válido" });
  }
};
