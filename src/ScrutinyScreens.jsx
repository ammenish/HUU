import { useState } from "react";
import Ic from './Ic.jsx';
import { Badge, StatCard, WorkflowBar } from './helpers.jsx';

export const ScrutinyHome = ({ apps }) => (
    <div className="fade-in">
        <div style={{ marginBottom: 22 }}><h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: 24, fontWeight: 800, color: "#0a2463" }}>Scrutiny Dashboard</h1><p style={{ color: "#64748b", fontSize: 13 }}>Environmental Document Review & Verification Unit</p></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14, marginBottom: 22 }}>
            <StatCard label="Submitted" val={apps.filter(a => a.status === "Submitted").length} icon="file" color="#2563eb" />
            <StatCard label="Under Scrutiny" val={apps.filter(a => a.status === "Under Scrutiny").length} icon="eye" color="#d97706" />
            <StatCard label="EDS Issued" val={apps.filter(a => a.status === "EDS Issued").length} icon="warn" color="#dc2626" />
            <StatCard label="Referred" val={apps.filter(a => a.status === "Referred for Meeting").length} icon="meet" color="#059669" />
        </div>
        <div className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, color: "#0a2463", marginBottom: 14 }}>All Submitted Applications</div>
            <table className="table"><thead><tr><th>App ID</th><th>Proponent</th><th>Category</th><th>Fee Status</th><th>Status</th></tr></thead>
                <tbody>{apps.filter(a => ["Submitted", "Under Scrutiny", "EDS Issued", "Referred for Meeting"].includes(a.status)).map(a => <tr key={a.id}>
                    <td><span style={{ fontWeight: 700, color: "#1e56c2", fontFamily: "monospace", fontSize: 12 }}>{a.id}</span></td>
                    <td style={{ fontWeight: 500 }}>{a.proponent}</td>
                    <td style={{ fontSize: 12 }}>{a.category}</td>
                    <td><span style={{ color: a.feesPaid ? "#059669" : "#dc2626", fontWeight: 600, fontSize: 12 }}>₹{a.fees.toLocaleString()} {a.feesPaid ? "✓" : "⚠"}</span></td>
                    <td><Badge t={a.status} /></td>
                </tr>)}</tbody></table>
        </div>
    </div>
);

