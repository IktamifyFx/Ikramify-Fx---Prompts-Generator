import OpenAI from "openai";

export default async function handler(req, res) {
  // Only allow POST request
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input, category } = req.body;

  // Check if data exists
  if (!input || !category) {
    return res.status(400).json({ error: "Missing input or category" });
  }

  try {
    // Create OpenAI instance (SAFE - backend only)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Generate 5 high-quality ${category} prompts about "${input}". Make them detailed and ready to use.`,
        },
      ],
    });

    // Send result back
    res.status(200).json({
      result: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
