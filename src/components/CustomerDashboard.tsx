import React, { useState } from 'react';
import {
  User,
  ShoppingBag,
  Package,
  Heart,
  Award,
  ShieldCheck,
  MapPin,
  Clock,
  Truck,
  CheckCircle2,
  FileText,
  Printer,
  LogOut,
  X,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  Home,
  IndianRupee,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { OrderItem, Product } from '../types/artisan';
import { ARTISAN_PRODUCTS } from '../data/artisanData';

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  memberSince: string;
  avatarUrl: string;
  favorites: string[]; // Product IDs
}

export const DEMO_CUSTOMERS: CustomerUser[] = [
  {
    id: 'cust-1',
    name: 'Radhika Rao',
    phone: '+91 98480 12345',
    email: 'radhika.rao@example.com',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    address: 'Flat 402, Krishna Heritage Enclave, Benz Circle',
    pincode: '520010',
    memberSince: 'March 2024',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    favorites: ['11', '12', '21'],
  },
  {
    id: 'cust-2',
    name: 'Vikram Reddy',
    phone: '+91 99890 54321',
    email: 'vikram.reddy@example.com',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Plot 88, Jubilee Hills Road No 36',
    pincode: '500033',
    memberSince: 'January 2024',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    favorites: ['14', '15', '22'],
  },
  {
    id: 'cust-3',
    name: 'Ananya Sharma',
    phone: '+91 97410 98765',
    email: 'ananya.sharma@example.com',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Villa 12, Palm Meadows, Whitefield',
    pincode: '560066',
    memberSince: 'May 2024',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    favorites: ['16', '18', '24'],
  },
];

