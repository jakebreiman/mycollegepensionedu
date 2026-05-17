import { NextRequest, NextResponse } from "next/server";

const BOOKING_API_URL = (process.env.BOOKING_API_URL ?? "").trim();
const BOOKING_API_KEY = (process.env.BOOKING_API_KEY ?? "").trim();

/** Convert "2:00 PM" → { hours: 14, minutes: 0 } */
function parseTime(t: string): { hours: number; minutes: number } {
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) throw new Error(`Bad time: ${t}`);
  let h = parseInt(m[1]);
  const min = parseInt(m[2]);
  if (m[3].toUpperCase() === "PM" && h !== 12) h += 12;
  if (m[3].toUpperCase() === "AM" && h === 12) h = 0;
  return { hours: h, minutes: min };
}

/** Get UTC offset string (e.g. "-04:00") for a date in a timezone */
function tzOffset(dateStr: string, tz: string): string {
  const d = new Date(`${dateStr}T12:00:00Z`);
  const utc = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }));
  const local = new Date(d.toLocaleString("en-US", { timeZone: tz }));
  const diff = (local.getTime() - utc.getTime()) / 60000;
  const sign = diff >= 0 ? "+" : "-";
  const abs = Math.abs(diff);
  return `${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

export async function POST(request: NextRequest) {
  if (!BOOKING_API_URL || !BOOKING_API_KEY) {
    console.error("BOOKING_API_URL or BOOKING_API_KEY not configured");
    return NextResponse.json(
      { success: false, error: "Booking service not configured" },
      { status: 500 }
    );
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  // Build ISO datetime from date + time + timezone
  const timezone = body.timezone || "America/New_York";
  let preferred_appointment: string;
  try {
    const { hours, minutes } = parseTime(body.meetingTime);
    const offset = tzOffset(body.meetingDate, timezone);
    preferred_appointment = `${body.meetingDate}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00${offset}`;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: `Invalid date/time: ${err}` },
      { status: 400 }
    );
  }

  const payload: Record<string, unknown> = {
    contact_name: body.fullName,
    email: body.workEmail,
    contact_number: body.mobileNumber,
    organization: body.agencyEmployer,
    preferred_appointment,
    timezone,
    product_type: "college",
    meeting_type: "Virtual",
    state: body.state,
    ...(body.captchaToken && { captcha_token: body.captchaToken }),
    // Forward UTM params
    ...(body.utm_source && { utm_source: body.utm_source }),
    ...(body.utm_medium && { utm_medium: body.utm_medium }),
    ...(body.utm_campaign && { utm_campaign: body.utm_campaign }),
    ...(body.utm_term && { utm_term: body.utm_term }),
    ...(body.utm_content && { utm_content: body.utm_content }),
  };

  try {
    const res = await fetch(BOOKING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": BOOKING_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Booking API call failed:", err);
    return NextResponse.json(
      { success: false, error: "Failed to reach booking service" },
      { status: 502 }
    );
  }
}
