"use client";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const AIRLINES = ["IndiGo","Air India","Jet Airways","SpiceJet","Multiple carriers","GoAir","Vistara","Air Asia","Jet Airways Business","Vistara Premium economy"];
const SOURCES = ["Banglore","Chennai","Delhi","Kolkata","Mumbai"];
const DESTINATIONS = ["Banglore","Cochin","Delhi","Hyderabad","Kolkata","New Delhi"];
const STOPS = ["non-stop","1 stop","2 stops","3 stops"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function FlightPricePage() {
  const [form, setForm] = useState({
    airline: "IndiGo", source: "Delhi", destination: "Cochin",
    dep_hour: 9, dep_minute: 0, arr_hour: 12, arr_minute: 0,
    duration_mins: 180, stops: "non-stop",
    journey_day: 15, journey_month: 5, journey_weekday: 2,
    additional_info: "No info"
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const predict = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form })
      });
      if (!res.ok) throw new Error(await res.text());
      setResult(await res.json());
    } catch (e: any) {
      setError(e.message || "Failed to fetch");
    }
    setLoading(false);
  };

  const inputCls = "w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors";
  const labelCls = "block text-xs text-zinc-400 mb-1 uppercase tracking-wider";

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#fff" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1f1f1f", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>✈️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f97316" }}>FlightFare AI</h1>
            <p style={{ margin: 0, fontSize: 12, color: "#71717a" }}>Indian domestic flight price prediction</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["R²", "0.9405"], ["MAE", "₹554"], ["Model", "XGB+LGB"]].map(([k, v]) => (
            <div key={k} style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f97316" }}>{v}</div>
              <div style={{ fontSize: 10, color: "#71717a" }}>{k}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* LEFT — Form */}
        <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 16, padding: 28 }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 600, color: "#e4e4e7" }}>Flight Details</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Airline */}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ display: "block", fontSize: 11, color: "#71717a", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Airline</label>
              <select value={form.airline} onChange={e => set("airline", e.target.value)}
                style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13 }}>
                {AIRLINES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>

            {/* Source */}
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#71717a", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>From</label>
              <select value={form.source} onChange={e => set("source", e.target.value)}
                style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13 }}>
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Destination */}
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#71717a", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>To</label>
              <select value={form.destination} onChange={e => set("destination", e.target.value)}
                style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13 }}>
                {DESTINATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            {/* Departure hour */}
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#71717a", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Departure Hour (0-23)</label>
              <input type="number" min={0} max={23} value={form.dep_hour} onChange={e => set("dep_hour", +e.target.value)}
                style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13 }} />
            </div>

            {/* Duration */}
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#71717a", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Duration (minutes)</label>
              <input type="number" min={30} max={1440} value={form.duration_mins} onChange={e => set("duration_mins", +e.target.value)}
                style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13 }} />
            </div>

            {/* Stops */}
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#71717a", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Stops</label>
              <select value={form.stops} onChange={e => set("stops", e.target.value)}
                style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13 }}>
                {STOPS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Month */}
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#71717a", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Month</label>
              <select value={form.journey_month} onChange={e => set("journey_month", +e.target.value)}
                style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13 }}>
                {MONTHS.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
              </select>
            </div>

            {/* Day */}
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#71717a", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Day of Month</label>
              <input type="number" min={1} max={31} value={form.journey_day} onChange={e => set("journey_day", +e.target.value)}
                style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 13 }} />
            </div>
          </div>

          <button onClick={predict} disabled={loading}
            style={{ marginTop: 24, width: "100%", background: loading ? "#7c3a1a" : "#f97316", border: "none", borderRadius: 10, padding: "14px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
            {loading ? "⏳ Predicting..." : "🔮 Predict Price"}
          </button>

          {error && (
            <div style={{ marginTop: 12, background: "#2a0f0f", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 14px", color: "#fca5a5", fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* RIGHT — Result */}
        <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", justifyContent: result ? "flex-start" : "center", alignItems: result ? "stretch" : "center" }}>
          {!result ? (
            <div style={{ textAlign: "center", color: "#3f3f46" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>✈️</div>
              <p style={{ fontSize: 14 }}>Fill in flight details and click Predict</p>
            </div>
          ) : (
            <>
              <h2 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 600, color: "#e4e4e7" }}>Prediction Result</h2>

              {/* Main price */}
              <div style={{ background: "linear-gradient(135deg, #1a0f00, #2a1500)", border: "1px solid #f97316", borderRadius: 14, padding: 28, textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: "#71717a", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Predicted Price</div>
                <div style={{ fontSize: 52, fontWeight: 800, color: "#f97316" }}>₹{result.predicted_price.toLocaleString()}</div>
                <div style={{ fontSize: 13, color: "#a1a1aa", marginTop: 8 }}>
                  Range: ₹{result.price_range.low.toLocaleString()} — ₹{result.price_range.high.toLocaleString()}
                </div>
              </div>

              {/* Model breakdown */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: "#71717a", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Model Breakdown</div>
                {Object.entries(result.model_predictions).map(([k, v]: any) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1f1f1f" }}>
                    <span style={{ fontSize: 13, color: "#a1a1aa", textTransform: "capitalize" }}>{k}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: k === "ensemble" ? "#f97316" : "#e4e4e7" }}>₹{v.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={{ background: "#0f0f0f", border: "1px solid #1f1f1f", borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, color: "#71717a", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Model Performance</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {[["R²", "0.9405"], ["MAE", "₹554"], ["Dataset", "10K+"]].map(([k, v]) => (
                    <div key={k} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#f97316" }}>{v}</div>
                      <div style={{ fontSize: 10, color: "#52525b" }}>{k}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}