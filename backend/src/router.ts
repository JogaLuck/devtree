import { Router } from "express";
import { body, param } from "express-validator";
import {
  createAccount,
  getUser,
  getUserByHandle,
  login,
  searchByHandle,
  updateProfile,
  uploadImage,
  getUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
  getMyFollowers,
} from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

const router = Router();

/** Autenticacion y Registro */
router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El handle no puede ir vacio"),
  body("name").notEmpty().withMessage("El Nombre no puede ir vacio"),
  body("email").isEmail().withMessage("E-mail no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El Password es muy corto, mínimo 8 caracteres"),
  handleInputErrors,
  createAccount
);

router.post(
  "/auth/login",
  body("email").isEmail().withMessage("E-mail no válido"),
  body("password").notEmpty().withMessage("El Password es obligatorio"),
  handleInputErrors,
  login
);

/** Rutas de Usuario */
router.get("/user", authenticate, getUser);

router.patch(
  "/user",
  body("handle").notEmpty().withMessage("El handle no puede ir vacio"),
  handleInputErrors,
  authenticate,
  updateProfile
);

router.post("/user/image", authenticate, uploadImage);

// Buscar usuarios

// Obtener perfil de usuario por ID con conteos
router.get(
  "/users/:userId",
  param("userId").isMongoId().withMessage("ID de usuario no válido"),
  handleInputErrors,
  getUserProfile,
  getFollowers
);

// Obtener perfil por handle (mantén esta ruta al final para evitar conflictos)
router.get("/:handle", getUserByHandle);

router.post(
  "/search",
  body("handle").notEmpty().withMessage("El handle no puede ir vacio"),
  handleInputErrors,
  searchByHandle
);

/** Rutas de Seguimiento */
// Seguir a un usuario
router.post(
  "/users/:userId/follow",
  param("userId").isMongoId().withMessage("ID de usuario no válido"),
  handleInputErrors,
  authenticate,
  followUser
);

// Dejar de seguir a un usuario
router.delete(
  "/users/:userId/unfollow",
  param("userId").isMongoId().withMessage("ID de usuario no válido"),
  handleInputErrors,
  authenticate,
  unfollowUser
);

router.get("/users/me/followers", authenticate, getMyFollowers);

// Obtener seguidores de un usuario
router.get(
  "/users/:userId/followers",
  param("userId").isMongoId().withMessage("ID de usuario no válido"),
  handleInputErrors,
  getFollowers
);

// Obtener usuarios que sigue un usuario
router.get(
  "/users/:userId/following",
  param("userId").isMongoId().withMessage("ID de usuario no válido"),
  handleInputErrors,
  getFollowing
);

// Verificar si sigo a un usuario
router.get(
  "/users/:userId/follow-status",
  param("userId").isMongoId().withMessage("ID de usuario no válido"),
  handleInputErrors,
  authenticate,
  checkFollowStatus
);

export default router;
