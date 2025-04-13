import pool from "../config/db.js";

export async function handleReportCreate(req, res) {
    try {
      const reporter_id = req.user.user_id;
      const { reportee_id, thread_id, reply_id, reason, details } = req.body;
  
      if (!reporter_id || !reportee_id || !reason) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const query = `
        INSERT INTO reports (reporter_id, reportee_id, thread_id, reply_id, reason, details)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
      `;
  
      const values = [reporter_id, reportee_id, thread_id || null, reply_id || null, reason, details];

      const { rows } = await pool.query(query, values);
  
      return res.status(201).json({ message: "Report created successfully", report: rows[0] });
    } catch (error) {
      console.error("Error creating report:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function handleGetReport(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.user_id;
  
      if (!id || !userId) {
        return res.status(400).json({ error: "Report ID and User ID are required" });
      }
  
      // Fetch user details
      const userRes = await pool.query("SELECT role FROM users WHERE id = $1", [userId]);
      if (userRes.rowCount === 0) {
        return res.status(401).json({ error: "Unauthorized: User not found" });
      }
  
      const userRole = userRes.rows[0].role;
  
      // Fetch report with reporter & reportee info
      const query = `
        SELECT 
          reports.*, 
          reporter.id AS reporter_id,
          reporter.name AS reporter_name,
          reporter.roll_number AS reporter_roll_number,
          reportee.id AS reportee_id,
          reportee.name AS reportee_name,
          reportee.roll_number AS reportee_roll_number
        FROM reports
        JOIN users AS reporter ON reports.reporter_id = reporter.id
        JOIN users AS reportee ON reports.reportee_id = reportee.id
        WHERE reports.id = $1;
      `;
  
      const { rows } = await pool.query(query, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: "Report not found" });
      }
  
      const report = rows[0];
  
      // Authorization check
      const isAuthorized =
        userRole === "admin" ||
        userRole === "developer" ||
        report.reporter_id === userId;
  
      if (!isAuthorized) {
        return res.status(403).json({ error: "Access denied" });
      }
  
      return res.status(200).json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }  
  
  export async function handleGetAllReports(req, res) {
    try {
      const userId = req.user?.user_id;
  
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
  
      const userRes = await pool.query("SELECT role FROM users WHERE id = $1", [userId]);
      if (userRes.rowCount === 0) {
        return res.status(401).json({ error: "User not found" });
      }
  
      const userRole = userRes.rows[0].role;
      if (userRole !== "admin" && userRole !== "developer") {
        return res.status(403).json({ error: "Access denied" });
      }
  
      const query = `
        SELECT 
          reports.*, 
          reporter.id AS reporter_id,
          reporter.name AS reporter_name,
          reporter.roll_number AS reporter_roll_number,
          reportee.id AS reportee_id,
          reportee.name AS reportee_name,
          reportee.roll_number AS reportee_roll_number
        FROM reports
        JOIN users AS reporter ON reports.reporter_id = reporter.id
        JOIN users AS reportee ON reports.reportee_id = reportee.id
      `;
  
      const { rows } = await pool.query(query);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: "No reports found" });
      }
  
      return res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching reports:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  
  export async function handleUpdateReport(req, res) {
    try {
      const reportId = req.params.id;
      const userId = req.user?.user_id;
      const { status } = req.body;
  
      if (!reportId || !userId || !status) {
        return res.status(400).json({ error: "Report ID, User ID, and status are required" });
      }
  
      const userRes = await pool.query("SELECT role FROM users WHERE id = $1", [userId]);
      if (userRes.rowCount === 0) {
        return res.status(401).json({ error: "Unauthorized: User not found" });
      }
  
      const userRole = userRes.rows[0].role;
      if (userRole !== "admin" && userRole !== "developer") {
        return res.status(403).json({ error: "Access denied" });
      }
  
      const updateQuery = `
        UPDATE reports
        SET status = $1
        WHERE id = $2
        RETURNING *;
      `;
  
      const { rows } = await pool.query(updateQuery, [status, reportId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: "Report not found" });
      }
  
      return res.status(200).json({ message: "Report status updated successfully", report: rows[0] });
    } catch (error) {
      console.error("Error updating report status:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  