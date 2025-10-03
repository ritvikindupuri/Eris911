
import React, { useState, useEffect } from 'react';
import { User, UserRole, EmergencyCall, PatientCareRecord, CallStatus } from './types';
import { USERS, EMERGENCY_CALLS, PCRs } from './constants';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import NavBar from './components/NavBar';
import DispatcherDashboard from './components/DispatcherDashboard';
import EmtDashboard from './components/EmtDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import LogCallForm from './components/LogCallForm';
import PatientCareRecordForm from './components/PatientCareRecordForm';
import ConfirmationPage from './components/ConfirmationPage';

type AppView = 
  | 'login' 
  | 'signup' 
  | 'dashboard' 
  | 'logCall' 
  | 'filePCR'
  | 'confirmation';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(USERS);
  const [calls, setCalls] = useState<EmergencyCall[]>(EMERGENCY_CALLS);
  const [pcrs, setPcrs] = useState<PatientCareRecord[]>(PCRs);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('login');
  const [callForPcr, setCallForPcr] = useState<EmergencyCall | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      setView('dashboard');
      return true;
    }
    return false;
  };

  const handleSignUp = (userData: Omit<User, 'id'>): boolean => {
    if (users.some(u => u.username === userData.username)) {
      return false;
    }
    const newUser = { ...userData, id: users.length + 1 };
    setUsers([...users, newUser]);
    setConfirmationMessage('Account created successfully! Please log in.');
    setView('login');
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
    setConfirmationMessage('');
  };

  const handleLogCallSubmit = (callData: Omit<EmergencyCall, 'id' | 'timestamp' | 'status' | 'pcrId'>) => {
    const newCall: EmergencyCall = {
      ...callData,
      id: calls.length + 1,
      timestamp: new Date(),
      status: CallStatus.PENDING,
    };
    setCalls(prevCalls => [newCall, ...prevCalls]);
    setConfirmationMessage('Emergency call logged successfully.');
    setView('confirmation');
  };

  const handlePcrSubmit = (pcrData: Omit<PatientCareRecord, 'id' | 'callId'>) => {
    if (!callForPcr) return;

    const newPcr: PatientCareRecord = {
      ...pcrData,
      id: pcrs.length + 1,
      callId: callForPcr.id,
    };
    setPcrs(prevPcrs => [...prevPcrs, newPcr]);

    setCalls(prevCalls => prevCalls.map(c => 
        c.id === callForPcr.id ? { ...c, pcrId: newPcr.id } : c
    ));
    setCallForPcr(null);
    setConfirmationMessage('Patient Care Record submitted successfully.');
    setView('confirmation');
  };
  
  const handleUpdateCallStatus = (callId: number, status: CallStatus) => {
    setCalls(calls.map(c => c.id === callId ? {...c, status} : c));
  };

  const renderDashboard = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case UserRole.DISPATCHER:
        return <DispatcherDashboard calls={calls} onLogNewCall={() => setView('logCall')} onUpdateCallStatus={handleUpdateCallStatus} />;
      case UserRole.EMT:
        return <EmtDashboard user={currentUser} calls={calls} onFilePCR={(call) => { setCallForPcr(call); setView('filePCR'); }} onUpdateCallStatus={handleUpdateCallStatus} />;
      case UserRole.SUPERVISOR:
        return <SupervisorDashboard calls={calls} users={users} />;
      default:
        return <div>Invalid user role.</div>;
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigateToSignUp={() => { setView('signup'); setConfirmationMessage(''); }} message={confirmationMessage}/>;
      case 'signup':
        return <SignUpPage onSignUp={handleSignUp} onNavigateToLogin={() => setView('login')} />;
      case 'logCall':
        return <LogCallForm onSubmit={handleLogCallSubmit} onCancel={() => setView('dashboard')} />;
      case 'filePCR':
        if (callForPcr) {
          return <PatientCareRecordForm call={callForPcr} onSubmit={handlePcrSubmit} onCancel={() => setView('dashboard')} />;
        }
        return null;
      case 'confirmation':
          return <ConfirmationPage message={confirmationMessage} onBack={() => setView('dashboard')} />
      case 'dashboard':
      default:
        if (!currentUser) {
          return <LoginPage onLogin={handleLogin} onNavigateToSignUp={() => setView('signup')} />;
        }
        return (
          <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <NavBar user={currentUser} onLogout={handleLogout} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
            <main>
              {renderDashboard()}
            </main>
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
};

export default App;
