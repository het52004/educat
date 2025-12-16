import "../../styles/student/Dashboard.css";

const messages = [
  {
    id: 1,
    sender: "Sarah Connor",
    role: "Instructor",
    text: "Don't forget the deadline for the final project!",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "Support Team",
    role: "Admin",
    text: "Your payment was successfully processed.",
    time: "Yesterday",
  },
];

function Messages() {
  return (
    <div className="messages-panel">
      <h2 className="section-title">Inbox</h2>
      {messages.map((msg) => (
        <div key={msg.id} className="message-row">
          <div className="msg-avatar-placeholder">{msg.sender[0]}</div>
          <div className="msg-info">
            <h4>
              {msg.sender} <span className="role-tag">{msg.role}</span>
            </h4>
            <p>{msg.text}</p>
          </div>
          <span className="msg-time">{msg.time}</span>
        </div>
      ))}
    </div>
  );
}

export default Messages;
