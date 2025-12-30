import React from 'react';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <div className="flex items-center justify-between p-2 mb-2 bg-card-bg border border-card-border rounded-lg hover:bg-card-hover-bg transition-colors group">
            <div className="flex items-center gap-3 flex-1">
                <button
                    onClick={() => onToggle(todo.id)}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-400 dark:border-gray-500 hover:border-green-400'
                        }`}
                >
                    {todo.completed && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3.5 h-3.5 text-white"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    )}
                </button>
                <span
                    className={`text-sm font-medium transition-all ${todo.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-800 dark:text-gray-100'
                        }`}
                >
                    {todo.text}
                </span>
            </div>
            <button
                onClick={() => onDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all p-1"
                aria-label="Delete todo"
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
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
            </button>
        </div>
    );
}
