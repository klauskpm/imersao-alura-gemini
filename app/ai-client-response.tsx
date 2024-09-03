'use client';

import { useEffect, useState } from "react";

export default function AiClientResponse({ text }: { text?: string }) {
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
                <p>Response from AI: (Client)</p>
                <pre>{aiResult}</pre>
            </>
        )
    );
}
    