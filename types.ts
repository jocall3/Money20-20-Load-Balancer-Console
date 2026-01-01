
export enum FeatureCategory {
  Analytics = 'Analytics',
  Collaboration = 'Collaboration',
  DataEntry = 'Data Entry',
  Reporting = 'Reporting',
  Admin = 'Administration',
  Communication = 'Communication',
  Utility = 'Utility',
  Search = 'Search',
  Configuration = 'Configuration',
  Automation = 'Automation',
  Integrations = 'Integrations',
  Notifications = 'Notifications',
  UserManagement = 'User Management',
  PerformanceMonitoring = 'Performance Monitoring',
  Security = 'Security',
  DevelopmentTools = 'Development Tools',
  MachineLearning = 'Machine Learning',
  VirtualReality = 'Virtual Reality',
  AugmentedReality = 'Augmented Reality',
  Simulation = 'Simulation',
  AgentAI = 'Agent AI',
  TokenRails = 'Token Rails',
  Payments = 'Payments',
  Identity = 'Digital Identity',
  Orchestration = 'Orchestration',
}

export enum ThrottlingStrategy {
  StaticThreshold = 'Static Threshold',
  DynamicAdaptive = 'Dynamic Adaptive',
  PredictiveML = 'Predictive ML',
  UserSegmentSpecific = 'User Segment Specific',
  TimeBased = 'Time-Based',
  CapacityBased = 'Capacity-Based',
  PriorityBased = 'Priority-Based',
  FeatureDependency = 'Feature Dependency',
  RevenueImpact = 'Revenue Impact',
  ComplianceDriven = 'Compliance-Driven',
  AgentDriven = 'Agent Driven',
}

export enum AlertSeverity {
  Info = 'Info',
  Warning = 'Warning',
  Critical = 'Critical',
  Emergency = 'Emergency',
}

export enum UserSegment {
  NewUser = 'New User',
  ExperiencedUser = 'Experienced User',
  PowerUser = 'Power User',
  Admin = 'Admin',
  Guest = 'Guest',
  Developer = 'Developer',
  Analyst = 'Analyst',
  Manager = 'Manager',
  Executive = 'Executive',
  ExternalPartner = 'External Partner',
  InternalSupport = 'Internal Support',
}

export interface FeatureDefinition {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  cognitiveWeight: number;
  baseThrottleThreshold: number;
  isActive: boolean;
  dependencies: string[];
  impactMetrics: { name: string; value: number }[];
  recoveryTimeEstimate: number;
  lastUpdated: string;
  ownerTeam: string;
  rolloutStrategy: 'all_users' | 'beta_testers' | 'segment_specific';
}

export interface ThrottlingPolicy {
  id: string;
  name: string;
  description: string;
  strategy: ThrottlingStrategy;
  targetFeatureIds: string[];
  userSegments: UserSegment[];
  thresholdConfig: {
    minLoad?: number;
    maxLoad?: number;
    staticLoadThreshold?: number;
    durationThreshold?: number;
    cooldownPeriod?: number;
  };
  activationConditions: string[];
  deactivationConditions: string[];
  priority: number;
  isActive: boolean;
  lastModifiedBy: string;
  lastModifiedDate: string;
  efficacyMetrics: { name: string; targetValue: number }[];
  A_BTestGroup?: string;
}

export interface AlertDefinition {
  id: string;
  name: string;
  description: string;
  severity: AlertSeverity;
  condition: string;
  targetFeatures: string[];
  targetUserSegments: UserSegment[];
  notificationChannels: string[];
  isActive: boolean;
  debouncePeriod: number;
  autoResolveCondition: string;
  escalationPolicyId?: string;
}

export interface AlertInstance {
  id: string;
  definitionId: string;
  timestamp: string;
  resolvedTimestamp?: string;
  status: 'active' | 'resolved' | 'acknowledged';
  triggeredValue: string;
  context: Record<string, any>;
  assignedTo?: string;
  notes: string[];
}

export interface SystemHealthMetric {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  databaseConnections: number;
  errorRate: number;
  queueDepth: number;
  activeUsers: number;
  backgroundTasks: number;
  diskIO: number;
  apiCallRate: number;
}

export interface HistoricalCognitiveData {
  timestamp: string;
  avgLoad: number;
  maxLoad: number;
  minLoad: number;
  activeThrottleDurations: Record<string, number>;
  userSegmentBreakdown: Record<UserSegment, { avgLoad: number; userCount: number }>;
  featureContribution: Record<string, number>;
}

export interface PredictiveForecast {
  timestamp: string;
  forecastedLoad: number;
  confidenceInterval: [number, number];
  influencingFactors: Record<string, number>;
  recommendedActions: { featureId: string; action: 'throttle' | 'ease'; rationale: string }[];
}

export interface FeedbackLoopStatus {
  lastEvaluationTimestamp: string;
  policiesEvaluated: string[];
  proposedAdjustments: Record<string, string>;
  efficacyScore: number;
  nextEvaluationDue: string;
  statusMessage: string;
  optimizationGoal: string;
}

