import {
  Compass,
  Camera,
  Mic,
  Package,
  Layers,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Store,
  User,
  UserCheck,
  LogOut
} from 'lucide-react';
import { SellerUser } from './SellerDashboard';
import { CustomerUser } from './CustomerDashboard';

export type NavTab = 'explore' | 'map' | 'villages' | 'orders';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenScanner: () => void;
  onOpenVoiceModal: () => void;
  onOpenSellerPortal: () => void;
  currentSeller: SellerUser | null;
  onOpenCustomerPortal: () => void;
  currentCustomer: CustomerUser | null;
  orderCount: number;
  onSwitchRole?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenScanner,
  onOpenVoiceModal,
  onOpenSellerPortal,
  currentSeller,
  onOpenCustomerPortal,
  currentCustomer,
  orderCount,
  onSwitchRole,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Brand Logo & Title */}
          <div
            onClick={() => onSelectTab('explore')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 p-0.5 shadow-md shadow-amber-700/20">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-amber-700">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight font-serif">
                  Hands2Haven
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  GI Guilds
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-500 hidden xs:block">
                Artisan Villages & Heritage Craft Haven
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200">
            <button
              onClick={() => onSelectTab('explore')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentTab === 'explore'
                  ? 'bg-amber-700 text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              Explore Crafts
            </button>

            <button
              onClick={() => onSelectTab('map')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentTab === 'map'
                  ? 'bg-amber-700 text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <MapPin className="w-4 h-4" />
              India & Village Map
            </button>

            <button
              onClick={() => onSelectTab('villages')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentTab === 'villages'
                  ? 'bg-amber-700 text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              8 Artisan Villages
            </button>

            <button
              onClick={() => onSelectTab('orders')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
                currentTab === 'orders'
                  ? 'bg-amber-700 text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Package className="w-4 h-4" />
              Bookings & Orders
              {orderCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-600 text-white font-extrabold">
                  {orderCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action Tools: Voice + Camera + Customer Login + Shopkeeper Login */}
          <div className="flex items-center gap-2">
            {/* Live Camera Scanner Trigger */}
            <button
              onClick={onOpenScanner}
              className="px-3 sm:px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
              title="Open Live Camera Scanner"
            >
              <Camera className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">Camera</span>
            </button>

            {/* Continuous Voice Assistant Trigger */}
            <button
              onClick={onOpenVoiceModal}
              className="px-3 sm:px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
              title="Continuous Voice Search"
            >
              <Mic className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">Voice</span>
            </button>

            {/* Customer Login / Dashboard Button */}
            <button
              onClick={onOpenCustomerPortal}
              className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all ${
                currentCustomer
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  : 'bg-stone-100 text-stone-800 border border-stone-300 hover:bg-stone-200'
              }`}
              title="Customer Login & Dashboard"
            >
              <User className="w-4 h-4 text-amber-800" />
              <span className="hidden lg:inline">
                {currentCustomer ? currentCustomer.name.split(' ')[0] : 'Customer Login'}
              </span>
            </button>

            {/* Shopkeeper (Seller) Login / Portal Button */}
            <button
              onClick={onOpenSellerPortal}
              className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all ${
                currentSeller
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
                  : 'bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-800/20'
              }`}
              title="Artisan Shopkeeper Portal"
            >
              <Store className="w-4 h-4" />
              <span className="hidden md:inline">
                {currentSeller ? `${currentSeller.name.split(' ')[0]} (Shop)` : 'Seller Portal'}
              </span>
            </button>

            {/* Switch Role / Exit to Login Gateway */}
            {onSwitchRole && (
              <button
                onClick={onSwitchRole}
                className="px-2.5 sm:px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Switch Role / Back to Login Portal"
              >
                <LogOut className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden xl:inline">Switch Role</span>
              </button>
            )}

            {/* Mobile Orders Shortcut */}
            <button
              onClick={() => onSelectTab('orders')}
              className={`md:hidden p-2 rounded-xl relative transition-all ${
                currentTab === 'orders'
                  ? 'bg-amber-700 text-white'
                  : 'bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              <Package className="w-4 h-4" />
              {orderCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                  {orderCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-stone-200 gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => onSelectTab('explore')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center font-medium ${
              currentTab === 'explore' ? 'bg-amber-700 text-white font-bold' : 'text-stone-600'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => onSelectTab('map')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center font-medium ${
              currentTab === 'map' ? 'bg-amber-700 text-white font-bold' : 'text-stone-600'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => onSelectTab('villages')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center font-medium ${
              currentTab === 'villages' ? 'bg-amber-700 text-white font-bold' : 'text-stone-600'
            }`}
          >
            8 Villages
          </button>
          <button
            onClick={() => onSelectTab('orders')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center font-medium ${
              currentTab === 'orders' ? 'bg-amber-700 text-white font-bold' : 'text-stone-600'
            }`}
          >
            Orders ({orderCount})
          </button>
        </div>
      </div>
    </header>
  );
};
