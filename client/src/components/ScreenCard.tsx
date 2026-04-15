import { FormEvent, useState } from "react";
import { Screen, ScreenStatus } from "../types";

interface ScreenCardProps {
  screen: Screen;
  onUpdate: (id: number, content: string, status: ScreenStatus) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onSchedule: (id: number, message: string, time: string) => Promise<void>;
}

const ScreenCard = ({ screen, onUpdate, onDelete, onSchedule }: ScreenCardProps) => {
  const [content, setContent] = useState(screen.content);
  const [status, setStatus] = useState<ScreenStatus>(screen.status);
  const [scheduledMessage, setScheduledMessage] = useState(screen.scheduledMessage ?? "");
  const [scheduledTime, setScheduledTime] = useState(
    screen.scheduledTime ? screen.scheduledTime.slice(0, 16) : ""
  );

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onUpdate(screen.id, content, status);
  };

  const handleSchedule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSchedule(screen.id, scheduledMessage, scheduledTime);
  };

  return (
    <div className="screen-card">
      <div className="screen-card-header">
        <h3>{screen.name}</h3>
        <span className={`status-badge ${screen.status}`}>
          {screen.status === "online" ? "Online" : "Offline"}
        </span>
      </div>
      <p className="meta">Location: {screen.location}</p>
      <p className="content-preview">{screen.content}</p>

      <form className="card-form" onSubmit={handleUpdate}>
        <label htmlFor={`content-${screen.id}`}>Update Content</label>
        <textarea
          id={`content-${screen.id}`}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />

        <label htmlFor={`status-${screen.id}`}>Status</label>
        <select
          id={`status-${screen.id}`}
          value={status}
          onChange={(event) => setStatus(event.target.value as ScreenStatus)}
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>

        <button type="submit">Save Changes</button>
      </form>

      <form className="card-form" onSubmit={handleSchedule}>
        <label htmlFor={`schedule-message-${screen.id}`}>Scheduled Message</label>
        <input
          id={`schedule-message-${screen.id}`}
          value={scheduledMessage}
          onChange={(event) => setScheduledMessage(event.target.value)}
          placeholder="Promotion starts at 9 AM"
          required
        />

        <label htmlFor={`schedule-time-${screen.id}`}>Scheduled Time</label>
        <input
          id={`schedule-time-${screen.id}`}
          type="datetime-local"
          value={scheduledTime}
          onChange={(event) => setScheduledTime(event.target.value)}
          required
        />

        <button type="submit">Set Schedule</button>
      </form>

      <button className="danger-button" type="button" onClick={() => onDelete(screen.id)}>
        Delete Screen
      </button>
    </div>
  );
};

export default ScreenCard;
