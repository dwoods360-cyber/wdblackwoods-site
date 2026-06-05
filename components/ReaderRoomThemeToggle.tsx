"use client"

export default function ReaderRoomThemeToggle() {
  function toggleTheme() {
    const next = document.documentElement.dataset.readerRoomTheme !== "dark"
    window.localStorage.setItem("reader-room-theme", next ? "dark" : "light")
    document.documentElement.dataset.readerRoomTheme = next ? "dark" : "light"
  }

  return (
    <button type="button" className="reader-room-theme-toggle" onClick={toggleTheme}>
      Toggle reading mode
    </button>
  )
}
