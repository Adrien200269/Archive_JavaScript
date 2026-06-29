import { Request, Response } from "express";
import { userService } from "../../services/user.service";
import { AdminCreateUserSchema, AdminUpdateUserSchema } from "../../dtos/user.dto";

// ── Admin User Controller ────────────────────────────────────────────────────
// All routes are protected by authenticate + requireAdmin middleware.

export const adminUserController = {
  // GET /api/v1/admin/users?page=&limit=&search=
  async getAllUsers(req: Request, res: Response) {
    try {
      const { page, limit, search } = req.query as Record<string, string>;
      const { data, pagination } = await userService.adminGetAllUsers(page, limit, search);
      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data,
        meta: pagination,
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  // GET /api/v1/admin/users/:id
  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.adminGetUserById(req.params.id);
      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  // POST /api/v1/admin/users
  async createUser(req: Request, res: Response) {
    try {
      const parsed = AdminCreateUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        });
      }
      const user = await userService.adminCreateUser(parsed.data);
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  // PUT /api/v1/admin/users/:id
  async updateUser(req: Request, res: Response) {
    try {
      const parsed = AdminUpdateUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        });
      }
      const user = await userService.adminUpdateUser(req.params.id, parsed.data);
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  // DELETE /api/v1/admin/users/:id
  async deleteUser(req: Request, res: Response) {
    try {
      await userService.adminDeleteUser(req.params.id);
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: null,
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
};
