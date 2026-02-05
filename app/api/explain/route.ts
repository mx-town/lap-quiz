import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

export async function POST(req: NextRequest) {
  try {
    const { questionId, questionText, userAnswer, correctAnswer } = await req.json()

    if (!questionText || !correctAnswer) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        explanation:
          "KI-Erklärungen sind noch nicht konfiguriert. Bitte ANTHROPIC_API_KEY in den Umgebungsvariablen setzen.",
      })
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: `Du bist ein erfahrener Mechatronik-Ausbilder in Österreich und bereitest Lehrlinge auf die LAP (Lehrabschlussprüfung) vor.

Erkläre, warum die gegebene Antwort falsch ist und warum die richtige Antwort korrekt ist.

Regeln:
- Verwende österreichische Normen (ÖVE/ÖNORM) wo relevant
- Nenne konkrete Zahlenwerte, Formeln und Grenzwerte
- Gib ein kurzes Praxisbeispiel
- Maximal 150 Wörter
- Fachlich präzise, aber verständlich für Lehrlinge
- Deutsch (österreichische Fachterminologie)`,
      messages: [
        {
          role: "user",
          content: `Frage: ${questionText}\n\nGegebene Antwort (FALSCH): ${userAnswer}\n\nRichtige Antwort: ${correctAnswer}\n\nErkläre kurz und praxisnah, warum die gegebene Antwort falsch ist und die richtige Antwort stimmt.`,
        },
      ],
    })

    const explanation =
      message.content[0].type === "text" ? message.content[0].text : "Keine Erklärung verfügbar."

    return NextResponse.json({ explanation })
  } catch (error) {
    console.error("AI explanation error:", error)
    return NextResponse.json(
      { error: "Fehler bei der KI-Erklärung" },
      { status: 500 }
    )
  }
}
