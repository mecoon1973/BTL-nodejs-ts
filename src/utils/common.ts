export const generatePreview = function (content: string, maxLength: number) {
  const decodedText = content.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });

  const cleanText = decodedText.replace(/<.*?>/g, '');

  const trimmedText = cleanText.replace(/\s+/g, ' ');
  let previewText = trimmedText.substring(0, maxLength);
  if (trimmedText.length > maxLength) {
    previewText += '...';
  }

  return previewText;
};
