const bcrypt = require("bcrypt");

const testHash = async () => {
  const plainPassword = "admin"; // Change to your test password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  console.log("Generated Hashed Password:", hashedPassword);
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

  console.log("Password Comparison Result:", isMatch ? "✅ Match" : "❌ No Match");
};

testHash();
