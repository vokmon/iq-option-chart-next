export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  code: string;
  company_id: number;
  created_at: number;
  ssid: string;
  user_id: number;
}

export interface VerifyResponse {
  code: string;
  method: string;
  token: string;
}

export interface VerifyDataResponse {
  code: string;
  identifier: string;
  token: string;
  ttl: number;
}

export interface TwoFAMethod {
  name: string;
  enabled: boolean;
}

export interface TwoFAMethodsResponse {
  status: boolean;
  methods: TwoFAMethod[];
}

export interface VerifyCredentials {
  code: string;
  token: string;
}

export interface LoginError {
  error: string;
  details?: string;
}
