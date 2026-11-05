import React, { useState } from 'react';
import {
  ShoppingBag,
  ShieldCheck,
  Volume2,
  Info,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { Product } from '../types/artisan';
import { speakText } from '../hooks/useVoiceInput';

interface ProductCardProps {
  product: Product;
  onBookProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onBookProduct }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    const pronunciationText = `${product.name} from ${product.village}, crafted by ${product.artisanName}`;
    speakText(pronunciationText);
  };

  return (
    <>
      <div className="group bg-white border border-stone-200/90 rounded-2xl overflow-hidden hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between">
        {/* Product Image & Badges */}
        <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
          {!imgError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-amber-50/60 text-center">
              <Sparkles className="w-8 h-8 text-amber-600 mb-1" />
              <span className="text-xs font-bold text-stone-900">{product.name}</span>
              <span className="text-[10px] text-stone-500 mt-0.5">{product.village} • {product.material}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-700 text-white shadow-xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              {product.village}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-md shadow-xs ${
                product.stockStatus === 'In Stock'
                  ? 'bg-white/95 text-emerald-800 border border-emerald-200'
                  : 'bg-white/95 text-amber-800 border border-amber-200'
              }`}
            >
              {product.stockStatus}
            </span>
          </div>

          {/* Audio Pronunciation Button */}
          <button
            onClick={handlePronounce}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-amber-800 hover:bg-white border border-stone-200 shadow-xs transition-all"
            title="Hear craft pronunciation"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          {/* Telugu Heritage Name in corner */}
          {product.teluguName && (
            <div className="absolute bottom-2 left-2.5 right-2.5">
              <span className="text-[11px] font-semibold text-white drop-shadow">
                {product.teluguName}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-[11px] text-stone-500">
              <span className="text-amber-800 font-bold">{product.category}</span>
              <span>{product.hub}</span>
            </div>

            <h3 className="text-sm font-bold text-stone-900 mt-1 line-clamp-1 group-hover:text-amber-800 transition-colors">
              {product.name}
            </h3>

            <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications Pills */}
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 text-[11px] space-y-1">
            <div className="flex justify-between text-stone-500">
              <span>Material:</span>
              <span className="font-semibold text-stone-800 truncate max-w-[130px]">{product.material}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Artisan:</span>
              <span className="text-amber-900 font-semibold truncate max-w-[130px]">{product.artisanName}</span>
            </div>
          </div>

          {/* Pricing & Booking CTA */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-stone-900">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold block">
                Coop Fair Trade Price
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowDetailModal(true)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                title="View full craftsmanship details"
              >
                <Info className="w-4 h-4" />
              </button>

              <button
                onClick={() => onBookProduct(product)}
                className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail & Process Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative aspect-video">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-stone-700 hover:text-stone-950 shadow"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-700 text-white">
                  {product.village} • {product.hub}
                </span>
                <h3 className="text-lg font-bold text-white drop-shadow mt-1">{product.name}</h3>
              </div>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs text-stone-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px] mb-1">
                  Craft Overview & Significance
                </h4>
                <p className="text-stone-700">{product.description}</p>
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/60 space-y-2">
                <h4 className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
                  Traditional Production Technique
                </h4>
                <p className="text-stone-800">{product.craftProcess}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">Dimensions</span>
                  <div className="font-semibold text-stone-900 mt-0.5">{product.dimensions}</div>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-bold">Approx Weight</span>
                  <div className="font-semibold text-stone-900 mt-0.5">{product.weight}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px] mb-1">
                  Care & Preservation Guide
                </h4>
                <p className="text-stone-600">{product.careInstructions}</p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-stone-200">
                <div>
                  <span className="text-xs text-stone-500">Co-op Price:</span>
                  <div className="text-lg font-bold text-amber-900">₹{product.price}</div>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    onBookProduct(product);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                >
                  <ShoppingBag className="w-4 h-4" /> Book This Artifact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