interface CustomerDashboardProps {
  currentCustomer: CustomerUser | null;
  onLogin: (customer: CustomerUser) => void;
  onLogout: () => void;
  orders: OrderItem[];
  onCancelOrder: (orderId: string) => void;
  onSelectProductToBook: (product: Product) => void;
  onClose: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentCustomer,
  onLogin,
  onLogout,
  orders,
  onCancelOrder,
  onSelectProductToBook,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'certificates' | 'profile'>('orders');
  const [orderFilter, setOrderFilter] = useState<'All' | OrderItem['status']>('All');
  const [selectedCertificateOrder, setSelectedCertificateOrder] = useState<OrderItem | null>(null);

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginCity, setLoginCity] = useState('Vijayawada');
  const [loginState, setLoginState] = useState('Andhra Pradesh');

  // Customer orders (filter by customer phone or customer name)
  const myOrders = currentCustomer
    ? orders.filter(
        (o) =>
          o.customerPhone === currentCustomer.phone ||
          o.customerName.toLowerCase() === currentCustomer.name.toLowerCase()
      )
    : [];

  const displayOrders = myOrders.length > 0 ? myOrders : orders;

  // Impact calculations
  const totalSpent = displayOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const uniqueVillages = new Set(displayOrders.map((o) => o.village)).size;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = DEMO_CUSTOMERS.find(
      (c) => c.phone.includes(loginPhone) || c.email.toLowerCase().includes(loginPhone.toLowerCase())
    );

    if (matched) {
      onLogin(matched);
    } else {
      // Create fresh customer account
      const newCustomer: CustomerUser = {
        id: 'cust-' + Date.now(),
        name: loginName.trim() || 'Patron Customer',
        phone: loginPhone.trim() || '+91 98480 99999',
        email: `${loginName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        city: loginCity,
        state: loginState,
        address: `Heritage Lane, ${loginCity}`,
        pincode: '520001',
        memberSince: 'Just now',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        favorites: ['11', '12'],
      };
      onLogin(newCustomer);
    }
  };

  const handleQuickDemoLogin = (customer: CustomerUser) => {
    onLogin(customer);
  };

  // If customer is not logged in, render Customer Login Page / Modal
  if (!currentCustomer) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-amber-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-700 text-white flex items-center justify-center shadow-md shadow-amber-700/20">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                  Customer Account & Heritage Portal
                </h2>
                <p className="text-xs text-stone-600">
                  Track your GI artisan bookings, saved crafts & official certificates
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
            {/* 1-Click Quick Demo Customer Login */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                Quick 1-Click Login (Demo Accounts):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_CUSTOMERS.map((cust) => (
                  <button
                    key={cust.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(cust)}
                    className="p-3 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={cust.avatarUrl}
                        alt={cust.name}
                        className="w-8 h-8 rounded-full object-cover border border-amber-300"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate group-hover:text-amber-800">
                          {cust.name.split(' ')[0]}
                        </div>
                        <span className="text-[10px] text-amber-700 font-semibold block">
                          {cust.city}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-500 line-clamp-1">{cust.email}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Standard Login / Signup Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">
                  {isRegistering ? 'Register New Customer Account' : 'Sign in with Mobile or Email'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-xs text-amber-700 font-semibold hover:underline"
                >
                  {isRegistering ? 'Already have account? Sign in' : 'Create new account'}
                </button>
              </div>

              {isRegistering && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Rao"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  Mobile Number / Email Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98480 12345 or user@example.com"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
                />
              </div>

              {isRegistering && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Vijayawada"
                      value={loginCity}
                      onChange={(e) => setLoginCity(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-600 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-700">State</label>
                    <select
                      value={loginState}
                      onChange={(e) => setLoginState(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-600 bg-white"
                    >
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-700/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                {isRegistering ? 'Complete Customer Registration' : 'Sign In to Customer Dashboard'}
              </button>
            </form>

            <div className="text-center text-[11px] text-stone-500 bg-stone-50 p-3 rounded-2xl border border-stone-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 inline mr-1" />
              Secure patron access to certified Geographical Indication (GI) heritage bookings.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Customer Logged-in Dashboard
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header & Customer Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-stone-200 bg-amber-50/70 gap-3">
          <div className="flex items-center gap-3">
            <img
              src={currentCustomer.avatarUrl}
              alt={currentCustomer.name}
              className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-600 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900 font-serif">
                  {currentCustomer.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                  Heritage Patron
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                {currentCustomer.city}, {currentCustomer.state} • {currentCustomer.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-200 bg-white overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" /> My Bookings ({displayOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'certificates'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Award className="w-4 h-4" /> GI Certificates ({displayOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" /> Saved Crafts
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-amber-700 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Home className="w-4 h-4" /> Address & Profile
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-stone-50/50">
          {/* TAB 1: MY BOOKINGS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Patron Impact Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-1">
                  <span className="text-[11px] text-stone-500">Direct Artisan Patronage</span>
                  <div className="text-xl font-bold text-amber-900">₹{totalSpent.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-700 font-semibold">100% disbursed to rural guilds</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-1">
                  <span className="text-[11px] text-stone-500">Villages Supported</span>
                  <div className="text-xl font-bold text-stone-900">{uniqueVillages} Heritage Clusters</div>
                  <span className="text-[10px] text-amber-700 font-semibold">AP & Telangana</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-1">
                  <span className="text-[11px] text-stone-500">Active Consignments</span>
                  <div className="text-xl font-bold text-stone-900">
                    {displayOrders.filter((o) => o.status !== 'Delivered').length}
                  </div>
                  <span className="text-[10px] text-indigo-700 font-semibold">In handcrafting / transit</span>
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
                {['All', 'Booked', 'Handcrafting & QC', 'Dispatched', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st as any)}
                    className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                      orderFilter === st
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              <div className="space-y-3">
                {displayOrders
                  .filter((o) => orderFilter === 'All' || o.status === orderFilter)
                  .map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-900">{order.orderNumber}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            {order.status}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            • Booked on {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCertificateOrder(order)}
                            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-700" />
                            View GI Certificate & Receipt
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-stone-400">Handcraft Item</span>
                          <div className="font-bold text-stone-900 mt-0.5">{order.productName}</div>
                          <div className="text-stone-500">
                            Village: <strong className="text-amber-800">{order.village}</strong>
                          </div>
                          <div className="text-stone-500">Material: {order.material}</div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase text-stone-400">
                            Cooperative & Artisan
                          </span>
                          <div className="font-semibold text-stone-800 mt-0.5">{order.artisanName}</div>
                          <div className="text-stone-500">{order.hub}</div>
                          <div className="text-stone-500">Payment: {order.paymentMethod}</div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase text-stone-400">
                            Delivery Destination
                          </span>
                          <div className="text-stone-700 mt-0.5">
                            {order.address}, {order.city}, {order.state} - {order.pincode}
                          </div>
                          <div className="text-amber-900 font-bold mt-1 text-sm">
                            Total: ₹{order.totalAmount} (Qty: {order.quantity})
                          </div>
                        </div>
                      </div>

                      {order.status === 'Booked' && (
                        <div className="pt-2 border-t border-stone-100 flex justify-end">
                          <button
                            onClick={() => onCancelOrder(order.id)}
                            className="text-stone-400 hover:text-rose-600 text-xs transition-colors"
                          >
                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Official Geographical Indication (GI) Authenticity Certificates
                </h3>
                <p className="text-xs text-stone-500">
                  Every piece booked through Hands2Haven carries an accredited GI certificate verified by regional artisan cooperatives.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                          GI Act 1999 Verified
                        </span>
                        <span className="font-mono text-xs text-stone-500">{order.orderNumber}</span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">{order.productName}</h4>
                      <p className="text-xs text-stone-600">
                        Origin: <strong>{order.village}</strong> • Master Artisan: {order.artisanName}
                      </p>
                      <div className="text-[11px] text-stone-500 bg-white p-2.5 rounded-xl border border-amber-200/60">
                        100% natural organic pigments & authentic timber/canvas verified by {order.hub}.
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCertificateOrder(order)}
                      className="w-full py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" /> View & Print Official Certificate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WISHLIST / SAVED CRAFTS */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-stone-900">Saved Village Handicrafts</h3>
                <p className="text-xs text-stone-500">
                  Authentic heritage crafts from Kondapalli, Etikoppaka, and Srikalahasti you wish to book.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {ARTISAN_PRODUCTS.slice(0, 6).map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100">
                        <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white">
                          {prod.village}
                        </span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-xs mt-2 line-clamp-1">{prod.name}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{prod.material}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-amber-900">₹{prod.price}</span>
                      <button
                        onClick={() => {
                          onSelectProductToBook(prod);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg text-xs"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE & ADDRESS */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs max-w-xl mx-auto space-y-4 text-xs">
              <h3 className="font-bold text-base text-stone-900 font-serif">
                Customer Delivery Profile
              </h3>
              <div className="space-y-3 text-stone-700">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-stone-400 block text-[10px] font-bold uppercase">Name</span>
                    <strong className="text-stone-900">{currentCustomer.name}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] font-bold uppercase">Mobile</span>
                    <strong className="text-stone-900">{currentCustomer.phone}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-stone-400 block text-[10px] font-bold uppercase">Email</span>
                    <span className="text-stone-900">{currentCustomer.email}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] font-bold uppercase">Patron Since</span>
                    <span className="text-stone-900">{currentCustomer.memberSince}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase mb-1">
                    Primary Consignment Delivery Address
                  </span>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800">
                    <p>{currentCustomer.address}</p>
                    <p>
                      {currentCustomer.city}, {currentCustomer.state} - {currentCustomer.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GI Certificate Modal */}
      {selectedCertificateOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-amber-50 text-stone-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border-4 border-amber-600/40">
            <div className="flex items-center justify-between px-6 py-4 bg-amber-800 text-amber-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-bold text-base tracking-wide">
                    Geographical Indication (GI) Certificate of Authenticity
                  </h3>
                  <p className="text-[11px] text-amber-200">
                    Government of India GI Act 1999 • Cooperative Registry
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCertificateOrder(null)}
                className="p-1.5 text-amber-200 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto font-serif">
              <div className="text-center space-y-1.5 border-b-2 border-dashed border-amber-800/30 pb-5">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 text-xs font-bold uppercase tracking-widest">
                  Official Heritage Document
                </div>
                <h2 className="text-2xl font-extrabold text-amber-950 font-sans">
                  HANDS2HAVEN ARTISAN COOPERATIVE FEDERATION
                </h2>
                <p className="text-xs text-stone-600 font-sans">
                  Booking Ref: <strong>{selectedCertificateOrder.orderNumber}</strong>
                </p>
              </div>

              <div className="text-xs sm:text-sm text-stone-800 leading-relaxed space-y-3">
                <p>
                  This is to certify that the handcrafted artifact{' '}
                  <strong className="text-amber-950 text-base">{selectedCertificateOrder.productName}</strong>,
                  originating from the historical artisan cluster of{' '}
                  <strong className="text-amber-950">{selectedCertificateOrder.village}</strong>, has been
                  authenticated by the Regional Hub Cooperative{' '}
                  <strong className="text-amber-950">{selectedCertificateOrder.hub}</strong>.
                </p>

                <p>
                  Handcrafted by accredited master craftsman{' '}
                  <strong className="text-amber-950">{selectedCertificateOrder.artisanName}</strong>.
                </p>

                <div className="bg-amber-100/70 p-4 rounded-xl border border-amber-300/80 space-y-1 font-sans text-xs">
                  <div>
                    <strong>Material Integrity:</strong> {selectedCertificateOrder.material}
                  </div>
                  <div>
                    <strong>Verification Stamp:</strong> 100% Lead-Free Natural Dyes & Chisel Handcrafting
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-amber-800/30 flex items-end justify-between font-sans text-xs">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full border-2 border-amber-800 flex items-center justify-center p-1 text-[8px] font-bold text-amber-900 uppercase">
                    Co-op Verified Seal
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">GI Registry Stamp</div>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-base text-amber-950 font-bold">
                    {selectedCertificateOrder.artisanName}
                  </div>
                  <div className="text-[10px] text-stone-600 font-medium border-t border-stone-400 pt-0.5">
                    Master Artisan Signature
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-amber-100 border-t border-amber-300/80 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </button>
              <button
                onClick={() => setSelectedCertificateOrder(null)}
                className="px-5 py-2 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-all"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
