import { useSettings } from '@/contexts/SettingsContext';

export type AppColor = 'yellow' | 'blue' | 'teal' | 'red' | 'green' | 'purple' | 'orange';

interface AppThemeConfig {
  appColor: AppColor;
  themeBackground: string;
}

export const getAppThemeStyles = ({ appColor, themeBackground }: AppThemeConfig) => {
  const appStyles = getAppColorStyles(appColor);
  
  return {
    background: themeBackground,
    container: appStyles.container,
    text: appStyles.text,
    subText: appStyles.subText,
    accent: appStyles.accent,
    button: appStyles.button,
    border: appStyles.border,
    card: appStyles.card
  };
};

const getAppColorStyles = (appColor: AppColor) => {
  switch (appColor) {
    case 'yellow':
      return {
        container: 'bg-gradient-to-br from-yellow-50/95 to-amber-100/95 border-2 border-yellow-400 shadow-2xl shadow-yellow-400/20',
        text: 'text-yellow-800',
        subText: 'text-yellow-700',
        accent: 'text-yellow-600',
        button: 'bg-yellow-500/80 hover:bg-yellow-600/80 text-yellow-50 border border-yellow-400/50',
        border: 'border-yellow-400/30',
        card: 'bg-yellow-50/50 border-yellow-300'
      };
    case 'blue':
      return {
        container: 'bg-gradient-to-br from-blue-50/95 to-indigo-100/95 border-2 border-blue-400 shadow-2xl shadow-blue-400/20',
        text: 'text-blue-800',
        subText: 'text-blue-700',
        accent: 'text-blue-600',
        button: 'bg-blue-500/80 hover:bg-blue-600/80 text-blue-50 border border-blue-400/50',
        border: 'border-blue-400/30',
        card: 'bg-blue-50/50 border-blue-300'
      };
    case 'teal':
      return {
        container: 'bg-gradient-to-br from-teal-50/95 to-cyan-100/95 border-2 border-teal-400 shadow-2xl shadow-teal-400/20',
        text: 'text-teal-800',
        subText: 'text-teal-700',
        accent: 'text-teal-600',
        button: 'bg-teal-500/80 hover:bg-teal-600/80 text-teal-50 border border-teal-400/50',
        border: 'border-teal-400/30',
        card: 'bg-teal-50/50 border-teal-300'
      };
    case 'red':
      return {
        container: 'bg-gradient-to-br from-red-50/95 to-rose-100/95 border-2 border-red-400 shadow-2xl shadow-red-400/20',
        text: 'text-red-800',
        subText: 'text-red-700',
        accent: 'text-red-600',
        button: 'bg-red-500/80 hover:bg-red-600/80 text-red-50 border border-red-400/50',
        border: 'border-red-400/30',
        card: 'bg-red-50/50 border-red-300'
      };
    case 'green':
      return {
        container: 'bg-gradient-to-br from-green-50/95 to-emerald-100/95 border-2 border-green-400 shadow-2xl shadow-green-400/20',
        text: 'text-green-800',
        subText: 'text-green-700',
        accent: 'text-green-600',
        button: 'bg-green-500/80 hover:bg-green-600/80 text-green-50 border border-green-400/50',
        border: 'border-green-400/30',
        card: 'bg-green-50/50 border-green-300'
      };
    case 'purple':
      return {
        container: 'bg-gradient-to-br from-purple-50/95 to-violet-100/95 border-2 border-purple-400 shadow-2xl shadow-purple-400/20',
        text: 'text-purple-800',
        subText: 'text-purple-700',
        accent: 'text-purple-600',
        button: 'bg-purple-500/80 hover:bg-purple-600/80 text-purple-50 border border-purple-400/50',
        border: 'border-purple-400/30',
        card: 'bg-purple-50/50 border-purple-300'
      };
    case 'orange':
      return {
        container: 'bg-gradient-to-br from-orange-50/95 to-amber-100/95 border-2 border-orange-400 shadow-2xl shadow-orange-400/20',
        text: 'text-orange-800',
        subText: 'text-orange-700',
        accent: 'text-orange-600',
        button: 'bg-orange-500/80 hover:bg-orange-600/80 text-orange-50 border border-orange-400/50',
        border: 'border-orange-400/30',
        card: 'bg-orange-50/50 border-orange-300'
      };
    default:
      return getAppColorStyles('blue');
  }
};

export const useAppTheme = (appColor: AppColor) => {
  const { theme } = useSettings();
  
  const themeBackgrounds = {
    'space-mood': 'bg-gradient-to-br from-indigo-900 via-blue-900 to-black',
    'adventure-canyon': 'bg-gradient-to-br from-amber-100 via-orange-200 to-red-300'
  };
  
  return getAppThemeStyles({
    appColor,
    themeBackground: themeBackgrounds[theme]
  });
};