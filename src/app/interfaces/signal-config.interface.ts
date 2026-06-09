export interface Signal {
  status: string
  createdBy: string
  createdTime: string
  modifiedBy: string
  modifiedTime: string
  signalMetadataId: number
  rtoCode: string
  rtoLocation: string
  signalId: string
  signalLocation: string
  comments: string
  description: string
}

export interface SignalStatus {
  signalId: string
  signalLocation: string
  lmvCount: number
  mcwgCount: number
  mgvCount: number
  hmvCount: number
  htvCount: number
  timestamp: string
  congested: boolean
  manualOverrideActive: boolean
  manualOverrideAction: any
}

export interface OverrideRequest {
  signalId: string;
  overrideAction: string;
  durationSeconds: number;
}