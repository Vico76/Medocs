import React, { useEffect, useRef } from 'react';
import { Pill, Clock, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { useMedicationTracker } from '../hooks/useMedicationTracker';
import { formatTimeRemaining, getNextAvailableTime } from '../utils/time';
import { requestNotificationPermission, sendNotification } from '../utils/notifications';

interface MedicationCardProps {
  name: string;
  type: 'doliprane' | 'ibuprofen';
  storageKey: string;
  iconColorClass: string;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ name, type, storageKey, iconColorClass }) => {
  const { isAvailable, timeRemaining, lastTaken, takeMedication, resetMedication } = useMedicationTracker(storageKey);

  // Constants for styling based on state
  const statusColor = isAvailable ? 'bg-green-500' : 'bg-red-500';
  const statusLightColor = isAvailable ? 'bg-green-50' : 'bg-red-50';
  const statusBorder = isAvailable ? 'border-green-200' : 'border-red-200';
  const textColor = isAvailable ? 'text-green-700' : 'text-red-700';

  // Duration in hours (hardcoded for display context)
  const DURATION_HOURS = 6;

  // Track previous availability to detect the transition from false -> true
  const wasAvailableRef = useRef(isAvailable);

  useEffect(() => {
    // If it was NOT available, and now IS available, and we have a valid lastTaken (meaning timer finished)
    if (!wasAvailableRef.current && isAvailable && lastTaken) {
      sendNotification(
        "Médicament disponible", 
        `Vous pouvez maintenant reprendre : ${name}`
      );
    }
    wasAvailableRef.current = isAvailable;
  }, [isAvailable, lastTaken, name]);

  const handleTakeMedication = () => {
    // Request permission when user interacts
    requestNotificationPermission();
    takeMedication();
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-500 ease-in-out border ${statusBorder}`}>
      {/* Background Pulse Effect when available */}
      {isAvailable && (
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-green-100 opacity-50 blur-xl animate-pulse" />
      )}

      <div className="p-6 flex flex-col h-full justify-between relative z-10">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${statusLightColor}`}>
              <Pill className={`w-8 h-8 ${iconColorClass}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
              <p className="text-sm text-gray-500 font-medium">Toutes les {DURATION_HOURS}h</p>
            </div>
          </div>
          
          {/* Status Indicator Icon */}
          <div className={`rounded-full p-1.5 transition-colors duration-300 ${isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {isAvailable ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="py-8 flex flex-col items-center justify-center text-center">
          {isAvailable ? (
            <div className="space-y-2">
              <span className="text-5xl font-extrabold text-green-500 tracking-tight">GO</span>
              <p className="text-gray-400 font-medium">Vous pouvez prendre ce médicament</p>
            </div>
          ) : (
            <div className="space-y-1">
               <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Prochaine prise dans</p>
              <div className="font-mono text-5xl font-bold text-gray-800 tracking-tight">
                {formatTimeRemaining(timeRemaining)}
              </div>
              <p className="text-sm text-gray-400 pt-2">
                 Disponible à <span className="font-bold text-gray-600">{lastTaken ? getNextAvailableTime(lastTaken, 6 * 60 * 60 * 1000) : '--:--'}</span>
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4">
          {isAvailable ? (
            <button
              onClick={handleTakeMedication}
              className="w-full group relative flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95 touch-manipulation"
            >
              <span className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-20 transition-opacity" />
              <Clock className="w-5 h-5" />
              <span>Prendre le comprimé</span>
            </button>
          ) : (
             <div className="flex gap-3">
               <button
                disabled
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-400 font-bold py-4 px-6 rounded-2xl cursor-not-allowed"
              >
                <Clock className="w-5 h-5" />
                <span>Attendre...</span>
              </button>
              
              <button
                onClick={resetMedication}
                aria-label="Annuler la prise"
                className="flex items-center justify-center bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 p-4 rounded-2xl transition-colors active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
             </div>
          )}
        </div>
      </div>
      
      {/* Progress Bar (Bottom) for cooldown */}
      {!isAvailable && (
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-100">
           <div 
             className="h-full bg-red-500 transition-all duration-1000 linear"
             style={{ width: `${(timeRemaining / (6 * 60 * 60 * 1000)) * 100}%` }}
           />
        </div>
      )}
    </div>
  );
};

export default MedicationCard;