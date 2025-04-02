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
  
      if (!id) {
        return res.status(400).json({ error: "Report ID is required" });
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
        WHERE reports.id = $1;
      `;
  
      const { rows } = await pool.query(query, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: "Report not found" });
      }
  
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Error fetching report:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function handleGetAllReports(req, res) {
    try {
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
        return res.status(404).json({ error: "Report not found" });
      }
  
      return res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching reports:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
}