import { useState, useEffect } from "react";


const CSS_TRACK = `
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { background:#f4f6f8; color:#111; font-family:'Inter',sans-serif; -webkit-font-smoothing:antialiased; }
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .fade{animation:fadeUp .25s ease}
  .spinner{width:36px;height:36px;border:3px solid #e2e8ef;border-top-color:#5aab1e;border-radius:50%;animation:spin .8s linear infinite}
`;

function Logo() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <svg width={40} height={40} viewBox="0 0 100 100">
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
        <div style={{ fontWeight:800, fontSize:22, letterSpacing:1 }}>
          <span style={{ color:"#5aab1e" }}>SPEED</span><span style={{ color:"#111" }}>CONECT</span>
        </div>
        <div style={{ fontSize:9, letterSpacing:2, color:"#4a9010", textTransform:"uppercase", marginTop:2 }}>
          Transportes Expresso e Logística
        </div>
      </div>
    </div>
  );
}

const SB_URL = "https://jypsucbjgtirxqkkesjt.supabase.co";
const SB_KEY = "sb_publishable_6vPQiyC-hjZzSKq15SaxoA_QUsWih29";

const STEPS = [
  { key: "arrived",    label: "Chegada da Carga",             icon: "✈",  desc: "Carga recebida no aeroporto" },
  { key: "delivered",  label: "Entrega da Carga",             icon: "📦", desc: "Carga entregue no local" },
  { key: "weightOk",  label: "Confirmação de Peso e Volumes", icon: "⚖",  desc: "Peso e volumes verificados" },
  { key: "inspection", label: "Inspeção / Raio-X",            icon: "🔍", desc: "Controlo de segurança aprovado" },
  { key: "documents",  label: "Entrega de Documentos Finais", icon: "📄", desc: "Documentação entregue ao cliente" },
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
          <span style={{ color:"#4a9010" }}>SPEED</span>CONECT
        </div>
        <div style={{ fontSize:size*.18, letterSpacing:1.5, color:"#4a9010", textTransform:"uppercase", marginTop:3 }}>
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
  if (allSim) return <span className="badge" style={{ background:"#1a3d1a", color:"#16a34a" }}>✓ Entregue</span>;
  if (answered === 0) return <span className="badge" style={{ background:"#2a1f0a", color:"#f6ad55" }}>⏳ A aguardar</span>;
  return <span className="badge" style={{ background:"#0d2040", color:"#63b3ed" }}>↗ Em trânsito</span>;
}

