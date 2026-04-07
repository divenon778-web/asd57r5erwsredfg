import React, { useEffect, useState } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { getOfferings, purchasePackage } from '../lib/revenuecat';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaywallModal({ isOpen, onClose, onSuccess }: PaywallModalProps) {
  const [offering, setOffering] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadOfferings();
    }
  }, [isOpen]);

  const loadOfferings = async () => {
    setIsLoading(true);
    setError(null);
    const currentOffering = await getOfferings();
    if (currentOffering) {
      setOffering(currentOffering);
    } else {
      setError("No offerings available at the moment.");
    }
    setIsLoading(false);
  };

  const handlePurchase = async (pkg: any) => {
    setIsPurchasing(true);
    setError(null);
    try {
      const isPro = await purchasePackage(pkg);
      if (isPro) {
        onSuccess();
      } else {
        setError("Purchase successful, but entitlement not granted.");
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        setError(e.message || "An error occurred during purchase.");
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Upgrade to Structra Pro</h2>
          <p className="text-gray-600 mb-6">Unlock advanced AI prompt fixing and unlimited usage.</p>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
          ) : error ? (
            <div className="text-red-500 mb-4">{error}</div>
          ) : offering ? (
            <div className="space-y-3">
              {offering.availablePackages.map((pkg: any) => (
                <button
                  key={pkg.identifier}
                  onClick={() => handlePurchase(pkg)}
                  disabled={isPurchasing}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-black hover:bg-gray-50 transition-all disabled:opacity-50 text-left"
                >
                  <div>
                    <div className="font-semibold text-lg">{pkg.product.title}</div>
                    <div className="text-sm text-gray-500">{pkg.product.description}</div>
                  </div>
                  <div className="font-bold text-xl">
                    {pkg.product.priceString}
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-8 space-y-3 text-left">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Unlimited prompt fixes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Advanced AI models</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Priority support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
