const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let ai = null;
if (process.env.GEMINI_API_KEY) {
    try {
        ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
    } catch (e) {
        console.log("Gemini API key setup notice:", e.message);
    }
}

// Educational response fallback generator
function generateEducationalFallback(question) {
    const q = question.toLowerCase();
    
    if (q.includes("recursion")) {
        return `### 🪆 Understanding Recursion Step-by-Step\n\nRecursion is a programming technique where a function calls itself to solve a smaller version of the same problem.\n\n**Key Components:**\n1. **Base Case:** The condition that stops recursion.\n2. **Recursive Step:** The function calling itself with modified inputs.\n\n\`\`\`python\ndef factorial(n):\n    if n <= 1: return 1  # Base Case\n    return n * factorial(n - 1)  # Recursive Step\n\nprint(factorial(5))  # Output: 120\n\`\`\`\n\n**📌 Key Takeaway:** Always ensure a base case exists!`;
    }

    if (q.includes("bayes")) {
        return `### 📊 Bayes' Theorem Simplified\n\nBayes' Theorem calculates conditional probability—the likelihood of an event occurring based on prior knowledge of conditions.\n\n$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$\n\n**Real-World Example:** Spam email filters calculating the likelihood an email is spam given suspicious keywords.\n\n**📌 Key Takeaway:** Bayes' theorem helps update probabilities as new evidence comes in.`;
    }

    if (q.includes("newton") || q.includes("f=ma") || q.includes("force")) {
        return `### ⚡ Newton's Second Law of Motion\n\nNewton's 2nd Law states that the acceleration ($a$) of an object is directly proportional to net force ($F$) and inversely proportional to mass ($m$).\n\n$$\\vec{F} = m \\cdot \\vec{a}$$\n\n- **Force ($F$):** Measured in Newtons ($N$).\n- **Mass ($m$):** Measured in kilograms ($kg$).\n- **Acceleration ($a$):** Measured in $m/s^2$.\n\n**📌 Key Takeaway:** Heavier objects require more force to achieve the same acceleration.`;
    }

    const cleanTopic = question.charAt(0).toUpperCase() + question.slice(1);
    return `### 💡 EduGuide Academic Explanation: ${cleanTopic}\n\nGreat learning question! Here is your step-by-step academic explanation:\n\n1. **Core Concept:** Understanding this topic starts by defining the fundamental terms and variables.\n2. **Logical Steps:** Break down complex equations or ideas into sequential steps.\n3. **Practical Application:** Test your understanding with practice questions or concise revision notes.\n\n*(To connect live Gemini API responses, set GEMINI_API_KEY in your .env file)*`;
}

app.post("/api/ask", async (req, res) => {
    try {
        const question = req.body.question;

        if (!question) {
            return res.status(400).json({
                error: "Question is required"
            });
        }

        if (ai && process.env.GEMINI_API_KEY) {
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `You are EduGuide-AI, an educational AI tutor. Answer the student's question clearly, step-by-step, with simple language and examples: ${question}`
                });

                if (response && response.text) {
                    return res.json({ answer: response.text });
                }
            } catch (geminiError) {
                console.error("Gemini API call failed, using educational fallback engine:", geminiError.message);
            }
        }

        // Return fallback structured response if Gemini API key is missing or errored
        const fallbackAnswer = generateEducationalFallback(question);
        res.json({
            answer: fallbackAnswer
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.json({
            answer: generateEducationalFallback(req.body.question || "Learning Question")
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`EduGuide-AI server running on http://localhost:${PORT}`);
});