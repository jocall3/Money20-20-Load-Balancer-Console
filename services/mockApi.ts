
import { 
  FeatureDefinition, FeatureCategory, UserSegment, ThrottlingPolicy, ThrottlingStrategy,
  AlertDefinition, AlertSeverity, AlertInstance, EscalationPolicy, SystemHealthMetric,
  HistoricalCognitiveData, UserProfile, IntegrationConfig, AgentDefinition, AgentCategory,
  AgentSkill, AgentHealthMetric, TokenRailType, TokenTransactionStatus, TokenRailMetrics,
  TokenAccountSnapshot, PaymentEngineStatus, PaymentRequestMetric, IdentityServiceStatus,
  AuthEventType, AuthLogEntry
} from '../types';

// Helper for generating UUIDs
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Simple non-crypto hashing simulation
export const simpleDeterministicHash = (data: string, previousHash: string = 'genesis'): string => {
  const combinedData = data + previousHash + 'salt';
  let hash = 0;
  for (let i = 0; i < combinedData.length; i++) {
    const char = combinedData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `mockhash-${(hash >>> 0).toString(16).padStart(8, '0')}-${generateUUID().split('-')[0]}`;
};

// Initial Mock Data Stores
export let mockFeatures: FeatureDefinition[] = [
  {
    id: 'feat_adv_analytics', name: 'Advanced Analytics', description: 'Deep dive data analysis and visualization tools.', category: FeatureCategory.Analytics, cognitiveWeight: 0.9, baseThrottleThreshold: 0.8, isActive: true, dependencies: [], impactMetrics: [{ name: 'decision_quality', value: 0.8 }], recoveryTimeEstimate: 300, lastUpdated: '2024-03-01T10:00:00Z', ownerTeam: 'Data Science', rolloutStrategy: 'all_users'
  },
  {
    id: 'feat_realtime_collaboration', name: 'Realtime Collaboration', description: 'Live multi-user document editing and session sync.', category: FeatureCategory.Collaboration, cognitiveWeight: 0.8, baseThrottleThreshold: 0.75, isActive: true, dependencies: [], impactMetrics: [{ name: 'team_productivity', value: 0.9 }], recoveryTimeEstimate: 240, lastUpdated: '2024-03-02T11:00:00Z', ownerTeam: 'Productivity Suite', rolloutStrategy: 'all_users'
  },
  {
    id: 'feat_ai_assistant', name: 'Build-Phase AI Assistant', description: 'LLM-powered architectural suggestions and automation.', category: FeatureCategory.AgentAI, cognitiveWeight: 0.95, baseThrottleThreshold: 0.88, isActive: true, dependencies: [], impactMetrics: [{ name: 'dev_velocity', value: 0.95 }], recoveryTimeEstimate: 360, lastUpdated: '2024-03-05T16:00:00Z', ownerTeam: 'AI Platform', rolloutStrategy: 'beta_testers'
  },
  {
    id: 'feat_token_rail_monitor', name: 'Token Rail Monitor', description: 'Real-time liquidity and settlement velocity tracker.', category: FeatureCategory.TokenRails, cognitiveWeight: 0.6, baseThrottleThreshold: 0.7, isActive: true, dependencies: [], impactMetrics: [{ name: 'settlement_success', value: 0.99 }], recoveryTimeEstimate: 120, lastUpdated: '2024-03-06T10:00:00Z', ownerTeam: 'Fintech Core', rolloutStrategy: 'all_users'
  },
  {
    id: 'feat_payment_routing', name: 'Intelligent Routing', description: 'Multi-rail AI routing for cost and speed optimization.', category: FeatureCategory.Payments, cognitiveWeight: 0.8, baseThrottleThreshold: 0.85, isActive: true, dependencies: ['feat_token_rail_monitor'], impactMetrics: [{ name: 'fee_reduction', value: 0.88 }], recoveryTimeEstimate: 240, lastUpdated: '2024-03-07T11:00:00Z', ownerTeam: 'Payments Engine', rolloutStrategy: 'all_users'
  },
];

export let mockThrottlingPolicies: ThrottlingPolicy[] = [
  {
    id: 'policy_high_load_general', name: 'Dynamic Adaptive Load Throttling', description: 'Universal protection policy for system stability.', strategy: ThrottlingStrategy.DynamicAdaptive, targetFeatureIds: ['feat_adv_analytics', 'feat_ai_assistant'], userSegments: [UserSegment.ExperiencedUser, UserSegment.Manager], thresholdConfig: { minLoad: 0.85, maxLoad: 0.95, durationThreshold: 60, cooldownPeriod: 300 }, activationConditions: ['avgCognitiveLoad > 0.85'], deactivationConditions: ['avgCognitiveLoad < 0.75'], priority: 1, isActive: true, lastModifiedBy: 'system', lastModifiedDate: '2024-02-01T09:00:00Z', efficacyMetrics: [{ name: 'load_reduction', targetValue: 0.15 }]
  },
  {
    id: 'policy_new_user_safety', name: 'New User Cognitive Shield', description: 'Prevents overwhelming new users with complex features.', strategy: ThrottlingStrategy.UserSegmentSpecific, targetFeatureIds: ['feat_adv_analytics'], userSegments: [UserSegment.NewUser], thresholdConfig: { staticLoadThreshold: 0.65 }, activationConditions: ['user_segment == NewUser'], deactivationConditions: [], priority: 0, isActive: true, lastModifiedBy: 'product_team', lastModifiedDate: '2024-02-10T10:00:00Z', efficacyMetrics: [{ name: 'retention_lift', targetValue: 0.05 }]
  }
];

export let mockAlertDefinitions: AlertDefinition[] = [
  {
    id: 'alert_critical_load', name: 'Critical System Congestion', description: 'Aggregate cognitive load exceeding safety limits.', severity: AlertSeverity.Critical, condition: 'avgCognitiveLoad > 0.92 for 30s', targetFeatures: [], targetUserSegments: [], notificationChannels: ['slack', 'pagerduty'], isActive: true, debouncePeriod: 300, autoResolveCondition: 'avgCognitiveLoad < 0.8 for 60s'
  }
];

export let mockAlertInstances: AlertInstance[] = [
  {
    id: 'alert_inst_001', definitionId: 'alert_critical_load', timestamp: new Date().toISOString(), status: 'active', triggeredValue: '0.94', context: { currentLoad: 0.94 }, assignedTo: 'ops-lead', notes: ['Monitoring rail latency concurrently.']
  }
];

export let mockAgentDefinitions: AgentDefinition[] = [
  {
    id: 'agent_fraud_shield', name: 'FraudShield Sentinel', description: 'Autonomous agent for transaction pattern analysis.', category: AgentCategory.FraudDetection, skills: [AgentSkill.AnomalyDetection, AgentSkill.RiskAssessment], status: 'active', configuration: { sensitivity: 0.85 }, operationalLoadThreshold: 1000, lastUpdated: '2024-03-01T13:00:00Z', ownerTeam: 'Security AI', rbacRole: 'threat_hunter'
  },
  {
    id: 'agent_settlement_ops', name: 'Settlement Orchestrator', description: 'Manages ledger reconciliation across token rails.', category: AgentCategory.Orchestration, skills: [AgentSkill.LedgerUpdate, AgentSkill.TransactionProcessing], status: 'idle', configuration: { primary_rail: 'Fast Rail' }, operationalLoadThreshold: 500, lastUpdated: '2024-03-05T14:00:00Z', ownerTeam: 'Payments Core', rbacRole: 'ledger_admin'
  }
];

export const mockBackendAPI = async (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (endpoint) {
        case 'features': return resolve(mockFeatures);
        case 'policies': return resolve(mockThrottlingPolicies);
        case 'alerts/definitions': return resolve(mockAlertDefinitions);
        case 'alerts/instances': return resolve(mockAlertInstances);
        case 'agents': return resolve(mockAgentDefinitions);
        case 'system_health': return resolve({
          cpuUsage: Math.random() * 20 + 60,
          memoryUsage: Math.random() * 15 + 70,
          networkLatency: Math.random() * 40 + 10,
          activeUsers: Math.floor(Math.random() * 500 + 1000),
          errorRate: Math.random() * 0.5,
          timestamp: new Date().toISOString()
        });
        default: resolve({ success: true });
      }
    }, 300);
  });
};