export const ReviewQ = ({ apps, upd, notify }) => {
    const [sel, setSel] = useState(null);
    const [eds, setEds] = useState(""); const [showEds, setShowEds] = useState(false);
    const queue = apps.filter(a => ["Submitted", "Under Scrutiny"].includes(a.status));
    const app = sel ? apps.find(a => a.id === sel) : null;
    const issueEds = () => { upd(sel, { status: "EDS Issued", edsRemarks: eds }); notify("EDS issued for " + sel); setShowEds(false); setEds(""); setSel(null); };
    return (
        <div className="fade-in">
            <div style={{ marginBottom: 22 }}><h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: 24, fontWeight: 800, color: "#0a2463" }}>Document Review Queue</h1><p style={{ color: "#64748b", fontSize: 13 }}>{queue.length} applications awaiting review</p></div>
            <div style={{ display: "grid", gridTemplateColumns: "310px 1fr", gap: 18 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {queue.map(a => <div key={a.id} onClick={() => setSel(a.id)} className="card" style={{ padding: 14, cursor: "pointer", border: `2px solid ${sel === a.id ? "#1e56c2" : "#dce3ef"}`, transition: "all 0.15s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span style={{ fontFamily: "monospace", fontWeight: 700, color: "#1e56c2", fontSize: 11 }}>{a.id}</span><Badge t={a.status} /></div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#0a2463", marginBottom: 2 }}>{a.project.slice(0, 42)}…</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{a.proponent}</div>
                    </div>)}
                    {!queue.length && <div className="card" style={{ padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Queue is empty</div>}
                </div>
                {app ? <div className="card" style={{ padding: 22 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                        <div><span style={{ fontFamily: "monospace", fontWeight: 700, color: "#1e56c2", fontSize: 12 }}>{app.id}</span><h2 style={{ fontFamily: "Outfit,sans-serif", fontWeight: 700, fontSize: 17, color: "#0a2463", marginTop: 3 }}>{app.project}</h2><div style={{ color: "#64748b", fontSize: 12 }}>{app.sector} · {app.category} · {app.proponent}</div></div>
                        <Badge t={app.status} />
                    </div>
                    <WorkflowBar status={app.status} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "14px 0" }}>
                        {[["Filed", app.date], ["Fee", "₹" + app.fees.toLocaleString()], ["Paid", app.feesPaid ? "✓ Yes" : "⚠ No"], ["Docs", app.docs.length + " files"]].map(([k, v]) => <div key={k} style={{ padding: "9px 12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #dce3ef" }}><div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>{k}</div><div style={{ fontSize: 13, fontWeight: 600, marginTop: 1 }}>{v}</div></div>)}
                    </div>
                    <div style={{ marginBottom: 14 }}><div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", marginBottom: 7 }}>Documents</div><div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{app.docs.map(d => <span key={d} className="badge" style={{ background: "#eff6ff", color: "#2563eb" }}><Ic n="doc" s={10} /> {d}</span>)}</div></div>
                    {app.status === "Submitted" && <button className="btn btn-primary" onClick={() => { upd(app.id, { status: "Under Scrutiny" }); notify("Review started for " + app.id); }}><Ic n="eye" s={14} />Start Review</button>}
                    {app.status === "Under Scrutiny" && <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button className="btn btn-success" onClick={() => { upd(app.id, { status: "Referred for Meeting", reviewer: "Dr. Priya Mehta" }); notify(app.id + " referred for meeting"); setSel(null); }}><Ic n="send" s={14} />Refer for Meeting</button>
                        <button className="btn btn-danger" onClick={() => setShowEds(true)}><Ic n="warn" s={14} />Issue EDS</button>
                    </div>}
                </div> : <div className="card" style={{ padding: 40, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, color: "#94a3b8" }}><Ic n="eye" s={40} c="#dce3ef" /><div>Select an application to review</div></div>}
            </div>
            {showEds && <div className="modal-backdrop" onClick={() => setShowEds(false)}><div className="modal" onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}><div style={{ width: 38, height: 38, borderRadius: 11, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic n="warn" s={18} c="#dc2626" /></div><div><h3 style={{ fontFamily: "Outfit,sans-serif", fontWeight: 700, color: "#0a2463" }}>Issue EDS – {sel}</h3><p style={{ fontSize: 12, color: "#64748b" }}>Application returned to proponent</p></div></div>
                <textarea className="input" rows={5} value={eds} onChange={e => setEds(e.target.value)} placeholder={"List missing documents:\n\n1. Wildlife Impact Assessment is missing\n2. EIA Report – Section 4.2 incomplete\n3. Water Usage Plan not provided"} style={{ resize: "vertical" }} />
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}><button className="btn btn-danger" style={{ flex: 1, justifyContent: "center" }} onClick={issueEds}>Issue EDS & Return to Proponent</button><button className="btn btn-secondary" onClick={() => setShowEds(false)}>Cancel</button></div>
            </div></div>}
        </div>
    );
};

export const EDSMgmt = ({ apps, upd, notify }) => {
    const eds = apps.filter(a => a.status === "EDS Issued");
    return (
        <div className="fade-in">
            <div style={{ marginBottom: 22 }}><h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: 24, fontWeight: 800, color: "#0a2463" }}>EDS Management</h1><p style={{ color: "#64748b", fontSize: 13 }}>Essential Documents Sought – track pending corrections</p></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {eds.map(a => <div key={a.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                        <div><span style={{ fontFamily: "monospace", fontWeight: 700, color: "#1e56c2", fontSize: 12 }}>{a.id}</span><div style={{ fontWeight: 600, color: "#0a2463", marginTop: 3 }}>{a.project}</div><div style={{ fontSize: 12, color: "#64748b" }}>{a.sector} · {a.proponent}</div></div>
                        <Badge t={a.status} />
                    </div>
                    <div style={{ padding: "11px 13px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca", fontSize: 13, color: "#7f1d1d", marginBottom: 12 }}><strong>EDS Remarks:</strong> {a.edsRemarks}</div>
                    <button className="btn btn-success btn-sm" onClick={() => { upd(a.id, { status: "Under Scrutiny", edsRemarks: "" }); notify("EDS resolved – " + a.id + " back in scrutiny"); }}><Ic n="ok" s={12} />Mark Documents Received</button>
                </div>)}
                {!eds.length && <div className="card" style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}><Ic n="warn" s={40} c="#dce3ef" /><div style={{ marginTop: 10 }}>No active EDS cases</div></div>}
            </div>
        </div>
    );
};

export const GistGen = ({ apps, upd, notify }) => {
    const [gen, setGen] = useState(null);
    const ready = apps.filter(a => a.status === "Referred for Meeting" && !a.gist);
    const done = apps.filter(a => a.status === "MoM Generated" && a.gist);
    const generate = (app) => {
        setGen(app.id);
        setTimeout(() => {
            const g = `MEETING GIST\nApp ID: ${app.id}\nDate: ${new Date().toLocaleDateString("en-IN")}\nCategory: ${app.category} | Sector: ${app.sector}\n\n1. PROJECT OVERVIEW\nProject: ${app.project}\nProponent: ${app.proponent}\nCategory: ${app.category} | Sector: ${app.sector}\n\n2. ENVIRONMENTAL IMPACT SUMMARY\nProject involves development in the ${app.sector} sector under ${app.category} norms.\nReviewed documents: ${app.docs.join(", ")}.\nFee of ₹${app.fees.toLocaleString()} ${app.feesPaid ? "paid" : "pending"}.\n\n3. COMMITTEE OBSERVATIONS\n• Application filed on ${app.date}, reviewed by ${app.reviewer || "Scrutiny Team"}\n• All mandatory documents verified as per EIA Notification 2006\n• No major deficiencies found post-EDS resolution\n\n4. RECOMMENDATIONS\nReferred to Expert Appraisal Committee (EAC) for detailed appraisal.\n\n5. DRAFT CONDITIONS\n(i)  Project to comply with all environmental conditions\n(ii) Quarterly environmental monitoring reports mandatory\n(iii) EMP to be strictly implemented per MoEFCC guidelines`;
            upd(app.id, { gist: g, status: "MoM Generated" });
            setGen(null);
            notify("Auto-Gist generated for " + app.id);
        }, 1800);
    };
    return (
        <div className="fade-in">
            <div style={{ marginBottom: 22 }}><h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: 24, fontWeight: 800, color: "#0a2463" }}>Auto-Gist Generation & Meeting Referral</h1><p style={{ color: "#64748b", fontSize: 13 }}>Trigger automatic Gist creation using Admin's master templates</p></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {ready.map(a => <div key={a.id} className="card" style={{ padding: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                        <div><div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}><span style={{ fontFamily: "monospace", fontWeight: 700, color: "#1e56c2", fontSize: 12 }}>{a.id}</span><Badge t={a.status} /></div><div style={{ fontWeight: 600, color: "#0a2463" }}>{a.project}</div><div style={{ fontSize: 12, color: "#64748b" }}>{a.category} · Template: {a.category} Gist Template</div></div>
                        <button className="btn btn-primary" onClick={() => generate(a)} disabled={gen === a.id}>
                            {gen === a.id ? <><span style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />Generating…</> : <><Ic n="sync" s={14} />Generate Gist</>}
                        </button>
                    </div>
                </div>)}
                {done.map(a => <div key={a.id} className="card" style={{ padding: 18, opacity: 0.8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                        <div><div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}><span style={{ fontFamily: "monospace", fontWeight: 700, color: "#1e56c2", fontSize: 12 }}>{a.id}</span><span className="badge" style={{ background: "#faf5ff", color: "#7c3aed" }}>✓ Gist Ready</span></div><div style={{ fontWeight: 600, color: "#0a2463" }}>{a.project}</div></div>
                        <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>✓ Awaiting MoM Team</span>
                    </div>
                </div>)}
                {!ready.length && !done.length && <div className="card" style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}><Ic n="sync" s={40} c="#dce3ef" /><div style={{ marginTop: 10 }}>No applications ready for Gist generation</div></div>}
            </div>
        </div>
    );
};
