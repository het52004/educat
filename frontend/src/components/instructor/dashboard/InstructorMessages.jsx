import { useEffect, useRef, useState } from "react";
import "../../../styles/instructor/Dashboard.css";
import useInstructorMessageStore from "../../../store/instructor/useMessageStore";

function InstructorMessages({ instructor }) {
    const { students, messages, selectedStudent, fetchStudents, selectStudent, fetchMessages, sendMessage } = useInstructorMessageStore();
    const [text, setText] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (selectedStudent && instructor) {
            const ids = [instructor._id, selectedStudent._id].sort().join("_");
            fetchMessages(ids);
            const interval = setInterval(() => fetchMessages(ids), 3000);
            return () => clearInterval(interval);
        }
    }, [selectedStudent]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!text.trim() || !selectedStudent || !instructor) return;
        const ids = [instructor._id, selectedStudent._id].sort().join("_");
        await sendMessage(ids, text.trim());
        setText("");
    };

    return (
        <div className="instructor-chat-container">
            <div className="instructor-chat-sidebar">
                <div className="instructor-chat-sidebar-title">Students</div>
                {students.length === 0 && (
                    <p style={{ padding: "0 16px", fontSize: "13px", color: "var(--text-gray)" }}>No students yet</p>
                )}
                {students.map((s) => (
                    <button
                        key={s._id}
                        className={`instructor-chat-contact ${selectedStudent?._id === s._id ? "active" : ""}`}
                        onClick={() => selectStudent(s)}
                    >
                        <div className="instructor-chat-avatar">{s.fullName[0]}</div>
                        <div>
                            <span className="instructor-chat-contact-name">{s.fullName}</span>
                            <span className="instructor-chat-contact-role">Student</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="instructor-chat-main">
                {!selectedStudent ? (
                    <div className="instructor-chat-placeholder">
                        <span style={{ fontSize: "40px" }}>💬</span>
                        <p>Select a student to chat</p>
                    </div>
                ) : (
                    <>
                        <div className="instructor-chat-header">
                            <div className="instructor-chat-avatar">{selectedStudent.fullName[0]}</div>
                            <div>
                                <div className="instructor-chat-header-name">{selectedStudent.fullName}</div>
                                <div className="instructor-chat-header-role">Student</div>
                            </div>
                        </div>

                        <div className="instructor-chat-messages">
                            {messages.map((msg) => (
                                <div key={msg._id} className={`instructor-bubble-wrap ${msg.senderRole === "instructor" ? "mine" : "theirs"}`}>
                                    <div className="instructor-bubble">{msg.text}</div>
                                    <div className="instructor-bubble-time">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        <div className="instructor-chat-input-area">
                            <input
                                className="instructor-chat-input"
                                type="text"
                                placeholder="Type a message..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                            />
                            <button className="instructor-chat-send" onClick={handleSend}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export default InstructorMessages;
