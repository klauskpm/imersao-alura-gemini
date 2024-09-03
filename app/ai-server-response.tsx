import { generateGeminiResponse } from "./api/gemini/generate";

export default async function AiClientResponse({ text }: { text?: string }) {
    let aiResult = '';
    if (text) {
        aiResult = await generateGeminiResponse(text);
    }
    
    return (
        aiResult && (
            <>
                <p>Response from AI: (Server)</p>
                <pre>{aiResult}</pre>
            </>
        )
    );
}
    