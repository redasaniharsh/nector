import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { BRAND_NAME } from '../data/productData';
import { ASSETS } from '../assets/images';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('signature');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const pricePerUnit = 48; // Luxury confectionery price ($48 for 450G artisan apothecary jar)
  const totalPrice = pricePerUnit * quantity;

  // Handle escape key to close drawer
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckedOut(true);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-500 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#110b07] border-l border-[#261c14] shadow-2xl flex flex-col justify-between text-[#f4ede4]">
          
          {/* Top Header */}
          <div className="p-6 border-b border-[#261c14] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#ff8a1e]" />
              <h3 id="cart-drawer-title" className="font-display text-xl font-bold tracking-tight text-[#f4ede4]">
                Your Selection
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart drawer"
              className="p-1.5 rounded-full hover:bg-[#261c14] text-[#9c8f80] hover:text-[#f4ede4] transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-[#ff8a1e]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {checkedOut ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="font-display text-2xl font-bold text-[#f4ede4]">
                  Orchard Harvest Reserved
                </h4>
                <p className="font-body text-sm text-[#9c8f80] max-w-xs">
                  Your 450G {BRAND_NAME} apothecary jar is queued for cold-shipment packaging in our temperature-controlled vault.
                </p>
                <button
                  onClick={() => {
                    setCheckedOut(false);
                    onClose();
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#ff8a1e] text-[#0b0704] font-bold text-xs uppercase tracking-wider"
                >
                  Return to Exploration
                </button>
              </div>
            ) : (
              <>
                {/* Product Card */}
                <div className="flex space-x-4 p-4 rounded-2xl bg-[#170f0a] border border-[#2a1e16]">
                  <img
                    src={ASSETS.heroJar}
                    alt="NÉCTAR Apothecary Jar"
                    className="w-24 h-24 object-contain rounded-xl bg-[#0b0704] p-1 border border-[#261c14]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-base text-[#f4ede4]">
                          {BRAND_NAME} Crystal Jar
                        </h4>
                        <span className="font-tech text-sm font-bold text-[#ff8a1e]">
                          ${pricePerUnit}
                        </span>
                      </div>
                      <p className="font-tech text-xs text-[#9c8f80] mt-0.5">
                        450G • Fluted Apothecary Glass
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-3 bg-[#0b0704] border border-[#2e2117] rounded-full px-3 py-1">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          aria-label="Decrease quantity"
                          className="text-[#9c8f80] hover:text-[#f4ede4] p-0.5 cursor-pointer focus-visible:text-[#ff8a1e]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-tech text-xs font-semibold w-4 text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          aria-label="Increase quantity"
                          className="text-[#9c8f80] hover:text-[#f4ede4] p-0.5 cursor-pointer focus-visible:text-[#ff8a1e]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-tech text-xs text-[#9c8f80]">
                        Total: ${(pricePerUnit * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Variant Selection */}
                <div className="space-y-3">
                  <span className="font-tech text-xs text-[#9c8f80] uppercase tracking-wider block">
                    Select Orchard Curation
                  </span>
                  
                  <div className="space-y-2 font-tech text-xs">
                    <button
                      onClick={() => setSelectedVariant('signature')}
                      className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                        selectedVariant === 'signature'
                          ? 'border-[#ff8a1e] bg-[#ff8a1e]/10 text-[#f4ede4]'
                          : 'border-[#261c14] bg-[#140e0a] text-[#9c8f80] hover:border-[#38281d]'
                      }`}
                    >
                      <div>
                        <span className="font-semibold block text-[#f4ede4]">
                          Heritage 5-Fruit Curated Jar
                        </span>
                        <span className="text-[10px] text-[#9c8f80]">
                          Alphonso Mango, White Peach, Wild Berry, Citrus, Apple
                        </span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-[#ff8a1e]" />
                    </button>

                    <button
                      onClick={() => setSelectedVariant('mango')}
                      className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                        selectedVariant === 'mango'
                          ? 'border-[#ff8a1e] bg-[#ff8a1e]/10 text-[#f4ede4]'
                          : 'border-[#261c14] bg-[#140e0a] text-[#9c8f80] hover:border-[#38281d]'
                      }`}
                    >
                      <div>
                        <span className="font-semibold block text-[#f4ede4]">
                          Mono-Cultivar Alphonso Reserve
                        </span>
                        <span className="text-[10px] text-[#9c8f80]">
                          Single-estate Ratnagiri Alphonso mango nectar
                        </span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-[#ff8a1e]" />
                    </button>
                  </div>
                </div>

                {/* Shipping & Guarantee perks */}
                <div className="space-y-2 pt-2 border-t border-[#261c14] font-tech text-xs text-[#9c8f80]">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-[#ff8a1e]" />
                    <span>Complimentary climate-controlled express shipping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Sealed with tamper-evident beeswax & copper seal</span>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Footer Checkout Button */}
          {!checkedOut && (
            <div className="p-6 border-t border-[#261c14] space-y-3 bg-[#0d0805]">
              <div className="flex justify-between items-center font-display">
                <span className="text-sm font-tech text-[#9c8f80] uppercase tracking-wider">
                  Order Total
                </span>
                <span className="text-2xl font-black text-[#ff8a1e]">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 px-6 rounded-full bg-[#ff8a1e] hover:bg-[#ff9c3a] text-[#0b0704] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(255,138,30,0.4)] disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
              >
                {isCheckingOut ? (
                  <span>Securing Harvest Batch...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm & Reserve Jar (${totalPrice})</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
