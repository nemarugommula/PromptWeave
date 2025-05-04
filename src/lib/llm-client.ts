
import { getSetting } from './db';

const API_KEY_SETTING = 'openai-api-key';

interface LLMRequestOptions {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  [key: string]: any; // Allow additional options
}

interface LLMResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    index: number;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Make a request to the OpenAI API using the stored API key
 * Automatically handles authentication with the user's stored key
 */
export const callLLM = async (
  options: LLMRequestOptions,
  endpoint = 'https://api.openai.com/v1/chat/completions'
): Promise<LLMResponse> => {
  const apiKey = await getSetting(API_KEY_SETTING, true);
  
  if (!apiKey) {
    throw new Error('API key not found. Please add your OpenAI API key in the settings.');
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your API key and try again.');
      }
      const errorData = await response.json();
      throw new Error(`API Error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling LLM:', error);
    throw error;
  }
};

/**
 * Test if the API key is valid by making a minimal request
 */
export const testApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error testing API key:', error);
    return false;
  }
};

