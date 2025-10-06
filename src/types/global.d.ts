interface GoogleApiConfig {
  apiKey: string;
  clientId: string;
  discoveryDocs: string[];
  scope: string;
}

interface GoogleIdentityConfig {
  client_id: string;
  callback: (response: { credential: string }) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleButtonConfig {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  type?: 'standard' | 'icon';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: number;
}

interface PromptMomentNotification {
  isNotDisplayed(): boolean;
  isSkippedMoment(): boolean;
  isDismissedMoment(): boolean;
  getMomentType(): string;
}

declare global {
  interface GoogleTokenResponse {
    access_token?: string;
    expires_in?: number;
    scope?: string;
    token_type?: string;
    error?: string;
  }

  interface GoogleTokenClient {
    requestAccessToken: () => void;
  }

  interface GoogleTokenConfig {
    client_id: string;
    scope: string;
    callback: (response: GoogleTokenResponse) => void;
  }

  interface Window {
    gapi: {
      load: (apis: string, callback: () => void) => void;
      client: {
        init: (config: GoogleApiConfig) => Promise<void>;
        drive: {
          files: {
            list: (params: Record<string, unknown>) => Promise<{ result: unknown }>;
            get: (params: Record<string, unknown>) => Promise<{ body: string }>;
          };
        };
      };
    };
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleIdentityConfig) => void;
          prompt: (callback?: (notification: PromptMomentNotification) => void) => void;
          renderButton: (element: HTMLElement, config: GoogleButtonConfig) => void;
          disableAutoSelect: () => void;
        };
        oauth2: {
          initTokenClient: (config: GoogleTokenConfig) => GoogleTokenClient;
        };
      };
    };
  }
}

export {};
