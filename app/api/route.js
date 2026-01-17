import OpenAI from "openai";

export async function POST(req) {
  try {
    const body = await req.json();

    const { quoteForm, quotes, selectedQuoteId } = body;

    if (!quoteForm || !quotes?.length || !selectedQuoteId) {
      return Response.json(
        { ok: false, error: "Missing required data" },
        { status: 400 }
      );
    }

    const selected = quotes.find((q) => q.quoteId === selectedQuoteId);

    if (!selected) {
      return Response.json(
        { ok: false, error: "Selected quote not found" },
        { status: 404 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
You are an insurance assistant.
Your job is to explain why a car insurance plan is good or bad.

User car details:
- Vehicle Value (IDV): ${quoteForm.vehicleValue}
- Car Age: ${quoteForm.carAge} years
- City Tier: ${quoteForm.cityTier}
- NCB Discount: ${quoteForm.ncbPercent}%

Selected plan:
${JSON.stringify(selected, null, 2)}

Other available plans:
${JSON.stringify(quotes, null, 2)}

Give answer in short Hinglish (simple).
Return in this format:

1) Best for (who should buy)
2) Why recommended (3 bullet points)
3) Watchouts (2 bullet points)
4) Add-on suggestion (1-2 bullet points)
5) Final verdict (1 line)
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    return Response.json({
      ok: true,
      answer: completion.choices?.[0]?.message?.content || "No response",
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
