import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ThreadPage() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [threadVotes, setThreadVotes] = useState(0);
  const [replyVotes, setReplyVotes] = useState({});

  async function fetchVoteCounts() {
    try {
      const threadVoteResponse = await fetch(`http://localhost:3000/forum/vote/thread/${id}`);
      const threadVoteData = await threadVoteResponse.json();
      setThreadVotes(threadVoteData.net_votes);
      
      const votesMapping = {};
      await Promise.all(
        replies.map(async (reply) => {
          const replyVoteResponse = await fetch(`http://localhost:3000/forum/vote/reply/${reply.id}`);
          const replyVoteData = await replyVoteResponse.json();
          votesMapping[reply.id] = replyVoteData.net_votes;
        })
      );
      setReplyVotes(votesMapping);
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  }

  useEffect(() => {
    async function fetchThreadAndReplies() {
      try {
        const response = await fetch(`http://localhost:3000/forum/thread/${id}`);
        const data = await response.json();
        if (response.ok) {
          setThread(data.thread);
          setReplies(data.replies);
        } else {
          console.error("Error fetching thread:", data.error);
        }
      } catch (error) {
        console.error("Error fetching thread:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchThreadAndReplies();
  }, [id]);

  useEffect(() => {
    if (thread && replies.length > 0) {
      fetchVoteCounts();
    }
  }, [thread, replies]);

  async function handleVote(contentId, contentType, voteType) {
    try {
      const response = await fetch("http://localhost:3000/forum/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          thread_id: contentType === "thread" ? contentId : null,
          reply_id: contentType === "reply" ? contentId : null,
          vote_type: voteType,
        }),
      });
      if (response.ok) {
        fetchVoteCounts();
      } else {
        console.error("Vote failed");
      }
    } catch (error) {
      console.error("Vote error:", error);
    }
  }

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (!thread) return <p className="text-center text-lg font-semibold text-red-500">Thread not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 relative">
      <div className="border rounded-lg shadow-md p-4 mb-6 bg-white">
        <h1 className="text-2xl font-bold mb-2">{thread.title}</h1>
        <p className="text-gray-700">{thread.content}</p>
        <div className="mt-4 text-sm text-gray-500">
          <span>By <strong>{thread.username}</strong></span> | 
          <span> {new Date(thread.created_at).toLocaleString()}</span> | 
          <span> Votes: {threadVotes}</span>
          <div className="mt-2 flex space-x-2">
            <button
              onClick={() => handleVote(thread.id, "thread", 1)}
              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Upvote
            </button>
            <button
              onClick={() => handleVote(thread.id, "thread", -1)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Downvote
            </button>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setShowReplyBox(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Reply to Thread
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Replies</h2>
        {replies.length === 0 ? (
          <p className="text-gray-500">No replies yet. Be the first to reply!</p>
        ) : (
          replies.map((reply) => (
            <div key={reply.id} className="border rounded-lg shadow-sm p-3 mb-3 bg-gray-100">
              <p className="text-gray-800">{reply.content}</p>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                <div>
                  <span>By <strong>{reply.username}</strong></span> | 
                  <span> {new Date(reply.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Votes: {replyVotes[reply.id] || 0}</span>
                  <button
                    onClick={() => handleVote(reply.id, "reply", 1)}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Upvote
                  </button>
                  <button
                    onClick={() => handleVote(reply.id, "reply", -1)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Downvote
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
