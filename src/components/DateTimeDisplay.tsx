'use client';

import React, { useState, useEffect } from 'react';

export default function DateTimeDisplay() {
    const [date, setDate] = useState<Date | null>(null);

    useEffect(() => {
        setDate(new Date());
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!date) return <div className="h-8" />; // Prevent hydration mismatch

    const formatTime = (d: Date) => {
        return d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDate = (d: Date) => {
        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="text-center">
            <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {formatTime(date)}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-xs font-medium tracking-wide">
                {formatDate(date)}
            </div>
        </div>
    );
}
