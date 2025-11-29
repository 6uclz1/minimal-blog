import { html } from "hono/html";

export const Header = () => (
    <header class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <nav class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a
                href="./"
                class="text-xl font-bold text-gray-900 hover:text-primary-600 tracking-tight flex items-center gap-2"
            >
                Blog
            </a>
        </nav>
    </header>
);
