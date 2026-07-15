const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function formatDate(dateString: string): string {
  const date = DATE_ONLY.test(dateString)
    ? new Date(
        Number(dateString.slice(0, 4)),
        Number(dateString.slice(5, 7)) - 1,
        Number(dateString.slice(8, 10)),
      )
    : new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
