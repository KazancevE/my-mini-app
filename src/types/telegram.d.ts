declare global {
    interface Window {
      Telegram: {
        WebApp: {
          HapticFeedback: any;
          showAlert: (message: string, callback?: () => void) => void;
          close: () => void;
          sendData: (data: string) => void;
          initDataUnsafe: {
            user?: {
              imagePath: string | undefined;
              id: number;
              first_name?: string;
              last_name?: string;
              username?: string;
              language_code?: string;
            };
          };
        };
      };
    }
  }
  
  export {};