import pool from "../config/db.js";

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
        const result = await pool.query(
            "UPDATE replies SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
            [content, reply_id, user_id]
        );

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
        const result = await pool.query(
            "DELETE FROM replies WHERE id = $1 AND user_id = $2 RETURNING *",
            [reply_id, user_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Reply not found or you don't have permission to delete it." });
        }

        res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
