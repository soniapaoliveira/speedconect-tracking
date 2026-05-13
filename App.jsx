import { useState } from "react";

const SB_URL = "https://jypsucbjgtirxqkkesjt.supabase.co";
const SB_KEY = "sb_publishable_6vPQiyC-hjZzSKq15SaxoA_QUsWih29";

const STEPS = [
  { key: "arrived",    label: "Chegada ao Aeroporto", icon: "✈", desc: "Carga recebida no aeroporto" },
  { key: "weightOk",  label: "Volumes e Peso OK",     icon: "⚖", desc: "Volumes e peso verificados" },
  { key: "inspection", label: "Inspeção / Raio-X",    icon: "🔍", desc: "Controlo de segurança aprovado" },
  { key: "delivered",  label: "Carga Entregue",       icon: "📦", desc: "Carga entregue ao destinatário" },
];

const fmtDT = (iso) => !iso ? "—" : new Date(iso).toLocaleString("pt-PT", {
  day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit"
});

const CSS = `
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { background:#0d1117; color:#e2e8f0; font-family:'Inter',sans-serif; -webkit-font-smoothing:antialiased; min-height:100vh; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
  @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:none} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  .fade { animation:fadeUp .3s ease; }
  .inp { width:100%; background:#0d1117; border:1.5px solid #2d3748; border-radius:10px; color:#e2e8f0; padding:14px 16px; font-size:16px; font-family:'Inter',sans-serif; transition:border-color .15s,box-shadow .15s; letter-spacing:1px; }
  .inp:focus { outline:none; border-color:#5aab1e; box-shadow:0 0 0 3px rgba(90,171,30,.2); }
  .inp::placeholder { color:#4a5568; letter-spacing:0; }
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; border:none; border-radius:10px; padding:14px 24px; font-family:'Inter',sans-serif; font-size:16px; font-weight:700; transition:all .15s; user-select:none; }
  .btn:active { transform:scale(.97); }
  .btn:disabled { opacity:.4; cursor:not-allowed; }
  .bg { background:#5aab1e; color:#fff; box-shadow:0 4px 20px rgba(90,171,30,.35); }
  .spinner { width:36px; height:36px; border:3px solid #1e2a3a; border-top-color:#5aab1e; border-radius:50%; animation:spin .8s linear infinite; }
  .card { background:#161c2a; border:1px solid #1e2a3a; border-radius:14px; padding:22px; }
  .mono { font-family:'JetBrains Mono','Courier New',monospace; }
  .badge { display:inline-flex; align-items:center; gap:6px; padding:5px 14px; border-radius:20px; font-size:12px; font-weight:700; }
  .pbar { width:100%; height:6px; background:#1e2a3a; border-radius:3px; overflow:hidden; }
  .pfill { height:100%; border-radius:3px; transition:width .5s ease; }
  .step-done { background:rgba(46,204,113,.07); border-color:rgba(46,204,113,.35)!important; }
  .step-nao  { background:rgba(229,62,62,.07);  border-color:rgba(229,62,62,.35)!important; }
  .pgrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); gap:10px; }
  .pitem { border-radius:10px; overflow:hidden; aspect-ratio:1; cursor:pointer; }
  .pitem img { width:100%; height:100%; object-fit:cover; transition:transform .2s; }
  .pitem:active img { transform:scale(1.05); }
  .lbox { position:fixed; inset:0; z-index:9000; background:rgba(0,0,0,.95); display:flex; align-items:center; justify-content:center; padding:20px; }
  .lbox img { max-width:100%; max-height:90vh; border-radius:10px; object-fit:contain; }
  @media(max-width:500px) { .pgrid{grid-template-columns:repeat(3,1fr)} }
`;

