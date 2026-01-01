'use client';

import React, { useState, useEffect } from 'react';
import Quadrant from '@/components/Quadrant';
import Header from '@/components/Header';
import { createClient } from '@/utils/supabase/client';

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
  const [error, setError] = useState<string | null>(null);
  const [quadrantSettings, setQuadrantSettings] = useState<Record<string, string>>({});
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fetch todos from Supabase on mount
  useEffect(() => {
    const fetchTodos = async (user: any) => {
      if (!user) return;
      const { data: todosData, error: todosError } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data: settingsData, error: settingsError } = await supabase
        .from('quadrant_details')
        .select('*')
        .eq('user_id', user.id);

      if (todosError) {
        console.error('Error fetching todos:', todosError);
        setError('Failed to load todos. Check your connection.');
        setIsLoaded(true);
        return;
      }

      if (settingsError && settingsError.code !== '42P01') {
        // Ignore 42P01 (undefined_table) if user hasn't created table yet, but log others
        console.error('Error fetching settings:', settingsError);
      }

      if (settingsData) {
        const settings: Record<string, string> = {};
        settingsData.forEach((item: { type: string; subtitle: string }) => {
          settings[item.type] = item.subtitle;
        });
        setQuadrantSettings(settings);
      }

      if (todosData) {
        const grouped: TodoState = {
          daily: [],
          weekly: [],
          monthly: [],
          yearly: [],
        };

        todosData.forEach((todo: DbTodo) => {
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

    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await fetchTodos(user);
      } else {
        setIsLoaded(true);
      }
    };

    setup();
  }, []);

  const addTodo = async (type: QuadrantType, text: string) => {
    setError(null);
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
    const { error: insertError } = await supabase.from('todos').insert({
      id: newTodo.id,
      text: newTodo.text,
      completed: newTodo.completed,
      type,
      user_id: user?.id,
    });

    if (insertError) {
      console.error('Error adding todo:', insertError);
      setError('Failed to save todo.');
      // Rollback on error
      setTodos((prev) => ({
        ...prev,
        [type]: prev[type].filter((t) => t.id !== newTodo.id),
      }));
    }
  };

  const toggleTodo = async (type: QuadrantType, id: string) => {
    setError(null);
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
    const { error: updateError } = await supabase
      .from('todos')
      .update({ completed: newCompleted })
      .eq('id', id);

    if (updateError) {
      console.error('Error toggling todo:', updateError);
      setError('Failed to update todo.');
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
    setError(null);
    // Store the todo for potential rollback
    const deletedTodo = todos[type].find((t) => t.id === id);

    // Optimistic update
    setTodos((prev) => ({
      ...prev,
      [type]: prev[type].filter((t) => t.id !== id),
    }));

    // Delete from Supabase
    const { error: deleteError } = await supabase.from('todos').delete().eq('id', id);

    if (deleteError) {
      console.error('Error deleting todo:', deleteError);
      setError('Failed to delete todo.');
      // Rollback on error
      if (deletedTodo) {
        setTodos((prev) => ({
          ...prev,
          [type]: [...prev[type], deletedTodo],
        }));
      }
    }
  };
  const updateTodo = async (type: QuadrantType, id: string, newText: string) => {
    setError(null);
    // Find the current todo
    const currentTodo = todos[type].find((t) => t.id === id);
    if (!currentTodo) return;

    // Optimistic update
    setTodos((prev) => ({
      ...prev,
      [type]: prev[type].map((t) =>
        t.id === id ? { ...t, text: newText } : t
      ),
    }));

    // Update in Supabase
    const { error: updateError } = await supabase
      .from('todos')
      .update({ text: newText })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating todo:', updateError);
      setError('Failed to update todo text.');
      // Rollback on error
      setTodos((prev) => ({
        ...prev,
        [type]: prev[type].map((t) =>
          t.id === id ? { ...t, text: currentTodo.text } : t
        ),
      }));
    }
  };

  const updateSubtitle = async (type: QuadrantType, newSubtitle: string) => {
    // Optimistic update
    setQuadrantSettings(prev => ({
      ...prev,
      [type]: newSubtitle
    }));

    const { error } = await supabase
      .from('quadrant_details')
      .upsert({ type, subtitle: newSubtitle, user_id: user?.id })
      .select();

    if (error) {
      console.error('Error updating subtitle:', error);
      setError('Failed to save subtitle.');
      // Revert would require keeping previous state, simple error alert for now
    }
  };

  const [expandedQuadrant, setExpandedQuadrant] = useState<QuadrantType | null>(null);

  // ... (existing useEffect and handlers)

  // Calculate dynamic subtitles
  const now = new Date();

  // Daily: "Tuesday 30"
  const dailySubtitle = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' });

  // Weekly: "w52" (ISO week number calculation)
  const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
  };
  const weeklySubtitle = `w${getWeekNumber(now)}`;

  // Monthly: "December"
  const monthlySubtitle = now.toLocaleDateString('en-US', { month: 'long' });

  // Yearly: "2025"
  const yearlySubtitle = now.getFullYear().toString();

  const quadrants: { id: QuadrantType; title: string; subtitle: string; color: string }[] = [
    { id: 'daily', title: 'Daily', subtitle: dailySubtitle, color: 'blue' },
    { id: 'weekly', title: 'Weekly', subtitle: weeklySubtitle, color: 'purple' },
    { id: 'monthly', title: 'Monthly', subtitle: monthlySubtitle, color: 'pink' },
    { id: 'yearly', title: 'Yearly', subtitle: yearlySubtitle, color: 'orange' },
  ];

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen bg-background text-foreground p-4 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col relative">
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur text-sm font-medium animate-in fade-in slide-in-from-top-4">
          {error}
        </div>
      )}

      <Header isQuadrantExpanded={!!expandedQuadrant} />

      <div
        onClick={() => setExpandedQuadrant(null)}
        className={`grid gap-4 flex-1 min-h-0 w-full max-w-7xl mx-auto transition-all duration-300 ${expandedQuadrant ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {quadrants.map((q) => {
          if (expandedQuadrant && expandedQuadrant !== q.id) return null;

          return (
            <Quadrant
              key={q.id}
              title={q.title}
              subtitle={quadrantSettings[q.id] || q.subtitle}
              color={q.color}
              todos={todos[q.id]}
              onAddTodo={(text) => addTodo(q.id, text)}
              onToggleTodo={(id) => toggleTodo(q.id, id)}
              onDeleteTodo={(id) => deleteTodo(q.id, id)}
              onUpdateTodo={(id, newText) => updateTodo(q.id, id, newText)}
              isExpanded={expandedQuadrant === q.id}
              onExpandToggle={() => setExpandedQuadrant(expandedQuadrant === q.id ? null : q.id)}
              onSubtitleChange={(newSubtitle) => updateSubtitle(q.id, newSubtitle)}
            />
          );
        })}
      </div>
    </main>
  );
}
