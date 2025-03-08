import pool from "../config/db.js";

export async function handleVote(req, res) {
    try {
        const user_id = req.user.user_id;
        const { thread_id, reply_id, vote_type } = req.body;

        if (!user_id || ![-1, 1].includes(vote_type)) {
            return res.status(400).json({ error: "Invalid input." });
        }

        // Ensure that only one of thread_id or reply_id is provided
        if ((thread_id && reply_id) || (!thread_id && !reply_id)) {
            return res.status(400).json({ error: "Provide only one of thread_id or reply_id." });
        }

        // Validate if the provided thread_id or reply_id exists
        if (thread_id) {
            const threadExists = await pool.query("SELECT id FROM threads WHERE id = $1", [thread_id]);
            if (threadExists.rows.length === 0) {
                return res.status(404).json({ error: "Thread not found." });
            }
        } else if (reply_id) {
            const replyExists = await pool.query("SELECT id FROM replies WHERE id = $1", [reply_id]);
            if (replyExists.rows.length === 0) {
                return res.status(404).json({ error: "Reply not found." });
            }
        }

        // Check if the user has already voted
        const existingVote = await pool.query(
            "SELECT id, vote_type FROM votes WHERE user_id = $1 AND (thread_id = $2 OR reply_id = $3)",
            [user_id, thread_id || null, reply_id || null]
        );

        if (existingVote.rows.length > 0) {
            const prevVoteType = existingVote.rows[0].vote_type;

            if (prevVoteType === vote_type) {
                // User clicked the same vote -> Remove vote
                await pool.query("DELETE FROM votes WHERE id = $1", [existingVote.rows[0].id]);
                return res.status(200).json({ message: "Vote removed." });
            } else {
                // User changed their vote -> Update it
                await pool.query(
                    "UPDATE votes SET vote_type = $1 WHERE id = $2",
                    [vote_type, existingVote.rows[0].id]
                );
                return res.status(200).json({ message: "Vote updated." });
            }
        }

        // User voting for the first time -> Insert vote
        await pool.query(
            "INSERT INTO votes (user_id, thread_id, reply_id, vote_type) VALUES ($1, $2, $3, $4)",
            [user_id, thread_id || null, reply_id || null, vote_type]
        );

        res.status(201).json({ message: "Vote recorded." });
    } catch (err) {
        console.error("Vote handling error:", err);
        res.status(500).json({ error: "Internal Server Error." });
    }
}

export async function handleGetVoteCount(req, res) {
    try {
        const { contentType, contentId } = req.params;

        // Ensure only one of threadId or replyId is provided
        if (!contentType || !contentId) {
            return res.status(400).json({ error: "Missing details." });
        }

        let result;
        
        if(contentType === 'thread') {
            result = await pool.query(
                "SELECT COALESCE(SUM(vote_type), 0) AS net_votes FROM votes WHERE thread_id = $1",
                [contentId]
            );
        } else if(contentType === 'reply') {
            result = await pool.query(
                "SELECT COALESCE(SUM(vote_type), 0) AS net_votes FROM votes WHERE reply_id = $1",
                [contentId]
            );
        } else {
            return res.status(400).json({ error: "Invalid content type."});
        }

        res.status(200).json({ net_votes: result.rows[0]?.net_votes || 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error." });
    }
}
