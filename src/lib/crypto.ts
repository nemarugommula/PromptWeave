
/**
 * Utilities for secure encryption and decryption of sensitive data
 * using the Web Crypto API
 */

// In-memory storage for the encryption key (never persisted)
let encryptionKey: CryptoKey | null = null;

/**
 * Generate a random encryption key for AES-GCM
 */
export const generateEncryptionKey = async (): Promise<CryptoKey> => {
  if (encryptionKey) return encryptionKey;
  
  encryptionKey = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  
  return encryptionKey;
};

/**
 * Encrypt a string value using AES-GCM
 */
export const encrypt = async (value: string): Promise<string> => {
  const key = await generateEncryptionKey();
  const encodedValue = new TextEncoder().encode(value);
  
  // Generate a random initialization vector for AES-GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encodedValue
  );
  
  // Combine the IV and encrypted data for storage
  const combined = new Uint8Array(iv.length + new Uint8Array(encryptedData).length);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);
  
  // Convert to base64 for storage
  return btoa(String.fromCharCode(...combined));
};

/**
 * Decrypt an encrypted string value
 */
export const decrypt = async (encryptedValue: string): Promise<string> => {
  const key = await generateEncryptionKey();
  
  // Convert from base64
  const combined = new Uint8Array(
    atob(encryptedValue)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
  
  // Extract the IV and encrypted data
  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);
  
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encryptedData
  );
  
  return new TextDecoder().decode(decryptedData);
};

/**
 * Clear the in-memory encryption key
 */
export const clearEncryptionKey = () => {
  encryptionKey = null;
};

// Clear the key when the window/tab is closed
window.addEventListener("beforeunload", () => {
  clearEncryptionKey();
});

