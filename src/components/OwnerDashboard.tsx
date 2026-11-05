import React, { useState } from 'react';
import {
  Crown,
  ShieldCheck,
  Building2,
  Users,
  IndianRupee,
  Package,
  Sparkles,
  Layers,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  LogOut,
  X,
  ExternalLink,
  Store,
  Compass,
  FileText
} from 'lucide-react';
import { OwnerUser, DEMO_OWNER } from './AuthGateway';
import { ARTISAN_VILLAGES } from '../data/artisanData';
import { OrderItem } from '../types/artisan';

interface OwnerDashboardProps {
  currentOwner: OwnerUser;
  orders: OrderItem[];
  onLogout: () => void;
  onNavigateToBuyerStore: () => void;
  onNavigateToSellerPortal: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  currentOwner,
  orders,
  onLogout,
  onNavigateToBuyerStore,
  onNavigateToSellerPortal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'clusters' | 'audits' | 'governance'>('overview');
  const [approvedAudits, setApprovedAudits] = useState<string[]>([
    'Etikoppaka Lacquer Lead-Free Inspection - Cleared',
    'Kondapalli Tella Poniki Softwood Sustainable Harvest - Verified',
    'Srikalahasti Vegetable Dye Purity Audit - Cleared',
  ]);

  const totalGMV = orders.reduce((acc, curr) => acc + curr.totalAmount, 0) + 1245000;
  const totalArtisans = ARTISAN_VILLAGES.reduce((acc, curr) => acc + curr.artisanCount, 0);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-amber-600 p-0.5 shadow-md shadow-purple-900/20">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-purple-800">
                  <Crown className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-extrabold text-stone-900 font-serif">
                    Hands2Haven
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                    Owner & Federation Console
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Central Governance for 8 Artisan Village Clusters
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateToBuyerStore}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <Compass className="w-4 h-4 text-amber-700" />
                <span className="hidden sm:inline">Buyer Marketplace</span>
              </button>

              <button
                onClick={onNavigateToSellerPortal}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Store className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">Seller Portal</span>
              </button>

              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Log out to Role Gateway"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Welcome & Role Card */}
        <div className="bg-gradient-to-r from-purple-900 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentOwner.avatarUrl}
                alt={currentOwner.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif">{currentOwner.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    {currentOwner.title}
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  {currentOwner.office} • {currentOwner.jurisdiction}
                </p>
                <p className="text-xs text-amber-200 font-medium">
                  Central statutory oversight under the GI Act 1999 & State Crafts Commission
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center">
                <div className="text-2xl font-extrabold text-amber-300">8</div>
                <div className="text-[10px] text-stone-300 uppercase tracking-wider">Heritage Villages</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center">
                <div className="text-2xl font-extrabold text-emerald-300">~{totalArtisans}</div>
                <div className="text-[10px] text-stone-300 uppercase tracking-wider">Guild Craftsmen</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-1 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            Federation Overview
          </button>
          <button
            onClick={() => setActiveTab('clusters')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'clusters'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            8 Village Guilds Directory
          </button>
          <button
            onClick={() => setActiveTab('audits')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'audits'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            GI Compliance & Quality Audits
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* High-level KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs">
                  <span>Total Cooperative GMV</span>
                  <IndianRupee className="w-4 h-4 text-purple-700" />
                </div>
                <div className="text-2xl font-black text-stone-900">
                  ₹{totalGMV.toLocaleString()}
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  Direct artisan guild disbursements
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs">
                  <span>Active Consumer Bookings</span>
                  <Package className="w-4 h-4 text-amber-700" />
                </div>
                <div className="text-2xl font-black text-stone-900">
                  {orders.length}
                </div>
                <span className="text-[11px] text-stone-500">Live marketplace consignments</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs">
                  <span>Registered Guild Artisans</span>
                  <Users className="w-4 h-4 text-indigo-700" />
                </div>
                <div className="text-2xl font-black text-stone-900">
                  ~{totalArtisans}
                </div>
                <span className="text-[11px] text-indigo-700 font-semibold">Across AP & Telangana</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs">
                  <span>GI Authenticity Compliance</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-2xl font-black text-emerald-700">99.8%</div>
                <span className="text-[11px] text-emerald-700 font-semibold">100% natural lead-free dyes</span>
              </div>
            </div>

            {/* Note on Owner features expansion */}
            <div className="p-5 rounded-3xl bg-purple-50/80 border border-purple-200 text-xs text-purple-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-purple-700" />
                <span>Owner Portal Initialized • Federation Central Governance</span>
              </div>
              <p className="leading-relaxed text-purple-800">
                You are currently in <strong>Owner / Administrator Governance Mode</strong>. You have oversight
                over all 8 historical artisan village clusters, collective cooperative sales, and quality certifications.
                As requested, we have created this login entry and navigation flow, and deeper administrative controls
                can be expanded as needed.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-stone-900 font-serif">
                  Consumer Marketplace Preview
                </h3>
                <p className="text-xs text-stone-600">
                  Check live products, interactive India map, continuous voice search, and AI camera scanner from a buyer's perspective.
                </p>
                <button
                  onClick={onNavigateToBuyerStore}
                  className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
                >
                  <span>Launch Buyer Storefront</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-stone-900 font-serif">
                  Artisan Seller Cooperative Portal
                </h3>
                <p className="text-xs text-stone-600">
                  Switch to the shopkeeper cooperative dashboard to test order milestone advancements, printable dispatch slips, and adding new crafts.
                </p>
                <button
                  onClick={onNavigateToSellerPortal}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
                >
                  <span>Launch Shopkeeper Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLUSTERS DIRECTORY */}
        {activeTab === 'clusters' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-base text-stone-900 font-serif">
                8 Primary Heritage Craft Clusters Under Federation Jurisdiction
              </h3>
              <p className="text-xs text-stone-600">
                Statutory oversight under the Geographical Indications Registry and KVIC standards
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ARTISAN_VILLAGES.map((v, i) => (
                <div
                  key={v.id}
                  className="bg-white border border-stone-200 rounded-3xl p-4 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-purple-700 text-white font-bold text-xs flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                        {v.giTagNumber}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{v.name}</h4>
                      <div className="text-[11px] text-stone-500">{v.district}, {v.state}</div>
                    </div>

                    <p className="text-xs text-stone-700 line-clamp-2">
                      {v.specialty}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
                    <div>
                      Co-op: <strong className="text-stone-800">{v.hubName}</strong>
                    </div>
                    <div>
                      Master Artisans: <strong className="text-emerald-700">~{v.artisanCount}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AUDITS */}
        {activeTab === 'audits' && (
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-base text-stone-900 font-serif">
              GI Authenticity & Raw Material Audit Records
            </h3>
            <p className="text-stone-600">
              Federation inspection protocols verifying non-toxic vegetable dyes, authentic lathe softwood, and zero synthetic chemical varnish.
            </p>

            <div className="space-y-2 divide-y divide-stone-100">
              {approvedAudits.map((audit, i) => (
                <div key={i} className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-stone-800">{audit}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Compliant
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
