import pool from "../config/db.js"; 

export async function handleGetWeeklyLeaderboard(req, res) {
    try {
        const result = await pool.query(
            `SELECT u.id, u.username, u.roll_number,
                    COALESCE(
                        (SELECT COUNT(*) * 5 FROM threads t WHERE t.user_id = u.id AND t.created_at >= NOW() - INTERVAL '7 days'), 0
                    ) +
                    COALESCE(
                        (SELECT COUNT(*) * 2 FROM replies r WHERE r.user_id = u.id AND r.created_at >= NOW() - INTERVAL '7 days'), 0
                    ) +
                    COALESCE(
                        (SELECT SUM(v.vote_type) FROM votes v WHERE v.user_id = u.id AND v.created_at >= NOW() - INTERVAL '7 days'), 0
                    ) AS points
             FROM users u
             ORDER BY points DESC
             LIMIT 10;`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching weekly leaderboard:", error);
        res.status(500).json({ error: "Server error" });
    }
}

export async function handleGetLifetimeLeaderboard(req, res) {
    try {
        const result = await pool.query(
            `SELECT u.id, u.username, u.roll_number,
                    COALESCE((SELECT COUNT(*) * 5 FROM threads t WHERE t.user_id = u.id), 0) +
                    COALESCE((SELECT COUNT(*) * 2 FROM replies r WHERE r.user_id = u.id), 0) +
                    COALESCE((SELECT SUM(v.vote_type) FROM votes v WHERE v.user_id = u.id), 0) AS points
             FROM users u
             ORDER BY points DESC
             LIMIT 10;`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching lifetime leaderboard:", error);
        res.status(500).json({ error: "Server error" });
    }
}
