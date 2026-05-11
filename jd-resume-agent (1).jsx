import { useState, useRef } from "react";

const SYSTEM_PROMPT = `You are an elite ATS Resume Optimization Agent. Your ONLY job is to rewrite a candidate's resume bullet points to perfectly match a given Job Description (JD) — without fabricating skills or experience.

## STRICT RULES
1. NEVER invent skills, tools, or experiences the candidate doesn't have.
2. ALWAYS mirror exact keywords, phrases, and acronyms from the JD.
3. REWRITE bullets using strong action verbs + quantified impact where possible.
4. PRIORITIZE ATS-critical keywords (skills, tools, technologies, certifications) from the JD.
5. REORDER bullet points so the most JD-relevant ones appear first under each role.
6. Keep bullets under 2 lines. Power formula: [Action Verb] + [What you did] + [Tool/Tech] + [Impact/Result].
7. Match the seniority tone of the JD (junior = learning/built; senior = led/architected/scaled).
8. Return ONLY valid JSON — no markdown, no explanation, no preamble.

## OUTPUT FORMAT (strict JSON):
{
  "ats_score": 85,
  "matched_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword3"],
  "tailored_resume": {
    "name": "...",
    "title": "...(rewritten to match JD title if close enough)",
    "summary": "2-3 sentence ATS-optimized professional summary using JD keywords",
    "skills": ["skill1", "skill2", "...top skills from resume that match JD"],
    "experience": [
      {
        "company": "...",
        "role": "...",
        "duration": "...",
        "bullets": [
          "Rewrote bullet 1 using JD keywords",
          "Rewrote bullet 2 with impact metrics"
        ]
      }
    ],
    "projects": [
      {
        "name": "...",
        "bullets": ["Rewritten project bullet matching JD tech stack"]
      }
    ]
  },
  "optimization_notes": ["Note 1 about what was changed", "Note 2"]
}`;

const SAMPLE_JD = `We are looking for a Full Stack Developer to join our team.

Requirements:
- 1-3 years experience with React.js and Node.js
- REST API development with Express.js
- MongoDB database design
- JWT authentication and Role-Based Access Control (RBAC)
- Git version control
- Strong problem-solving skills
- Bonus: TypeScript, Redis, AWS

Responsibilities:
- Build and maintain scalable REST APIs
- Develop responsive React frontends
- Implement authentication and authorization systems
- Write clean, maintainable code
- Collaborate in agile environment`;

const SAMPLE_RESUME = {
  name: "Mohammed Zaheer Shaik",
  title: "MERN Stack Developer",
  summary: "Aspiring full stack developer with hands-on experience building REST APIs and web applications.",
  skills: ["MongoDB", "Express.js", "React", "Node.js", "JWT", "Git", "JavaScript"],
  experience: [
    {
      company: "Red & White Multimedia Education",
      role: "MERN Stack Trainee",
      duration: "2023 - 2024",
      bullets: [
        "Learned MERN stack development through intensive training",
        "Built multiple projects including APIs and web apps",
        "Practiced REST API design patterns"
      ]
    }
  ],
  projects: [
    {
      name: "RBAC REST API",
      bullets: [
        "Built a role-based access control system with JWT",
        "Implemented Admin, Manager, Employee hierarchy",
        "Used Cloudinary for file uploads and Nodemailer for emails"
      ]
    },
    {
      name: "vibe-error-explainer",
      bullets: [
        "Published npm package that explains Node.js errors in plain English",
        "Added multi-language support and offline dictionary"
      ]
    }
  ]
};

