export async function getSummary(forecastText: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.EXPO_PUBLIC_CLAUDE_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-5-5",
      max_tokens: 200,
      output_config: { effort: "low" },
      thinking: { type: "disabled" },
      system:
        "You write one-line weather summaries for a weather app. Reply with exactly one casual sentence under 20 words summarizing the 7 day forcast. Use day names like Monday or Tuesday, never dates. No reasoning, no intro, no quotes. Just the sentence.",
      messages: [
        {
          role: "user",
          content: `Here is the forecast:\n${forecastText}\n\n`,
        },
      ],
    }),
  });

  if (!res.ok) {
    console.log("Claude error:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  const textBlock = data.content.find((block: any) => block.type === "text");
  return textBlock?.text ?? null;
}

export async function getChatReply(messages: any[], weather: any) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.EXPO_PUBLIC_CLAUDE_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-5-5",
      max_tokens: 300,
      output_config: { effort: "low" },
      thinking: { type: "disabled" },
      system: `You are the weather assistant inside a weather app.

      Rules:
        - Only answer questions about the weather, using the forecast data below.
        - If the question isn't about the weather (math, homework, coding, general chat, etc.), don't answer it. Reply with: "I can only help with weather questions. Try asking about today's forecast!"
        - Only use the data provided. If the answer isn't in the data, say you don't have that information. Don't guess or make up numbers.
        - Keep answers short and casual, 1 to 3 sentences.

Weather data:
${JSON.stringify(weather)}`,
      messages: messages,
    }),
  });

  if (!res.ok) {
    console.log("Claude error:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  const textBlock = data.content.find((block: any) => block.type === "text");
  return textBlock?.text ?? null;
}
