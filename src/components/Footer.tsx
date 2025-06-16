
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Footer = () => {
  const [showImprint, setShowImprint] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const { theme, t } = useSettings();

  const getThemeStyles = () => {
    switch (theme) {
      case 'space-mood':
        return {
          footer: 'text-blue-800 hover:text-blue-900',
          overlay: 'bg-blue-100 border-blue-300',
          text: 'text-blue-900',
          header: 'text-blue-800'
        };
      case 'dark-vhs':
        return {
          footer: 'text-white hover:text-gray-300',
          overlay: 'bg-gray-900 border-gray-600',
          text: 'text-white',
          header: 'text-gray-300'
        };
      case 'retro-chrome':
        return {
          footer: 'text-blue-800 hover:text-blue-900',
          overlay: 'bg-slate-200 border-blue-400',
          text: 'text-slate-800',
          header: 'text-blue-800'
        };
      default:
        return {
          footer: 'text-gray-800 hover:text-gray-900',
          overlay: 'bg-white border-gray-400',
          text: 'text-gray-900',
          header: 'text-gray-800'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <>
      {/* Footer */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="flex items-center space-x-2 text-xs font-pixel">
          <button
            onClick={() => setShowImprint(true)}
            className={`underline transition-colors ${styles.footer}`}
          >
            Imprint
          </button>
          <span className={styles.footer}>|</span>
          <button
            onClick={() => setShowPrivacy(true)}
            className={`underline transition-colors ${styles.footer}`}
          >
            Privacy
          </button>
        </div>
      </div>

      {/* Imprint Overlay */}
      {showImprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`max-w-md w-full p-6 rounded-lg border-2 shadow-2xl ${styles.overlay}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-pixel font-bold ${styles.header}`}>Imprint</h2>
              <button
                onClick={() => setShowImprint(false)}
                className="p-1 rounded bg-red-500 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className={`font-pixel text-sm ${styles.text} space-y-2`}>
              <p>Henri Brüning</p>
              <p>Email: Henri.coesfeld@gmail.com</p>
              <p>Hengtestraße 68</p>
              <p>48653 Coesfeld</p>
              <p>Germany</p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Overlay */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`max-w-2xl w-full p-6 rounded-lg border-2 shadow-2xl max-h-[80vh] overflow-y-auto ${styles.overlay}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-pixel font-bold ${styles.header}`}>Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacy(false)}
                className="p-1 rounded bg-red-500 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className={`font-pixel text-sm ${styles.text} space-y-4`}>
              <p>This personal website does not collect or store personal data.</p>
              <p>No tracking cookies, analytics services or third-party advertising are used.</p>
              <p>Uploaded media is static and privately hosted. No visitor data is analyzed or monetized.</p>
              <p>Any form submissions or visitor interactions are purely voluntary and not recorded or evaluated.</p>
              
              <div className="mt-6 pt-4 border-t border-gray-300">
                <p className="font-bold mb-2">Responsible for content:</p>
                <p>Henri Brüning</p>
                <p>Email: Henri.coesfeld@gmail.com</p>
                <p>Hengtestraße 68</p>
                <p>48653 Coesfeld</p>
                <p>Germany</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
