import React, { useState } from 'react';
import {
  Store,
  User,
  Crown,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Compass,
  MapPin,
  CheckCircle2,
  Package,
  Layers,
  Phone,
  Lock,
  Mail,
  Building2,
  ExternalLink
} from 'lucide-react';
import { DEMO_SELLERS, SellerUser } from './SellerDashboard';
import { DEMO_CUSTOMERS, CustomerUser } from './CustomerDashboard';
import { ARTISAN_VILLAGES } from '../data/artisanData';

export type UserRole = 'buyer' | 'seller' | 'owner';

export interface OwnerUser {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  office: string;
  jurisdiction: string;
  avatarUrl: string;
}

export const DEMO_OWNER: OwnerUser = {
  id: 'owner-1',
  name: 'Dr. K. V. Ramanayya',
  title: 'Federation Commissioner & Founder',
  phone: '+91 94400 11223',
  email: 'commissioner@hands2haven.gov.in',
  office: 'State Handicrafts Development Commission, Vijayawada',
  jurisdiction: 'Andhra Pradesh & Telangana GI Craft Guilds',
  avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
};

interface AuthGatewayProps {
  onLoginAsBuyer: (customer: CustomerUser) => void;
  onLoginAsSeller: (seller: SellerUser) => void;
  onLoginAsOwner: (owner: OwnerUser) => void;
  onContinueAsGuestBuyer: () => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  onLoginAsBuyer,
  onLoginAsSeller,
  onLoginAsOwner,
  onContinueAsGuestBuyer,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');

