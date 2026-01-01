
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, Shield, Zap, Server, Users, Settings, Bell, 
  Menu, X, BrainCircuit, Landmark, Wallet, AlertCircle, Sparkles
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { 
  FeatureDefinition, ThrottlingPolicy, AlertInstance, 
  SystemHealthMetric, AgentDefinition, UserSegment 
} from './types';
import { mockBackendAPI, generateUUID } from './services/mockApi';
import { generateRemediationPlan } from './services/geminiService';

// --- Local Components ---

// Fix: Use React.FC and make children optional to resolve "missing children" and "missing key" prop errors in JSX usages
const Card: React.FC<{ title?: string, children?: React.ReactNode, className?: string }> = ({ title, children, className = "" }) => (
  <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg ${className}`}>
    {title && <h3 className="text-lg font-semibold text-slate-100 mb-4">{title}</h3>}
    {children}
  </div>
);

const Metric = ({ label, value, trend, colorClass = "text-blue-400" }: { label: string, value: string | number, trend?: string, colorClass?: string }) => (
  <div className="flex flex-col">
    <span className="text-sm text-slate-400 font-medium mb-1">{label}</span>
    <div className="flex items-baseline gap-2">
      <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
      {trend && <span className="text-xs text-green-400 font-semibold">{trend}</span>}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    idle: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    degraded: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[status.toLowerCase()] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
      {status.toUpperCase()}
    </span>
  );
};

// --- Main View ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // Operational Data State
  const [features, setFeatures] = useState<FeatureDefinition[]>([]);
  const [policies, setPolicies] = useState<ThrottlingPolicy[]>([]);
  const [alerts, setAlerts] = useState<AlertInstance[]>([]);
  const [health, setHealth] = useState<SystemHealthMetric | null>(null);
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [healthHistory, setHealthHistory] = useState<any[]>([]);
  
  // AI Insights
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAnalyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [f, p, a, h, ag] = await Promise.all([
        mockBackendAPI('features', 'GET'),
        mockBackendAPI('policies', 'GET'),
        mockBackendAPI('alerts/instances', 'GET'),
        mockBackendAPI('system_health', 'GET'),
        mockBackendAPI('agents', 'GET'),
      ]);
      setFeatures(f);
      setPolicies(p);
      setAlerts(a);
      setHealth(h);
      setAgents(ag);
    };

    loadData();
    const interval = setInterval(() => {
      mockBackendAPI('system_health', 'GET').then(h => {
        setHealth(h);
        setHealthHistory(prev => [...prev.slice(-19), { ...h, time: new Date().toLocaleTimeString() }]);
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const runAiAnalysis = async () => {
    setAnalyzing(true);
    const plan = await generateRemediationPlan({ features, health, alerts });
    setAiInsight(plan || 'AI Analysis Unavailable');
    setAnalyzing(false);
  };

  const navItems = [
    { id: 'overview', label: 'Command Center', icon: Activity },
    { id: 'cognitive', label: 'Cognitive Load', icon: BrainCircuit },
    { id: 'agents', label: 'Agentic AI', icon: Zap },
    { id: 'rails', label: 'Token Rails', icon: Wallet },
    { id: 'security', label: 'Identity & Trust', icon: Shield },
    { id: 'infra', label: 'Infrastructure', icon: Server },
  ];

  const currentCognitiveLoad = useMemo(() => {
    if (!health) return 0;
    return (health.cpuUsage / 100) * 0.8 + (health.errorRate * 0.2);
  }, [health]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-50`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">Money20/20</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === item.id 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-800"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-950 custom-scrollbar relative">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            {navItems.find(n => n.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={runAiAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-sm font-semibold shadow-lg shadow-blue-900/20 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyzing...' : 'AI Insights'}
            </button>
            <div className="relative">
              <Bell className="w-6 h-6 text-slate-400 cursor-pointer hover:text-slate-200" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center border-2 border-slate-950 font-bold">
                  {alerts.length}
                </span>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 overflow-hidden">
               <img src="https://picsum.photos/32/32" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* AI Insights Panel (Hidden until triggered) */}
          {aiInsight && (activeTab === 'overview' || activeTab === 'cognitive') && (
            <Card className="border-blue-500/30 bg-blue-500/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2">
                <button onClick={() => setAiInsight('')} className="text-slate-400 hover:text-slate-100"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <BrainCircuit className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1 text-sm leading-relaxed prose prose-invert max-w-none">
                  <h4 className="text-lg font-bold text-blue-400 mb-2">Build-Phase AI Remediation Plan</h4>
                  <div dangerouslySetInnerHTML={{ __html: aiInsight.replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            </Card>
          )}

          {/* Tab Views */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <Metric label="CPU Utilization" value={`${health?.cpuUsage.toFixed(1)}%`} trend="+2.4%" />
                <div className="h-16 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={healthHistory}>
                      <Area type="monotone" dataKey="cpuUsage" stroke="#3b82f6" fill="#3b82f633" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card>
                <Metric label="Mem Utilization" value={`${health?.memoryUsage.toFixed(1)}%`} trend="-1.2%" colorClass="text-indigo-400" />
                <div className="h-16 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={healthHistory}>
                      <Area type="monotone" dataKey="memoryUsage" stroke="#818cf8" fill="#818cf833" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card>
                <Metric label="Cognitive Load Index" value={currentCognitiveLoad.toFixed(2)} trend="Stable" colorClass="text-emerald-400" />
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Efficiency: 94%</span>
                  <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                </div>
              </Card>
              <Card>
                <Metric label="Active Throttles" value={features.filter(f => f.cognitiveWeight > 0.8).length} colorClass="text-orange-400" />
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge status="operational" />
                  <StatusBadge status="idle" />
                </div>
              </Card>
              
              <Card className="col-span-full lg:col-span-3" title="Real-Time System Telemetry">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                        itemStyle={{ color: '#f8fafc' }}
                      />
                      <Line type="monotone" dataKey="cpuUsage" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="memoryUsage" stroke="#818cf8" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="networkLatency" stroke="#fbbf24" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="col-span-full lg:col-span-1" title="Priority Alerts">
                <div className="space-y-4 max-h-[320px] overflow-y-auto custom-scrollbar pr-2">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex gap-4 p-3 rounded-lg bg-slate-900 border border-slate-700/50">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-100">Critical Congestion</p>
                        <p className="text-xs text-slate-400 mt-1">Load triggered @ {alert.triggeredValue}</p>
                        <p className="text-[10px] text-slate-500 mt-2 uppercase">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && <p className="text-slate-500 text-center py-10">No active incidents</p>}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'cognitive' && (
            <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card title="Feature Cognitive Weightage">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={features}>
                          <XAxis dataKey="name" hide />
                          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                          <Bar dataKey="cognitiveWeight">
                            {features.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.cognitiveWeight > 0.8 ? '#f43f5e' : '#3b82f6'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                 </Card>
                 <Card title="Throttle Policies">
                    <div className="space-y-4">
                      {policies.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
                          <div>
                            <p className="text-sm font-bold">{p.name}</p>
                            <p className="text-xs text-slate-400">{p.strategy}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-500">Priority {p.priority}</span>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${p.isActive ? 'bg-blue-600' : 'bg-slate-700'}`}>
                               <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${p.isActive ? 'right-1' : 'left-1'}`} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                 </Card>
               </div>
               <Card title="Feature Health Matrix">
                 <table className="w-full text-left">
                   <thead className="border-b border-slate-700">
                     <tr className="text-xs uppercase text-slate-500 font-bold">
                       <th className="pb-4">Feature Name</th>
                       <th className="pb-4">Category</th>
                       <th className="pb-4">Cognitive Weight</th>
                       <th className="pb-4">Status</th>
                       <th className="pb-4">Last Updated</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm divide-y divide-slate-800">
                     {features.map(f => (
                       <tr key={f.id} className="hover:bg-slate-900/40">
                         <td className="py-4 font-semibold">{f.name}</td>
                         <td className="py-4 text-slate-400">{f.category}</td>
                         <td className="py-4">
                           <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <div 
                               className={`h-full rounded-full ${f.cognitiveWeight > 0.8 ? 'bg-red-500' : 'bg-blue-500'}`} 
                               style={{ width: `${f.cognitiveWeight * 100}%` }}
                             />
                           </div>
                         </td>
                         <td className="py-4"><StatusBadge status={f.isActive ? 'active' : 'idle'} /></td>
                         <td className="py-4 text-slate-500">{new Date(f.lastUpdated).toLocaleDateString()}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </Card>
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map(agent => (
                <Card key={agent.id} className="relative group overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700 shadow-inner">
                        <Zap className="w-6 h-6 text-blue-400" />
                      </div>
                      <StatusBadge status={agent.status} />
                    </div>
                    <h4 className="text-lg font-bold mb-1">{agent.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">{agent.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-[11px] mb-6">
                      <div className="p-2 bg-slate-900/50 rounded-lg">
                        <span className="text-slate-500 block uppercase font-bold mb-1">Category</span>
                        <span className="text-slate-300 truncate block">{agent.category}</span>
                      </div>
                      <div className="p-2 bg-slate-900/50 rounded-lg">
                        <span className="text-slate-500 block uppercase font-bold mb-1">Threshold</span>
                        <span className="text-slate-300">{agent.operationalLoadThreshold} TPS</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       {agent.skills.slice(0, 2).map(skill => (
                         <span key={skill} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-[10px] font-bold">{skill}</span>
                       ))}
                       {agent.skills.length > 2 && <span className="text-[10px] text-slate-500 self-center">+{agent.skills.length - 2}</span>}
                    </div>
                  </div>
                </Card>
              ))}
              <button className="border-2 border-dashed border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-600/50 hover:bg-blue-600/5 transition-all text-slate-500 hover:text-blue-400 group">
                 <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Activity className="w-5 h-5" />
                 </div>
                 <span className="font-bold text-sm">Deploy New Agent</span>
              </button>
            </div>
          )}

          {activeTab === 'rails' && (
            <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card>
                   <Metric label="Liquidity Index" value="0.999" trend="Peak" colorClass="text-emerald-400" />
                 </Card>
                 <Card>
                   <Metric label="Avg. Settlement Time" value="12ms" trend="-2ms" colorClass="text-blue-400" />
                 </Card>
                 <Card>
                   <Metric label="Total Daily Value" value="$4.2B" trend="+12%" colorClass="text-indigo-400" />
                 </Card>
               </div>
               <Card title="Global Rail Throughput (TPS)">
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={healthHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} />
                        <Tooltip />
                        <Area type="monotone" dataKey="cpuUsage" stackId="1" stroke="#3b82f6" fill="#3b82f666" name="Fast Rail" />
                        <Area type="monotone" dataKey="memoryUsage" stackId="1" stroke="#818cf8" fill="#818cf866" name="Batch Rail" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </Card>
            </div>
          )}

          {/* Fallback for other tabs */}
          {['security', 'infra'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center">
                 <Settings className="w-8 h-8 text-slate-500 animate-spin" />
              </div>
              <p className="text-slate-400 font-bold">Initializing Build-Phase {activeTab.toUpperCase()} Module...</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
