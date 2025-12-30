"use client";

import React from "react";
import DateTimeDisplay from "@/components/DateTimeDisplay";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
    isQuadrantExpanded: boolean;
}

export default function Header({ isQuadrantExpanded }: HeaderProps) {
    return (
        <header
            className={`flex-none mb-6 flex items-center justify-between w-full max-w-7xl mx-auto px-2 transition-all duration-300 ${isQuadrantExpanded ? "opacity-0 h-0 overflow-hidden mb-0" : "opacity-100"
                }`}
        >
            <div className="flex items-center gap-4">
                <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">
                    GOAL
                </h1>
            </div>

            <div className="flex items-center gap-6">
                <DateTimeDisplay />
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />
                <ThemeToggle />
            </div>
        </header>
    );
}
