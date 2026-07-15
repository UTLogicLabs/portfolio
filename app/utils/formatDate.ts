const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function parseDateOnly(dateString: string): Date | null {
  const year = Number(dateString.slice(0, 4));
  const month = Number(dateString.slice(5, 7));
  const day = Number(dateString.slice(8, 10));
  const date = new Date(year, month - 1, day);

  const isValid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  return isValid ? date : null;
}

export function formatDate(dateString: string): string {
  const date = (DATE_ONLY.test(dateString) && parseDateOnly(dateString)) || new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
