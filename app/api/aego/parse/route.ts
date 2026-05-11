import { NextRequest, NextResponse } from "next/server";
import { parseAegoCommand } from "../../../../lib/aego/parser";
import { createServerSupabaseClient } from "../../../../lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Sign in before asking Aego to parse private updates."
        },
        { status: 401 }
      );
    }

    const body = (await request.json()) as { message?: unknown };
    const message = typeof body.message === "string" ? body.message : "";

    const result = parseAegoCommand(message);
    const messageStatus = result.requiresClarification ? "clarification_required" : "processed";
    const { data: savedMessage, error: saveError } = await supabase
      .from("ai_messages")
      .insert({
        user_id: user.id,
        user_message: result.rawText,
        ai_response: result,
        classification: result.classification,
        status: messageStatus
      })
      .select("id")
      .single();

    if (saveError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Aego parsed the update, but could not save the private parser log. Please try again."
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, result, messageId: savedMessage?.id ?? null });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to parse message."
      },
      { status: 400 }
    );
  }
}
