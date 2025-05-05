import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/components/ui/use-toast';

const recipeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficultyLevel: z.enum(['EASY', 'MEDIUM', 'HARD']),
  cookingTime: z.number().min(1, 'Cooking time is required'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  steps: z.array(z.string()).min(1, 'At least one step is required'),
  tags: z.array(z.string()),
  images: z.array(z.string()).max(3, 'Maximum 3 images allowed'),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

export const RecipeCreation = () => {
  const [step, setStep] = useState(1);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
  });

  const handleAddIngredient = () => {
    const input = document.getElementById('ingredient-input') as HTMLInputElement;
    if (input.value.trim()) {
      setIngredients([...ingredients, input.value.trim()]);
      input.value = '';
    }
  };

  const handleAddStep = () => {
    const input = document.getElementById('step-input') as HTMLInputElement;
    if (input.value.trim()) {
      setSteps([...steps, input.value.trim()]);
      input.value = '';
    }
  };

  const handleAddTag = () => {
    const input = document.getElementById('tag-input') as HTMLInputElement;
    if (input.value.trim()) {
      setTags([...tags, input.value.trim()]);
      input.value = '';
    }
  };

  const onSubmit = async (data: RecipeFormData) => {
    try {
      // TODO: Implement API call to create recipe
      toast({
        title: 'Success',
        description: 'Recipe created successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create recipe. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Recipe</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {step === 1 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Title</label>
                <Input
                  {...register('title')}
                  placeholder="Enter recipe title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-2">Description</label>
                <Textarea
                  {...register('description')}
                  placeholder="Enter recipe description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-2">Difficulty Level</label>
                <Select
                  {...register('difficultyLevel')}
                  options={[
                    { value: 'EASY', label: 'Easy' },
                    { value: 'MEDIUM', label: 'Medium' },
                    { value: 'HARD', label: 'Hard' },
                  ]}
                />
              </div>

              <div>
                <label className="block mb-2">Cooking Time (minutes)</label>
                <Input
                  type="number"
                  {...register('cookingTime', { valueAsNumber: true })}
                  placeholder="Enter cooking time"
                />
              </div>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  id="ingredient-input"
                  placeholder="Enter ingredient"
                />
                <Button type="button" onClick={handleAddIngredient}>
                  Add
                </Button>
              </div>
              <ul className="list-disc pl-5">
                {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Steps</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  id="step-input"
                  placeholder="Enter step"
                />
                <Button type="button" onClick={handleAddStep}>
                  Add
                </Button>
              </div>
              <ol className="list-decimal pl-5">
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </Card>
        )}

        {step === 4 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Media & Tags</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Images (max 3)</label>
                <ImageUpload
                  maxFiles={3}
                  onUpload={(urls) => setValue('images', urls)}
                />
              </div>

              <div>
                <label className="block mb-2">Tags</label>
                <div className="flex gap-2">
                  <Input
                    id="tag-input"
                    placeholder="Enter tag"
                  />
                  <Button type="button" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          {step < 4 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
            >
              Next
            </Button>
          ) : (
            <Button type="submit">
              Create Recipe
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}; 