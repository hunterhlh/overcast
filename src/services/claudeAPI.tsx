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
      messages: [
        {
          role: "user",
          content: `Here is the forecast:\n${forecastText}\n\nWrite one casual sentence, under 15 words, summarizing what's coming. No intro, just the sentence.`,
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
