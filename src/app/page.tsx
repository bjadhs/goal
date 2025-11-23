'use client';

import React, { useState, useEffect } from 'react';
import Quadrant from '@/components/Quadrant';
import DateTimeDisplay from '@/components/DateTimeDisplay';
import { supabase } from '@/lib/supabase';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type QuadrantType = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface TodoState {
  daily: Todo[];
  weekly: Todo[];
  monthly: Todo[];
  yearly: Todo[];
}

interface DbTodo {
  id: string;
  text: string;
  completed: boolean;
  type: QuadrantType;
  created_at: string;
}

export default function Home() {
  const [todos, setTodos] = useState<TodoState>({
    daily: [],
    weekly: [],
    monthly: [],
    yearly: [],
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch todos from Supabase on mount
  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching todos:', error);
        setIsLoaded(true);
        return;
      }

      if (data) {
        const grouped: TodoState = {
          daily: [],
          weekly: [],
          monthly: [],
          yearly: [],
        };

        data.forEach((todo: DbTodo) => {
          grouped[todo.type].push({
            id: todo.id,
            text: todo.text,
            completed: todo.completed,
          });
        });

        setTodos(grouped);
      }

      setIsLoaded(true);
    };

    fetchTodos();
  }, []);

  const addTodo = async (type: QuadrantType, text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };

    // Optimistic update
    setTodos((prev) => ({
      ...prev,
      [type]: [newTodo, ...prev[type]],
    }));

    // Insert into Supabase
    const { error } = await supabase.from('todos').insert({
      id: newTodo.id,
      text: newTodo.text,
      completed: newTodo.completed,
      type,
    });

    if (error) {
      console.error('Error adding todo:', error);
      // Rollback on error
      setTodos((prev) => ({
        ...prev,
        [type]: prev[type].filter((t) => t.id !== newTodo.id),
      }));
    }
  };

  const toggleTodo = async (type: QuadrantType, id: string) => {
    // Find the current todo
    const currentTodo = todos[type].find((t) => t.id === id);
    if (!currentTodo) return;

    const newCompleted = !currentTodo.completed;

    // Optimistic update
    setTodos((prev) => ({
      ...prev,
      [type]: prev[type].map((t) =>
        t.id === id ? { ...t, completed: newCompleted } : t
      ),
    }));

    // Update in Supabase
    const { error } = await supabase
      .from('todos')
      .update({ completed: newCompleted })
      .eq('id', id);

    if (error) {
      console.error('Error toggling todo:', error);
      // Rollback on error
      setTodos((prev) => ({
        ...prev,
        [type]: prev[type].map((t) =>
          t.id === id ? { ...t, completed: !newCompleted } : t
        ),
      }));
    }
  };

  const deleteTodo = async (type: QuadrantType, id: string) => {
    // Store the todo for potential rollback
    const deletedTodo = todos[type].find((t) => t.id === id);

    // Optimistic update
    setTodos((prev) => ({
      ...prev,
      [type]: prev[type].filter((t) => t.id !== id),
    }));

    // Delete from Supabase
    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
      // Rollback on error
      if (deletedTodo) {
        setTodos((prev) => ({
          ...prev,
          [type]: [...prev[type], deletedTodo],
        }));
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen bg-[#0a0a0a] text-white p-4 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      <header className="flex-none mb-4 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-black tracking-tighter mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          GOAL
        </h1>
        <DateTimeDisplay />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0 w-full max-w-7xl mx-auto">
        <Quadrant
          title="Daily"
          subtitle="Today's Focus"
          color="blue"
          todos={todos.daily}
          onAddTodo={(text) => addTodo('daily', text)}
          onToggleTodo={(id) => toggleTodo('daily', id)}
          onDeleteTodo={(id) => deleteTodo('daily', id)}
        />
        <Quadrant
          title="Weekly"
          subtitle="This Week"
          color="purple"
          todos={todos.weekly}
          onAddTodo={(text) => addTodo('weekly', text)}
          onToggleTodo={(id) => toggleTodo('weekly', id)}
          onDeleteTodo={(id) => deleteTodo('weekly', id)}
        />
        <Quadrant
          title="Monthly"
          subtitle="This Month"
          color="pink"
          todos={todos.monthly}
          onAddTodo={(text) => addTodo('monthly', text)}
          onToggleTodo={(id) => toggleTodo('monthly', id)}
          onDeleteTodo={(id) => deleteTodo('monthly', id)}
        />
        <Quadrant
          title="Yearly"
          subtitle="2025 Goals"
          color="orange"
          todos={todos.yearly}
          onAddTodo={(text) => addTodo('yearly', text)}
          onToggleTodo={(id) => toggleTodo('yearly', id)}
          onDeleteTodo={(id) => deleteTodo('yearly', id)}
        />
      </div>
    </main>
  );
}
