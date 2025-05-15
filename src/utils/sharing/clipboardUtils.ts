
// Function to copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    // Don't show any toast notification for clipboard success
    return true;
  } catch (error) {
    console.error('Failed to copy text: ', error);
    // Don't show error toast for clipboard failure
    return false;
  }
};
