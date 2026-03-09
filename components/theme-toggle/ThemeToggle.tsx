"use client";
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return ( 
    <div>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('system')}>System</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
   );
}

export default ThemeToggle;