  // Form states
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [passwordOrPin, setPasswordOrPin] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedVillageForSeller, setSelectedVillageForSeller] = useState('Kondapalli');
  const [formError, setFormError] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (selectedRole === 'buyer') {
      const matched = DEMO_CUSTOMERS.find(
        (c) => c.phone.includes(phoneOrEmail) || c.email.toLowerCase().includes(phoneOrEmail.toLowerCase())
      );
      if (matched) {
        onLoginAsBuyer(matched);
      } else {
        const newCustomer: CustomerUser = {
          id: 'cust-' + Date.now(),
          name: fullName.trim() || 'Valued Patron',
          phone: phoneOrEmail.trim() || '+91 98480 12345',
          email: phoneOrEmail.includes('@') ? phoneOrEmail : `${fullName.toLowerCase().replace(/\s+/g, '')}@example.com`,
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          address: 'Heritage Colony, Benz Circle',
          pincode: '520010',
          memberSince: 'Today',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          favorites: ['11', '12'],
        };
        onLoginAsBuyer(newCustomer);
      }
    } else if (selectedRole === 'seller') {
      const matched = DEMO_SELLERS.find(
        (s) => s.phone.includes(phoneOrEmail) || s.email.toLowerCase().includes(phoneOrEmail.toLowerCase())
      );
      if (matched) {
        onLoginAsSeller(matched);
      } else {
        // Construct seller from input
        const customSeller: SellerUser = {
          id: 'seller-' + Date.now(),
          name: fullName.trim() || 'Master Artisan',
          village: selectedVillageForSeller,
          district: `${selectedVillageForSeller} District`,
          cooperativeName: `${selectedVillageForSeller} Mutually Aided Co-operative Crafts Society`,
          hub: `${selectedVillageForSeller} Hub`,
          artisanId: `${selectedVillageForSeller.slice(0, 3).toUpperCase()}-GI-${Math.floor(100 + Math.random() * 900)}`,
          phone: phoneOrEmail.trim() || '+91 94401 23456',
          email: `${fullName.toLowerCase().replace(/\s+/g, '')}@artisan.coop`,
          role: 'Master Artisan',
          giCertified: true,
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        };
        onLoginAsSeller(customSeller);
      }
    } else if (selectedRole === 'owner') {
      onLoginAsOwner(DEMO_OWNER);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col justify-between font-sans selection:bg-amber-600 selection:text-white">
      {/* Top Banner Bar */}
      <header className="border-b border-stone-200 bg-white/95 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 p-0.5 shadow-md shadow-amber-700/20">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-amber-700">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight font-serif">
                  Hands2Haven
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  GI Guilds
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Artisan Villages & Heritage Craft Federation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline-block text-stone-500">Direct Gateway:</span>
            <button
              onClick={onContinueAsGuestBuyer}
              className="px-3.5 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold transition-all flex items-center gap-1.5"
            >
              <span>Explore as Guest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Center Login Portal */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center">
        <div className="w-full space-y-8">
          {/* Headline & Mission */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Official Geographical Indication (GI) Crafts Portal
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif tracking-tight">
              Welcome to Hands2Haven
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Please select your role to proceed to your dedicated portal. Connect directly with
              master artisans from Etikoppaka, Kondapalli, Srikalahasti, and 8 heritage craft villages.
            </p>
          </div>

          {/* Role Selection Cards (Buyer vs Seller vs Owner) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* 1. BUYER / CUSTOMER CARD */}
            <div
              onClick={() => setSelectedRole('buyer')}
              className={`cursor-pointer rounded-3xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 ${
                selectedRole === 'buyer'
                  ? 'bg-white border-amber-600 shadow-xl shadow-amber-900/5 ring-4 ring-amber-500/10'
                  : 'bg-white/80 border-stone-200 hover:border-amber-300 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    selectedRole === 'buyer' ? 'bg-amber-700 text-white shadow-md' : 'bg-amber-100 text-amber-800'
                  }`}>
                    <User className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedRole === 'buyer' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-100 text-stone-500'
                  }`}>
                    Consumer / Patron
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-serif">Buyer Portal</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Browse authentic GI crafts, place custom bookings, search with uninterrupted continuous voice, scan crafts with AI camera, and download certificates.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>Enter as Buyer</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* 2. SELLER / SHOPKEEPER CARD */}
            <div
              onClick={() => setSelectedRole('seller')}
              className={`cursor-pointer rounded-3xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 ${
                selectedRole === 'seller'
                  ? 'bg-white border-amber-600 shadow-xl shadow-amber-900/5 ring-4 ring-amber-500/10'
                  : 'bg-white/80 border-stone-200 hover:border-amber-300 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    selectedRole === 'seller' ? 'bg-amber-700 text-white shadow-md' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <Store className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedRole === 'seller' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-stone-100 text-stone-500'
                  }`}>
                    Artisan Cooperative
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-serif">Seller (Shopkeeper)</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Master artisan and cooperative dashboard: manage village inventory, update order milestones, print speed post dispatch slips, and publish new handicrafts.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>Enter as Shopkeeper</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* 3. OWNER / FEDERATION ADMIN CARD */}
            <div
              onClick={() => setSelectedRole('owner')}
              className={`cursor-pointer rounded-3xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 ${
                selectedRole === 'owner'
                  ? 'bg-white border-amber-600 shadow-xl shadow-amber-900/5 ring-4 ring-amber-500/10'
                  : 'bg-white/80 border-stone-200 hover:border-amber-300 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    selectedRole === 'owner' ? 'bg-amber-700 text-white shadow-md' : 'bg-purple-100 text-purple-800'
                  }`}>
                    <Crown className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedRole === 'owner' ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-stone-100 text-stone-500'
                  }`}>
                    Federation Admin
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-serif">Cooperative Owner</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Central governance portal over all 8 craft clusters (Etikoppaka, Kondapalli, Srikalahasti, etc.), quality compliance inspections, and economic federation metrics.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-purple-800">
                <span>Enter as Owner</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Login Form Box with 1-Click Fast Profiles */}
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Step 2 • Authenticate as {selectedRole.toUpperCase()}
                </span>
                <h4 className="text-xl font-bold text-stone-900 font-serif mt-0.5">
                  {selectedRole === 'buyer' && 'Customer Sign In & Access'}
                  {selectedRole === 'seller' && 'Artisan Shopkeeper Sign In'}
                  {selectedRole === 'owner' && 'Federation Owner & Commissioner Sign In'}
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                {selectedRole === 'buyer' ? 'Patron Mode' : selectedRole === 'seller' ? 'Cooperative Mode' : 'Governance Mode'}
              </span>
            </div>

            {/* Quick 1-Click Demo Profiles */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Instant 1-Click Demo Logins:
              </span>

              {selectedRole === 'buyer' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {DEMO_CUSTOMERS.map((cust) => (
                    <button
                      key={cust.id}
                      type="button"
                      onClick={() => onLoginAsBuyer(cust)}
                      className="p-3 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-all flex items-center gap-2.5 group shadow-2xs"
                    >
                      <img
                        src={cust.avatarUrl}
                        alt={cust.name}
                        className="w-9 h-9 rounded-full object-cover border border-amber-300"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate group-hover:text-amber-800">
                          {cust.name}
                        </div>
                        <div className="text-[10px] text-stone-500">{cust.city}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedRole === 'seller' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {DEMO_SELLERS.map((seller) => (
                    <button
                      key={seller.id}
                      type="button"
                      onClick={() => onLoginAsSeller(seller)}
                      className="p-3 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all flex items-center gap-2.5 group shadow-2xs"
                    >
                      <img
                        src={seller.avatarUrl}
                        alt={seller.name}
                        className="w-9 h-9 rounded-full object-cover border border-emerald-300"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate group-hover:text-emerald-800">
                          {seller.name.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold truncate">
                          {seller.village} Co-op
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedRole === 'owner' && (
                <button
                  type="button"
                  onClick={() => onLoginAsOwner(DEMO_OWNER)}
                  className="w-full p-3.5 rounded-2xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/80 text-left transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={DEMO_OWNER.avatarUrl}
                      alt={DEMO_OWNER.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-400"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900 group-hover:text-purple-900">
                        {DEMO_OWNER.name}
                      </div>
                      <div className="text-[11px] text-purple-800">{DEMO_OWNER.title}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-purple-700 text-white font-bold text-xs shadow-xs">
                    Sign in as Owner →
                  </span>
                </button>
              )}
            </div>

            {/* Standard Credentials Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4 border-t border-stone-100 text-xs">
              <span className="text-xs font-bold text-stone-800 block">
                Or enter custom {selectedRole} credentials:
              </span>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Full Name / Artisan Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder={selectedRole === 'buyer' ? 'e.g. Radhika Rao' : selectedRole === 'seller' ? 'e.g. Master Sitaram' : 'e.g. Dr. K. V. Ramanayya'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">
                    {selectedRole === 'seller' ? 'Mobile / Artisan Guild ID' : 'Mobile Number or Email'}
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. +91 98480 12345"
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">
                    {selectedRole === 'seller' ? 'Cooperative Society PIN' : 'Password / Security PIN'}
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwordOrPin}
                      onChange={(e) => setPasswordOrPin(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>
              </div>

              {selectedRole === 'seller' && (
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Select Artisan Village Guild</label>
                  <select
                    value={selectedVillageForSeller}
                    onChange={(e) => setSelectedVillageForSeller(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-600"
                  >
                    {ARTISAN_VILLAGES.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name} ({v.district}) — {v.specialty.slice(0, 40)}...
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formError && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {formError}
                </p>
              )}

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onContinueAsGuestBuyer}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-600 font-semibold"
                >
                  Continue as Guest
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold shadow-md shadow-amber-800/20 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <span>Sign In as {selectedRole === 'buyer' ? 'Buyer' : selectedRole === 'seller' ? 'Shopkeeper' : 'Owner'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Quick Village Badges */}
          <div className="text-center space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Federation Clusters:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-600">
              {['Etikoppaka', 'Kondapalli', 'Srikalahasti', 'Nimmalakunta', 'Budithi', 'Machilipatnam', 'Nirmal', 'Cheriyal'].map((v) => (
                <span key={v} className="px-2.5 py-1 rounded-xl bg-stone-100 border border-stone-200">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
        <p>Hands2Haven © {new Date().getFullYear()} • Certified Geographical Indications (GI) Artisan Cooperative Federation</p>
      </footer>
    </div>
  );
};
