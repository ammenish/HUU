import { useState } from "react";
import Ic from './Ic.jsx';
import { CATEGORIES, SECTORS } from './data.js';
import { Badge, StatCard } from './helpers.jsx';

export const AdminHome = ({ apps }) => {
    const s = (st) => apps.filter(a => a.status === st).length;
    return (
        <div className="fade-in">
            <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: 24, fontWeight: 800, color: "#0a2463" }}>System Overview</h1><p style={{ color: "#64748b", fontSize: 14 }}>PARIVESH 3.0 — Administrative Control Center</p></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 14, marginBottom: 22 }}>
                <StatCard label="Total Applications" val={apps.length} icon="file" color="#1e56c2" sub="All statuses" />
                <StatCard label="Under Scrutiny" val={s("Under Scrutiny")} icon="eye" color="#d97706" sub="Awaiting review" />
                <StatCard label="EDS Issued" val={s("EDS Issued")} icon="warn" color="#dc2626" sub="Pending correction" />
                <StatCard label="In Meeting Stage" val={s("Referred for Meeting") + s("MoM Generated")} icon="meet" color="#0077b6" sub="Active meetings" />
                <StatCard label="Finalized" val={s("Finalized")} icon="ok" color="#059669" sub="Clearance granted" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="card" style={{ padding: 20 }}>
                    <div style={{ fontWeight: 700, marginBottom: 14, color: "#0a2463", fontSize: 15 }}>Applications by Category</div>
                    {CATEGORIES.map(c => { const n = apps.filter(a => a.category === c).length, p = apps.length ? Math.round(n / apps.length * 100) : 0; return (<div key={c} style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span style={{ fontWeight: 500 }}>{c}</span><span style={{ color: "#64748b" }}>{n} ({p}%)</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: `${p}%` }} /></div></div>); })}
                </div>
                <div className="card" style={{ padding: 20 }}>
                    <div style={{ fontWeight: 700, marginBottom: 14, color: "#0a2463", fontSize: 15 }}>Latest Applications</div>
                    {apps.slice(0, 5).map(a => <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}><div><div style={{ fontSize: 13, fontWeight: 600 }}>{a.id}</div><div style={{ fontSize: 11, color: "#64748b" }}>{a.proponent}</div></div><Badge t={a.status} /></div>)}
                </div>
            </div>
        </div>
    );
};

export const UserMgmt = ({ notify }) => {
    const [users, setUsers] = useState([{ id: 2, name: "Rajiv Sharma", email: "sharma@infraltd.com", role: "proponent" }, { id: 3, name: "Dr. Priya Mehta", email: "scrutiny1@moef.gov.in", role: "scrutiny" }, { id: 4, name: "Arvind Kumar", email: "mom1@moef.gov.in", role: "mom" }, { id: 5, name: "Demo User", email: "demo@proponent.in", role: "proponent" }]);
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", role: "scrutiny" });
    const rc = { proponent: "#059669", scrutiny: "#d97706", mom: "#7c3aed" };
    const add = () => { setUsers(p => [...p, { id: Date.now(), ...form }]); setShow(false); setForm({ name: "", email: "", role: "scrutiny" }); notify("User provisioned"); };
    const toggle = id => { setUsers(p => p.map(u => u.id === id ? { ...u, role: u.role === "scrutiny" ? "mom" : "scrutiny" } : u)); notify("Role updated"); };
    return (
        <div className="fade-in">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div><h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: 24, fontWeight: 800, color: "#0a2463" }}>User Management</h1><p style={{ color: "#64748b", fontSize: 13 }}>Dynamic role assignment & access control</p></div>
                <button className="btn btn-primary" onClick={() => setShow(true)}><Ic n="plus" s={14} />Add User</button>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
                <table className="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
                    <tbody>{users.map(u => <tr key={u.id}><td style={{ fontWeight: 600 }}>{u.name}</td><td style={{ color: "#64748b" }}>{u.email}</td>
                        <td><span className="badge" style={{ background: (rc[u.role] || "#1e56c2") + "18", color: rc[u.role] || "#1e56c2" }}>{u.role}</span></td>
                        <td>{(u.role === "scrutiny" || u.role === "mom") && <button className="btn btn-secondary btn-sm" onClick={() => toggle(u.id)}><Ic n="sync" s={12} />Switch to {u.role === "scrutiny" ? "MoM" : "Scrutiny"}</button>}</td>
                    </tr>)}</tbody></table>
            </div>
            {show && <div className="modal-backdrop" onClick={() => setShow(false)}><div className="modal" onClick={e => e.stopPropagation()}>
                <h3 style={{ fontFamily: "Outfit,sans-serif", fontWeight: 700, color: "#0a2463", marginBottom: 18 }}>Provision New User</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                    <div><label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Full Name</label><input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Dr. Firstname Lastname" /></div>
                    <div><label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Official Email</label><input className="input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="official@moef.gov.in" /></div>
                    <div><label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase" }}>Assign Role</label>
                        <select className="input select" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}><option value="scrutiny">Scrutiny Team</option><option value="mom">MoM Team</option><option value="proponent">Project Proponent</option></select>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 22 }}><button className="btn btn-primary" onClick={add} style={{ flex: 1, justifyContent: "center" }}>Create User</button><button className="btn btn-secondary" onClick={() => setShow(false)}>Cancel</button></div>
            </div></div>}
        </div>
    );
};

