export const removeHtmlTags = (text: string) => {
    if (!text) return "";

    return text
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&[^;]+;/g, "")
        .trim();
};


export const parseDDMMYYYY = (
  dateString: string,
) => {
  const [day, month, year] =
    dateString.split('/');

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  );
};