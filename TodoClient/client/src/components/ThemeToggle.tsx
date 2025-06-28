import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-all duration-300 hover:bg-gray-200/50
                text-gray-700 hover:text-gray-900
                dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/50"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </button>
  );
}