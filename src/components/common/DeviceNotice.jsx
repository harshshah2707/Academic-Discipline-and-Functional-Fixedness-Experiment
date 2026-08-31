import React from 'react';
import { Laptop, AlertCircle } from 'lucide-react';

export const DeviceNotice = () => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-start gap-3 text-xs text-slate-600 mb-6">
      <Laptop className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-slate-800">Recommended Environment: </span>
        For response timing accuracy and comfortable typing, we strongly encourage completing this experiment on a <strong>laptop or desktop computer</strong> with a physical keyboard.
      </div>
    </div>
  );
};
