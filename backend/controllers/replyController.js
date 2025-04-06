import pool from "../config/db.js";

export async function handleGetRepliesBySearch(req, res) {
    try {
        const { replyId, threadId, username, keywords, dateFrom, dateTo, sortBy } = req.query;

        let query = `
            SELECT replies.*, users.username 
            FROM replies
            JOIN users ON replies.user_id = users.id
            WHERE 1=1`;
        
        let values = [];
        let index = 1;

        if (replyId) {
            query += ` AND replies.id = $${index++}`;
            values.push(replyId);
        }

        if (threadId) {
            query += ` AND replies.thread_id = $${index++}`;
            values.push(threadId);
        }

        if (username) {
            query += ` AND users.username ILIKE $${index++}`;
            values.push(`%${username}%`);
        }

        if (keywords) {
            query += ` AND replies.content ILIKE $${index++}`;
            values.push(`%${keywords}%`);
        }

        if (dateFrom) {
            query += ` AND replies.created_at >= $${index++}`;
            values.push(dateFrom);
        }

        if (dateTo) {
            query += ` AND replies.created_at <= $${index++}`;
            values.push(dateTo);
        }

        // Sorting
        if (sortBy === "oldest") {
            query += ` ORDER BY replies.created_at ASC`;
        } else {
            query += ` ORDER BY replies.created_at DESC`; // Default: Newest
        }

        const result = await pool.query(query, values);
        res.json(result.rows);
        
    } catch (error) {
        console.error("Error fetching replies:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function handleGetAllReplies(req, res) {
    const threadid  = req.params.threadid;

    if (!threadid) {
        return res.status(400).json({ error: "Thread ID is required." });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM replies WHERE thread_id = $1 ORDER BY created_at ASC",
            [threadid]
        );

        res.status(200).json({ replies: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function handleGetReply(req, res) {
    const reply_id = req.params.replyid;

    if (!reply_id) {
        return res.status(400).json({ error: "Reply ID is required." });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM replies WHERE id = $1",
            [reply_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Reply not found." });
        }

        res.status(200).json({ reply: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function handleReplyPostToThread(req, res) {
    const { content } = req.body;
    const thread_id = req.params.threadid;
    const user_id = req.user.user_id;

    if (!thread_id || !content) {
        return res.status(400).json({ error: "Thread ID and content are required." });
    }

    try {
        const result = await pool.query(
            "INSERT INTO replies (thread_id, user_id, content, parent_reply_id) VALUES ($1, $2, $3, NULL) RETURNING *",
            [thread_id, user_id, content]
        );

        res.status(201).json({ message: "Reply posted successfully", reply: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function handleReplyModify(req, res) {
    const { content } = req.body;
    const reply_id = req.params.replyid;
    const user_id = req.user.user_id;

    if (!reply_id || !content) {
        return res.status(400).json({ error: "Reply ID and new content are required." });
    }

    try {
        // Fetch user role
        const userResult = await pool.query("SELECT role FROM users WHERE id = $1", [user_id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const userRole = userResult.rows[0].role;

        let query, params;
        if (userRole === "admin" || userRole === "developer") {
            // Admins and developers can modify any reply
            query = "UPDATE replies SET content = $1 WHERE id = $2 RETURNING *";
            params = [content, reply_id];
        } else {
            // Normal users can only modify their own replies
            query = "UPDATE replies SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *";
            params = [content, reply_id, user_id];
        }

        const result = await pool.query(query, params);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Reply not found or you don't have permission to modify it." });
        }

        res.status(200).json({ message: "Reply modified successfully", reply: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function handleReplyDelete(req, res) {
    const reply_id = req.params.replyid;
    const user_id = req.user.user_id;

    if (!reply_id) {
        return res.status(400).json({ error: "Reply ID is required." });
    }

    try {
        // Fetch user role
        const userResult = await pool.query("SELECT role FROM users WHERE id = $1", [user_id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const userRole = userResult.rows[0].role;

        let query, params;
        if (userRole === "admin" || userRole === "developer") {
            // Admins and developers can delete any reply
            query = "DELETE FROM replies WHERE id = $1 RETURNING *";
            params = [reply_id];
        } else {
            // Normal users can only delete their own replies
            query = "DELETE FROM replies WHERE id = $1 AND user_id = $2 RETURNING *";
            params = [reply_id, user_id];
        }

        const result = await pool.query(query, params);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Reply not found or you don't have permission to delete it." });
        }

        res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

