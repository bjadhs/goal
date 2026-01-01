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
    onUpdateTodo?: (id: string, newText: string) => void;
    isExpanded?: boolean;
    onExpandToggle?: () => void;
    onSubtitleChange?: (newSubtitle: string) => void;
}

export default function Quadrant({
    title,
    subtitle,
    color,
    todos,
    onAddTodo,
    onToggleTodo,
    onDeleteTodo,
    onUpdateTodo,
    isExpanded = false,
    onExpandToggle,
    onSubtitleChange,
}: QuadrantProps) {
    const [inputValue, setInputValue] = useState('');
    const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
    const [subtitleValue, setSubtitleValue] = useState(subtitle);

    const activeTodos = todos.filter(t => !t.completed);
    const completedTodos = todos.filter(t => t.completed);

    // Sync local subtitle state when prop changes (e.g. from DB load)
    React.useEffect(() => {
        setSubtitleValue(subtitle);
    }, [subtitle]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAddTodo(inputValue.trim());
            setInputValue('');
        }
    };

    const handleSubtitleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditingSubtitle(false);
        if (onSubtitleChange && subtitleValue.trim() !== subtitle) {
            onSubtitleChange(subtitleValue);
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
            onDoubleClick={onExpandToggle}
            onClick={(e) => e.stopPropagation()}
            className={`flex flex-col h-full bg-gradient-to-br ${gradientClass} border rounded-2xl p-4 backdrop-blur-sm transition-all duration-300 shadow-lg min-h-0 relative group`}
        >
            <div className="flex items-center justify-between mb-3 flex-none">
                <div className="flex items-baseline gap-3">
                    <h2 className={`text-xl font-bold ${titleColorClass}`}>{title}</h2>

                    {isEditingSubtitle ? (
                        <form onSubmit={handleSubtitleSubmit} className="inline-block">
                            <input
                                autoFocus
                                type="text"
                                value={subtitleValue}
                                onChange={(e) => setSubtitleValue(e.target.value)}
                                onBlur={handleSubtitleSubmit}
                                className="bg-input-bg border border-card-border rounded px-2 py-0.5 text-xs text-foreground focus:outline-none focus:border-blue-500"
                            />
                        </form>
                    ) : (
                        <div
                            className="group/subtitle flex items-center gap-2 cursor-pointer"
                            onClick={() => onSubtitleChange && setIsEditingSubtitle(true)}
                        >
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                                {subtitle}
                            </p>
                            {onSubtitleChange && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-gray-400 dark:text-gray-600 opacity-0 group-hover/subtitle:opacity-100 transition-opacity">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                </svg>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className={`flex-1 overflow-hidden flex flex-col min-h-0 ${isExpanded ? 'md:flex-row gap-6' : ''}`}>
                <div className={`flex-1 flex flex-col min-h-0 ${isExpanded ? 'md:w-1/2' : ''}`}>
                    <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-1 custom-scrollbar">
                        {activeTodos.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500/50 text-sm italic">
                                {completedTodos.length > 0 ? "All tasks done! 🏆" : "No tasks yet"}
                            </div>
                        ) : (
                            activeTodos.map((todo) => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onToggle={onToggleTodo}
                                    onDelete={onDeleteTodo}
                                    onUpdate={onUpdateTodo}
                                />
                            ))
                        )}
                    </div>

                    {!isExpanded && completedTodos.length > 0 && (
                        <div className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400/60 dark:text-gray-500/40 text-center">
                            {completedTodos.length} {completedTodos.length === 1 ? 'task' : 'tasks'} done
                        </div>
                    )}
                </div>

                {isExpanded && (
                    <div className="flex-1 flex flex-col min-h-0 md:w-1/2 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 opacity-40 hover:opacity-100 transition-opacity duration-500">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4 flex items-center gap-2">
                            <span>Completed</span>
                            <span className="h-px flex-1 bg-white/5"></span>
                        </h3>
                        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-1 custom-scrollbar">
                            {completedTodos.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-gray-400/50 text-xs italic">
                                    No completed tasks
                                </div>
                            ) : (
                                completedTodos.map((todo) => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        onToggle={onToggleTodo}
                                        onDelete={onDeleteTodo}
                                        onUpdate={onUpdateTodo}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full bg-input-bg border border-card-border rounded-xl py-3 pl-4 pr-12 text-sm text-foreground placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-white/10 focus:border-blue-500/30 dark:focus:border-white/20 transition-all"
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg text-gray-400 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
