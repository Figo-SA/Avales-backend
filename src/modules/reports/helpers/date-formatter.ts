export const formatDate = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...options,
  };

  return dateObj.toLocaleDateString('es-ES', defaultOptions);
};

export const formatDateShort = (date: Date | string): string => {
  return formatDate(date, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateForFilename = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};
