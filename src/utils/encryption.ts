const ENCRYPTION_KEY = 'media-agent-key';

export const encrypt = (text: string): string => {
  try {
    return btoa(text);
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

export const decrypt = (encryptedText: string): string => {
  try {
    return atob(encryptedText);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};