import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
const port = 3003;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const pool = mysql.createPool({
  host: "mysql", // MySQL service name in Docker Compose (not localhost)
  user: "root",
  password: "root",
  database: "bank",
  port: 3306, // Use the MySQL container's default port
});

// Helper function to execute SQL queries
const query = async (sql, params) => {
  const [results] = await pool.execute(sql, params);
  return results;
};

// GET /account/:id - Return user balance
app.get("/account/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [account] = await pool.execute(
      "SELECT * FROM accounts WHERE user_id = ?",
      [id]
    );

    if (!account.length) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({
      user_id: account[0].user_id,
      balance: parseFloat(account[0].balance),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting account balance" });
  }
});

// POST /account/deposit - Deposit money into the user's account
app.post("/account/deposit", async (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Unable to deposit a negative number" });
  }

  try {
    const [account] = await pool.execute(
      "SELECT * FROM accounts WHERE user_id = ?",
      [user_id]
    );

    if (!account.length) {
      return res.status(404).json({ message: "Account not found" });
    }

    const currentBalance = parseFloat(account[0].balance);
    const newBalance = (currentBalance + amount).toFixed(2);

    const [result] = await pool.execute(
      "UPDATE accounts SET balance = ? WHERE user_id = ?",
      [newBalance, user_id]
    );

    if (!result.affectedRows) {
      return res
        .status(404)
        .json({ message: "Failed to update account balance" });
    }

    res.json({
      message: "Deposit successful",
      new_balance: parseFloat(newBalance),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing deposit" });
  }
});

// POST /users - Create a new user
app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    const result = await query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );

    await query("INSERT INTO accounts (user_id, balance) VALUES (?, 0.00)", [
      result.insertId,
    ]);

    res.status(201).json({
      message: "User and account created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to create user and account");
  }
});

// POST /login - Login an existing user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    const [users] = await pool.execute(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (!users.length) {
      return res.status(401).send("Invalid username or password");
    }

    res.json({ message: "Login successful", user: users[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error during login");
  }
});

// PUT /new-password - Update user password
app.put("/new-password", async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).send("UserId and newPassword are required");
  }

  try {
    const [result] = await pool.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [newPassword, userId]
    );

    if (!result.affectedRows) {
      return res.status(404).send("User not found");
    }

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to update password");
  }
});

// DELETE /users - Remove a user by ID
app.delete("/users", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "UserId is required" });
  }

  try {
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [
      userId,
    ]);

    if (!result.affectedRows) {
      return res.status(404).json({ error: "User not found" });
    }

    await pool.execute("DELETE FROM accounts WHERE user_id = ?", [userId]);

    res.json({ message: "User and account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Start the server
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
