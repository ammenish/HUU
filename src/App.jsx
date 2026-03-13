import { useState } from "react";
import { SECTORS, INITIAL_APPS } from './data.js';
import Ic from './Ic.jsx';
import Login from './Login.jsx';
import LandingPage from './LandingPage.jsx';
import Sidebar from './Sidebar.jsx';
import { AdminHome, UserMgmt, Templates, AppTable } from './AdminScreens.jsx';
import { PPHome, NewApp } from './ProponentScreens.jsx';
import { ScrutinyHome, ReviewQ, EDSMgmt, GistGen } from './ScrutinyScreens.jsx';
import { MoMHome, MoMEd, Finalized } from './MoMScreens.jsx';

// ── Global Styles (injected once) ─────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const globalStyle = document.createElement("style");
globalStyle.textContent = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f4f8; }
  .fade-in { animation: fadeIn 0.4s ease both; }
  .slide-up { animation: slideUp 0.35s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  @keyframes slideUp { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .card { background: #fff; border-radius: 16px; border: 1px solid #dce3ef; box-shadow: 0 2px 12px rgba(10,36,99,0.06); }
  .btn { display:inline-flex; align-items:center; gap:6px; padding:9px 20px; border-radius:10px; border:none; cursor:pointer; font-family:inherit; font-weight:600; font-size:14px; transition:all 0.18s ease; }
  .btn:disabled { opacity:0.5; cursor:not-allowed; }
  .btn-primary { background:#1e56c2; color:#fff; }
  .btn-primary:not(:disabled):hover { background:#1749a8; transform:translateY(-1px); box-shadow:0 4px 16px rgba(30,86,194,0.3); }
  .btn-secondary { background:#e8edf5; color:#0a2463; }
  .btn-secondary:hover { background:#d5dff0; }
  .btn-danger { background:#fff0f3; color:#ef476f; border:1px solid #ffd0da; }
  .btn-success { background:#e8fdf5; color:#059669; border:1px solid #a7f3d0; }
  .btn-sm { padding:6px 14px; font-size:13px; }
  .input { width:100%; padding:10px 14px; border:1.5px solid #dce3ef; border-radius:10px; font-family:inherit; font-size:14px; color:#0f172a; outline:none; transition:border 0.18s; background:#fff; }
  .input:focus { border-color:#3a86ff; box-shadow:0 0 0 3px rgba(58,134,255,0.1); }
  .select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:36px; }
  .badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
  .sidebar-link { display:flex; align-items:center; gap:10px; padding:10px 16px; border-radius:10px; cursor:pointer; font-size:13.5px; font-weight:500; color:rgba(255,255,255,0.7); transition:all 0.18s; margin:2px 8px; }
  .sidebar-link:hover { background:rgba(255,255,255,0.1); color:#fff; }
  .sidebar-link.active { background:#3a86ff; color:#fff; box-shadow:0 2px 8px rgba(58,134,255,0.4); }
  .modal-backdrop { position:fixed; inset:0; background:rgba(10,36,99,0.45); backdrop-filter:blur(4px); z-index:1000; display:flex; align-items:center; justify-content:center; }
  .modal { background:#fff; border-radius:20px; padding:28px; max-width:540px; width:90%; max-height:85vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.2); animation:slideUp 0.3s ease both; }
  .table { width:100%; border-collapse:collapse; }
  .table th { background:#f8fafc; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; padding:10px 14px; text-align:left; border-bottom:1px solid #dce3ef; }
  .table td { padding:12px 14px; border-bottom:1px solid #f1f5f9; font-size:14px; color:#0f172a; }
  .table tr:hover td { background:#fafbfe; }
  .notif { position:fixed; top:20px; right:20px; z-index:9999; background:#fff; border-radius:12px; padding:14px 18px; box-shadow:0 8px 30px rgba(0,0,0,0.15); border-left:4px solid #06d6a0; display:flex; align-items:center; gap:10px; font-size:14px; font-weight:500; animation:slideUp 0.3s ease; min-width:280px; }
  .progress-bar { height:6px; background:#e2e8f0; border-radius:3px; overflow:hidden; }
  .progress-fill { height:100%; background:linear-gradient(90deg,#3a86ff,#00b4d8); border-radius:3px; transition:width 0.5s ease; }
`;
document.head.appendChild(globalStyle);

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
    const [user, setUser] = useState(null);
    const [page, setPage] = useState("landing"); // landing | login | dashboard
    const [view, setView] = useState("dashboard");
    const [apps, setApps] = useState(INITIAL_APPS);
    const [notif, setNotif] = useState(null);
    const notify = msg => { setNotif(msg); setTimeout(() => setNotif(null), 3200); };
    const upd = (id, changes) => setApps(p => p.map(a => a.id === id ? { ...a, ...changes } : a));
    const addApp = a => { setApps(p => [a, ...p]); setView("myApps"); };

    if (!user && page === "landing") return <LandingPage onLogin={() => setPage("login")} />;
    if (!user) return <Login onLogin={u => { setUser(u); setPage("dashboard"); setView("dashboard"); }} />;

    const render = () => {
        const { role } = user;
        if (role === "admin") {
            if (view === "dashboard") return <AdminHome apps={apps} />;
            if (view === "users") return <UserMgmt notify={notify} />;
            if (view === "templates") return <Templates notify={notify} />;
            if (view === "allApps") return <AppTable apps={apps} title="All Applications" sub={`${apps.length} total records`} />;
            if (view === "sectors") return (
                <div className="fade-in">
                    <h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: 24, fontWeight: 800, color: "#0a2463", marginBottom: 6 }}>Sector Parameters</h1>
                    <p style={{ color: "#64748b", fontSize: 13, marginBottom: 22 }}>Configure sector-specific evaluation criteria</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
                        {SECTORS.map(s => <div key={s} className="card" style={{ padding: 16 }}><div style={{ fontWeight: 700, color: "#0a2463", marginBottom: 7 }}>{s}</div><div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>Sector-specific criteria</div><button className="btn btn-secondary btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={() => notify("Sector editor opened")}><Ic n="edit" s={12} />Configure</button></div>)}
                    </div>
                </div>
            );
        }
        if (role === "proponent") {
            if (view === "dashboard") return <PPHome user={user} apps={apps} />;
            if (view === "newApp") return <NewApp user={user} onAdd={addApp} notify={notify} />;
            if (view === "myApps") return <AppTable apps={apps.filter(a => a.proponent === (user.company || user.name))} title="My Applications" />;
            if (view === "payments") return (
                <div className="fade-in">
                    <h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: 24, fontWeight: 800, color: "#0a2463", marginBottom: 6 }}>Fee Payments</h1>
                    <p style={{ color: "#64748b", fontSize: 13, marginBottom: 22 }}>Track and manage application fees</p>
                    <div className="card" style={{ overflow: "hidden" }}>
                        <table className="table"><thead><tr><th>App ID</th><th>Project</th><th>Fee</th><th>Status</th><th>Action</th></tr></thead>
                            <tbody>{apps.filter(a => a.proponent === (user.company || user.name)).map(a => <tr key={a.id}>
                                <td><span style={{ fontFamily: "monospace", fontWeight: 700, color: "#1e56c2", fontSize: 12 }}>{a.id}</span></td>
                                <td style={{ fontWeight: 500 }}>{a.project}</td>
                                <td style={{ fontWeight: 700 }}>₹{a.fees.toLocaleString()}</td>
                                <td><span style={{ color: a.feesPaid ? "#059669" : "#dc2626", fontWeight: 600, fontSize: 12 }}>{a.feesPaid ? "Paid ✓" : "Pending ⚠"}</span></td>
                                <td>{!a.feesPaid && <button className="btn btn-primary btn-sm" onClick={() => { upd(a.id, { feesPaid: true }); notify("Payment confirmed for " + a.id); }}>Pay Now</button>}</td>
                            </tr>)}</tbody></table>
                    </div>
                </div>
            );
        }
        if (role === "scrutiny") {
            if (view === "dashboard") return <ScrutinyHome apps={apps} />;
            if (view === "review") return <ReviewQ apps={apps} upd={upd} notify={notify} />;
            if (view === "eds") return <EDSMgmt apps={apps} upd={upd} notify={notify} />;
            if (view === "gistGen") return <GistGen apps={apps} upd={upd} notify={notify} />;
        }
        if (role === "mom") {
            if (view === "dashboard") return <MoMHome apps={apps} />;
            if (view === "momEdit") return <MoMEd apps={apps} upd={upd} notify={notify} />;
            if (view === "finalized") return <Finalized apps={apps} notify={notify} />;
        }
        return <div style={{ padding: 40, color: "#94a3b8" }}>Select a section from the sidebar.</div>;
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f8" }}>
            <Sidebar user={user} active={view} setActive={setView} logout={() => { setUser(null); setPage("landing"); setView("dashboard"); }} />
            <main style={{ flex: 1, padding: 26, overflowY: "auto", minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                        <Ic n="shield" s={13} c="#1e56c2" />
                        <span style={{ color: "#1e56c2", fontWeight: 700 }}>PARIVESH 3.0</span>
                        <span>/</span><span style={{ textTransform: "capitalize" }}>{user.role}</span>
                        <span>/</span><span style={{ textTransform: "capitalize" }}>{view}</span>
                    </div>
                    <div style={{ padding: "5px 13px", background: "#fff", borderRadius: 9, border: "1px solid #dce3ef", fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                        {new Date().toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                    </div>
                </div>
                {render()}
            </main>
            {notif && <div className="notif"><span style={{ color: "#06d6a0", fontSize: 18 }}>●</span>{notif}<span style={{ marginLeft: "auto", cursor: "pointer", opacity: 0.5, fontSize: 16 }} onClick={() => setNotif(null)}>✕</span></div>}
        </div>
    );
}
