import React, { useContext } from 'react'
import { ThemeContext } from '../store/ThemeContext'

const Toggle = () => {
  const { theme, setTheme } = useContext(ThemeContext)

  function isDark() {
    return theme === 'dark'
  }

  function toggleTheme(e) {
    setTheme(e.target.checked ? 'dark' : 'light')
  }

  return (
    <label>
      <input
        type="checkbox"
        checked={isDark()}
        onChange={(e) => toggleTheme(e)}
      />
      Dark Mode
    </label>
  )
}
export default Toggle