// ── SEARCH PAGE ───────────────────────────────────────────────
function SearchPage({ client, onLogout, onFound }) {
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
      // Fetch cargo by AWB
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
      // SECURITY: strict check - cargo client_name must match company_name exactly
      if (client?.company_name) {
        const cargoName = (cargo.client_name || "").toLowerCase().trim();
        const accountName = (client.company_name || "").toLowerCase().trim();
        if (cargoName !== accountName) {
          setError("Nenhuma carga encontrada com esse número.");
          setLoading(false);
          return;
        }
      }
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
    <div style={{ minHeight:"100vh", background:"linear-gradient(180deg,#f0fae8 0%,#f4f6f8 50%)", display:"flex", flexDirection:"column" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"/>
      {/* Header */}
      <div style={{ padding:"30px 20px 0", display:"flex", justifyContent:"center" }}>
        <Logo size={44}/>
      </div>

      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px 20px 40px" }}>
        <div style={{ width:"100%", maxWidth:480 }} className="fade">

          {/* Hero */}
          {/* Welcome bar */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,padding:"12px 16px",background:"#fff",borderRadius:10,border:"1px solid #e2e8ef",boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
            <div>
              <div style={{ fontWeight:700,fontSize:15,color:"#111" }}>Olá, {client?.company_name}! 👋</div>
              <div style={{ fontSize:12,color:"#888",marginTop:2 }}>Só vê as suas cargas</div>
            </div>
            <button onClick={onLogout} style={{ background:"transparent",border:"1px solid #d1d8e0",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,color:"#555",fontFamily:"Inter,sans-serif" }}>Sair</button>
          </div>

          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ width:70, height:70, borderRadius:"50%", background:"rgba(90,171,30,.12)", border:"2px solid rgba(90,171,30,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, margin:"0 auto 20px" }}>
              📦
            </div>
            <h1 style={{ fontWeight:800, fontSize:26, lineHeight:1.2, marginBottom:10, color:"#111" }}>
              Rastreie a sua carga
            </h1>
            <p style={{ color:"#555", fontSize:14, lineHeight:1.7 }}>
              Introduza o número da carta de porte (AWB)<br/>para consultar o estado da sua encomenda.
            </p>
          </div>

          {/* Search box */}
          <div className="card" style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#555", marginBottom:8 }}>
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
            <div style={{ marginTop:12, fontSize:12, color:"#888", lineHeight:1.6 }}>
              O número AWB foi fornecido pela SpeedConect no momento do envio da sua carga.
            </div>
          </div>

          {/* Steps preview */}
          <div className="card">
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#555", marginBottom:14 }}>
              Etapas de rastreamento
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {STEPS.map((s, i) => (
                <div key={s.key} style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 0", borderBottom: i < STEPS.length-1 ? "1px solid #1e2a3a" : "none" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"#f4f6f8", border:"1.5px solid #2d3748", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14, color:"#333" }}>{s.label}</div>
                    <div style={{ fontSize:12, color:"#555", marginTop:2 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign:"center", padding:"16px 20px 30px", borderTop:"1px solid #1e2a3a" }}>
        <div style={{ fontSize:12, color:"#888" }}>© 2025 SpeedConect — Transportes Expresso e Logística</div>
        <div style={{ fontSize:11, color:"#1e2a3a", marginTop:4 }}>Para apoio contacte a SpeedConect</div>
      </div>
    </div>
  );
}

// ── RESULT PAGE ───────────────────────────────────────────────
function ResultPage({ cargo, photos, client, onLogout, onBack }) {
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
    <div style={{ minHeight:"100vh", background:"#f4f6f8" }}>
      {/* Top bar */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(255,255,255,.97)", backdropFilter:"blur(10px)", borderBottom:"1px solid #e2e8ef", padding:"10px 16px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ background:"transparent", border:"1px solid #2d3748", borderRadius:8, color:"#555", padding:"7px 14px", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"Inter,sans-serif" }}>
          ← Nova pesquisa
        </button>
        <Logo size={26}/>
      </div>

      <div style={{ maxWidth:580, margin:"0 auto", padding:"20px 16px 50px" }} className="fade">

        {/* Summary card */}
        <div className="card" style={{ marginBottom:14, borderColor: hasNao ? "rgba(229,62,62,.35)" : done===5 ? "rgba(90,171,30,.35)" : "#1e2a3a" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap", marginBottom:16 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:22, marginBottom:4 }}>{cargo.client_name}</div>
              <div className="mono" style={{ color:"#555", fontSize:13 }}>{cargo.airway_bill}</div>
            </div>
            <StatusBadge cargo={cargo}/>
          </div>

          {/* Stats row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
            {[["Volumes", cargo.volumes], ["Peso", `${cargo.peso} kg`], ["Progresso", `${done}/4`]].map(([k,v]) => (
              <div key={k} style={{ background:"#f4f6f8", borderRadius:10, padding:"10px 12px" }}>
                <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:".07em", fontWeight:700 }}>{k}</div>
                <div className="mono" style={{ fontSize:18, fontWeight:700, marginTop:3 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#555", marginBottom:6 }}>
              <span>{hasNao ? "⚠ Problema registado" : done===5 ? "✓ Processo concluído" : "Em processamento..."}</span>
              <span className="mono">{pct}%</span>
            </div>
            <div className="pbar" style={{ height:8 }}>
              <div className="pfill" style={{ width:`${pct}%`, background:barColor }}/>
            </div>
          </div>

          {lastStep && (
            <div style={{ marginTop:12, fontSize:12, color:"#555" }}>
              Última atualização: <b style={{ color:"#333" }}>{lastStep.label}</b> — {fmtDT(cargo.status[lastStep.key]?.ts)}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="card" style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#555", marginBottom:20 }}>
            Estado detalhado
          </div>
          <div style={{ position:"relative" }}>
            {/* Vertical line */}
            <div style={{ position:"absolute", left:19, top:20, bottom:20, width:2, background:"#f0f4f8" }}/>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {STEPS.map((step, i) => {
                const s = cargo.status[step.key];
                const isSim = s?.answer === "sim";
                const isNao = s?.answer === "nao";
                const history = s?.history || [];
                const hadProblems = history.some(h => h.answer === "nao");
                return (
                  <div key={step.key} style={{ position:"relative", zIndex:1, paddingBottom: i < 3 ? 24 : 0 }}>
                    <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
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
                          {isSim && hadProblems && <span style={{ marginLeft:8, fontSize:11, color:"#f6e05e", fontWeight:600 }}>⚠ corrigido</span>}
                        </div>
                        <div style={{ fontSize:12, color:"#555", marginTop:3 }}>
                          {!s && "Aguarda processamento"}
                          {isSim && fmtDT(s.ts)}
                          {isNao && fmtDT(s.ts)}
                        </div>

                        {/* Motivo do NÃO atual */}
                        {isNao && s.note && (
                          <div style={{ marginTop:8, background:"rgba(229,62,62,.1)", border:"1px solid rgba(229,62,62,.25)", borderRadius:8, padding:"10px 12px", fontSize:13, color:"#fc8181" }}>
                            ⚠ <b>Motivo:</b> {s.note}
                          </div>
                        )}
                        {isNao && !s.note && (
                          <div style={{ marginTop:8, background:"rgba(229,62,62,.1)", border:"1px solid rgba(229,62,62,.25)", borderRadius:8, padding:"10px 12px", fontSize:13, color:"#fc8181" }}>
                            ⚠ Problema registado — aguarda resolução
                          </div>
                        )}

                        {/* Nota do SIM (se houver) */}
                        {isSim && s.note && (
                          <div style={{ marginTop:8, background:"rgba(255,193,7,.06)", border:"1px solid rgba(255,193,7,.2)", borderRadius:8, padding:"10px 12px", fontSize:13, color:"#f6e05e" }}>
                            📋 {s.note}
                          </div>
                        )}

                        {/* Histórico de problemas anteriores */}
                        {isSim && hadProblems && (
                          <div style={{ marginTop:8, background:"rgba(255,193,7,.04)", border:"1px solid rgba(255,193,7,.15)", borderRadius:8, padding:"10px 12px" }}>
                            <div style={{ fontSize:11, fontWeight:700, color:"#f6e05e", marginBottom:6, textTransform:"uppercase", letterSpacing:".05em" }}>Histórico desta etapa</div>
                            {history.filter(h=>h.answer==="nao").map((h,idx)=>(
                              <div key={idx} style={{ fontSize:12, color:"#555", marginBottom:4 }}>
                                ✗ Problema em {fmtDT(h.ts)}{h.note ? ` — "${h.note}"` : ""}
                              </div>
                            ))}
                            <div style={{ fontSize:12, color:"#16a34a", marginTop:4 }}>
                              ✓ Resolvido em {fmtDT(s.ts)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Photos */}
        {photos.length > 0 && (
          <div className="card" style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#555", marginBottom:14 }}>
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
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#555", marginBottom:10 }}>Observações</div>
            <div style={{ fontSize:14, color:"#333", lineHeight:1.7 }}>{cargo.notes}</div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign:"center", paddingTop:24, borderTop:"1px solid #1e2a3a" }}>
          <Logo size={32}/>
          <div style={{ fontSize:12, color:"#888", marginTop:12 }}>
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
// ── Change Password Page ────────────────────────────────────
function ChangePasswordPage({ client, onChanged }) {
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!pwd1.trim()) { setError("Insira a nova senha."); return; }
    if (pwd1.length < 4) { setError("A senha deve ter pelo menos 4 caracteres."); return; }
    if (pwd1 !== pwd2) { setError("As senhas não coincidem."); return; }
    setLoading(true);
    try {
      await fetch(`${SB_URL}/rest/v1/sc_clients?id=eq.${client.id}`, {
        method: "PATCH",
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" },
        body: JSON.stringify({ password: pwd1, must_change_password: false })
      });
      const updated = { ...client, password: pwd1, must_change_password: false };
      try { localStorage.setItem("sc_client", JSON.stringify(updated)); } catch {}
      onChanged(updated);
    } catch { setError("Erro ao guardar. Tente novamente."); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(180deg,#f0fae8 0%,#f4f6f8 40%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <div style={{ textAlign:"center", marginBottom:30 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔑</div>
          <h1 style={{ fontWeight:800, fontSize:22, color:"#111", marginBottom:8 }}>Defina a sua senha</h1>
          <p style={{ color:"#555", fontSize:14, lineHeight:1.6 }}>Bem-vindo(a), <b>{client.company_name}</b>!<br/>Por segurança, defina uma senha pessoal.</p>
        </div>
        <div style={{ background:"#fff", border:"1px solid #e2e8ef", borderRadius:14, padding:24, boxShadow:"0 2px 12px rgba(0,0,0,.07)" }}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#555", marginBottom:6 }}>Nova senha</label>
            <input style={{ width:"100%", background:"#f8fafc", border:"1.5px solid #d1d8e0", borderRadius:8, color:"#111", padding:"12px 14px", fontSize:15, fontFamily:"Inter,sans-serif", outline:"none", boxSizing:"border-box" }}
              type="password" value={pwd1} onChange={e=>setPwd1(e.target.value)} placeholder="Mínimo 4 caracteres"
              onFocus={e=>e.target.style.borderColor="#5aab1e"} onBlur={e=>e.target.style.borderColor="#d1d8e0"}/>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#555", marginBottom:6 }}>Confirmar senha</label>
            <input style={{ width:"100%", background:"#f8fafc", border:"1.5px solid #d1d8e0", borderRadius:8, color:"#111", padding:"12px 14px", fontSize:15, fontFamily:"Inter,sans-serif", outline:"none", boxSizing:"border-box" }}
              type="password" value={pwd2} onChange={e=>setPwd2(e.target.value)} placeholder="Repita a nova senha"
              onKeyDown={e=>e.key==="Enter"&&save()}
              onFocus={e=>e.target.style.borderColor="#5aab1e"} onBlur={e=>e.target.style.borderColor="#d1d8e0"}/>
          </div>
          {error && <div style={{ background:"#fff5f5", border:"1px solid #fca5a5", borderRadius:8, padding:"10px 12px", fontSize:13, color:"#dc2626", marginBottom:14 }}>⚠ {error}</div>}
          <button onClick={save} disabled={loading} style={{ width:"100%", background:"#5aab1e", color:"#fff", border:"none", borderRadius:10, padding:"14px", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 2px 12px rgba(90,171,30,.3)" }}>
            {loading ? "A guardar..." : "Guardar e Entrar →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Login Page ─────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!username.trim() || !password.trim()) { setError("Preencha todos os campos."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${SB_URL}/rest/v1/sc_clients?username=eq.${encodeURIComponent(username.toLowerCase().trim())}&select=*`, {
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
      });
      const data = await res.json();
      if (!data || data.length === 0) { setError("Utilizador não encontrado."); setLoading(false); return; }
      const client = data[0];
      if (client.password !== password) { setError("Senha incorreta."); setLoading(false); return; }
      try { localStorage.setItem("sc_client", JSON.stringify(client)); } catch {}
      onLogin(client);
    } catch { setError("Erro de ligação. Tente novamente."); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(180deg,#f0fae8 0%,#f4f6f8 40%)", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"28px 20px 0", display:"flex", justifyContent:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <svg width={44} height={44} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="47" stroke="#5aab1e" strokeWidth="5" fill="#0a1a08"/>
            <circle cx="50" cy="50" r="35" fill="#112210"/>
            <ellipse cx="50" cy="50" rx="16" ry="35" stroke="#5aab1e" strokeWidth="1.5" fill="none" opacity="0.5"/>
            <line x1="15" y1="50" x2="85" y2="50" stroke="#5aab1e" strokeWidth="1.5" opacity="0.5"/>
            <ellipse cx="36" cy="44" rx="11" ry="8" fill="#5aab1e" opacity="0.85"/>
            <ellipse cx="62" cy="56" rx="9" ry="6" fill="#5aab1e" opacity="0.75"/>
          </svg>
          <div>
            <div style={{ fontWeight:800, fontSize:22, letterSpacing:1 }}><span style={{ color:"#5aab1e" }}>SPEED</span>CONECT</div>
            <div style={{ fontSize:10, color:"#4a9010", textTransform:"uppercase", letterSpacing:2 }}>Portal do Cliente</div>
          </div>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px 20px 40px" }}>
        <div style={{ width:"100%", maxWidth:400 }}>
          <div style={{ textAlign:"center", marginBottom:30 }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔐</div>
            <h1 style={{ fontWeight:800, fontSize:24, color:"#111", marginBottom:8 }}>Acesso ao Portal</h1>
            <p style={{ color:"#555", fontSize:14 }}>Entre com as credenciais fornecidas pela SpeedConect</p>
          </div>
          <div style={{ background:"#fff", border:"1px solid #e2e8ef", borderRadius:14, padding:24, boxShadow:"0 2px 12px rgba(0,0,0,.07)" }}>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#555", marginBottom:6 }}>Nome de utilizador</label>
              <input style={{ width:"100%", background:"#f8fafc", border:"1.5px solid #d1d8e0", borderRadius:8, color:"#111", padding:"12px 14px", fontSize:15, fontFamily:"Inter,sans-serif", outline:"none" }}
                value={username} onChange={e=>setUsername(e.target.value.toLowerCase())} placeholder="Ex: rangel" autoFocus
                onFocus={e=>e.target.style.borderColor="#5aab1e"} onBlur={e=>e.target.style.borderColor="#d1d8e0"}/>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"#555", marginBottom:6 }}>Senha</label>
              <input style={{ width:"100%", background:"#f8fafc", border:"1.5px solid #d1d8e0", borderRadius:8, color:"#111", padding:"12px 14px", fontSize:15, fontFamily:"Inter,sans-serif", outline:"none" }}
                type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"
                onKeyDown={e=>e.key==="Enter"&&login()}
                onFocus={e=>e.target.style.borderColor="#5aab1e"} onBlur={e=>e.target.style.borderColor="#d1d8e0"}/>
            </div>
            {error && <div style={{ background:"#fff5f5", border:"1px solid #fca5a5", borderRadius:8, padding:"10px 12px", fontSize:13, color:"#dc2626", marginBottom:14 }}>⚠ {error}</div>}
            <button onClick={login} disabled={loading} style={{ width:"100%", background:"#5aab1e", color:"#fff", border:"none", borderRadius:10, padding:"14px", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 2px 12px rgba(90,171,30,.3)" }}>
              {loading ? "A entrar..." : "Entrar →"}
            </button>
          </div>
          <div style={{ textAlign:"center", marginTop:16, fontSize:12, color:"#888" }}>
            Problemas de acesso? Contacte a SpeedConect.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [client, setClient] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(()=>{
    try { const saved=localStorage.getItem("sc_client"); if(saved) setClient(JSON.parse(saved)); } catch {}
  },[]);

  const logout = () => {
    try { localStorage.clear(); } catch {}
    window.location.reload(true);
  };

  if (!client) return <LoginPage onLogin={c=>{ setClient(c); setResult(null); }}/>;

  // First login - must change password
  if (client.must_change_password) {
    return <ChangePasswordPage client={client} onChanged={c=>{ setClient(c); setResult(null); }}/>;
  }

  return (
    <div>
      <style>{CSS}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      {result
        ? <ResultPage cargo={result.cargo} photos={result.photos} client={client} onLogout={logout} onBack={() => setResult(null)}/>
        : <SearchPage client={client} onLogout={logout} onFound={(cargo, photos) => setResult({ cargo, photos })}/>
      }
    </div>
  );
}
