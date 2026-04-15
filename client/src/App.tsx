import { useEffect, useState } from "react";
import ScreenCard from "./components/ScreenCard";
import ScreenForm from "./components/ScreenForm";
import { createScreen, deleteScreen, getScreens, scheduleMessage, updateScreen } from "./services/api";
import { Screen, ScreenStatus } from "./types";
import "./styles.css";

const App = () => {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadScreens = async () => {
    try {
      setLoading(true);
      const data = await getScreens();
      setScreens(data);
      setError("");
    } catch (apiError) {
      setError("Unable to load screens. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadScreens();
  }, []);

  const handleCreateScreen = async (payload: { name: string; location: string; content: string }) => {
    try {
      await createScreen(payload);
      await loadScreens();
    } catch (apiError) {
      setError("Failed to create screen.");
    }
  };

  const handleUpdateScreen = async (id: number, content: string, status: ScreenStatus) => {
    try {
      await updateScreen(id, { content, status });
      await loadScreens();
    } catch (apiError) {
      setError("Failed to update screen.");
    }
  };

  const handleDeleteScreen = async (id: number) => {
    try {
      await deleteScreen(id);
      await loadScreens();
    } catch (apiError) {
      setError("Failed to delete screen.");
    }
  };

  const handleSchedule = async (id: number, message: string, time: string) => {
    try {
      await scheduleMessage(id, { scheduledMessage: message, scheduledTime: time });
      await loadScreens();
    } catch (apiError) {
      setError("Failed to schedule message.");
    }
  };

  return (
    <main className="app">
      <header>
        <h1>Digital Signage Dashboard</h1>
        <p>Manage screen content, status, and scheduled announcements.</p>
      </header>

      <ScreenForm onSubmit={handleCreateScreen} />

      {loading && <p>Loading screens...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && (
        <section className="screen-grid">
          {screens.length === 0 ? (
            <p className="empty-state">No screens found. Add one to get started.</p>
          ) : (
            screens.map((screen) => (
              <ScreenCard
                key={screen.id}
                screen={screen}
                onUpdate={handleUpdateScreen}
                onDelete={handleDeleteScreen}
                onSchedule={handleSchedule}
              />
            ))
          )}
        </section>
      )}
    </main>
  );
};

export default App;
