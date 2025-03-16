import pool from "../config/db.js";

export async function handleGetAllThreads(req, res) {
    const subforum = req.params.subforum;

    try {
        const result = await pool.query(
            `SELECT threads.id, threads.title, threads.content, threads.subforum, 
                    threads.created_at, users.username, 
                    COUNT(replies.id) AS repliesCount
             FROM threads
             JOIN users ON threads.user_id = users.id
             LEFT JOIN replies ON replies.thread_id = threads.id
             WHERE threads.subforum = $1
             GROUP BY threads.id, users.username
             ORDER BY threads.created_at DESC`,
            [subforum]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function handleGetThread(req, res) {
    const threadid = req.params.id;

    if (!threadid) {
        return res.status(400).json({ error: "Thread ID is missing." });
    }

    try {
        const threadQuery = `
            SELECT 
                t.id, t.title, t.content, t.subforum, t.created_at, 
                u.id AS user_id, u.username, u.reputation,
                COALESCE(SUM(v.vote_type), 0) AS votes
            FROM threads t
            JOIN users u ON t.user_id = u.id
            LEFT JOIN votes v ON v.thread_id = t.id
            WHERE t.id = $1
            GROUP BY t.id, u.id
        `;

        const repliesQuery = `
            SELECT 
                r.id, r.content, r.created_at, r.parent_reply_id,
                u.id AS user_id, u.username,
                COALESCE(SUM(v.vote_type), 0) AS votes
            FROM replies r
            JOIN users u ON r.user_id = u.id
            LEFT JOIN votes v ON v.reply_id = r.id
            WHERE r.thread_id = $1
            GROUP BY r.id, u.id
            ORDER BY r.created_at DESC
        `;

        const threadResult = await pool.query(threadQuery, [threadid]);
        const repliesResult = await pool.query(repliesQuery, [threadid]);

        if (threadResult.rows.length === 0) {
            return res.status(404).json({ error: "Thread not found." });
        }

        res.status(200).json({
            thread: threadResult.rows[0],
            replies: repliesResult.rows,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export async function handleThreadCreate(req, res) {
    try {
        const user_id = req.user.user_id;
        const subforum = req.params.subforum;
        const { title, content } = req.body;

        if (!user_id || !subforum || !title || !content) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const query = `
            INSERT INTO threads (user_id, subforum, title, content)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [user_id, subforum, title, content];
        const newThread = await pool.query(query, values);

        res.status(201).json({ message: "Thread created successfully.", thread: newThread.rows[0] });

    } catch (err) {
        console.error("Error creating thread:", err);
        res.status(500).json({ error: "Server error." });
    }
}

export async function handleThreadModify(req, res) {
    try {
        const user_id = req.user.user_id;
        const { title, content } = req.body;
        const thread_id = req.params.id;
        //console.log(thread_id);

        if (!thread_id || !user_id || (!title && !content)) {
            return res.status(400).json({ error: "Thread ID, User ID, and at least one field (title/content) are required." });
        }

        const threadQuery = await pool.query("SELECT * FROM threads WHERE id = $1 AND user_id = $2", [thread_id, user_id]);
        if (threadQuery.rows.length === 0) {
            return res.status(403).json({ error: "Thread not found or unauthorized." });
        }

        const updateFields = [];
        const values = [thread_id];

        if (title) {
            values.push(title);
            updateFields.push(`title = $${values.length}`);
        }
        if (content) {
            values.push(content);
            updateFields.push(`content = $${values.length}`);
        }

        const updateQuery = `UPDATE threads SET ${updateFields.join(", ")} WHERE id = $1 RETURNING *;`;
        const updatedThread = await pool.query(updateQuery, values);

        res.status(200).json({ message: "Thread updated successfully.", thread: updatedThread.rows[0] });

    } catch (err) {
        console.error("Error modifying thread:", err);
        res.status(500).json({ error: "Server error." });
    }
}

export async function handleThreadDelete(req, res) {
    try {
        const user_id = req.user.user_id;
        const thread_id = req.params.id;

        if (!thread_id || !user_id) {
            return res.status(400).json({ error: "Thread ID and User ID are required." });
        }

        const threadQuery = await pool.query("SELECT * FROM threads WHERE id = $1 AND user_id = $2", [thread_id, user_id]);
        if (threadQuery.rows.length === 0) {
            return res.status(403).json({ error: "Thread not found or unauthorized." });
        }

        await pool.query("DELETE FROM threads WHERE id = $1", [thread_id]);

        res.status(200).json({ message: "Thread deleted successfully." });

    } catch (err) {
        console.error("Error deleting thread:", err);
        res.status(500).json({ error: "Server error." });
    }
}
