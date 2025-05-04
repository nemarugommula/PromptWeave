import { useState, useEffect } from 'react';
import { EyeIcon, EyeOffIcon, KeyIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { encrypt } from '@/lib/crypto';
import { saveSetting, getSetting, deleteSetting } from '@/lib/db';
import { testApiKey } from '@/lib/llm-client';

const API_KEY_SETTING = 'openai-api-key';

export function ApiKeySettings() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const { toast } = useToast();

  // Check if we have a stored API key on component mount
  useEffect(() => {
    const checkForStoredKey = async () => {
      try {
        const storedKey = await getSetting(API_KEY_SETTING, true);
        setHasStoredKey(!!storedKey);
        if (storedKey) {
          setApiKey('•'.repeat(16)); // Show placeholder dots instead of actual key
        }
      } catch (error) {
        console.error('Error checking for stored API key:', error);
      }
    };

    checkForStoredKey();
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey || apiKey === '•'.repeat(16)) {
      toast({
        title: "Missing API Key",
        description: "Please enter your OpenAI API key",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Test the API key before saving
      const isValid = await testApiKey(apiKey);
      
      if (!isValid) {
        toast({
          title: "Invalid API Key",
          description: "The API key you entered appears to be invalid. Please check and try again.",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }
      
      // Save the API key directly without pre-encrypting it
      // Let the saveSetting function handle encryption with the shouldEncrypt flag set to true
      await saveSetting(API_KEY_SETTING, apiKey, true);
      
      setHasStoredKey(true);
      setApiKey('•'.repeat(16)); // Replace with dots after saving
      setShowApiKey(false);
      
      toast({
        title: "API Key Saved",
        description: "Your API key has been securely saved in your browser.",
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error Saving API Key",
        description: "There was a problem saving your API key.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearApiKey = async () => {
    try {
      await deleteSetting(API_KEY_SETTING);
      setApiKey('');
      setHasStoredKey(false);
      
      toast({
        title: "API Key Cleared",
        description: "Your API key has been removed.",
      });
    } catch (error) {
      console.error('Error clearing API key:', error);
      toast({
        title: "Error Clearing API Key",
        description: "There was a problem removing your API key.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <KeyIcon className="h-5 w-5" />
          <CardTitle>OpenAI API Key</CardTitle>
        </div>
        <CardDescription>
          Enter your OpenAI API key to use with PromptWeave. Your key is never sent to our servers and is stored encrypted in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => {
                    // If they're typing a new key, clear the dots
                    if (hasStoredKey && apiKey === '•'.repeat(16)) {
                      setApiKey(e.target.value);
                    } else {
                      setApiKey(e.target.value);
                    }
                  }}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleClearApiKey}
          disabled={!hasStoredKey || isSaving}
        >
          Clear Key
        </Button>
        <Button 
          onClick={handleSaveApiKey}
          disabled={!apiKey || isSaving}
        >
          {isSaving ? "Saving..." : "Save Key"}
        </Button>
      </CardFooter>
    </Card>
  );
}