export const Templates = ({ notify }) => {
    const tpls = [{ id: 1, cat: "Category A", name: "Large Project Gist Template", secs: ["Project Overview", "Environmental Impact Summary", "Committee Observations", "Recommendations", "Conditions of Approval"], upd: "2025-06-01" }, { id: 2, cat: "Category B1", name: "Medium Project Template", secs: ["Project Overview", "Impact Assessment", "Recommendations"], upd: "2025-05-15" }, { id: 3, cat: "Category B2", name: "Small Project Template", secs: ["Project Summary", "Clearance Recommendation"], upd: "2025-05-10" }];
    return (
        <div className="fade-in">
            <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: 24, fontWeight: 800, color: "#0a2463" }}>Gist Template Manager</h1><p style={{ color: "#64748b", fontSize: 13 }}>Master templates for auto-gist generation by category</p></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 16 }}>
                {tpls.map(t => <div key={t.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><Badge t={t.cat} /><span style={{ fontSize: 11, color: "#64748b" }}>Updated {t.upd}</span></div>
                    <div style={{ fontWeight: 700, color: "#0a2463", marginBottom: 12 }}>{t.name}</div>
                    <div style={{ marginBottom: 14 }}>{t.secs.map((s, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid #f0f4f8", fontSize: 13 }}><span style={{ width: 19, height: 19, borderRadius: 6, background: "#eff6ff", color: "#2563eb", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>{s}</div>)}</div>
                    <button className="btn btn-secondary btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={() => notify("Template editor opened")}><Ic n="edit" s={12} />Edit Template</button>
                </div>)}
            </div>
        </div>
    );
};

export const AppTable = ({ apps, title, sub }) => (
    <div className="fade-in">
        <div style={{ marginBottom: 22 }}><h1 style={{ fontFamily: "Outfit,sans-serif", fontSize: 24, fontWeight: 800, color: "#0a2463" }}>{title || "Applications"}</h1><p style={{ color: "#64748b", fontSize: 13 }}>{sub || `${apps.length} records`}</p></div>
        <div className="card" style={{ overflow: "auto" }}>
            <table className="table"><thead><tr><th>App ID</th><th>Proponent</th><th>Sector</th><th>Category</th><th>Project</th><th>Status</th><th>Fee</th></tr></thead>
                <tbody>{apps.map(a => <tr key={a.id}>
                    <td><span style={{ fontWeight: 700, color: "#1e56c2", fontFamily: "monospace", fontSize: 12 }}>{a.id}</span></td>
                    <td style={{ fontWeight: 500 }}>{a.proponent}</td>
                    <td><span className="badge" style={{ background: "#eff6ff", color: "#2563eb", fontSize: 11 }}>{a.sector}</span></td>
                    <td style={{ fontSize: 13 }}>{a.category}</td>
                    <td style={{ maxWidth: 190, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>{a.project}</td>
                    <td><Badge t={a.status} /></td>
                    <td><span style={{ color: a.feesPaid ? "#059669" : "#dc2626", fontWeight: 600, fontSize: 12 }}>₹{a.fees.toLocaleString()} {a.feesPaid ? "✓" : "⚠"}</span></td>
                </tr>)}</tbody></table>
        </div>
    </div>
);
