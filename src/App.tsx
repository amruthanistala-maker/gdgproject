import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Camera,
  Mic,
  MicOff,
  ShoppingBag,
  Sparkles,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  Store,
  Compass,
  Heart,
  User,
  Crown,
  LogOut
} from 'lucide-react';
import { Navbar, NavTab } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { VillageDirectory } from './components/VillageDirectory';
import { CameraScannerModal } from './components/CameraScannerModal';
import { AudioInputModal } from './components/AudioInputModal';
import { BookingModal } from './components/BookingModal';
import { OrdersView } from './components/OrdersView';
import { ArtisanMap } from './components/ArtisanMap';
import { SellerDashboard, SellerUser, DEMO_SELLERS } from './components/SellerDashboard';
import { CustomerDashboard, CustomerUser, DEMO_CUSTOMERS } from './components/CustomerDashboard';
import { AuthGateway, OwnerUser, DEMO_OWNER } from './components/AuthGateway';
import { OwnerDashboard } from './components/OwnerDashboard';
import { ARTISAN_PRODUCTS, ARTISAN_VILLAGES } from './data/artisanData';
import { Product, OrderItem, CraftCategory } from './types/artisan';
import { useVoiceInput } from './hooks/useVoiceInput';

export default function App() {
  // Opening Gateway State: shows login page on first load
  const [activeRole, setActiveRole] = useState<'gateway' | 'buyer' | 'seller' | 'owner'>('gateway');

  const [currentTab, setCurrentTab] = useState<NavTab>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillage, setSelectedVillage] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriceMax, setSelectedPriceMax] = useState<number>(3000);
  const [onlyCoopVerified, setOnlyCoopVerified] = useState<boolean>(false);

  // Products state (allows shopkeepers to add products)
  const [productsList, setProductsList] = useState<Product[]>(ARTISAN_PRODUCTS);

  // Seller Dashboard state
  const [currentSeller, setCurrentSeller] = useState<SellerUser | null>(() => {
    const saved = localStorage.getItem('hands2haven_seller');
    return saved ? JSON.parse(saved) : null;
  });
  const [isSellerPortalOpen, setIsSellerPortalOpen] = useState(false);

  // Customer Dashboard state
  const [currentCustomer, setCurrentCustomer] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('hands2haven_customer');
    return saved ? JSON.parse(saved) : null;
  });
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);

  // Owner state
  const [currentOwner, setCurrentOwner] = useState<OwnerUser>(DEMO_OWNER);

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProductForBooking, setSelectedProductForBooking] = useState<Product | null>(null);

  // Orders store
  const [orders, setOrders] = useState<OrderItem[]>([]);

  // Inline Quick Voice inside Search Bar
  const {
    isListening: isSearchMicListening,
    fullText: searchVoiceText,
    startListening: startSearchMic,
    stopListening: stopSearchMic,
  } = useVoiceInput({
    language: 'en-IN',
    onFinalResult: (text) => {
      setSearchQuery(text);
      stopSearchMic();
    },
  });

  // Sync inline voice text to search query
  useEffect(() => {
    if (searchVoiceText) {
      setSearchQuery(searchVoiceText);
    }
  }, [searchVoiceText]);

  // Load orders from server on mount
  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch initial orders from server:', err);
      });
  }, []);

  // Filter products
  const filteredProducts = productsList.filter((product) => {
    const matchesVillage =
      selectedVillage === 'All' ||
      product.village.toLowerCase() === selectedVillage.toLowerCase();

    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;

    const matchesPrice = product.price <= selectedPriceMax;
    const matchesCoop = !onlyCoopVerified || product.coopStatus === 'Coop-Verified';

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.village.toLowerCase().includes(q) ||
      product.material.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      product.artisanName.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      (product.teluguName && product.teluguName.includes(q));

    return matchesVillage && matchesCategory && matchesPrice && matchesCoop && matchesSearch;
  });

  const handleOpenBooking = (product: Product) => {
    setSelectedProductForBooking(product);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
  };

  const handleUpdateOrderStatus = async (orderId: string, nextStatus: OrderItem['status']) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (e) {
      console.warn('Order status update offline notice:', e);
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  const handleCancelOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleSelectVillageFilter = (villageName: string) => {
    setSelectedVillage(villageName);
    setCurrentTab('explore');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Seller authentication handlers
  const handleSellerLogin = (seller: SellerUser) => {
    setCurrentSeller(seller);
    localStorage.setItem('hands2haven_seller', JSON.stringify(seller));
    setActiveRole('seller');
  };

  const handleSellerLogout = () => {
    setCurrentSeller(null);
    localStorage.removeItem('hands2haven_seller');
    setActiveRole('gateway');
  };

  // Customer authentication handlers
  const handleCustomerLogin = (customer: CustomerUser) => {
    setCurrentCustomer(customer);
    localStorage.setItem('hands2haven_customer', JSON.stringify(customer));
    setActiveRole('buyer');
  };

  const handleCustomerLogout = () => {
    setCurrentCustomer(null);
    localStorage.removeItem('hands2haven_customer');
  };

  // Owner authentication handler
  const handleOwnerLogin = (owner: OwnerUser) => {
    setCurrentOwner(owner);
    setActiveRole('owner');
  };

  // Return to Gateway / Switch Role
  const handleReturnToGateway = () => {
    setActiveRole('gateway');
  };

  // Add new craft product from Seller Dashboard
  const handleAddNewProduct = (newProduct: Product) => {
    setProductsList((prev) => [newProduct, ...prev]);
  };

  const CATEGORIES: CraftCategory[] = [
    'Wooden Crafts',
    'Cloth & Textiles',
    'Jute & Fiber',
    'Leather Art',
    'Metal & Brass',
    'Bamboo & Tribal',
  ];

  // 1. INITIAL LANDING SCREEN: Show Login Page First (Seller, Owner, or Buyer)
  if (activeRole === 'gateway') {
    return (
      <AuthGateway
        onLoginAsBuyer={(customer) => {
          handleCustomerLogin(customer);
          setCurrentTab('explore');
        }}
        onLoginAsSeller={(seller) => {
          handleSellerLogin(seller);
        }}
        onLoginAsOwner={(owner) => {
          handleOwnerLogin(owner);
        }}
        onContinueAsGuestBuyer={() => {
          setActiveRole('buyer');
          setCurrentTab('explore');
        }}
      />
    );
  }

  // 2. SELLER / ARTISAN SHOPKEEPER FULL VIEW
  if (activeRole === 'seller') {
    return (
      <SellerDashboard
        isFullScreen={true}
        currentSeller={currentSeller || DEMO_SELLERS[0]}
        onLogin={handleSellerLogin}
        onLogout={handleSellerLogout}
        products={productsList}
        orders={orders}
        onAddProduct={handleAddNewProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onClose={handleReturnToGateway}
        onNavigateToBuyerStore={() => {
          setActiveRole('buyer');
          setCurrentTab('explore');
        }}
      />
    );
  }

  // 3. OWNER / FEDERATION GOVERNANCE FULL VIEW
  if (activeRole === 'owner') {
    return (
      <OwnerDashboard
        currentOwner={currentOwner || DEMO_OWNER}
        orders={orders}
        onLogout={handleReturnToGateway}
        onNavigateToBuyerStore={() => {
          setActiveRole('buyer');
          setCurrentTab('explore');
        }}
        onNavigateToSellerPortal={() => {
          setActiveRole('seller');
        }}
      />
    );
  }

  // 4. BUYER / CUSTOMER MARKETPLACE VIEW
  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenSellerPortal={() => setActiveRole('seller')}
        currentSeller={currentSeller}
        onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
        currentCustomer={currentCustomer}
        orderCount={orders.length}
        onSwitchRole={handleReturnToGateway}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {currentTab === 'explore' && (
          <>
            {/* Hero Section (Light Warm Theme) */}
            <section className="relative rounded-3xl overflow-hidden border border-amber-200/90 bg-gradient-to-br from-amber-50 via-white to-orange-50/40 p-6 sm:p-10 shadow-xs">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100/80 text-amber-900 border border-amber-300">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Andhra Pradesh & Telangana GI Crafts Federation
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-stone-900 font-serif tracking-tight leading-tight">
                  Authentic Crafts from{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600">
                    Artisan Villages
                  </span>
                </h1>

                <p className="text-stone-600 text-xs sm:text-base leading-relaxed">
                  Direct procurement from master craftsmen of <strong>Etikoppaka</strong>,{' '}
                  <strong>Kondapalli</strong>, <strong>Srikalahasti</strong>, <strong>Nimmalakunta</strong>,{' '}
                  <strong>Budithi</strong>, <strong>Machilipatnam</strong>, <strong>Nirmal</strong>, and{' '}
                  <strong>Cheriyal</strong>. Featuring lacquerware, hand-painted Kalamkari cloth, hand-braided jute bags, and brassware.
                </p>

                {/* Hero Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="px-5 py-3 rounded-2xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-800/20 active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    AI Live Camera Scanner
                  </button>

                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="px-5 py-3 rounded-2xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs active:scale-95"
                  >
                    <Mic className="w-4 h-4 text-amber-700" />
                    Voice Search (Continuous)
                  </button>

                  <button
                    onClick={() => setActiveRole('seller')}
                    className="px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs"
                  >
                    <Store className="w-4 h-4 text-emerald-700" />
                    Shopkeeper (Seller) Portal
                  </button>

                  <button
                    onClick={() => setActiveRole('owner')}
                    className="px-5 py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs"
                  >
                    <Crown className="w-4 h-4 text-purple-700" />
                    Owner Governance
                  </button>

                  <button
                    onClick={handleReturnToGateway}
                    className="px-4 py-3 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                    title="Switch user role or return to login page"
                  >
                    <LogOut className="w-4 h-4 text-stone-500" />
                    Switch Role
                  </button>
                </div>
              </div>

              {/* Fast 8-Villages Quick Bar */}
              <div className="relative z-10 mt-8 pt-6 border-t border-amber-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                    Direct Village Filters:
                  </span>
                  <button
                    onClick={() => setCurrentTab('villages')}
                    className="text-xs text-amber-800 hover:underline flex items-center gap-1 font-semibold transition-colors"
                  >
                    View All 8 Dossiers <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setSelectedVillage('All')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedVillage === 'All'
                        ? 'bg-amber-700 text-white font-bold shadow-xs'
                        : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                    }`}
                  >
                    All Villages ({productsList.length})
                  </button>

                  {ARTISAN_VILLAGES.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVillage(v.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedVillage === v.name
                          ? 'bg-amber-700 text-white font-bold shadow-xs'
                          : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200 hover:border-amber-400'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Search & Comprehensive Filters Bar (Light Theme) */}
            <section className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Search Bar with inline continuous voice button */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search by craft name, village (e.g. Kondapalli, Etikoppaka), material, or jute bags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-24 py-2.5 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-colors"
                  />

                  {/* Inline Voice Mic Button */}
                  <button
                    onClick={isSearchMicListening ? stopSearchMic : startSearchMic}
                    className={`absolute right-2 top-2 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      isSearchMicListening
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-stone-200/80 text-stone-700 hover:text-stone-900 hover:bg-stone-300'
                    }`}
                    title={isSearchMicListening ? 'Stop continuous voice listening' : 'Start uninterrupted voice search'}
                  >
                    {isSearchMicListening ? <Mic className="w-3.5 h-3.5 animate-bounce" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isSearchMicListening ? 'Listening...' : 'Voice'}</span>
                  </button>
                </div>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-2.5 rounded-xl bg-stone-100 text-stone-600 hover:text-stone-900 text-xs flex items-center justify-center transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Craft Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-stone-500 font-bold whitespace-nowrap text-[11px] uppercase tracking-wider">
                  Category:
                </span>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
                    selectedCategory === 'All'
                      ? 'bg-amber-700 text-white font-bold shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All Types
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-amber-700 text-white font-bold shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Secondary Filter toggles (Max Price, Coop Only) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-stone-600">Max Price: ₹{selectedPriceMax}</span>
                  <input
                    type="range"
                    min={200}
                    max={2500}
                    step={50}
                    value={selectedPriceMax}
                    onChange={(e) => setSelectedPriceMax(Number(e.target.value))}
                    className="accent-amber-700 w-32 cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyCoopVerified}
                      onChange={(e) => setOnlyCoopVerified(e.target.checked)}
                      className="rounded border-stone-300 text-amber-700 focus:ring-amber-600 bg-white"
                    />
                    <span>Cooperative Verified Only</span>
                  </label>

                  {(selectedVillage !== 'All' || selectedCategory !== 'All' || searchQuery || onlyCoopVerified || selectedPriceMax < 2500) && (
                    <button
                      onClick={() => {
                        setSelectedVillage('All');
                        setSelectedCategory('All');
                        setSearchQuery('');
                        setOnlyCoopVerified(false);
                        setSelectedPriceMax(2500);
                      }}
                      className="text-amber-800 hover:underline text-xs font-semibold"
                    >
                      Reset all filters
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 font-serif">
                  Village Craft Collections
                  <span className="text-xs font-sans font-normal text-stone-500">
                    ({filteredProducts.length} items available)
                  </span>
                </h3>
                {selectedVillage !== 'All' && (
                  <p className="text-xs text-amber-800 font-medium">
                    Showing verified artifacts from <strong>{selectedVillage}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto text-amber-700">
                  <Search className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-stone-900">
                  No crafts match your current criteria
                </h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Try clearing some filters or searching for specific craft terms like "lacquer", "kalamkari", "dancing doll", or "jute".
                </p>
                <button
                  onClick={() => {
                    setSelectedVillage('All');
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl text-xs"
                >
                  Show All Village Crafts
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBookProduct={handleOpenBooking}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Interactive India & Village Map Tab */}
        {currentTab === 'map' && (
          <ArtisanMap onSelectVillageFilter={handleSelectVillageFilter} />
        )}

        {/* 8 Artisan Villages Tab */}
        {currentTab === 'villages' && (
          <VillageDirectory onSelectVillageFilter={handleSelectVillageFilter} />
        )}

        {/* Bookings & Orders Tab */}
        {currentTab === 'orders' && (
          <OrdersView
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onCancelOrder={handleCancelOrder}
            onBookMore={() => setCurrentTab('explore')}
          />
        )}
      </main>

      {/* Footer (Light Theme) */}
      <footer className="mt-16 bg-white border-t border-stone-200 py-10 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="font-serif font-bold text-sm text-stone-900">
              Hands2Haven Artisan Craft Federation
            </div>
            <p className="text-stone-500">
              Direct bridge to certified Indian craft villages with AI camera authentication, uninterrupted continuous audio search, customer accounts, and shopkeeper cooperative portals.
            </p>
          </div>
          <div className="flex items-center gap-4 text-stone-600 flex-wrap justify-center">
            <span>Etikoppaka</span>
            <span>•</span>
            <span>Kondapalli</span>
            <span>•</span>
            <span>Srikalahasti</span>
            <span>•</span>
            <span>Nimmalakunta</span>
            <span>•</span>
            <span>Budithi</span>
            <span>•</span>
            <button
              onClick={handleReturnToGateway}
              className="text-amber-800 font-bold hover:underline"
            >
              Login Gateway
            </button>
            <span>•</span>
            <button
              onClick={() => setIsCustomerPortalOpen(true)}
              className="text-amber-800 font-bold hover:underline"
            >
              Customer Account
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveRole('seller')}
              className="text-amber-800 font-bold hover:underline"
            >
              Seller Dashboard
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveRole('owner')}
              className="text-purple-800 font-bold hover:underline"
            >
              Owner Console
            </button>
          </div>
        </div>
      </footer>

      {/* Customer Dashboard Modal */}
      {isCustomerPortalOpen && (
        <CustomerDashboard
          currentCustomer={currentCustomer}
          onLogin={handleCustomerLogin}
          onLogout={handleCustomerLogout}
          orders={orders}
          onCancelOrder={handleCancelOrder}
          onSelectProductToBook={handleOpenBooking}
          onClose={() => setIsCustomerPortalOpen(false)}
        />
      )}

      {/* Camera Scanner Modal */}
      <CameraScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSelectProductToBook={handleOpenBooking}
      />

      {/* Uninterrupted Voice Search Modal */}
      <AudioInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onApplyFilter={(village) => {
          setSelectedVillage(village);
          setCurrentTab('explore');
        }}
        onSelectProductToBook={handleOpenBooking}
        onNavigateToOrders={() => setCurrentTab('orders')}
      />

      {/* Customer Booking Modal */}
      <BookingModal
        product={selectedProductForBooking}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedProductForBooking(null);
        }}
        onBookingSuccess={handleBookingSuccess}
        currentCustomer={currentCustomer}
      />
    </div>
  );
}
