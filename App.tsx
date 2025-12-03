import React from 'react';
import MedicationCard from './components/MedicationCard';
import { ShieldCheck, Info } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      
      {/* iOS-style Header */}
      <header className="w-full pt-14 pb-4 px-6 sticky top-0 bg-gray-50/80 backdrop-blur-md z-20 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ma Santé</h1>
            <p className="text-sm text-gray-500 font-medium">Suivi des prises</p>
          </div>
          <div className="h-10 w-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
             <ShieldCheck className="text-blue-500 w-6 h-6" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md px-6 py-8 flex flex-col gap-6">
        
        {/* Medication Cards */}
        <MedicationCard 
          name="Doliprane" 
          type="doliprane"
          storageKey="med_tracker_doliprane"
          iconColorClass="text-yellow-500"
        />
        
        <MedicationCard 
          name="Ibuprofène" 
          type="ibuprofen"
          storageKey="med_tracker_ibuprofen"
          iconColorClass="text-pink-500"
        />

        {/* Informational Footer */}
        <div className="mt-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3 items-start">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Rappel important :</strong> Respectez toujours un intervalle de 6 heures minimum entre deux prises du même médicament. En cas de doute ou de persistance des symptômes, consultez un médecin.
          </p>
        </div>

      </main>
      
      <footer className="w-full py-6 text-center text-xs text-gray-300">
        MediTrack v1.0 • Données locales
      </footer>

    </div>
  );
};

export default App;