function Logo({ size = 40 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="47" stroke="#5aab1e" strokeWidth="5" fill="#0a1a08"/>
        <circle cx="50" cy="50" r="35" fill="#112210"/>
        <ellipse cx="50" cy="50" rx="16" ry="35" stroke="#5aab1e" strokeWidth="1.5" fill="none" opacity="0.5"/>
        <line x1="15" y1="50" x2="85" y2="50" stroke="#5aab1e" strokeWidth="1.5" opacity="0.5"/>
        <path d="M17 32 Q50 22 83 32" stroke="#5aab1e" strokeWidth="1" fill="none" opacity="0.4"/>
        <path d="M17 68 Q50 78 83 68" stroke="#5aab1e" strokeWidth="1" fill="none" opacity="0.4"/>
        <ellipse cx="36" cy="44" rx="11" ry="8" fill="#5aab1e" opacity="0.85"/>
        <ellipse cx="62" cy="56" rx="9" ry="6" fill="#5aab1e" opacity="0.75"/>
        <ellipse cx="58" cy="38" rx="6" ry="4" fill="#5aab1e" opacity="0.6"/>
      </svg>
      <div style={{ lineHeight:1 }}>
        <div style={{ fontWeight:800, fontSize:size*.5, letterSpacing:1, color:"#f0f6e8" }}>
          <span style={{ color:"#78d832" }}>SPEED</span>CONECT
        </div>
        <div style={{ fontSize:size*.18, letterSpacing:1.5, color:"#3d6025", textTransform:"uppercase", marginTop:3 }}>
          Transportes Expresso e Logística
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ cargo }) {
  const hasNao = STEPS.some(s => cargo.status[s.key]?.answer === "nao");
  const allSim = STEPS.every(s => cargo.status[s.key]?.answer === "sim");
  const answered = STEPS.filter(s => cargo.status[s.key]).length;
  if (hasNao) return <span className="badge" style={{ background:"#3d1515", color:"#fc8181" }}>⚠ Problema detetado</span>;
  if (allSim) return <span className="badge" style={{ background:"#1a3d1a", color:"#68d391" }}>✓ Entregue</span>;
  if (answered === 0) return <span className="badge" style={{ background:"#2a1f0a", color:"#f6ad55" }}>⏳ A aguardar</span>;
  return <span className="badge" style={{ background:"#0d2040", color:"#63b3ed" }}>↗ Em trânsito</span>;
}

