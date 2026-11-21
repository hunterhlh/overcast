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
