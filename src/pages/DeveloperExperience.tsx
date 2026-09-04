import { useState } from 'react'
import type { NavigateFn } from '../App'
import HeroSpotlight from '../components/HeroSpotlight'

interface Props { navigate: NavigateFn }

const dashboardRoutes = [
  { route: '/', label: 'Overview', desc: 'Failure trends, recent heals, active rules summary, system health' },
  { route: '/failures', label: 'Failures', desc: 'Paginated failure list with detail modal — route, category, payload context' },
  { route: '/analysis', label: 'HITL Queue', desc: 'Pending proposals with Venn-Abers confidence, approve/reject, SSE chat synthesis' },
  { route: '/rules', label: 'Active Rules', desc: 'Rules by type — schema, routing, CORS, origin override, DSL programs' },
  { route: '/services', label: 'Services', desc: 'Service registration, OpenAPI/manifest import, upstream instance management' },
  { route: '/portal', label: 'Developer Portal', desc: 'Catalog, API specs, self-service keys, usage analytics, AI route config' },
  { route: '/simulate', label: 'Simulate', desc: 'Pre-built failure scenarios for demos and team training' },
  { route: '/audit', label: 'Audit', desc: 'Deploy/approve/disable history — immutable log for compliance' },
]

type Screen = 'overview' | 'analysis' | 'chat'

