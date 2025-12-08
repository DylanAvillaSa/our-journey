// Convert YYYY-MM-DD → { dayName, dayNumber, monthName, year }
export function parseDate(dateStr) {
  if (!dateStr) return null;

  const date = new Date(dateStr);

  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return {
    dayName: dayNames[date.getDay()],
    dayNumber: date.getDate(),
    monthName: monthNames[date.getMonth()],
    year: date.getFullYear(),
  };
}

// Format jam "20:21" → "20.21"
export function formatTime(timeStr) {
  if (!timeStr) return "00.00";
  return timeStr.replace(":", ".");
}
