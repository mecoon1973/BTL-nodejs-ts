function generatePreview(content, maxLength) {
  // Remove HTML tags
  var plainText = content.replace(/<[^>]+>/g, '');

  // Limit the length of the content
  if (plainText.length > maxLength) {
    plainText = plainText.substring(0, maxLength) + '...';
  }

  return plainText;
}