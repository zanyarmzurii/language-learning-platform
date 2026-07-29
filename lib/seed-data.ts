import mongoose from "mongoose";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: "admin@kurdilearn.com" });
    
    if (!existingAdmin) {
      console.log("Creating admin user...");
      
      const hashedPassword = await hashPassword("Admin123!@#");
      
      await User.create({
        name: "Admin",
        email: "admin@kurdilearn.com",
        password: hashedPassword,
        role: "admin",
        phone: "+964 750 604 5491",
      });

      console.log("✅ Admin user created!");
      console.log("Email: admin@kurdilearn.com");
      console.log("Password: Admin123!@#");
    } else {
      console.log("Admin user already exists");
    }

    // Create owner if not exists
    const existingOwner = await User.findOne({ email: "owner@kurdilearn.com" });
    
    if (!existingOwner) {
      console.log("Creating owner user...");
      
      const hashedPassword = await hashPassword("Owner123!@#");
      
      await User.create({
        name: "Owner",
        email: "owner@kurdilearn.com",
        password: hashedPassword,
        role: "owner",
        phone: "+964 750 604 5491",
      });

      console.log("✅ Owner user created!");
      console.log("Email: owner@kurdilearn.com");
      console.log("Password: Owner123!@#");
    } else {
      console.log("Owner user already exists");
    }

    console.log("\n📊 Seed Summary:");
    const stats = {
      total: await User.countDocuments(),
      admins: await User.countDocuments({ role: "admin" }),
      owners: await User.countDocuments({ role: "owner" }),
    };
    console.log(stats);

    await mongoose.disconnect();
    console.log("\n✅ Seed completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
