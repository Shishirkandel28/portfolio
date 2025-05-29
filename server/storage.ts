import { users, contacts, careerPaths, siteSettings, type User, type InsertUser, type Contact, type InsertContact, type CareerPath, type InsertCareerPath, type SiteSetting, type InsertSiteSetting } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User Management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Admin Authentication
  getAdminByEmail(email: string): Promise<User | undefined>;
  createDefaultAdmin(): Promise<User | undefined>;
  
  // Contact Management
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  updateContactStatus(id: number, status: string): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;
  
  // Career Path Management
  getCareerPaths(): Promise<CareerPath[]>;
  getCareerPath(id: number): Promise<CareerPath | undefined>;
  createCareerPath(careerPath: InsertCareerPath): Promise<CareerPath>;
  updateCareerPath(id: number, updates: Partial<CareerPath>): Promise<CareerPath | undefined>;
  deleteCareerPath(id: number): Promise<boolean>;
  
  // Site Settings Management
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  updateSiteSetting(key: string, value: string): Promise<SiteSetting>;

  // Session Store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool: (db as any).pool, 
      createTableIfMissing: true 
    });
    
    // Initialize default data
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Create the default admin account
    await this.createDefaultAdmin();

    // Initialize default site settings
    const defaultSettings = [
      { key: "site_title", value: "Shishir Kandel - Portfolio", description: "Main site title" },
      { key: "hero_title", value: "Hi, I'm Shishir Kandel", description: "Hero section title" },
      { key: "hero_description", value: "A passionate Graphic Designer and Creative Professional with expertise in visual storytelling and brand development.", description: "Hero section description" },
      { key: "about_title", value: "Creative Graphic Designer", description: "About section title" },
      { key: "about_description", value: "I'm a passionate graphic designer with extensive experience in creating compelling visual content that communicates ideas effectively. My journey in design started with a love for art and creativity, which evolved into a professional pursuit of visual excellence and brand storytelling.", description: "About section description" },
      { key: "contact_email", value: "shishirxkandel@gmail.com", description: "Contact email address" },
      { key: "linkedin_url", value: "https://www.linkedin.com/in/shishirkandel/", description: "LinkedIn profile URL" },
      { key: "behance_url", value: "https://www.behance.net/theshishirkandel", description: "Behance profile URL" },
      { key: "github_url", value: "https://github.com/Shishirkdl", description: "GitHub profile URL" }
    ];

    for (const setting of defaultSettings) {
      await this.createOrUpdateSiteSetting(setting.key, setting.value, setting.description);
    }

    // Initialize default career paths
    const defaultCareerPaths = [
      {
        title: "Graphic Design",
        description: "Create visual content for digital and print media, including logos, brochures, advertisements, and brand identity materials.",
        icon: "fas fa-palette",
        skills: ["Adobe Creative Suite", "Typography", "Color Theory", "Brand Identity"],
        salaryRange: "$35,000 - $70,000",
        timeToLearn: "6-12 months",
        iconColor: "#FF6B6B"
      },
      {
        title: "UI/UX Design",
        description: "Design user interfaces and experiences for websites, mobile apps, and digital products with focus on usability and aesthetics.",
        icon: "fas fa-mobile-alt",
        skills: ["Figma", "Sketch", "User Research", "Prototyping"],
        salaryRange: "$50,000 - $90,000",
        timeToLearn: "8-18 months",
        iconColor: "#4ECDC4"
      },
      {
        title: "Brand Identity Design",
        description: "Develop comprehensive brand identities including logos, color schemes, typography, and brand guidelines for businesses.",
        icon: "fas fa-trademark",
        skills: ["Brand Strategy", "Logo Design", "Style Guides", "Market Research"],
        salaryRange: "$45,000 - $85,000",
        timeToLearn: "10-24 months",
        iconColor: "#45B7D1"
      }
    ];

    for (const careerPath of defaultCareerPaths) {
      const existing = await this.getCareerPathByTitle(careerPath.title);
      if (!existing) {
        await this.createCareerPath(careerPath);
      }
    }
  }

  private async createOrUpdateSiteSetting(key: string, value: string, description?: string): Promise<void> {
    const existing = await this.getSiteSetting(key);
    if (!existing) {
      await db.insert(siteSettings).values({ key, value, description });
    }
  }

  private async getCareerPathByTitle(title: string): Promise<CareerPath | undefined> {
    const [careerPath] = await db.select().from(careerPaths).where(eq(careerPaths.title, title));
    return careerPath || undefined;
  }

  // User Management Methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAdminByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (user && user.role === 'admin') {
      return user;
    }
    return undefined;
  }

  async createDefaultAdmin(): Promise<User | undefined> {
    // Check if admin already exists
    const existingAdmin = await this.getAdminByEmail("shishirxkandel@gmail.com");
    if (existingAdmin) {
      return existingAdmin;
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash("Jamuna@#5544@#", 12);

    // Create the default admin account
    const adminUser = await this.createUser({
      username: "admin",
      email: "shishirxkandel@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    return adminUser;
  }

  // Contact Management Methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(contacts.createdAt);
  }

  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  async updateContactStatus(id: number, status: string): Promise<Contact | undefined> {
    const [contact] = await db.update(contacts).set({ status }).where(eq(contacts.id, id)).returning();
    return contact || undefined;
  }

  async deleteContact(id: number): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Career Path Management Methods
  async getCareerPaths(): Promise<CareerPath[]> {
    return await db.select().from(careerPaths).where(eq(careerPaths.isActive, true)).orderBy(careerPaths.createdAt);
  }

  async getCareerPath(id: number): Promise<CareerPath | undefined> {
    const [careerPath] = await db.select().from(careerPaths).where(eq(careerPaths.id, id));
    return careerPath || undefined;
  }

  async createCareerPath(insertCareerPath: InsertCareerPath): Promise<CareerPath> {
    const [careerPath] = await db.insert(careerPaths).values(insertCareerPath).returning();
    return careerPath;
  }

  async updateCareerPath(id: number, updates: Partial<CareerPath>): Promise<CareerPath | undefined> {
    const [careerPath] = await db.update(careerPaths).set(updates).where(eq(careerPaths.id, id)).returning();
    return careerPath || undefined;
  }

  async deleteCareerPath(id: number): Promise<boolean> {
    const result = await db.update(careerPaths).set({ isActive: false }).where(eq(careerPaths.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Site Settings Management Methods
  async getSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings).orderBy(siteSettings.key);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting || undefined;
  }

  async updateSiteSetting(key: string, value: string): Promise<SiteSetting> {
    const [setting] = await db.update(siteSettings)
      .set({ value, updatedAt: new Date() })
      .where(eq(siteSettings.key, key))
      .returning();

    if (!setting) {
      const [newSetting] = await db.insert(siteSettings)
        .values({ key, value })
        .returning();
      return newSetting;
    }

    return setting;
  }
}

export const storage = new DatabaseStorage();