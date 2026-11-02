export function getDateInTimezone(timezone: string, date: Date = new Date()): string {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const v = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    return `${v.year}-${v.month}-${v.day}`;
  }
  
  export function dateStringToUtc(date: string): Date {
    return new Date(`${date}T00:00:00.000Z`);
  }
  
  export function getPreviousDate(date: string): string {
    const d = dateStringToUtc(date);
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  }
  
  export function getDayOfYear(date: string): number {
    const year = Number(date.slice(0, 4));
    const diff = dateStringToUtc(date).getTime() - Date.UTC(year, 0, 1);
    return Math.floor(diff / 86_400_000) + 1;
  }
  
  export function formatLongDate(date: string): string {
    return dateStringToUtc(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  }