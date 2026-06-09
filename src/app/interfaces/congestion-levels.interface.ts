export interface RuleCondition {
  field: string;
  operator: string;
  value: number;
}

export interface RuleExpression {
  conditions: RuleCondition[];
  logic: string;
}

export interface CongestionLevel {
  id?: number;
  signalId: string;
  ruleExpression: RuleExpression;
  enabled: boolean;
  description: string;
}