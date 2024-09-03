'use client';

import { useEffect, useState } from "react";

export default function AiResponse({ text }: { text?: string }) {
    const [aiResult, setAiResult] = useState<string>('');

    useEffect(() => {
        if (!text) return;
        fetch(`/api/gemini?text=${text}`)
        .then(response => response.text())
        .then(setAiResult);
    }, [text]);
    
    return (
        aiResult && (
            <>
            <p>Response from AI:</p>
            <pre>{aiResult}</pre>
            </>
        )
    );
}
    