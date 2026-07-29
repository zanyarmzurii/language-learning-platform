import OpenAI from "openai";

// For free tier, use OpenRouter or local AI
// But we'll set up for OpenAI when you get budget
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-demo-key",
});

export async function generateQuiz(
  language: string,
  level: string,
  topic: string,
  count: number = 5
): Promise<any> {
  try {
    const prompt = `
      Generate a ${level} level quiz for learning ${language}.
      Topic: ${topic}
      Number of questions: ${count}
      
      Format as JSON array:
      [
        {
          "question": "question text",
          "type": "multiple_choice" | "fill_blank" | "translation",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "correct option",
          "explanation": "explanation in Kurdish"
        }
      ]
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful language learning assistant. Always respond in JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content;
    return JSON.parse(content || "[]");
  } catch (error) {
    console.error("AI Quiz Generation Error:", error);
    // Return fallback quiz if AI fails
    return generateFallbackQuiz(language, level, topic, count);
  }
}

function generateFallbackQuiz(
  language: string,
  level: string,
  topic: string,
  count: number
): any[] {
  const quiz = [];
  for (let i = 0; i < count; i++) {
    quiz.push({
      question: `${language} - ${topic} - Question ${i + 1} (${level})`,
      type: "multiple_choice",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "This is a sample question. AI will generate real questions.",
    });
  }
  return quiz;
}

export async function checkGrammar(
  text: string,
  language: string
): Promise<any> {
  try {
    const prompt = `
      Check the grammar of this ${language} text and provide corrections:
      "${text}"
      
      Return JSON:
      {
        "hasErrors": boolean,
        "correctedText": "corrected version",
        "errors": [
          {
            "original": "error",
            "correction": "correct version",
            "explanation": "explanation in Kurdish"
          }
        ]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a grammar checker for language learning. Always respond in JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content;
    return JSON.parse(content || "{}");
  } catch (error) {
    console.error("Grammar Check Error:", error);
    return {
      hasErrors: false,
      correctedText: text,
      errors: [],
    };
  }
}

export async function generateVocabulary(
  language: string,
  category: string,
  count: number = 10
): Promise<any> {
  try {
    const prompt = `
      Generate ${count} vocabulary words for learning ${language} in category: ${category}.
      
      Return JSON array:
      [
        {
          "word": "word in target language",
          "translation": "translation in Kurdish",
          "pronunciation": "pronunciation guide",
          "partOfSpeech": "noun/verb/adjective/etc",
          "example": "example sentence in target language",
          "exampleTranslation": "example translation in Kurdish",
          "difficulty": "beginner/intermediate/advanced"
        }
      ]
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a vocabulary builder for language learning. Respond in JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    return JSON.parse(content || "[]");
  } catch (error) {
    console.error("Vocabulary Generation Error:", error);
    return [];
  }
}

export async function gradeSpeaking(
  expectedText: string,
  spokenText: string
): Promise<any> {
  try {
    const prompt = `
      Compare expected text: "${expectedText}"
      With spoken text: "${spokenText}"
      
      Return JSON:
      {
        "accuracy": percentage (0-100),
        "feedback": "feedback in Kurdish",
        "mispronounced": ["list of words"]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a speech evaluator. Respond in JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content;
    return JSON.parse(content || "{}");
  } catch (error) {
    console.error("Speech Grading Error:", error);
    return {
      accuracy: 0,
      feedback: "Unable to evaluate speech at this time.",
      mispronounced: [],
    };
  }
}
