'use client';

import React, { useState } from 'react';
import TodoItem from './TodoItem';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

interface QuadrantProps {
    title: string;
    subtitle: string;
    color: string; // e.g., 'blue', 'purple', 'pink', 'orange'
    todos: Todo[];
    onAddTodo: (text: string) => void;
    onToggleTodo: (id: string) => void;
    onDeleteTodo: (id: string) => void;
}

export default function Quadrant({
    title,
    subtitle,
    color,
    todos,
    onAddTodo,
    onToggleTodo,
    onDeleteTodo,
}: QuadrantProps) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAddTodo(inputValue.trim());
            setInputValue('');
        }
    };

    // Map color names to Tailwind classes
    const colorClasses: Record<string, string> = {
        blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30 hover:border-blue-500/50',
        purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30 hover:border-purple-500/50',
        pink: 'from-pink-500/20 to-pink-600/5 border-pink-500/30 hover:border-pink-500/50',
        orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/30 hover:border-orange-500/50',
    };

    const titleColors: Record<string, string> = {
        blue: 'text-blue-400',
        purple: 'text-purple-400',
        pink: 'text-pink-400',
        orange: 'text-orange-400',
    };

    const gradientClass = colorClasses[color] || colorClasses.blue;
    const titleColorClass = titleColors[color] || titleColors.blue;

    return (
        <div
            className={`flex flex-col h-full bg-gradient-to-br ${gradientClass} border rounded-2xl p-4 backdrop-blur-sm transition-all duration-300 shadow-lg min-h-0`}
        >
            <div className="flex items-baseline justify-between mb-3 flex-none">
                <h2 className={`text-xl font-bold ${titleColorClass}`}>{title}</h2>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                    {subtitle}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 pr-2 -mr-2 space-y-1 custom-scrollbar">
                {todos.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500/50 text-sm italic">
                        No tasks yet
                    </div>
                ) : (
                    todos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={onToggleTodo}
                            onDelete={onDeleteTodo}
                        />
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all"
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
            </form>
        </div>
    );
}
