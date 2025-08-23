// src/pages/CalendarPage.jsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import TodoModal from "../components/Todo/TodoModal";
import { apiRequest } from "../api";

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

  useEffect(() => {
    fetchTodos();
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function fetchTodos() {
    try {
      const data = await apiRequest("todos", "GET");

      // Map backend LocalDateTime directly to JS Date
      const mapped = data
  .filter(todo => todo.startDate && todo.endDate)
  .map(todo => {
    // Remove fractional seconds if present
    const cleanStart = todo.startDate.split('.')[0].replace(' ', 'T');
    const cleanEnd = todo.endDate.split('.')[0].replace(' ', 'T');

    let start = new Date(cleanStart);
    let end = new Date(cleanEnd);

    if (todo.allDay) {
      start = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0);
      end = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59);
    }

    return {
      id: todo.id,
      title: todo.title,
      start,
      end,
      allDay: !!todo.allDay,
      extendedProps: {
        completed: todo.completed,
        eventType: todo.eventType,
      },
    };
  });

      setEvents(mapped);
    } catch (err) {
      console.error("Failed to fetch todos:", err.message);
    }
  }

  function handleDateClick(date) {
    setSelectedEvent(null);
    setModalOpen(true);
  }

  function handleEventClick(event) {
    setSelectedEvent({
      id: event.id,
      title: event.title,
      startDate: event.start.toISOString(),
      endDate: event.end.toISOString(),
      allDay: event.allDay,
      completed: event.extendedProps.completed,
      eventType: event.extendedProps.eventType,
    });
    setModalOpen(true);
  }

  async function handleSave(payload) {
    try {
      if (selectedEvent) {
        const updated = await apiRequest(`todos/${selectedEvent.id}`, "PUT", payload);
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === updated.id
              ? {
                  ...updated,
                  start: new Date(updated.startDate),
                  end: new Date(updated.endDate),
                  allDay: !!updated.allDay,
                }
              : ev
          )
        );
      } else {
        const created = await apiRequest("todos", "POST", payload);
        setEvents((prev) => [
          ...prev,
          {
            ...created,
            start: new Date(created.startDate),
            end: new Date(created.endDate),
            allDay: !!created.allDay,
          },
        ]);
      }
    } catch (err) {
      console.error("Save failed:", err.message);
    } finally {
      setModalOpen(false);
    }
  }

  async function handleDelete() {
    if (!selectedEvent) return;
    try {
      await apiRequest(`todos/${selectedEvent.id}`, "DELETE");
      setEvents((prev) => prev.filter((ev) => ev.id !== selectedEvent.id));
      setModalOpen(false);
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  }

  const isMobile = windowWidth < 768;

  // Tailwind-based dark styles
  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.allDay ? "#9333ea" : "#2563eb", // purple for allDay, blue for normal
      color: "#f9fafb",
      borderRadius: "0.375rem",
      border: "none",
      padding: "2px 4px",
      fontSize: isMobile ? "0.7rem" : "0.85rem",
    },
  });

  const dayPropGetter = (date) => {
    const isCurrentMonth = date.getMonth() === new Date().getMonth();
    return {
      style: {
        backgroundColor: isCurrentMonth ? "#1f2937" : "#374151", // gray-800 / gray-700
        color: isCurrentMonth ? "#f9fafb" : "#9ca3af", // gray-50 / gray-400
      },
    };
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 p-2 md:p-4">
      <div className="flex-1 min-h-0">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={(slotInfo) => handleDateClick(slotInfo.start)}
          onSelectEvent={handleEventClick}
          eventPropGetter={eventStyleGetter}
          dayPropGetter={dayPropGetter}
          views={["month", "week", "day"]}
          defaultView={isMobile ? "day" : "month"}
          style={{ height: "90vh" }}
        />
      </div>

      <TodoModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  onSave={handleSave}
  onDelete={(id) => setEvents(prev => prev.filter(ev => ev.id !== id))}
  initialData={selectedEvent}
/>

      {modalOpen && selectedEvent && (
        <div className={`fixed ${isMobile ? "bottom-4 left-4 right-4" : "bottom-10 right-10"}`}>
          <button
            onClick={handleDelete}
            className={`px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 ${isMobile ? "w-full" : ""}`}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