export default function DeveloperExperience({ navigate }: Props) {
  const [activeScreen, setActiveScreen] = useState<Screen>('analysis')

  const screens: Record<Screen, React.ReactNode> = {
    overview: (
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Active rules', value: '12', delta: '+2 today' },
            { label: 'Healed (7d)', value: '34', delta: '94% approval rate' },
            { label: 'Pending', value: '2', delta: 'Awaiting review' },
          ].map(stat => (
            <div key={stat.label} className="bg-canvas border border-rule rounded-lg p-3">
              <div className="text-lg font-bold text-brand">{stat.value}</div>
              <div className="text-[10px] text-on-surface">{stat.label}</div>
              <div className="text-[10px] text-dim">{stat.delta}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="text-[10px] font-semibold text-dim uppercase tracking-wide mb-2">Recent heals</div>
          {[
            { time: '2m ago', route: 'inventory→shipping', op: 'rename /mag_sent', status: 'healed' },
            { time: '1h ago', route: 'payment→billing', op: 'coerce /amount', status: 'healed' },
            { time: '3h ago', route: 'bff→catalog', op: 'CORS allow', status: 'healed' },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-overlay last:border-0">
              <div className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0"></div>
              <span className="text-[10px] text-dim w-10 flex-shrink-0">{row.time}</span>
              <span className="text-[10px] font-mono text-on-surface flex-1">{row.route}</span>
              <span className="text-[10px] font-mono text-brand">{row.op}</span>
            </div>
          ))}
        </div>
      </div>
    ),

    analysis: (
      <div className="p-5 space-y-3">
        <div className="text-[10px] font-semibold text-dim uppercase tracking-wide">Pending approval — 2 proposals</div>
        {[
          { route: 'inventory→shipping POST /ship', op: 'rename /mag_sent → /tag_sent', confidence: 94, label: 'High' },
          { route: 'payment→billing POST /charge', op: 'coerce /amount string→number', confidence: 71, label: 'Moderate' },
        ].map((item, i) => (
          <div key={i} className="bg-surface border border-rule rounded-xl p-4">
            <div className="text-[10px] font-mono text-brand mb-1">{item.route}</div>
            <div className="text-xs font-semibold text-on-surface mb-2">{item.op}</div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-1.5 bg-overlay rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.confidence}%`, backgroundColor: item.confidence > 90 ? '#22C55E' : '#F59E0B' }}></div>
              </div>
              <span className={`text-[10px] font-bold ${item.confidence > 90 ? 'text-success' : 'text-[#F59E0B]'}`}>{item.confidence}%</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.confidence > 90 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>{item.label}</span>
            </div>
            <div className="flex gap-2">
              <button className="text-[10px] bg-brand text-white font-bold px-3 py-1.5 rounded-md">Approve</button>
              <button className="text-[10px] border border-rule text-dim px-3 py-1.5 rounded-md">Reject</button>
              <button className="text-[10px] text-brand px-2 py-1.5">Chat →</button>
            </div>
          </div>
        ))}
      </div>
    ),

    chat: (
      <div className="p-5 flex flex-col gap-3 h-full">
        <div className="text-[10px] font-semibold text-dim uppercase tracking-wide">Chat synthesis — analysis #1247</div>
        <div className="flex-1 space-y-3 min-h-0">
          <div className="flex gap-2">
            <div className="w-5 h-5 rounded-full bg-rule flex items-center justify-center text-[8px] flex-shrink-0">👤</div>
            <div className="bg-canvas border border-rule rounded-lg p-2.5 text-[10px] text-on-surface max-w-[80%]">
              Can you also strip the legacy_id field from the request while renaming?
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <div className="bg-sky rounded-lg p-2.5 text-[10px] text-brand max-w-[85%]">
              <div className="font-semibold mb-1">Updated proposal (verified ✓):</div>
              <pre className="font-mono text-[9px] text-[#1E3A5F] bg-white/50 rounded p-2 whitespace-pre">
{`ops:
  - op: rename
    from: /mag_sent
    to: /tag_sent
  - op: remove
    path: /legacy_id`}
              </pre>
              <div className="mt-1.5 text-[#1E3A5F] opacity-70">2 ops. Java+Lua verified. 5/5 simulation samples pass.</div>
            </div>
            <div className="w-5 h-5 rounded-full bg-sky flex items-center justify-center text-[8px] flex-shrink-0">AI</div>
          </div>
        </div>
        <div className="flex gap-2 mt-auto">
          <input className="flex-1 text-[10px] border border-rule rounded-lg px-3 py-2 bg-surface" placeholder="Ask about this proposal..." readOnly />
          <button className="bg-brand text-white text-[10px] px-3 py-2 rounded-lg font-semibold">Send</button>
        </div>
      </div>
    ),
  }

  return (
    <div>
      {/* Header */}
      <HeroSpotlight className="border-b border-rule py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">Platform</div>
          <h1 className="font-[family-name:var(--font-display)] font-bold text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] tracking-tight text-on-surface mb-5">
            Operator dashboard & developer portal
          </h1>
          <p className="text-lg text-dim leading-relaxed max-w-2xl mx-auto">
            A React dashboard (port 3000) for operators to review proposals, manage services, monitor the healing loop, and access the developer portal.
          </p>
        </div>
      </HeroSpotlight>

      {/* Dashboard mockup */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Sidebar */}
            <div className="lg:col-span-2">
              <h2 className="font-[family-name:var(--font-display)] font-bold text-xl tracking-tight text-on-surface mb-5">
                Dashboard routes
              </h2>
              <div className="space-y-2">
                {dashboardRoutes.map(route => (
                  <div key={route.route} className="flex items-start gap-3 bg-surface border border-rule rounded-lg p-3.5">
                    <span className="font-mono text-xs text-brand font-semibold min-w-[60px]">{route.route}</span>
                    <div>
                      <div className="text-xs font-semibold text-on-surface">{route.label}</div>
                      <div className="text-[10px] text-dim mt-0.5 leading-relaxed">{route.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live mockup */}
            <div className="lg:col-span-3">
              <div className="bg-surface border border-rule rounded-2xl overflow-hidden shadow-sm">
                {/* Browser chrome */}
                <div className="bg-canvas border-b border-rule px-4 py-2.5 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-warning"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
                  </div>
                  <div className="flex-1 bg-surface border border-rule rounded-md px-3 py-1 text-[10px] text-dim font-mono">
                    localhost:3000/{activeScreen === 'overview' ? '' : activeScreen === 'analysis' ? 'analysis' : 'analysis/1247'}
                  </div>
                </div>

                {/* App chrome */}
                <div className="flex">
                  {/* Sidebar nav */}
                  <div className="w-14 bg-ink flex flex-col items-center py-4 gap-3 flex-shrink-0">
                    <div className="w-7 h-7 bg-cream rounded-lg flex items-center justify-center mb-3">
                      <span className="text-ink font-bold text-[10px]">M</span>
                    </div>
                    {[
                      { id: 'overview' as Screen, icon: '◈', label: 'Overview' },
                      { id: 'analysis' as Screen, icon: '◉', label: 'Analysis' },
                      { id: 'chat' as Screen, icon: '◎', label: 'Chat' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActiveScreen(item.id)}
                        title={item.label}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors
                          ${activeScreen === item.id ? 'bg-surface/15 text-white' : 'text-dim hover:text-white'}`}
                      >
                        {item.icon}
                      </button>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-h-[400px] overflow-auto">
                    <div key={activeScreen} className="animate-fade-in h-full">
                      {screens[activeScreen]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Screen switcher */}
              <div className="flex gap-2 mt-3">
                {(['overview', 'analysis', 'chat'] as Screen[]).map(screen => (
                  <button
                    key={screen}
                    onClick={() => setActiveScreen(screen)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors capitalize
                      ${activeScreen === screen ? 'bg-brand text-white' : 'bg-surface border border-rule text-dim hover:text-on-surface'}`}
                  >
                    {screen}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer portal */}
      <section className="bg-surface border-y border-rule py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Developer Portal</div>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl tracking-tight text-on-surface mb-4">
                Self-service for API consumers
              </h2>
              <p className="text-dim leading-relaxed mb-5">
                The developer portal exposes service catalog, OpenAPI specs, self-service API keys, usage analytics, and AI route configuration — all behind per-tenant WorkOS authentication.
              </p>
              <div className="space-y-3">
                {[
                  { endpoint: 'GET /api/portal/catalog', desc: 'Browse available services and their contracts' },
                  { endpoint: 'GET /api/portal/specs/{name}', desc: 'Fetch OpenAPI spec for a registered service' },
                  { endpoint: 'POST /api/portal/keys', desc: 'Self-service API key generation and rotation' },
                  { endpoint: 'GET /api/portal/usage', desc: 'Per-tenant usage analytics and metering data' },
                  { endpoint: 'GET /api/portal/ai-routes', desc: 'AI gateway route configuration and limits' },
                ].map(item => (
                  <div key={item.endpoint} className="flex items-start gap-3">
                    <span className="font-mono text-[10px] bg-overlay text-on-surface px-2 py-0.5 rounded flex-shrink-0 mt-0.5">{item.endpoint}</span>
                    <span className="text-xs text-dim">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-canvas border border-rule rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="text-xs font-semibold text-on-surface">Service catalog</div>
                <div className="text-[10px] bg-sky text-sky-ink px-2.5 py-1 rounded-full font-semibold">4 services</div>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'inventory-service', version: 'v2.4', status: 'healthy', endpoints: 12 },
                  { name: 'payment-api', version: 'v1.9', status: 'healthy', endpoints: 8 },
                  { name: 'shipping-gateway', version: 'v3.1', status: 'healing', endpoints: 15 },
                  { name: 'billing-platform', version: 'v1.2', status: 'healthy', endpoints: 6 },
                ].map(svc => (
                  <div key={svc.name} className="flex items-center gap-3 bg-surface border border-rule rounded-lg p-3.5">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${svc.status === 'healthy' ? 'bg-success' : 'bg-warning animate-pulse-slow'}`}></div>
                    <div className="flex-1">
                      <div className="text-xs font-mono font-semibold text-on-surface">{svc.name}</div>
                      <div className="text-[10px] text-dim">{svc.endpoints} endpoints</div>
                    </div>
                    <span className="text-[10px] bg-overlay text-dim px-2 py-0.5 rounded font-mono">{svc.version}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: 'WorkOS AuthKit', desc: 'SSO and enterprise auth for operator dashboard when REACT_APP_WORKOS_CLIENT_ID configured. Transparent dev passthrough when not.', icon: '🔐' },
              { title: 'Per-tenant API keys', desc: 'Edges authenticate with <prefix>.<secret> format. sha256 hashed at rest. Admin rotation via POST /api/internal/admin/api-keys.', icon: '🗝️' },
              { title: 'SSE streaming chat', desc: 'Chat synthesis streams via /api/chat/stream proxied through frontend nginx with buffering disabled and 120s timeout.', icon: '💬' },
            ].map(item => (
              <div key={item.title} className="bg-surface border border-rule rounded-xl p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="text-sm font-semibold text-on-surface mb-2">{item.title}</h3>
                <p className="text-xs text-dim leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
