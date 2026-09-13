import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ModuleDetailScreen from './src/screens/ModuleDetailScreen';
import ARPreparingScreen from './src/screens/ARPreparingScreen';
import ARSimulationScreen from './src/screens/ARSimulationScreen';
import ScoreScreen from './src/screens/ScoreScreen';
import CertificateScreen from './src/screens/CertificateScreen';
import CertificateVerificationScreen from './src/screens/CertificateVerificationScreen';

export default function App() {
  // Screen state
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [selectedModule, setSelectedModule] = useState('fire');
  const [lang, setLang] = useState('en');
  const [lastResults, setLastResults] = useState(null);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            onNext={() => setCurrentScreen('login')}
            lang={lang}
            onToggleLang={toggleLanguage}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onLogin={() => setCurrentScreen('home')}
            lang={lang}
            onToggleLang={toggleLanguage}
          />
        );
      case 'home':
        return (
          <HomeScreen
            onSelectModule={(mod) => {
              setSelectedModule(mod);
              setCurrentScreen('detail');
            }}
            lang={lang}
            onToggleLang={toggleLanguage}
          />
        );
      case 'detail':
        return (
          <ModuleDetailScreen
            moduleType={selectedModule}
            onBack={() => setCurrentScreen('home')}
            onStartAR={() => setCurrentScreen('arPrep')}
            lang={lang}
            onToggleLang={toggleLanguage}
          />
        );
      case 'arPrep':
        return (
          <ARPreparingScreen
            onBack={() => setCurrentScreen('detail')}
            onStartSimulation={() => setCurrentScreen('arSim')}
            lang={lang}
            onToggleLang={toggleLanguage}
          />
        );
      case 'arSim':
        return (
          <ARSimulationScreen
            moduleType={selectedModule}
            onFinishSimulation={(res) => {
              setLastResults(res);
              setCurrentScreen('score');
            }}
            onBack={() => setCurrentScreen('arPrep')}
            lang={lang}
            onToggleLang={toggleLanguage}
          />
        );
      case 'score':
        return (
          <ScoreScreen
            results={
              lastResults || {
                score: 86,
                correctActions: 7,
                wrongActions: 2,
                safetyViolations: 1,
                timeTaken: '02:14',
                moduleTitle:
                  selectedModule === 'fire'
                    ? 'Fire & Explosion Response'
                    : 'Gas Leak & Confined Space',
              }
            }
            onViewCertificate={() => setCurrentScreen('certificate')}
            onRetry={() => setCurrentScreen('arSim')}
            onBackToHome={() => setCurrentScreen('home')}
            lang={lang}
            onToggleLang={toggleLanguage}
          />
        );
      case 'certificate':
        return (
          <CertificateScreen
            onVerify={() => setCurrentScreen('verification')}
            onBack={() => setCurrentScreen('score')}
            lang={lang}
            onToggleLang={toggleLanguage}
          />
        );
      case 'verification':
        return (
          <CertificateVerificationScreen
            onBackHome={() => setCurrentScreen('home')}
            lang={lang}
            onToggleLang={toggleLanguage}
          />
        );
      default:
        return <SplashScreen onNext={() => setCurrentScreen('login')} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {renderCurrentScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