export interface UserProfile {
  userId: string;
  segment: UserSegment;
  onboardingCompletion: number;
  engagementScore: number;
  recentCognitiveLoadHistory: any[];
  preferredLanguage: string;
  customThrottlePreferences: Record<string, 'throttle' | 'ease' | 'default'>;
  accountStatus: 'active' | 'inactive' | 'suspended';
  lastActivity: string;
  publicKey?: string;
  profileSignature?: string;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'slack' | 'datadog' | 'jira' | 'email' | 'custom_webhook';
  status: 'connected' | 'disconnected' | 'error';
  settings: Record<string, string>;
  lastTested?: string;
}

export enum AgentCategory {
  Monitoring = 'Monitoring',
  Remediation = 'Remediation',
  Reconciliation = 'Reconciliation',
  Orchestration = 'Orchestration',
  FraudDetection = 'Fraud Detection',
  Compliance = 'Compliance',
  Reporting = 'Reporting',
  DataAnalysis = 'Data Analysis',
  CustomerSupport = 'Customer Support',
  Security = 'Security',
}

export enum AgentSkill {
  AnomalyDetection = 'Anomaly Detection',
  SystemDiagnosis = 'System Diagnosis',
  PolicyEnforcement = 'Policy Enforcement',
  TransactionProcessing = 'Transaction Processing',
  LedgerUpdate = 'Ledger Update',
  IdentityVerification = 'Identity Verification',
  RiskAssessment = 'Risk Assessment',
  Communication = 'Communication',
  DataAggregation = 'Data Aggregation',
  SmartContractExecution = 'Smart Contract Execution',
  ErrorHandling = 'Error Handling',
  ResourceAllocation = 'Resource Allocation',
  SentimentAnalysis = 'Sentiment Analysis',
  KeyManagement = 'Key Management',
}

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  skills: AgentSkill[];
  status: 'active' | 'idle' | 'suspended' | 'error';
  configuration: Record<string, any>;
  operationalLoadThreshold: number;
  lastUpdated: string;
  ownerTeam: string;
  rbacRole: string;
  publicKey?: string;
}

export interface AgentHealthMetric {
  timestamp: string;
  agentId: string;
  cpuUsage: number;
  memoryUsage: number;
  activeTasks: number;
  taskThroughput: number;
  errorRate: number;
  avgTaskLatency: number;
  healthScore: number;
}

export enum TokenRailType {
  Fast = 'Fast Rail',
  Batch = 'Batch Rail',
  HighValue = 'High Value Rail',
  Compliance = 'Compliance Rail',
}

export enum TokenTransactionStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Failed = 'Failed',
  Reversed = 'Reversed',
  Blocked = 'Blocked',
  Expired = 'Expired',
}

export interface TokenRailMetrics {
  timestamp: string;
  railId: string;
  railType: TokenRailType;
  tps: number;
  avgLatency: number;
  errorRate: number;
  queueDepth: number;
  status: 'operational' | 'degraded' | 'offline';
  totalValueTransacted: number;
}

export interface TokenAccountSnapshot {
  accountId: string;
  balance: number;
  lastTransactionTimestamp: string;
  transactionCount: number;
  recentTransactions: { txId: string; amount: number; status: TokenTransactionStatus }[];
}

export interface PaymentEngineStatus {
  timestamp: string;
  overallStatus: 'online' | 'partially_degraded' | 'offline';
  requestsPerSecond: number;
  avgProcessingLatency: number;
  failureRate: number;
  inFlightTransactions: number;
  flaggedTransactions: number;
  railStatuses: Record<string, 'operational' | 'degraded' | 'offline'>;
}

export interface PaymentRequestMetric {
  timestamp: string;
  requestId: string;
  source: string;
  destination: string;
  amount: number;
  currency: string;
  chosenRail: TokenRailType;
  processingTime: number;
  status: TokenTransactionStatus;
  riskScore: number;
  fraudReason?: string;
}

export interface IdentityServiceStatus {
  timestamp: string;
  overallStatus: 'operational' | 'degraded' | 'offline';
  authRequestsPerSecond: number;
  avgAuthLatency: number;
  failedAuthRate: number;
  authzChecksPerSecond: number;
  activeSessions: number;
  keyManagementStatus: 'healthy' | 'warning' | 'critical';
  securityIncidents: string[];
}

export enum AuthEventType {
  LoginSuccess = 'Login Success',
  LoginFailure = 'Login Failure',
  Logout = 'Logout',
  PasswordChange = 'Password Change',
  SessionStart = 'Session Start',
  SessionEnd = 'Session End',
  AccessGranted = 'Access Granted',
  AccessDenied = 'Access Denied',
  KeyGeneration = 'Key Generation',
  KeyRotation = 'Key Rotation',
  MFAAttempt = 'MFA Attempt',
  MFAChallenge = 'MFA Challenge',
  MFAFailure = 'MFA Failure',
  TransactionProcessing = 'Transaction Processing',
}

export interface AuthLogEntry {
  id: string;
  timestamp: string;
  eventType: AuthEventType;
  entityId: string;
  ipAddress: string;
  outcome: 'success' | 'failure' | 'denied' | 'info';
  message: string;
  context: Record<string, any>;
  previousHash: string;
  entryHash: string;
}

export interface EscalationPolicy {
  id: string;
  name: string;
  description: string;
  steps: {
    delaySeconds: number;
    targetType: 'channel' | 'team' | 'user';
    targetIdentifier: string;
    notificationMessage: string;
  }[];
  isActive: boolean;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

export interface CognitiveMetric {
  timestamp: string;
  avgCognitiveLoad: number;
  activeThrottles: string[];
}
