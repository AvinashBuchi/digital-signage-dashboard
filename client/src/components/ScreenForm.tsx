import { FormEvent, useState } from "react";
import { NewScreenPayload } from "../types";

interface ScreenFormProps {
  onSubmit: (payload: NewScreenPayload) => Promise<void>;
}

const ScreenForm = ({ onSubmit }: ScreenFormProps) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit({ name, location, content });
      setName("");
      setLocation("");
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <h2>Add New Screen</h2>
      <label htmlFor="name">Screen Name</label>
      <input id="name" value={name} onChange={(event) => setName(event.target.value)} required />

      <label htmlFor="location">Location</label>
      <input
        id="location"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        required
      />

      <label htmlFor="content">Content</label>
      <textarea
        id="content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        required
      />

      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add Screen"}
      </button>
    </form>
  );
};

export default ScreenForm;
