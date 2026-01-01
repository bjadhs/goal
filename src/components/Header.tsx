"use client";

import React from "react";
import DateTimeDisplay from "@/components/DateTimeDisplay";
import { ThemeToggle } from "@/components/ThemeToggle";
import { logout } from "@/app/login/actions";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";

interface HeaderProps {
    isQuadrantExpanded: boolean;
}

export default function Header({ isQuadrantExpanded }: HeaderProps) {
    const [user, setUser] = React.useState<User | null>(null);
    const supabase = createClient();

    React.useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, [supabase.auth]);

    return (
        <header
            className="flex-none mb-6 flex items-center justify-between w-full max-w-7xl mx-auto px-2 transition-all duration-300"
        >
            <div className="flex items-center gap-4">
                <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">
                    GOAL
                </h1>
                {user && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {user.email}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-6">
                <DateTimeDisplay />
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />
                <ThemeToggle />
                {user && (
                    <>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />
                        <form action={logout}>
                            <button
                                type="submit"
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                                title="Sign out"
                            >
                                <LogOut size={18} />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </header>
    );
}