export default function ResumeAgent() {
  const [jd, setJd] = useState(SAMPLE_JD);
  const [resumeJson, setResumeJson] = useState(JSON.stringify(SAMPLE_RESUME, null, 2));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("bullets");
  const [copied, setCopied] = useState(false);
  const [jsonError, setJsonError] = useState("");

  const validateJson = (str) => {
    try { JSON.parse(str); setJsonError(""); return true; }
    catch (e) { setJsonError("Invalid JSON: " + e.message); return false; }
  };

  const runAgent = async () => {
    if (!jd.trim()) return setError("Paste a Job Description first.");
    if (!validateJson(resumeJson)) return;
    setError(""); setResult(null); setLoading(true);

    try {
      const userPrompt = `## JOB DESCRIPTION\n${jd}\n\n## CANDIDATE RESUME (JSON)\n${resumeJson}\n\nRewrite this resume to maximize ATS match for the above JD. Return ONLY valid JSON.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userPrompt }]
        })
      });

      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("").trim();
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError("Agent failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    const text = result ? JSON.stringify(result.tailored_resume, null, 2) : "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreColor = (score) => {
    if (score >= 80) return "#00ff9d";
    if (score >= 60) return "#ffcc00";
    return "#ff4d4d";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      color: "#e2e8f0",
      padding: "0",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1e2435",
        padding: "18px 32px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        background: "#0d0d17"
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "linear-gradient(135deg, #00ff9d22, #0066ff22)",
          border: "1px solid #00ff9d44",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18
        }}>⚡</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", color: "#fff" }}>
            JD → RESUME TAILOR
          </div>
          <div style={{ fontSize: 11, color: "#4a5568", letterSpacing: "0.12em" }}>
            ATS OPTIMIZATION AGENT · POWERED BY CLAUDE
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ display: "flex", flex: 1, height: "calc(100vh - 61px)" }}>

        {/* LEFT — Inputs */}
        <div style={{
          width: "44%", borderRight: "1px solid #1e2435",
          display: "flex", flexDirection: "column", overflow: "hidden"
        }}>
          {/* JD Input */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", borderBottom: "1px solid #1e2435" }}>
            <div style={{
              padding: "10px 18px", fontSize: 10, letterSpacing: "0.14em",
              color: "#00ff9d", borderBottom: "1px solid #1e2435",
              background: "#0d0d17", display: "flex", alignItems: "center", gap: 8
            }}>
              <span style={{ opacity: 0.5 }}>01</span> JOB DESCRIPTION
              <span style={{ marginLeft: "auto", color: "#2d3748", fontSize: 9 }}>
                {jd.length} chars
              </span>
            </div>
            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              placeholder="Paste the full job description here..."
              style={{
                flex: 1, background: "transparent", border: "none",
                color: "#c9d1e0", fontSize: 12, lineHeight: 1.7,
                padding: "14px 18px", resize: "none", outline: "none",
                fontFamily: "inherit"
              }}
            />
          </div>

          {/* Resume JSON Input */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{
              padding: "10px 18px", fontSize: 10, letterSpacing: "0.14em",
              color: "#0099ff", borderBottom: "1px solid #1e2435",
              background: "#0d0d17", display: "flex", alignItems: "center", gap: 8
            }}>
              <span style={{ opacity: 0.5 }}>02</span> BASE RESUME (JSON)
              {jsonError && (
                <span style={{ marginLeft: "auto", color: "#ff4d4d", fontSize: 9 }}>⚠ {jsonError}</span>
              )}
            </div>
            <textarea
              value={resumeJson}
              onChange={e => { setResumeJson(e.target.value); if (jsonError) validateJson(e.target.value); }}
              placeholder='{ "name": "...", "experience": [...] }'
              style={{
                flex: 1, background: "transparent", border: "none",
                color: "#c9d1e0", fontSize: 11, lineHeight: 1.7,
                padding: "14px 18px", resize: "none", outline: "none",
                fontFamily: "inherit"
              }}
            />
          </div>

          {/* Run Button */}
          <div style={{ padding: "14px 18px", borderTop: "1px solid #1e2435", background: "#0d0d17" }}>
            {error && <div style={{ fontSize: 11, color: "#ff4d4d", marginBottom: 10 }}>{error}</div>}
            <button
              onClick={runAgent}
              disabled={loading}
              style={{
                width: "100%", padding: "12px",
                background: loading ? "#1a1a2e" : "linear-gradient(135deg, #00ff9d18, #0066ff18)",
                border: `1px solid ${loading ? "#2d3748" : "#00ff9d55"}`,
                borderRadius: 8, color: loading ? "#4a5568" : "#00ff9d",
                fontSize: 12, letterSpacing: "0.12em", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10
              }}
            >
              {loading ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>◌</span>
                  AGENT RUNNING...
                </>
              ) : "⚡ TAILOR MY RESUME"}
            </button>
          </div>
        </div>

        {/* RIGHT — Output */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {!result && !loading && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 16,
              color: "#2d3748"
            }}>
              <div style={{ fontSize: 48 }}>◎</div>
              <div style={{ fontSize: 12, letterSpacing: "0.1em" }}>AWAITING INPUT</div>
              <div style={{ fontSize: 11, maxWidth: 280, textAlign: "center", lineHeight: 1.6, color: "#1e2435" }}>
                Paste a JD + your resume JSON on the left, then hit TAILOR MY RESUME
              </div>
            </div>
          )}

          {loading && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 20
            }}>
              <div style={{
                width: 60, height: 60, border: "1px solid #00ff9d33",
                borderTop: "1px solid #00ff9d", borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} />
              <div style={{ fontSize: 12, color: "#00ff9d", letterSpacing: "0.12em" }}>
                ANALYZING JD + RESUME...
              </div>
              {["Extracting ATS keywords", "Matching experience", "Rewriting bullets", "Scoring match"].map((s, i) => (
                <div key={i} style={{
                  fontSize: 11, color: "#2d3748",
                  animation: `fadeIn 0.5s ${i * 0.6}s both`
                }}>→ {s}</div>
              ))}
            </div>
          )}

          {result && (
            <>
              {/* Score bar */}
              <div style={{
                padding: "16px 24px", borderBottom: "1px solid #1e2435",
                background: "#0d0d17", display: "flex", alignItems: "center", gap: 20
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: 28, fontWeight: 700,
                    color: scoreColor(result.ats_score)
                  }}>{result.ats_score}</div>
                  <div style={{ fontSize: 9, color: "#4a5568", letterSpacing: "0.1em" }}>ATS SCORE</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    height: 4, background: "#1e2435", borderRadius: 2, overflow: "hidden"
                  }}>
                    <div style={{
                      height: "100%", width: `${result.ats_score}%`,
                      background: `linear-gradient(90deg, #0066ff, ${scoreColor(result.ats_score)})`,
                      transition: "width 1s ease", borderRadius: 2
                    }} />
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    {result.matched_keywords?.slice(0,6).map(k => (
                      <span key={k} style={{
                        fontSize: 9, padding: "2px 7px", borderRadius: 3,
                        background: "#00ff9d15", color: "#00ff9d",
                        border: "1px solid #00ff9d33", letterSpacing: "0.06em"
                      }}>✓ {k}</span>
                    ))}
                    {result.missing_keywords?.slice(0,3).map(k => (
                      <span key={k} style={{
                        fontSize: 9, padding: "2px 7px", borderRadius: 3,
                        background: "#ff4d4d12", color: "#ff6b6b",
                        border: "1px solid #ff4d4d33", letterSpacing: "0.06em"
                      }}>✗ {k}</span>
                    ))}
                  </div>
                </div>
                <button onClick={copyOutput} style={{
                  padding: "8px 16px", background: copied ? "#00ff9d22" : "transparent",
                  border: `1px solid ${copied ? "#00ff9d" : "#2d3748"}`,
                  borderRadius: 6, color: copied ? "#00ff9d" : "#4a5568",
                  fontSize: 10, letterSpacing: "0.1em", cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.2s"
                }}>
                  {copied ? "✓ COPIED" : "COPY JSON"}
                </button>
              </div>

              {/* Tabs */}
              <div style={{
                display: "flex", borderBottom: "1px solid #1e2435",
                background: "#0d0d17"
              }}>
                {[
                  { id: "bullets", label: "BULLETS" },
                  { id: "summary", label: "SUMMARY" },
                  { id: "notes", label: "NOTES" },
                  { id: "raw", label: "RAW JSON" }
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                    padding: "10px 18px", fontSize: 10, letterSpacing: "0.12em",
                    background: "transparent", border: "none",
                    borderBottom: activeTab === tab.id ? "2px solid #00ff9d" : "2px solid transparent",
                    color: activeTab === tab.id ? "#00ff9d" : "#4a5568",
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s"
                  }}>{tab.label}</button>
                ))}
              </div>

              {/* Tab content */}
              <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>

                {activeTab === "bullets" && (
                  <div>
                    {/* Experience */}
                    {result.tailored_resume?.experience?.map((exp, i) => (
                      <div key={i} style={{ marginBottom: 24 }}>
                        <div style={{
                          fontSize: 12, color: "#0099ff", marginBottom: 4,
                          letterSpacing: "0.08em"
                        }}>{exp.role} @ {exp.company}</div>
                        <div style={{ fontSize: 10, color: "#2d3748", marginBottom: 10 }}>{exp.duration}</div>
                        {exp.bullets?.map((b, j) => (
                          <div key={j} style={{
                            fontSize: 12, color: "#c9d1e0", lineHeight: 1.7,
                            padding: "8px 12px", marginBottom: 6,
                            background: "#0d1117", borderLeft: "2px solid #00ff9d44",
                            borderRadius: "0 6px 6px 0"
                          }}>→ {b}</div>
                        ))}
                      </div>
                    ))}

                    {/* Projects */}
                    {result.tailored_resume?.projects?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 10, color: "#ffcc00", letterSpacing: "0.12em", marginBottom: 12 }}>
                          PROJECTS
                        </div>
                        {result.tailored_resume.projects.map((p, i) => (
                          <div key={i} style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: 12, color: "#ffcc00aa", marginBottom: 8 }}>{p.name}</div>
                            {p.bullets?.map((b, j) => (
                              <div key={j} style={{
                                fontSize: 12, color: "#c9d1e0", lineHeight: 1.7,
                                padding: "8px 12px", marginBottom: 6,
                                background: "#0d1117", borderLeft: "2px solid #ffcc0033",
                                borderRadius: "0 6px 6px 0"
                              }}>→ {b}</div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "summary" && (
                  <div>
                    <div style={{
                      fontSize: 12, color: "#c9d1e0", lineHeight: 1.8,
                      padding: "16px", background: "#0d1117",
                      borderLeft: "2px solid #0099ff", borderRadius: "0 8px 8px 0",
                      marginBottom: 20
                    }}>
                      {result.tailored_resume?.summary}
                    </div>
                    <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: "0.1em", marginBottom: 12 }}>
                      MATCHED SKILLS
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {result.tailored_resume?.skills?.map(s => (
                        <span key={s} style={{
                          fontSize: 11, padding: "4px 10px", borderRadius: 4,
                          background: "#0099ff15", color: "#0099ff",
                          border: "1px solid #0099ff33"
                        }}>{s}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 10, color: "#4a5568", letterSpacing: "0.1em", marginTop: 20, marginBottom: 12 }}>
                      SUGGESTED TITLE
                    </div>
                    <div style={{ fontSize: 14, color: "#fff", letterSpacing: "0.06em" }}>
                      {result.tailored_resume?.title}
                    </div>
                  </div>
                )}

                {activeTab === "notes" && (
                  <div>
                    {result.optimization_notes?.map((note, i) => (
                      <div key={i} style={{
                        fontSize: 12, color: "#c9d1e0", lineHeight: 1.7,
                        padding: "10px 14px", marginBottom: 8,
                        background: "#0d1117", borderLeft: "2px solid #ffcc0066",
                        borderRadius: "0 6px 6px 0"
                      }}>
                        <span style={{ color: "#ffcc00", marginRight: 8 }}>{i + 1}.</span>
                        {note}
                      </div>
                    ))}
                    {result.missing_keywords?.length > 0 && (
                      <div style={{ marginTop: 20 }}>
                        <div style={{ fontSize: 10, color: "#ff6b6b", letterSpacing: "0.1em", marginBottom: 12 }}>
                          GAPS TO ADDRESS
                        </div>
                        {result.missing_keywords.map(k => (
                          <div key={k} style={{
                            fontSize: 11, padding: "6px 12px", marginBottom: 6,
                            background: "#ff4d4d08", borderLeft: "2px solid #ff4d4d44",
                            color: "#ff6b6b", borderRadius: "0 4px 4px 0"
                          }}>✗ {k} — consider adding this to your skill set or project descriptions</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "raw" && (
                  <pre style={{
                    fontSize: 11, color: "#4a7c59", lineHeight: 1.6,
                    whiteSpace: "pre-wrap", wordBreak: "break-word"
                  }}>
                    {JSON.stringify(result.tailored_resume, null, 2)}
                  </pre>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #1e2435; border-radius: 2px; }
        textarea::placeholder { color: #1e2435; }
      `}</style>
    </div>
  );
}
