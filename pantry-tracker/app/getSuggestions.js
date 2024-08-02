import OpenAI from 'openai'; // Adjust if needed
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
console.log("OpenAI API Key:", process.env.NEXT_PUBLIC_OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function getRecipeSuggestions(inventory) {
  try {
    const ingredients = inventory.map(item => item.name).join(", ");
    const response = await openai.Completions.create({
      prompt: `Suggest a recipe with these ingredients: ${ingredients}`,
      max_tokens: 150,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error fetching recipe suggestions:", error);
    return "Error fetching recipe suggestions.";
  }
}