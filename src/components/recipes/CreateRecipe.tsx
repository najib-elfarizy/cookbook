import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { AuthModal } from "@/components/auth/AuthModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentUser } from "@/lib/auth";
import { createRecipe } from "@/lib/api";

const CreateRecipe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category_id: "",
    prep_time: "",
    cook_time: "",
    servings: "",
    difficulty: "",
    instructions: [{ number: 1, instruction: "", tip: "" }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be signed in to create a recipe",
          variant: "destructive",
        });
        return;
      }

      const recipe = await createRecipe({
        ...formData,
        user_id: user.id,
        prep_time: parseInt(formData.prep_time),
        cook_time: parseInt(formData.cook_time),
        servings: parseInt(formData.servings),
      });

      toast({
        title: "Success!",
        description: "Your recipe has been created.",
      });

      navigate(`/recipe/${recipe.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        {
          number: prev.instructions.length + 1,
          instruction: "",
          tip: "",
        },
      ],
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Card>
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Create New Recipe</h1>
              <p className="text-muted-foreground mb-6">
                Please sign in to create a recipe
              </p>
              <AuthModal />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Recipe</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Recipe Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      image_url: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category_id: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Italian</SelectItem>
                      <SelectItem value="2">Japanese</SelectItem>
                      <SelectItem value="3">Mexican</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, difficulty: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prep_time">Prep Time (mins)</Label>
                  <Input
                    id="prep_time"
                    type="number"
                    min="0"
                    value={formData.prep_time}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        prep_time: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cook_time">Cook Time (mins)</Label>
                  <Input
                    id="cook_time"
                    type="number"
                    min="0"
                    value={formData.cook_time}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cook_time: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    value={formData.servings}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        servings: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Instructions</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addInstruction}
                  >
                    Add Step
                  </Button>
                </div>

                {formData.instructions.map((step, index) => (
                  <div key={step.number} className="space-y-2">
                    <Label>Step {step.number}</Label>
                    <Textarea
                      value={step.instruction}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          instructions: prev.instructions.map((s) =>
                            s.number === step.number
                              ? { ...s, instruction: e.target.value }
                              : s,
                          ),
                        }))
                      }
                      placeholder={`Describe step ${step.number}`}
                      required
                    />
                    <Input
                      value={step.tip}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          instructions: prev.instructions.map((s) =>
                            s.number === step.number
                              ? { ...s, tip: e.target.value }
                              : s,
                          ),
                        }))
                      }
                      placeholder="Optional tip for this step"
                    />
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Recipe..." : "Create Recipe"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRecipe;
