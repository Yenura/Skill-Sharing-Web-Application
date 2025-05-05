import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface CommunitySettings {
  name: string;
  description: string;
  category: string;
  isPrivate: boolean;
  allowMemberPosts: boolean;
  requireApproval: boolean;
  maxMembers: number;
  rules: string[];
  moderators: number[];
  bannedUsers: number[];
  customFields: {
    name: string;
    type: 'text' | 'number' | 'boolean';
    required: boolean;
  }[];
}

export const CommunitySettings = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<CommunitySettings>({
    name: '',
    description: '',
    category: '',
    isPrivate: false,
    allowMemberPosts: true,
    requireApproval: false,
    maxMembers: 1000,
    rules: [],
    moderators: [],
    bannedUsers: [],
    customFields: [],
  });
  const [newRule, setNewRule] = useState('');
  const [newCustomField, setNewCustomField] = useState({
    name: '',
    type: 'text' as const,
    required: false,
  });

  useEffect(() => {
    fetchSettings();
  }, [id]);

  const fetchSettings = async () => {
    try {
      // TODO: Implement API call to fetch community settings
      // const response = await api.get(`/communities/${id}/settings`);
      // setSettings(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load community settings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      // TODO: Implement API call to save community settings
      // await api.put(`/communities/${id}/settings`, settings);

      toast({
        title: 'Success',
        description: 'Community settings saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save community settings.',
        variant: 'destructive',
      });
    }
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      setSettings((prev) => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()],
      }));
      setNewRule('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const handleAddCustomField = () => {
    if (newCustomField.name.trim()) {
      setSettings((prev) => ({
        ...prev,
        customFields: [...prev.customFields, { ...newCustomField }],
      }));
      setNewCustomField({
        name: '',
        type: 'text',
        required: false,
      });
    }
  };

  const handleRemoveCustomField = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Community Settings</h1>

      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Community Name
              </label>
              <Input
                type="text"
                value={settings.name}
                onChange={(e) =>
                  setSettings({ ...settings, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={settings.description}
                onChange={(e) =>
                  setSettings({ ...settings, description: e.target.value })
                }
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Input
                type="text"
                value={settings.category}
                onChange={(e) =>
                  setSettings({ ...settings, category: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Privacy & Permissions</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.isPrivate}
                onChange={(e) =>
                  setSettings({ ...settings, isPrivate: e.target.checked })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Private Community
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.allowMemberPosts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    allowMemberPosts: e.target.checked,
                  })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Allow Members to Create Posts
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.requireApproval}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    requireApproval: e.target.checked,
                  })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Require Approval for New Members
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Members
              </label>
              <Input
                type="number"
                value={settings.maxMembers}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxMembers: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Community Rules</h2>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Add a new rule"
              />
              <Button onClick={handleAddRule}>Add</Button>
            </div>
            <div className="space-y-2">
              {settings.rules.map((rule, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded"
                >
                  <span>{rule}</span>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveRule(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Custom Fields</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Input
                type="text"
                value={newCustomField.name}
                onChange={(e) =>
                  setNewCustomField({
                    ...newCustomField,
                    name: e.target.value,
                  })
                }
                placeholder="Field name"
              />
              <select
                value={newCustomField.type}
                onChange={(e) =>
                  setNewCustomField({
                    ...newCustomField,
                    type: e.target.value as 'text' | 'number' | 'boolean',
                  })
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newCustomField.required}
                  onChange={(e) =>
                    setNewCustomField({
                      ...newCustomField,
                      required: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Required
                </label>
              </div>
            </div>
            <Button onClick={handleAddCustomField}>Add Field</Button>
            <div className="space-y-2">
              {settings.customFields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded"
                >
                  <div>
                    <span className="font-medium">{field.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({field.type})
                      {field.required && ' • Required'}
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveCustomField(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}; 