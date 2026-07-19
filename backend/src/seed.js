require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, Room, User } = require("./models");

const DEFAULT_ROOMS = [
  { number: "101", floor: "1st Floor", type: "First Floor Apartment", bed: "King bed", size: 480, capacity: 3, price: 180, amenities: ["Wifi", "Balcony", "Sea view", "Kitchenette"] },
  { number: "102", floor: "1st Floor", type: "First Floor Apartment", bed: "King bed", size: 480, capacity: 3, price: 180, amenities: ["Wifi", "Balcony", "Sea view", "Kitchenette"] },
  { number: "103", floor: "1st Floor", type: "First Floor Apartment", bed: "King bed", size: 480, capacity: 3, price: 180, amenities: ["Wifi", "Balcony", "Sea view", "Kitchenette"] },
  { number: "104", floor: "1st Floor", type: "First Floor Apartment", bed: "King bed", size: 480, capacity: 3, price: 180, amenities: ["Wifi", "Balcony", "Sea view", "Kitchenette"] },
  { number: "201", floor: "2nd Floor", type: "Second Floor Apartment", bed: "King bed", size: 500, capacity: 3, price: 195, amenities: ["Wifi", "Balcony", "Panoramic sea view", "Kitchenette"] },
  { number: "202", floor: "2nd Floor", type: "Second Floor Apartment", bed: "King bed", size: 500, capacity: 3, price: 195, amenities: ["Wifi", "Balcony", "Panoramic sea view", "Kitchenette"] },
  { number: "301", floor: "3rd Floor", type: "Third Floor Apartment", bed: "King bed", size: 520, capacity: 3, price: 210, amenities: ["Wifi", "Balcony", "Panoramic sea view", "Kitchenette"] },
  { number: "302", floor: "3rd Floor", type: "Third Floor Apartment", bed: "King bed", size: 520, capacity: 3, price: 210, amenities: ["Wifi", "Balcony", "Panoramic sea view", "Kitchenette"] },
];

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync();

  for (const roomData of DEFAULT_ROOMS) {
    const [room, created] = await Room.findOrCreate({
      where: { number: roomData.number },
      defaults: roomData,
    });
    console.log(created ? `Created room ${room.number}` : `Room ${room.number} already exists, skipped`);
  }

  const adminUsername = process.env.SEED_ADMIN_USERNAME || "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const existingAdmin = await User.findOne({ where: { username: adminUsername } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await User.create({ username: adminUsername, passwordHash, role: "admin" });
    console.log(`Created admin user "${adminUsername}" â change this password after first login.`);
  } else {
    console.log(`Admin user "${adminUsername}" already exists, skipped`);
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
