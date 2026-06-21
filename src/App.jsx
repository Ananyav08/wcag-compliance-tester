import { useState, useCallback, useEffect } from 'react'
import './index.css'

// ─── Utility: Hex → RGB ───────────────────────────────────────────────────────
function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean
  const num = parseInt(full, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

// ─── Utility: Relative Luminance (WCAG formula) ───────────────────────────────
function relativeLuminance({ r, g, b }) {
  const channel = (c) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

// ─── Utility: Contrast Ratio ──────────────────────────────────────────────────
function contrastRatio(hex1, hex2) {
  const L1 = relativeLuminance(hexToRgb(hex1))
  const L2 = relativeLuminance(hexToRgb(hex2))
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

// ─── Sub-component: TapTargetValidator ───────────────────────────────────────
function TapTargetValidator() {
  const [width, setWidth] = useState(44)
  const [height, setHeight] = useState(44)
  const [paddingH, setPaddingH] = useState(0)
  const [paddingV, setPaddingV] = useState(0)

  const totalW = Number(width) + Number(paddingH) * 2
  const totalH = Number(height) + Number(paddingV) * 2
  const pass = totalW >= 44 && totalH >= 44
  const minDim = Math.min(totalW, totalH)

  const MAX_DISPLAY = 160
  const displayW = Math.min(totalW, MAX_DISPLAY)
  const displayH = Math.min(totalH, MAX_DISPLAY)
  const displayScale = Math.min(displayW / totalW, displayH / totalH, 1)

  return (
    <div className="glass-card glow-indigo rounded-2xl p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M9 9h6M9 15h6" />
          </svg>
        </div>
        <div>
          <span className="section-badge bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-1">Utility 01</span>
          <h2 className="text-lg font-bold text-white leading-tight">Tap Target Validator</h2>
          <p className="text-slate-400 text-sm mt-0.5">WCAG 2.5.5 — Minimum 44×44px interactive area</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Element Width', value: width, set: setWidth, unit: 'px' },
          { label: 'Element Height', value: height, set: setHeight, unit: 'px' },
          { label: 'Padding H (each side)', value: paddingH, set: setPaddingH, unit: 'px' },
          { label: 'Padding V (each side)', value: paddingV, set: setPaddingV, unit: 'px' },
        ].map(({ label, value, set, unit }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="500"
                value={value}
                onChange={e => set(e.target.value)}
                className="input-field w-full rounded-xl px-3 py-2.5 pr-10 text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">{unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual preview */}
      <div className="rounded-xl border border-white/5 bg-black/20 p-4 flex flex-col items-center gap-4">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Touch Area Preview</p>
        <div
          className={`touch-target-box flex items-center justify-center transition-all duration-300 ${pass ? 'pass' : 'fail'}`}
          style={{
            width: Math.max(displayW, 8),
            height: Math.max(displayH, 8),
            minWidth: 8,
            minHeight: 8,
          }}
        >
          <span className="text-xs font-mono text-slate-400 select-none">{totalW}×{totalH}</span>
        </div>
        <div className="flex gap-3 text-xs font-mono text-slate-500">
          <span>Total W: <span className="text-slate-300">{totalW}px</span></span>
          <span>•</span>
          <span>Total H: <span className="text-slate-300">{totalH}px</span></span>
        </div>
      </div>

      {/* Result badge */}
      <div className={`rounded-xl p-4 flex items-center gap-3 border badge-pulse ${pass
          ? 'bg-emerald-500/8 border-emerald-500/20'
          : 'bg-red-500/8 border-red-500/20'
        }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${pass ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
          {pass ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-bold ${pass ? 'text-emerald-400' : 'text-red-400'}`}>
            {pass ? '✓ PASS — Meets WCAG 2.5.5' : '✗ FAIL — Below WCAG 44px Minimum'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {pass
              ? `Interactive area of ${totalW}×${totalH}px meets the 44×44px requirement.`
              : `Current ${totalW}×${totalH}px area is too small. Minimum is 44×44px.`}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-component: ContrastCalculator ───────────────────────────────────────
function ContrastCalculator({ onContrastChange }) {
  const [textColor, setTextColor] = useState('#ffffff')
  const [bgColor, setBgColor] = useState('#1e1b4b')
  const [textHex, setTextHex] = useState('#ffffff')
  const [bgHex, setBgHex] = useState('#1e1b4b')

  const syncTextColor = (val) => { setTextColor(val); setTextHex(val) }
  const syncBgColor = (val) => { setBgColor(val); setBgHex(val) }

  const handleTextHex = (val) => {
    setTextHex(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) setTextColor(val)
  }
  const handleBgHex = (val) => {
    setBgHex(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) setBgColor(val)
  }

  const ratio = contrastRatio(textColor, bgColor)
  const ratioFixed = ratio.toFixed(2)
  const passAA = ratio >= 4.5
  const passAALarge = ratio >= 3.0
  const passAAA = ratio >= 7.0

  useEffect(() => {
    onContrastChange({ ratio: ratioFixed, passAA, passAALarge, textColor, bgColor })
  }, [ratio, textColor, bgColor])

  const maxRatio = 21
  const barPercent = Math.min((ratio / maxRatio) * 100, 100)
  const barColor = passAA ? '#10b981' : passAALarge ? '#f59e0b' : '#ef4444'

  return (
    <div className="glass-card glow-emerald rounded-2xl p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 0 20V2z" fill="#10b981" fillOpacity="0.2" />
          </svg>
        </div>
        <div>
          <span className="section-badge bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-1">Utility 02</span>
          <h2 className="text-lg font-bold text-white leading-tight">Contrast Ratio Calculator</h2>
          <p className="text-slate-400 text-sm mt-0.5">WCAG 1.4.3 — AA requires 4.5:1 (normal) / 3:1 (large)</p>
        </div>
      </div>

      {/* Color pickers */}
      <div className="grid grid-cols-2 gap-4">
        {/* Text Color */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Text Color</label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input type="color" value={textColor} onChange={e => syncTextColor(e.target.value)}
                className="rounded-lg border border-white/10 cursor-pointer"
                style={{ width: 44, height: 44 }}
                title="Pick text color"
              />
            </div>
            <input
              type="text"
              value={textHex}
              onChange={e => handleTextHex(e.target.value)}
              maxLength={7}
              className="input-field rounded-xl px-3 py-2.5 text-sm flex-1 font-mono"
              placeholder="#ffffff"
            />
          </div>
        </div>
        {/* Background Color */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Background Color</label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input type="color" value={bgColor} onChange={e => syncBgColor(e.target.value)}
                className="rounded-lg border border-white/10 cursor-pointer"
                style={{ width: 44, height: 44 }}
                title="Pick background color"
              />
            </div>
            <input
              type="text"
              value={bgHex}
              onChange={e => handleBgHex(e.target.value)}
              maxLength={7}
              className="input-field rounded-xl px-3 py-2.5 text-sm flex-1 font-mono"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div
        className="rounded-xl p-5 text-center transition-all duration-300 border border-white/5"
        style={{ backgroundColor: bgColor }}
      >
        <p className="text-xl font-bold mb-1 transition-colors duration-300" style={{ color: textColor }}>
          The quick brown fox
        </p>
        <p className="text-sm transition-colors duration-300" style={{ color: textColor, opacity: 0.8 }}>
          Sample body text — does this pass WCAG contrast requirements?
        </p>
      </div>

      {/* Ratio meter */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-300">Contrast Ratio</span>
          <span className="font-mono text-2xl font-bold text-white">{ratioFixed}<span className="text-slate-500 text-base font-normal">:1</span></span>
        </div>
        <div className="ratio-bar-track">
          <div className="ratio-bar-fill" style={{ width: `${barPercent}%`, backgroundColor: barColor }} />
        </div>
        <div className="flex justify-between text-xs text-slate-600 font-mono">
          <span>1:1</span>
          <span className="text-amber-600">3:1</span>
          <span className="text-emerald-600">4.5:1</span>
          <span className="text-blue-500">7:1</span>
          <span>21:1</span>
        </div>
      </div>

      {/* Level table */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { level: 'AA Normal', req: '4.5:1', pass: passAA },
          { level: 'AA Large', req: '3:1', pass: passAALarge },
          { level: 'AAA Normal', req: '7:1', pass: passAAA },
        ].map(({ level, req, pass }) => (
          <div key={level} className={`rounded-xl p-3 text-center border ${pass ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-red-500/8 border-red-500/20'}`}>
            <p className={`text-xs font-bold mb-1 ${pass ? 'text-emerald-400' : 'text-red-400'}`}>
              {pass ? '✓' : '✗'} {level}
            </p>
            <p className="text-xs font-mono text-slate-500">{req} min</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Sub-component: MarkdownExporter ─────────────────────────────────────────
function MarkdownExporter({ tapData, contrastData }) {
  const [copied, setCopied] = useState(false)
  const [exiting, setExiting] = useState(false)

  const generateMarkdown = () => {
    const now = new Date().toISOString().slice(0, 10)
    const tapPass = tapData.pass ? '✅ PASS' : '❌ FAIL'
    const contrastAAPass = contrastData.passAA ? '✅ PASS' : '❌ FAIL'
    const contrastLargePass = contrastData.passAALarge ? '✅ PASS' : '❌ FAIL'

    return `## ♿ WCAG 2.2 Accessibility Audit Report
> Generated on **${now}** via WCAG Heuristic Tester

---

### 🎯 Tap Target Size (WCAG 2.5.5)

| Metric | Value | Requirement | Status |
|--------|-------|-------------|--------|
| Total Width | \`${tapData.totalW}px\` | ≥ 44px | ${tapData.totalW >= 44 ? '✅ PASS' : '❌ FAIL'} |
| Total Height | \`${tapData.totalH}px\` | ≥ 44px | ${tapData.totalH >= 44 ? '✅ PASS' : '❌ FAIL'} |
| Overall | **${tapData.totalW}×${tapData.totalH}px** | 44×44px min | **${tapPass}** |

---

### 🎨 Contrast Ratio (WCAG 1.4.3)

| Metric | Value | Requirement | Status |
|--------|-------|-------------|--------|
| Text Color | \`${contrastData.textColor}\` | — | — |
| Background Color | \`${contrastData.bgColor}\` | — | — |
| Contrast Ratio | \`${contrastData.ratio}:1\` | — | — |
| AA Normal Text | 4.5:1 minimum | Current: ${contrastData.ratio}:1 | **${contrastAAPass}** |
| AA Large Text | 3:1 minimum | Current: ${contrastData.ratio}:1 | **${contrastLargePass}** |

---

### 📋 Summary

| Criterion | Status |
|-----------|--------|
| WCAG 2.5.5 Tap Target | ${tapPass} |
| WCAG 1.4.3 AA (Normal) | ${contrastAAPass} |
| WCAG 1.4.3 AA (Large) | ${contrastLargePass} |

> _Tested with [WCAG Heuristic Tester](https://digitalheroesco.com) — Built for Digital Heroes_`
  }

  const handleCopy = async () => {
    const md = generateMarkdown()
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => {
      setExiting(true)
      setTimeout(() => { setCopied(false); setExiting(false) }, 300)
    }, 2500)
  }

  return (
    <div className="glass-card glow-violet rounded-2xl p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
          </svg>
        </div>
        <div>
          <span className="section-badge bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-1">Utility 03</span>
          <h2 className="text-lg font-bold text-white leading-tight">Markdown Audit Exporter</h2>
          <p className="text-slate-400 text-sm mt-0.5">Copy a formatted Markdown table for GitHub PR descriptions</p>
        </div>
      </div>

      {/* Snapshot of current state */}
      <div className="rounded-xl border border-white/5 bg-black/20 p-4 flex flex-col gap-3">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-1">Current Snapshot</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center justify-between bg-white/3 rounded-lg px-3 py-2">
            <span className="text-slate-400 text-xs">Tap Target</span>
            <span className={`font-mono text-xs font-bold ${tapData.pass ? 'text-emerald-400' : 'text-red-400'}`}>
              {tapData.totalW}×{tapData.totalH}px
            </span>
          </div>
          <div className="flex items-center justify-between bg-white/3 rounded-lg px-3 py-2">
            <span className="text-slate-400 text-xs">Contrast</span>
            <span className={`font-mono text-xs font-bold ${contrastData.passAA ? 'text-emerald-400' : contrastData.passAALarge ? 'text-amber-400' : 'text-red-400'}`}>
              {contrastData.ratio}:1
            </span>
          </div>
          <div className="flex items-center justify-between bg-white/3 rounded-lg px-3 py-2">
            <span className="text-slate-400 text-xs">WCAG 2.5.5</span>
            <span className={`text-xs font-bold ${tapData.pass ? 'text-emerald-400' : 'text-red-400'}`}>
              {tapData.pass ? '✓ PASS' : '✗ FAIL'}
            </span>
          </div>
          <div className="flex items-center justify-between bg-white/3 rounded-lg px-3 py-2">
            <span className="text-slate-400 text-xs">WCAG 1.4.3 AA</span>
            <span className={`text-xs font-bold ${contrastData.passAA ? 'text-emerald-400' : 'text-red-400'}`}>
              {contrastData.passAA ? '✓ PASS' : '✗ FAIL'}
            </span>
          </div>
        </div>
      </div>

      {/* Markdown preview */}
      <div className="rounded-xl border border-white/5 bg-black/30 p-4 font-mono text-xs text-slate-400 leading-relaxed overflow-auto max-h-48 whitespace-pre-wrap select-text">
        {`## ♿ WCAG 2.2 Accessibility Audit Report
> Generated via WCAG Heuristic Tester

### 🎯 Tap Target (WCAG 2.5.5)
| Metric | Value | Status |
|--------|-------|--------|
| Total Area | ${tapData.totalW}×${tapData.totalH}px | ${tapData.pass ? '✅ PASS' : '❌ FAIL'} |

### 🎨 Contrast (WCAG 1.4.3)
| Level | Ratio | Status |
|-------|-------|--------|
| AA Normal | ${contrastData.ratio}:1 | ${contrastData.passAA ? '✅ PASS' : '❌ FAIL'} |
| AA Large  | ${contrastData.ratio}:1 | ${contrastData.passAALarge ? '✅ PASS' : '❌ FAIL'} |`}
      </div>

      {/* Copy button */}
      <button
        id="copy-markdown-btn"
        onClick={handleCopy}
        className="copy-btn w-full rounded-xl py-3.5 px-6 text-sm flex items-center justify-center gap-2.5 relative z-10"
      >
        {copied ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied to Clipboard!
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy Markdown to Clipboard
          </>
        )}
      </button>

      {/* Toast */}
      {copied && (
        <div className={`toast ${exiting ? 'toast-exit' : 'toast-enter'}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Markdown copied! Paste it in your GitHub PR.
        </div>
      )}
    </div>
  )
}

// ─── Main App Component ───────────────────────────────────────────────────────
export default function App() {
  // Tap target state (lifted so exporter can read it)
  const [tapState, setTapState] = useState({ totalW: 44, totalH: 44, pass: true })
  const [contrastState, setContrastState] = useState({
    ratio: '10.56',
    passAA: true,
    passAALarge: true,
    textColor: '#ffffff',
    bgColor: '#1e1b4b',
  })

  // We need to lift tap target values
  const [width, setWidth] = useState(44)
  const [height, setHeight] = useState(44)
  const [paddingH, setPaddingH] = useState(0)
  const [paddingV, setPaddingV] = useState(0)

  useEffect(() => {
    const totalW = Number(width) + Number(paddingH) * 2
    const totalH = Number(height) + Number(paddingV) * 2
    setTapState({ totalW, totalH, pass: totalW >= 44 && totalH >= 44 })
  }, [width, height, paddingH, paddingV])

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 50%, #0a0a0f 100%)' }}>
      {/* Background orbs */}
      <div className="orb" style={{ width: 600, height: 600, background: 'radial-gradient(circle, #4f46e5, transparent)', top: -200, left: -200 }} />
      <div className="orb" style={{ width: 500, height: 500, background: 'radial-gradient(circle, #7c3aed, transparent)', top: 300, right: -200 }} />
      <div className="orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, #0f766e, transparent)', bottom: 200, left: '30%' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 pb-0">
        {/* Hero Header */}
        <header className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 tracking-widest uppercase">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            WCAG 2.2 Compliance Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
            Accessibility{' '}
            <span className="shimmer-text">Heuristic</span>
            <br />
            Tester
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Three micro-utilities to validate WCAG 2.2 compliance — tap targets, contrast ratios, and instant audit exports.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-600">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Tap Target Validator</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Contrast Calculator</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500 inline-block" /> Markdown Exporter</span>
          </div>
        </header>

        {/* Grid Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tap Target - full width lifted version */}
          <div className="glass-card glow-indigo rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="M9 9h6M9 15h6" />
                </svg>
              </div>
              <div>
                <span className="section-badge bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-1">Utility 01</span>
                <h2 className="text-lg font-bold text-white leading-tight">Tap Target Validator</h2>
                <p className="text-slate-400 text-sm mt-0.5">WCAG 2.5.5 — Minimum 44×44px interactive area</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Element Width', value: width, set: setWidth },
                { label: 'Element Height', value: height, set: setHeight },
                { label: 'Padding H (each side)', value: paddingH, set: setPaddingH },
                { label: 'Padding V (each side)', value: paddingV, set: setPaddingV },
              ].map(({ label, value, set }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
                  <div className="relative">
                    <input
                      type="number" min="0" max="500"
                      value={value}
                      onChange={e => set(e.target.value)}
                      className="input-field w-full rounded-xl px-3 py-2.5 pr-10 text-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">px</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual preview */}
            <div className="rounded-xl border border-white/5 bg-black/20 p-4 flex flex-col items-center gap-4">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Touch Area Preview</p>
              <div
                className={`touch-target-box flex items-center justify-center transition-all duration-300 ${tapState.pass ? 'pass' : 'fail'}`}
                style={{
                  width: Math.min(Math.max(tapState.totalW, 8), 180),
                  height: Math.min(Math.max(tapState.totalH, 8), 180),
                }}
              >
                <span className="text-xs font-mono text-slate-400 select-none">{tapState.totalW}×{tapState.totalH}</span>
              </div>
              <div className="flex gap-3 text-xs font-mono text-slate-500">
                <span>Total W: <span className="text-slate-300">{tapState.totalW}px</span></span>
                <span>•</span>
                <span>Total H: <span className="text-slate-300">{tapState.totalH}px</span></span>
              </div>
            </div>

            <div className={`rounded-xl p-4 flex items-center gap-3 border badge-pulse ${tapState.pass ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-red-500/8 border-red-500/20'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tapState.pass ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                {tapState.pass ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${tapState.pass ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tapState.pass ? '✓ PASS — Meets WCAG 2.5.5' : '✗ FAIL (Below WCAG 44px Minimum)'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {tapState.pass
                    ? `${tapState.totalW}×${tapState.totalH}px area meets the 44×44px requirement.`
                    : `${tapState.totalW}×${tapState.totalH}px is too small. Increase size or padding.`}
                </p>
              </div>
            </div>
          </div>

          {/* Contrast Calculator */}
          <ContrastCalculator onContrastChange={setContrastState} />

          {/* Markdown Exporter – full width */}
          <div className="lg:col-span-2">
            <MarkdownExporter tapData={tapState} contrastData={contrastState} />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 py-10 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-white font-bold text-lg">Ananya Vishwakarma</p>
              <a
                href="mailto:[Your Email Here]"
                className="text-slate-400 text-sm hover:text-indigo-400 transition-colors"
              >
                anvishwakarma52@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 inline-block" />
              <span>WCAG 2.2 Heuristic Tester</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 inline-block" />
              <span>Open Source</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 inline-block" />
              <span>{new Date().getFullYear()}</span>
            </div>

            <a
              id="digital-heroes-btn"
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Built for Digital Heroes
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
