import React, { useState } from 'react';
import {
  Store,
  Package,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  Truck,
  IndianRupee,
  ShieldCheck,
  Edit,
  Trash2,
  LogOut,
  User,
  ShoppingBag,
  Layers,
  Search,
  Filter,
  FileText,
  Printer,
  X,
  AlertCircle,
  Eye,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Product, OrderItem, CraftCategory } from '../types/artisan';
import { ARTISAN_VILLAGES } from '../data/artisanData';

export interface SellerUser {
  id: string;
  name: string;
  teluguName?: string;
  village: string;
  district: string;
  cooperativeName: string;
  hub: string;
  artisanId: string;
  phone: string;
  email: string;
  role: 'Master Artisan' | 'Cooperative Society Manager' | 'Guild Secretary';
  giCertified: boolean;
  avatarUrl: string;
}

export const DEMO_SELLERS: SellerUser[] = [
  {
    id: 'seller-1',
    name: 'Sitaram Achari',
    teluguName: 'సీతారాం ఆచారి',
    village: 'Kondapalli',
    district: 'NTR District / Vijayawada',
    cooperativeName: 'Kondapalli Mutually Aided Co-operative Crafts Society',
    hub: 'Vijayawada Hub',
    artisanId: 'KOP-GI-44-202',
    phone: '+91 94401 23456',
    email: 'sitaram.kondapalli@artisan.coop',
    role: 'Master Artisan',
    giCertified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'seller-2',
    name: 'Appa Rao Varma',
    teluguName: 'అప్పారావు వర్మ',
    village: 'Etikoppaka',
    district: 'Visakhapatnam District',
    cooperativeName: 'Etikoppaka Lacquerware Artisans Cooperative Society',
    hub: 'Visakhapatnam Hub',
    artisanId: 'ETK-GI-93-108',
    phone: '+91 98480 54321',
    email: 'apparao.etikoppaka@artisan.coop',
    role: 'Cooperative Society Manager',
    giCertified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'seller-3',
    name: 'Subrahmanyam Chetty',
    teluguName: 'సుబ్రహ్మణ్యం శెట్టి',
    village: 'Srikalahasti',
    district: 'Tirupati District',
    cooperativeName: 'Srikalahasti Kalamkari Karigar Sangam',
    hub: 'Srikalahasti Hub',
    artisanId: 'SKH-GI-19-312',
    phone: '+91 94412 87654',
    email: 'subrahmanyam@kalamkari.org',
    role: 'Master Artisan',
    giCertified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
];

interface SellerDashboardProps {
  currentSeller: SellerUser | null;
  onLogin: (seller: SellerUser) => void;
  onLogout: () => void;
  products: Product[];
  orders: OrderItem[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderItem['status']) => void;
  onClose: () => void;
  isFullScreen?: boolean;
  onNavigateToBuyerStore?: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  currentSeller,
  onLogin,
  onLogout,
  products,
  orders,
  onAddProduct,
  onUpdateOrderStatus,
  onClose,
  isFullScreen = false,
  onNavigateToBuyerStore,
}) => {
  // Tabs inside dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'add_product'>('overview');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | OrderItem['status']>('All');
  const [selectedInvoice, setSelectedInvoice] = useState<OrderItem | null>(null);

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Add Product Form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductTelugu, setNewProductTelugu] = useState('');
  const [newProductVillage, setNewProductVillage] = useState('Kondapalli');
  const [newProductCategory, setNewProductCategory] = useState<CraftCategory>('Wooden Crafts');
  const [newProductPrice, setNewProductPrice] = useState('650');
  const [newProductOriginalPrice, setNewProductOriginalPrice] = useState('800');
  const [newProductMaterial, setNewProductMaterial] = useState('Soft Wood Punnuku');
  const [newProductDyes, setNewProductDyes] = useState('Natural Vegetable Dyes & Tree Lacquer');
  const [newProductDimensions, setNewProductDimensions] = useState('15 cm x 8 cm x 8 cm');
  const [newProductWeight, setNewProductWeight] = useState('180 grams');
  const [newProductStock, setNewProductStock] = useState<'In Stock' | 'Low Stock' | 'Crafted to Order'>('In Stock');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductProcess, setNewProductProcess] = useState('');
  const [newProductImageUrl, setNewProductImageUrl] = useState('');
  const [productSuccessMsg, setProductSuccessMsg] = useState('');

  // Filter orders for the logged-in seller
  const sellerOrders = currentSeller
    ? orders.filter(
        (o) =>
          o.village.toLowerCase() === currentSeller.village.toLowerCase() ||
          o.hub.toLowerCase().includes(currentSeller.village.toLowerCase()) ||
          o.artisanName.toLowerCase().includes(currentSeller.name.split(' ')[0].toLowerCase())
      )
    : [];

  const displayOrders = sellerOrders.length > 0 ? sellerOrders : orders;

  // Filter products for the logged-in seller
  const sellerProducts = currentSeller
    ? products.filter(
        (p) =>
          p.village.toLowerCase() === currentSeller.village.toLowerCase() ||
          p.artisanName.toLowerCase().includes(currentSeller.name.split(' ')[0].toLowerCase())
      )
    : products;

  // Sales calculations
  const totalRevenue = displayOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const pendingOrders = displayOrders.filter(
    (o) => o.status === 'Booked' || o.status === 'Cooperative Assigned' || o.status === 'Handcrafting & QC'
  );
  const dispatchedOrders = displayOrders.filter((o) => o.status === 'Dispatched' || o.status === 'Delivered');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const matched = DEMO_SELLERS.find(
      (s) => s.phone.includes(loginPhone) || s.email.toLowerCase().includes(loginPhone.toLowerCase())
    );

    if (matched) {
      onLogin(matched);
    } else {
      // Default to Master Sitaram
      onLogin(DEMO_SELLERS[0]);
    }
  };

  const handleQuickDemoLogin = (seller: SellerUser) => {
    onLogin(seller);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductPrice) {
      return;
    }

    const created: Product = {
      id: 'prod-' + Date.now(),
      name: newProductName.trim(),
      teluguName: newProductTelugu.trim() || undefined,
      village: newProductVillage,
      district: currentSeller?.district || 'Cooperative Cluster',
      state: 'Andhra Pradesh',
      price: Number(newProductPrice) || 500,
      originalPrice: Number(newProductOriginalPrice) || undefined,
      material: newProductMaterial.trim() || 'Natural Raw Craft Material',
      dyesAndFinish: newProductDyes.trim() || 'Organic Botanical Vegetable Pigments',
      coopStatus: 'Coop-Verified',
      artisanName: currentSeller ? currentSeller.name : 'Master Cooperative Artisan',
      hub: currentSeller ? currentSeller.hub : `${newProductVillage} Hub`,
      stockStatus: newProductStock,
      category: newProductCategory,
      description: newProductDescription.trim() || `Authentic handcrafted heritage item from ${newProductVillage}.`,
      dimensions: newProductDimensions.trim() || 'Standard artisanal size',
      weight: newProductWeight.trim() || '250 grams',
      giCertified: true,
      imageUrl:
        newProductImageUrl.trim() ||
        'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80',
      craftProcess: newProductProcess.trim() || 'Handmade on traditional wood lathe or handloom using natural binders.',
      careInstructions: 'Clean with soft dry muslin cloth. Keep away from water immersion.',
    };

    onAddProduct(created);
    setProductSuccessMsg(`Craft "${created.name}" successfully added to village cooperative catalog!`);

    // Reset inputs
    setNewProductName('');
    setNewProductTelugu('');
    setNewProductDescription('');
    setNewProductImageUrl('');

    setTimeout(() => {
      setProductSuccessMsg('');
      setActiveTab('inventory');
    }, 1500);
  };

  // If not logged in, render light Shopkeeper Login Modal
  if (!currentSeller) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-amber-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/20">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                  Artisan Shopkeeper Portal
                </h2>
                <p className="text-xs text-stone-600">
                  Seller dashboard for cooperative societies & craftsmen
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Login Content */}
          <div className="p-6 space-y-6">
            {/* Quick 1-Click Demo Profiles */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                Quick Login as Master Artisan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_SELLERS.map((seller) => (
                  <button
                    key={seller.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(seller)}
                    className="p-3 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={seller.avatarUrl}
                        alt={seller.name}
                        className="w-8 h-8 rounded-full object-cover border border-amber-300"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate group-hover:text-amber-800">
                          {seller.name.split(' ')[0]}
                        </div>
                        <span className="text-[10px] text-amber-700 font-semibold block">
                          {seller.village}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-500 line-clamp-1">{seller.role}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2 border-t border-stone-100">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  Mobile Number / Artisan Cooperative ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 94401 23456 or KOP-GI-44"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  Password / Guild PIN
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
                />
              </div>

              {loginError && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-700/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4" />
                Sign In to Seller Dashboard
              </button>
            </form>

            <div className="text-center text-[11px] text-stone-500 bg-stone-50 p-3 rounded-2xl border border-stone-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 inline mr-1" />
              Verified under Khadi & Village Industries Commission (KVIC) and GI Act.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Shopkeeper / Seller Dashboard Screen
  const dashboardHeader = (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-stone-200 bg-amber-50/70 gap-3">
      <div className="flex items-center gap-3">
        <img
          src={currentSeller.avatarUrl}
          alt={currentSeller.name}
          className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-600 shadow-sm"
        />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-stone-900 font-serif">
              {currentSeller.name}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
              {currentSeller.role}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> GI Verified
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-0.5">
            {currentSeller.village} • {currentSeller.cooperativeName} (ID: {currentSeller.artisanId})
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {onNavigateToBuyerStore && (
          <button
            onClick={onNavigateToBuyerStore}
            className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-800" />
            <span>Buyer Marketplace</span>
          </button>
        )}
        <button
          onClick={onLogout}
          className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium flex items-center gap-1.5 transition-colors"
          title="Logout from seller portal"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
        {!isFullScreen && (
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );

  const dashboardContent = (
    <>
      {dashboardHeader}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-200 bg-white overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Store Overview
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Customer Bookings ({displayOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" /> Village Inventory ({sellerProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('add_product')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'add_product'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-amber-700" /> + Add New Craft
          </button>
        </div>

        {/* Dashboard Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-stone-50/50">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span>Total Sales Revenue</span>
                    <IndianRupee className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="text-2xl font-black text-stone-900">
                    ₹{totalRevenue.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    100% direct cooperative payout
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span>Pending Bookings</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-stone-900">
                    {pendingOrders.length}
                  </div>
                  <span className="text-[11px] text-stone-500">In crafting / quality inspection</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span>Dispatched / Delivered</span>
                    <Truck className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-black text-stone-900">
                    {dispatchedOrders.length}
                  </div>
                  <span className="text-[11px] text-indigo-600 font-medium">Via India Speed Post</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-stone-500 text-xs">
                    <span>GI Authenticity Score</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-emerald-700">99.4%</div>
                  <span className="text-[11px] text-emerald-600 font-medium">100% lead-free vegetable dyes</span>
                </div>
              </div>

              {/* Action Banner */}
              <div className="bg-gradient-to-r from-amber-800 to-amber-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                <div>
                  <h3 className="font-bold text-base font-serif">
                    Welcome, Master Artisan {currentSeller.name}!
                  </h3>
                  <p className="text-xs text-amber-200 mt-1 max-w-xl leading-relaxed">
                    You have <strong>{pendingOrders.length} customer bookings</strong> awaiting cooperative crafting
                    and dispatch from {currentSeller.hub}. You can update statuses and generate printable GI Dispatch Slips.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-5 py-2.5 rounded-xl bg-white text-stone-900 hover:bg-amber-100 font-bold text-xs shadow-md transition-all whitespace-nowrap self-start sm:self-auto"
                >
                  Fulfill Bookings Now
                </button>
              </div>

              {/* Recent Active Orders */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-stone-900">
                    Recent Village Consignments
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-amber-700 hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="divide-y divide-stone-100 text-xs">
                  {displayOrders.slice(0, 4).map((order) => (
                    <div key={order.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900">
                            {order.orderNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-700">
                            {order.status}
                          </span>
                        </div>
                        <div className="text-stone-500 mt-0.5">
                          {order.productName} (x{order.quantity}) • Customer: {order.customerName}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-amber-800">₹{order.totalAmount}</div>
                        <span className="text-[10px] text-stone-400">{order.paymentMethod}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOMER BOOKINGS & ORDER FULFILLMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by Order # or Customer..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {['All', 'Booked', 'Handcrafting & QC', 'Dispatched', 'Delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st as any)}
                      className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                        orderStatusFilter === st
                          ? 'bg-amber-700 text-white shadow'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Cards */}
              <div className="space-y-3">
                {displayOrders
                  .filter((o) => {
                    const matchSt = orderStatusFilter === 'All' || o.status === orderStatusFilter;
                    const matchQ =
                      !orderSearchQuery ||
                      o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                      o.productName.toLowerCase().includes(orderSearchQuery.toLowerCase());
                    return matchSt && matchQ;
                  })
                  .map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm hover:border-amber-300 transition-all space-y-3 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-900">{order.orderNumber}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            {order.status}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            • {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedInvoice(order)}
                            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-700" />
                            Dispatch Slip & GI Invoice
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-stone-400">
                            Craft Product
                          </span>
                          <div className="font-bold text-stone-900 mt-0.5">{order.productName}</div>
                          <div className="text-stone-500">Qty: {order.quantity} • Total: ₹{order.totalAmount}</div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase text-stone-400">
                            Customer Details
                          </span>
                          <div className="font-semibold text-stone-800 mt-0.5">{order.customerName}</div>
                          <div className="text-stone-500">
                            {order.customerPhone} • {order.city}, {order.state} - {order.pincode}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase text-stone-400">
                            Consignment Milestone
                          </span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <select
                              value={order.status}
                              onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 font-semibold focus:outline-none focus:border-amber-600"
                            >
                              <option value="Booked">1. Booked</option>
                              <option value="Cooperative Assigned">2. Cooperative Assigned</option>
                              <option value="Handcrafting & QC">3. Handcrafting & QC</option>
                              <option value="Dispatched">4. Dispatched to Hub</option>
                              <option value="Delivered">5. Delivered</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {order.customNotes && (
                        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-stone-700">
                          <strong className="text-amber-900">Customer Inscription / Custom Note:</strong>{' '}
                          {order.customNotes}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    {currentSeller.village} Cooperative Inventory
                  </h3>
                  <p className="text-xs text-stone-500">
                    Craft artifacts listed under your village guild license
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('add_product')}
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Add New Craft
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sellerProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white">
                          {p.category}
                        </span>
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-stone-800 shadow">
                          {p.stockStatus}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-xs sm:text-sm line-clamp-1">
                          {p.name}
                        </h4>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {p.material} • {p.dyesAndFinish}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <div className="text-base font-bold text-amber-800">₹{p.price}</div>
                      <span className="text-[10px] text-stone-400">{p.dimensions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ADD NEW CRAFT */}
          {activeTab === 'add_product' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm max-w-2xl mx-auto space-y-5">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="font-bold text-base text-stone-900 font-serif">
                  Add New Handicraft to Village Catalog
                </h3>
                <p className="text-xs text-stone-500">
                  Register new artisanal artifacts under {currentSeller.village} Cooperative Society
                </p>
              </div>

              {productSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{productSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Craft Name (English) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lathe-Turned Bullock Cart"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Telugu Traditional Name</label>
                    <input
                      type="text"
                      placeholder="e.g. ఎద్దుల బండి లక్క బొమ్మ"
                      value={newProductTelugu}
                      onChange={(e) => setNewProductTelugu(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Village Cluster</label>
                    <select
                      value={newProductVillage}
                      onChange={(e) => setNewProductVillage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-600"
                    >
                      {ARTISAN_VILLAGES.map((v) => (
                        <option key={v.id} value={v.name}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Craft Category</label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-600"
                    >
                      <option value="Wooden Crafts">Wooden Crafts</option>
                      <option value="Cloth & Textiles">Cloth & Textiles</option>
                      <option value="Jute & Fiber">Jute & Fiber</option>
                      <option value="Leather Art">Leather Art</option>
                      <option value="Metal & Brass">Metal & Brass</option>
                      <option value="Bamboo & Tribal">Bamboo & Tribal</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min={50}
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Raw Material Composition</label>
                    <input
                      type="text"
                      placeholder="e.g. Ankudu Softwood / Tella Poniki"
                      value={newProductMaterial}
                      onChange={(e) => setNewProductMaterial(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Dye / Finish Technique</label>
                    <input
                      type="text"
                      placeholder="e.g. Natural Herbal Lacquer & Turmeric"
                      value={newProductDyes}
                      onChange={(e) => setNewProductDyes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Product Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProductImageUrl}
                    onChange={(e) => setNewProductImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Craft Description & Cultural History</label>
                  <textarea
                    rows={2}
                    placeholder="Describe traditional handcrafting process, motifs, and historical significance..."
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-600 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('inventory')}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold shadow"
                  >
                    Save & Publish to Hands2Haven
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
    </>
  );

  const dispatchSlipModal = selectedInvoice && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-amber-800 text-white">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5" />
            <h3 className="font-bold text-sm">Artisan Dispatch Slip & Consignment Label</h3>
          </div>
          <button
            onClick={() => setSelectedInvoice(null)}
            className="text-white hover:text-amber-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-mono text-stone-800 overflow-y-auto">
          <div className="text-center border-b pb-3">
            <h4 className="font-bold text-base text-stone-900 font-sans">
              HANDS2HAVEN COOPERATIVE DISPATCH SLIP
            </h4>
            <p className="text-[11px] text-stone-500 font-sans">
              Booking Ref: <strong>{selectedInvoice.orderNumber}</strong> • Verified GI Guild Consignment
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="bg-stone-50 p-3 rounded-xl border">
              <strong>DISPATCH FROM:</strong>
              <div>{currentSeller.name}</div>
              <div>{currentSeller.cooperativeName}</div>
              <div>{currentSeller.hub}</div>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border">
              <strong>SHIP TO (CONSIGNEE):</strong>
              <div>{selectedInvoice.customerName}</div>
              <div>{selectedInvoice.address}</div>
              <div>
                {selectedInvoice.city}, {selectedInvoice.state} - {selectedInvoice.pincode}
              </div>
              <div>Ph: {selectedInvoice.customerPhone}</div>
            </div>
          </div>

          <div className="border p-3 rounded-xl space-y-1">
            <div className="flex justify-between">
              <span>ITEM:</span>
              <strong>{selectedInvoice.productName} (x{selectedInvoice.quantity})</strong>
            </div>
            <div className="flex justify-between">
              <span>PAYMENT METHOD:</span>
              <span>{selectedInvoice.paymentMethod}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-1 border-t">
              <span>TOTAL AMOUNT:</span>
              <span>₹{selectedInvoice.totalAmount}</span>
            </div>
          </div>

          {selectedInvoice.customNotes && (
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px]">
              <strong>CUSTOM ENGRAVING / PACKAGING NOTE:</strong>
              <div>{selectedInvoice.customNotes}</div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-stone-50 border-t flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl font-bold text-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print Consignment Label
          </button>
          <button
            onClick={() => setSelectedInvoice(null)}
            className="px-4 py-2 border rounded-xl text-stone-700 text-xs font-semibold hover:bg-stone-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  if (isFullScreen) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans">
        <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col">
          <div className="bg-white border border-stone-200 rounded-3xl shadow-xs overflow-hidden flex flex-col flex-1">
            {dashboardContent}
          </div>
        </main>
        {dispatchSlipModal}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {dashboardContent}
      </div>
      {dispatchSlipModal}
    </div>
  );
};
