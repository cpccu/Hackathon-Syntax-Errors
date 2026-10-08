import React, { useState, useEffect } from 'react';
import { X, QrCode, Download, CheckCircle, Calendar, User } from 'lucide-react';
import { generateQrDataUrl } from '../utils/qrHelper';

interface QrPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  ticketCode: string;
  studentName?: string;
}

export const QrPassModal: React.FC<QrPassModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  ticketCode,
  studentName = 'Rafid Ahmed',
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && ticketCode) {
      const payload = JSON.stringify({
        system: 'CampusOS',
        event: eventTitle,
        ticket: ticketCode,
        attendee: studentName,
        issued: new Date().toISOString(),
      });
      generateQrDataUrl(payload).then(setQrUrl);
    }
  }, [isOpen, eventTitle, ticketCode, studentName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 text-center animate-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 uppercase tracking-wider">
            Official Entry Pass
          </span>
          <h3 className="font-extrabold text-base mt-2 leading-snug">{eventTitle}</h3>
          <p className="text-xs text-blue-200 mt-1">City University CampusOS Verification</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
            {qrUrl ? (
              <img src={qrUrl} alt="Entry Pass QR" className="w-48 h-48 mx-auto rounded-xl" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-slate-200 rounded-xl text-xs text-slate-500">
                Generating Ticket...
              </div>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg inline-block border border-slate-200">
              {ticketCode}
            </span>
            <p className="text-xs font-semibold text-slate-700 pt-1">
              Attendee: {studentName}
            </p>
            <p className="text-[11px] text-slate-400">
              Present this QR code at the entrance table for 1-second admission.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Done & Save Pass
          </button>
        </div>
      </div>
    </div>
  );
};
