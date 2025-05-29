import express, { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, adminLoginSchema, insertSiteSettingSchema, forgotPasswordSchema, resetPasswordSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { sendOTPEmail } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Store for OTP codes (in production, use Redis or database)
  const otpStore = new Map<string, { otp: string; expires: number; email: string }>();

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }

  // Configure multer for file uploads
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(uploadsDir));

  // Session configuration for admin authentication
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Middleware to check admin authentication
  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.session?.adminId) {
      next();
    } else {
      res.status(401).json({ error: 'Admin authentication required' });
    }
  };

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const validatedData = adminLoginSchema.parse(req.body);
      const admin = await storage.getAdminByEmail(validatedData.email);
      
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(validatedData.password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Set admin session
      (req.session as any).adminId = admin.id;
      
      res.json({ 
        success: true, 
        admin: { 
          id: admin.id, 
          email: admin.email, 
          username: admin.username 
        } 
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(400).json({ error: 'Login failed' });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", (req, res) => {
    (req.session as any).adminId = undefined;
    res.json({ success: true });
  });

  // Forgot password endpoint (only for your email)
  app.post("/api/admin/forgot-password", async (req, res) => {
    try {
      const validatedData = forgotPasswordSchema.parse(req.body);
      const { email } = validatedData;

      // Only allow password reset for your specific email
      if (email !== 'shishirxkandel@gmail.com') {
        return res.status(403).json({ 
          error: 'Password reset is not available for this email address' 
        });
      }

      // Check if admin exists
      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      // Generate 6-digit OTP
      const otp = Math.random().toString().slice(2, 8).padStart(6, '0');
      const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Store OTP
      otpStore.set(email, { otp, expires, email });

      // Send OTP email
      const emailSent = await sendOTPEmail(email, otp);
      
      if (!emailSent) {
        return res.status(500).json({ error: 'Failed to send OTP email' });
      }

      console.log(`Password reset OTP sent to: ${email}`);
      res.json({ 
        success: true, 
        message: 'OTP sent to your email address' 
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(400).json({ error: 'Invalid request' });
    }
  });

  // Reset password endpoint
  app.post("/api/admin/reset-password", async (req, res) => {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);
      const { email, otp, newPassword } = validatedData;

      // Only allow password reset for your specific email
      if (email !== 'shishirxkandel@gmail.com') {
        return res.status(403).json({ 
          error: 'Password reset is not available for this email address' 
        });
      }

      // Check OTP
      const storedOTP = otpStore.get(email);
      if (!storedOTP) {
        return res.status(400).json({ error: 'No OTP found for this email' });
      }

      if (Date.now() > storedOTP.expires) {
        otpStore.delete(email);
        return res.status(400).json({ error: 'OTP has expired' });
      }

      if (storedOTP.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      // Get admin and update password
      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password in database
      await storage.updateUser(admin.id, { password: hashedPassword });

      // Clear OTP
      otpStore.delete(email);

      console.log(`Password successfully reset for: ${email}`);
      res.json({ 
        success: true, 
        message: 'Password reset successfully' 
      });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(400).json({ error: 'Invalid request' });
    }
  });

  // Check admin authentication status
  app.get("/api/admin/me", async (req, res) => {
    const adminId = (req.session as any)?.adminId;
    if (!adminId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const admin = await storage.getUser(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(401).json({ error: 'Not authorized' });
    }

    res.json({ 
      id: admin.id, 
      email: admin.email, 
      username: admin.username 
    });
  });

  // Get site settings for admin editing
  app.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  // Update site settings
  app.put("/api/admin/settings/:key", requireAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      
      const setting = await storage.updateSiteSetting(key, value);
      res.json(setting);
    } catch (error) {
      console.error('Error updating setting:', error);
      res.status(500).json({ error: 'Failed to update setting' });
    }
  });

  // Contact form submission endpoint
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      console.log(`Contact form submitted by: ${contact.name}`);
      res.json({ success: true, message: "Contact form submitted successfully!" });
    } catch (error) {
      console.error(`Contact form error:`, error);
      res.status(400).json({ success: false, message: "Failed to submit contact form" });
    }
  });

  // Get all contacts endpoint (admin only)
  app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error(`Error fetching contacts:`, error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Update contact status (admin only)
  app.patch("/api/admin/contacts/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!["unread", "read", "replied"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const contact = await storage.updateContactStatus(parseInt(id), status);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }

      res.json(contact);
    } catch (error) {
      console.error('Error updating contact status:', error);
      res.status(500).json({ error: 'Failed to update contact status' });
    }
  });

  // Delete contact (admin only)
  app.delete("/api/admin/contacts/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteContact(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ error: "Contact not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ error: 'Failed to delete contact' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
