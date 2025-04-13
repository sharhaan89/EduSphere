import pool from "../config/db.js";

export async function handleBanUser(req, res) {
  try {
    const currentUserId = req.user?.user_id;
    const { id } = req.params;

    if (!currentUserId || !id) {
      return res.status(400).json({ error: "Missing user ID" });
    }

    // Check role of current user
    const roleRes = await pool.query("SELECT role FROM users WHERE id = $1", [currentUserId]);
    if (roleRes.rowCount === 0 || !["admin", "developer"].includes(roleRes.rows[0].role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check role of the target user
    const roleTarget = await pool.query("SELECT role FROM users WHERE id = $1", [id]);
    if (roleTarget.rowCount === 0 || !["admin", "developer"].includes(roleRes.rows[0].role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Ban user
    await pool.query("UPDATE users SET banned = true WHERE id = $1", [id]);
    return res.status(200).json({ message: "User banned successfully" });

  } catch (error) {
    console.error("Error banning user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function handleUnbanUser(req, res) {
  try {
    const currentUserId = req.user?.user_id;
    const { id } = req.params;

    if (!currentUserId || !id) {
      return res.status(400).json({ error: "Missing user ID" });
    }

    // Check role of current user
    const roleRes = await pool.query("SELECT role FROM users WHERE id = $1", [currentUserId]);
    if (roleRes.rowCount === 0 || !["admin", "developer"].includes(roleRes.rows[0].role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Unban user
    await pool.query("UPDATE users SET banned = false WHERE id = $1", [id]);
    return res.status(200).json({ message: "User unbanned successfully" });

  } catch (error) {
    console.error("Error unbanning user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
