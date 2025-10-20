"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [showCompleted, setShowCompleted] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: Date.now(),
      title: newTodo.trim(),
      completed: false,
    };

    setTodos([...todos, todo]);
    setNewTodo("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewTodo(e.target.value);
  };

  const toggleComplete = (id: number): void => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number): void => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = (): void => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch {
        console.error("Failed to parse todos from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = showCompleted
    ? todos.filter((todo) => todo.completed)
    : todos;

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>To-Do list</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter new task..."
          value={newTodo}
          onChange={handleChange}
          style={{ padding: "0.5rem", width: "70%", marginRight: "0.5rem" }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </form>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={() => setShowCompleted(!showCompleted)}
          />
          Show only completed
        </label>

        <button
          onClick={clearCompleted}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Clear all completed
        </button>
      </div>

      {filteredTodos.length === 0 && <p>No tasks yet. Add one!</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              backgroundColor: todo.completed ? "#e0ffe0" : "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
              />
              <Link
                href={`/todos/${todo.id}`}
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: "black",
                }}
              >
                {todo.title}
              </Link>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "red",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