// ── SEARCH PAGE ───────────────────────────────────────────────
function SearchPage({ onFound }) {
  const [awb, setAwb] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    const q = awb.trim().toUpperCase();
    if (!q) return;
    setLoading(true);
    setError("");
    try {
      // Fetch cargo
      const res = await fetch(
        `${SB_URL}/rest/v1/sc_cargos?airway_bill=eq.${encodeURIComponent(q)}&select=*`,
        { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
      );
      const data = await res.json();
      if (!data || data.length === 0) {
        setError("Nenhuma carga encontrada com esse número. Verifique o AWB e tente novamente.");
        setLoading(false);
        return;
      }
      const cargo = data[0];
      // Fetch photos
      const resP = await fetch(
        `${SB_URL}/rest/v1/sc_photos?cargo_id=eq.${cargo.id}&select=*&order=created_at.asc`,
        { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
      );
      const photos = await resP.json();
      onFound(cargo, photos || []);
    } catch(e) {
      setError("Erro de ligação. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"radial-gradient(ellipse at 50% 0%, #0e2208 0%, #0d1117 55%)", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ padding:"30px 20px 0", display:"flex", justifyContent:"center" }}>
        <Logo size={44}/>
      </div>

      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px 20px 40px" }}>
        <div style={{ width:"100%", maxWidth:480 }} className="fade">

          {/* Hero */}
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ width:70, height:70, borderRadius:"50%", background:"rgba(90,171,30,.12)", border:"2px solid rgba(90,171,30,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, margin:"0 auto 20px" }}>
              📦
            </div>
            <h1 style={{ fontWeight:800, fontSize:28, lineHeight:1.2, marginBottom:10 }}>
              Rastreie a sua carga
            </h1>
            <p style={{ color:"#4a5568", fontSize:15, lineHeight:1.7 }}>
              Introduza o número da carta de porte (AWB)<br/>para consultar o estado da sua encomenda.
            </p>
          </div>

          {/* Search box */}
          <div className="card" style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#718096", marginBottom:8 }}>
              Número da Carta de Porte (AWB)
            </label>
            <div style={{ display:"flex", gap:10 }}>
              <input
                className="inp mono"
                value={awb}
                onChange={e => { setAwb(e.target.value.toUpperCase()); setError(""); }}
                placeholder="Ex: 012-34567890"
                onKeyDown={e => e.key === "Enter" && search()}
                style={{ flex:1 }}
                autoFocus
              />
              <button className="btn bg" onClick={search} disabled={loading || !awb.trim()} style={{ flexShrink:0, padding:"14px 20px" }}>
                {loading ? <div className="spinner" style={{ width:20, height:20, borderWidth:2 }}/> : "→"}
              </button>
            </div>
            {error && (
              <div style={{ marginTop:12, background:"rgba(229,62,62,.1)", border:"1px solid rgba(229,62,62,.25)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#fc8181", lineHeight:1.5 }}>
                ⚠ {error}
              </div>
            )}
            <div style={{ marginTop:12, fontSize:12, color:"#2d3748", lineHeight:1.6 }}>
              O número AWB foi fornecido pela SpeedConect no momento do envio da sua carga.
            </div>
          </div>

          {/* Steps preview */}
          <div className="card">
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#718096", marginBottom:14 }}>
              Etapas de rastreamento
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {STEPS.map((s, i) => (
                <div key={s.key} style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 0", borderBottom: i < STEPS.length-1 ? "1px solid #1e2a3a" : "none" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"#0d1117", border:"1.5px solid #2d3748", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14, color:"#a0aec0" }}>{s.label}</div>
                    <div style={{ fontSize:12, color:"#4a5568", marginTop:2 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign:"center", padding:"16px 20px 30px", borderTop:"1px solid #1e2a3a" }}>
        <div style={{ fontSize:12, color:"#2d3748" }}>© 2025 SpeedConect — Transportes Expresso e Logística</div>
        <div style={{ fontSize:11, color:"#1e2a3a", marginTop:4 }}>Para apoio contacte a SpeedConect</div>
      </div>
    </div>
  );
}

// ── RESULT PAGE ───────────────────────────────────────────────
function ResultPage({ cargo, photos, onBack }) {
  const [lbox, setLbox] = useState(null);
  const done = STEPS.filter(s => cargo.status[s.key]?.answer === "sim").length;
  const hasNao = STEPS.some(s => cargo.status[s.key]?.answer === "nao");
  const pct = Math.round((done / 4) * 100);
  const lastStep = [...STEPS].reverse().find(s => cargo.status[s.key]);

  const barColor = hasNao
    ? "linear-gradient(90deg,#e53e3e,#fc8181)"
    : done === 4
    ? "linear-gradient(90deg,#5aab1e,#78d832)"
    : "linear-gradient(90deg,#3182ce,#63b3ed)";

  return (
    <div style={{ minHeight:"100vh", background:"#0d1117" }}>
      {/* Top bar */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(13,17,23,.97)", backdropFilter:"blur(10px)", borderBottom:"1px solid #1e2a3a", padding:"10px 16px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ background:"transparent", border:"1px solid #2d3748", borderRadius:8, color:"#718096", padding:"7px 14px", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"Inter,sans-serif" }}>
          ← Nova pesquisa
        </button>
        <Logo size={26}/>
      </div>

      <div style={{ maxWidth:580, margin:"0 auto", padding:"20px 16px 50px" }} className="fade">

        {/* Summary card */}
        <div className="card" style={{ marginBottom:14, borderColor: hasNao ? "rgba(229,62,62,.35)" : done===4 ? "rgba(90,171,30,.35)" : "#1e2a3a" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap", marginBottom:16 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:22, marginBottom:4 }}>{cargo.client_name}</div>
              <div className="mono" style={{ color:"#4a5568", fontSize:13 }}>{cargo.airway_bill}</div>
            </div>
            <StatusBadge cargo={cargo}/>
          </div>

          {/* Stats row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
            {[["Volumes", cargo.volumes], ["Peso", `${cargo.peso} kg`], ["Progresso", `${done}/4`]].map(([k,v]) => (
              <div key={k} style={{ background:"#0d1117", borderRadius:10, padding:"10px 12px" }}>
                <div style={{ fontSize:10, color:"#4a5568", textTransform:"uppercase", letterSpacing:".07em", fontWeight:700 }}>{k}</div>
                <div className="mono" style={{ fontSize:18, fontWeight:700, marginTop:3 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#4a5568", marginBottom:6 }}>
              <span>{hasNao ? "⚠ Problema registado" : done===4 ? "✓ Processo concluído" : "Em processamento..."}</span>
              <span className="mono">{pct}%</span>
            </div>
            <div className="pbar" style={{ height:8 }}>
              <div className="pfill" style={{ width:`${pct}%`, background:barColor }}/>
            </div>
          </div>

          {lastStep && (
            <div style={{ marginTop:12, fontSize:12, color:"#4a5568" }}>
              Última atualização: <b style={{ color:"#a0aec0" }}>{lastStep.label}</b> — {fmtDT(cargo.status[lastStep.key]?.ts)}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="card" style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#718096", marginBottom:20 }}>
            Estado detalhado
          </div>
          <div style={{ position:"relative" }}>
            {/* Vertical line */}
            <div style={{ position:"absolute", left:19, top:20, bottom:20, width:2, background:"#1e2a3a" }}/>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {STEPS.map((step, i) => {
                const s = cargo.status[step.key];
                const isSim = s?.answer === "sim";
                const isNao = s?.answer === "nao";
                return (
                  <div key={step.key} style={{ display:"flex", gap:16, alignItems:"flex-start", position:"relative", zIndex:1, paddingBottom: i < 3 ? 24 : 0 }}>
                    <div style={{
                      width:40, height:40, borderRadius:"50%", flexShrink:0,
                      background: isSim ? "#5aab1e" : isNao ? "#9b2c2c" : "#161c2a",
                      border: `2px solid ${isSim ? "#5aab1e" : isNao ? "#e53e3e" : "#2d3748"}`,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:17,
                      boxShadow: isSim ? "0 0 16px rgba(90,171,30,.5)" : isNao ? "0 0 16px rgba(229,62,62,.4)" : "none",
                    }}>
                      {isSim ? "✓" : isNao ? "✗" : step.icon}
                    </div>
                    <div style={{ paddingTop:8, flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14, color: isSim ? "#78d832" : isNao ? "#fc8181" : "#4a5568" }}>
                        {step.label}
                      </div>
                      <div style={{ fontSize:12, color:"#2d3748", marginTop:3 }}>
                        {isSim ? fmtDT(s.ts) : isNao ? `⚠ ${s.note || "Problema registado"} — ${fmtDT(s.ts)}` : "Aguarda processamento"}
                      </div>
                    </div>
                    {isSim && <div style={{ color:"#5aab1e", fontSize:20, paddingTop:8, flexShrink:0 }}>✓</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Photos */}
        {photos.length > 0 && (
          <div className="card" style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#718096", marginBottom:14 }}>
              Fotos da carga ({photos.length})
            </div>
            <div className="pgrid">
              {photos.map((p, i) => (
                <div key={p.id||i} className="pitem" onClick={() => setLbox(p.data)}>
                  <img src={p.data} alt={`Foto ${i+1}`}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {cargo.notes && (
          <div className="card" style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#718096", marginBottom:10 }}>Observações</div>
            <div style={{ fontSize:14, color:"#a0aec0", lineHeight:1.7 }}>{cargo.notes}</div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign:"center", paddingTop:24, borderTop:"1px solid #1e2a3a" }}>
          <Logo size={32}/>
          <div style={{ fontSize:12, color:"#2d3748", marginTop:12 }}>
            Para mais informações contacte a SpeedConect
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lbox && (
        <div className="lbox" onClick={() => setLbox(null)}>
          <button onClick={() => setLbox(null)} style={{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,.1)", border:"none", color:"#fff", width:42, height:42, borderRadius:8, cursor:"pointer", fontSize:24 }}>×</button>
          <img src={lbox} alt="" onClick={e => e.stopPropagation()}/>
        </div>
      )}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────
export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div>
      <style>{CSS}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      {result
        ? <ResultPage cargo={result.cargo} photos={result.photos} onBack={() => setResult(null)}/>
        : <SearchPage onFound={(cargo, photos) => setResult({ cargo, photos })}/>
      }
    </div>
  );
}
