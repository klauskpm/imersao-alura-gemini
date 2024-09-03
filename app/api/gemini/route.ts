import { NextRequest } from "next/server";
import { generateGeminiResponse } from "./generate";

export async function GET(request: NextRequest) {
    const text = request.nextUrl.searchParams.get('text');

    if (!text) {
        return new Response("You must provide a text query parameter", {
            status: 400
        });
    }

    const result = await generateGeminiResponse(text);

    return new Response(result);
}