import { useEffect, useRef, useState } from "react";
import "../../../styles/student/Dashboard.css";
import "../../../styles/student/Messages.css";
import useMessageStore from "../../../store/student/useMessageStore";
import { useAuthStore } from "../../../store/student/useAuthStore";

function Messages() {
    const { instructors, messages, selectedInstructor, loading, fetchInstructors, selectInstructor, fetchMessages, sendMessage } = useMessageStore();
    const user = useAuthStore((state) => state.user);
    const [text, setText] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        fetchInstructors();
    }, []);

    useEffect(() => {
        if (selectedInstructor && user) {
            const ids = [user._id, selectedInstructor._id].sort().join("_");
            fetchMessages(ids);
            const interval = setInterval(() => fetchMessages(ids), 3000);
            return () => clearInterval(interval);
        }
    }, [selectedInstructor]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!text.trim() || !selectedInstructor || !user) return;
        const ids = [user._id, selectedInstructor._id].sort().join("_");
        await sendMessage(ids, text.trim());
        setText("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h3 className="chat-sidebar-title">Instructors</h3>
                {instructors.length === 0 && (
                    <p className="chat-empty-hint">No instructors available</p>
                )}
                {instructors.map((inst) => (
                    <button
                        key={inst._id}
                        className={`chat-contact ${selectedInstructor?._id === inst._id ? "active" : ""}`}
                        onClick={() => selectInstructor(inst)}
                    >
                        <div className="chat-avatar">{inst.name[0]}</div>
                        <div className="chat-contact-info">
                            <span className="chat-contact-name">{inst.name}</span>
                            <span className="chat-contact-role">Instructor</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="chat-main">
                {!selectedInstructor ? (
                    <div className="chat-placeholder">
                        <div className="chat-placeholder-icon">💬</div>
                        <p>Select an instructor to start chatting</p>
                    </div>
                ) : (
                    <>
                        <div className="chat-header">
                            <div className="chat-avatar">{selectedInstructor.name[0]}</div>
                            <div>
                                <div className="chat-header-name">{selectedInstructor.name}</div>
                                <div className="chat-header-role">Instructor</div>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {loading && messages.length === 0 && (
                                <p className="chat-loading">Loading messages...</p>
                            )}
                            {messages.map((msg) => (
                                <div
                                    key={msg._id}
                                    className={`chat-bubble-wrap ${msg.senderRole === "student" ? "mine" : "theirs"}`}
                                >
                                    <div className="chat-bubble">{msg.text}</div>
                                    <div className="chat-time">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        <div className="chat-input-area">
                            <input
                                className="chat-input"
                                type="text"
                                placeholder="Type a message..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="chat-send-btn" onClick={handleSend}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Messages;
