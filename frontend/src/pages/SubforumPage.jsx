import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function SubforumPage() {
    const { subforum } = useParams();
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(`http://localhost:3000/forum/thread/${subforum}/all`);
        fetch(`http://localhost:3000/forum/thread/${subforum}/all`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Threads Data:", data);
                setThreads(data);
            })
            .catch((err) => console.error("Error fetching threads:", err))
            .finally(() => setLoading(false));
    }, [subforum]);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{subforum} Forum</h1>

            {loading ? (
                <p>Loading threads...</p>
            ) : threads.length === 0 ? (
                <p>No threads found.</p>
            ) : (
                <div className="space-y-4">
                    {threads.map((thread) => (
                        <Link 
                            to={`/forum/thread/${thread.id}`} 
                            key={thread.id} 
                            className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                        >
                            <h2 className="text-lg font-semibold">{thread.title}</h2>
                            <p className="text-sm text-gray-600">
                                Created by {thread.username} • {new Date(thread.created_at).toLocaleString()}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
