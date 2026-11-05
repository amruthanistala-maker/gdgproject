import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  FileText,
  Printer,
  X,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Calendar,
  ChevronRight,
  User,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { OrderItem } from '../types/artisan';

interface OrdersViewProps {
  orders: OrderItem[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderItem['status']) => void;
  onCancelOrder: (orderId: string) => void;
  onBookMore: () => void;
}

const STATUS_STEPS: OrderItem['status'][] = [
  'Booked',
  'Cooperative Assigned',
  'Handcrafting & QC',
  'Dispatched',
  'Delivered',
];

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onUpdateOrderStatus,
  onCancelOrder,
  onBookMore,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | OrderItem['status']>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<OrderItem | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = activeFilter === 'All' || order.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.productName.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.village.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'Booked':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Cooperative Assigned':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Handcrafting & QC':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Dispatched':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  const getStepIndex = (status: OrderItem['status']) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-50/90 via-white to-amber-100/60 border border-amber-200/80 p-6 sm:p-7 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Direct Cooperative Tracking
            </span>
            <span className="text-xs text-stone-500 font-medium">Live Village Hub Updates</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1 font-serif">
            Customer Bookings & Consignment Tracker
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            View real-time craft creation progress, dispatch notices, and official GI certificates.
          </p>
        </div>

        <button
          onClick={onBookMore}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse Crafts to Book
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {['All', ...STATUS_STEPS].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === status
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              {status} {status === 'All' && `(${orders.length})`}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Order #, product, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl pl-8 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-2xs"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-6 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Package className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-stone-800">No bookings match this filter</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You can search for products across Etikoppaka, Kondapalli, Srikalahasti, and place a new booking.
          </p>
          <button
            onClick={onBookMore}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs"
          >
            Explore Village Crafts <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const currentStepIdx = getStepIndex(order.status);
            return (
              <div
                key={order.id}
                className="bg-white border border-stone-200 rounded-3xl p-5 hover:border-amber-300 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-amber-900">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        • Booked on {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 mt-1">
                      Customer: <strong className="text-stone-900">{order.customerName}</strong> ({order.customerPhone})
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1.5 border border-amber-200 transition-colors"
                      title="View GI Certificate and invoice receipt"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-700" />
                      GI Certificate & Receipt
                    </button>

                    {order.status !== 'Delivered' && (
                      <button
                        onClick={() => {
                          const nextIdx = (currentStepIdx + 1) % STATUS_STEPS.length;
                          onUpdateOrderStatus(order.id, STATUS_STEPS[nextIdx]);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-amber-700 hover:text-white text-stone-700 text-[11px] font-medium transition-colors"
                        title="Simulate next cooperative progress milestone"
                      >
                        Advance Status
                      </button>
                    )}
                  </div>
                </div>

                {/* Craft and Hub Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-stone-400 uppercase tracking-wider text-[10px] font-bold">
                      Craft Details
                    </span>
                    <div className="text-sm font-bold text-stone-900">{order.productName}</div>
                    <div className="text-stone-600">
                      Village: <strong className="text-amber-800">{order.village}</strong>
                    </div>
                    <div className="text-stone-500">Material: {order.material}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-stone-400 uppercase tracking-wider text-[10px] font-bold">
                      Cooperative Hub & Artisan
                    </span>
                    <div className="font-semibold text-stone-800">{order.artisanName}</div>
                    <div className="text-stone-500">{order.hub}</div>
                    <div className="text-stone-500">
                      Order Type:{' '}
                      <span className="text-amber-800 font-semibold">{order.orderType}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-stone-400 uppercase tracking-wider text-[10px] font-bold">
                      Delivery & Payment
                    </span>
                    <div className="text-stone-700">
                      {order.address}, {order.city}, {order.state} - {order.pincode}
                    </div>
                    <div className="text-stone-500">
                      Payment: {order.paymentMethod} •{' '}
                      <strong className="text-amber-900 text-sm">₹{order.totalAmount}</strong>{' '}
                      (Qty: {order.quantity})
                    </div>
                  </div>
                </div>

                {order.customNotes && (
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-stone-700">
                    <strong className="text-amber-900">Customer Note to Artisan:</strong>{' '}
                    {order.customNotes}
                  </div>
                )}

                {/* Progress Stepper Bar */}
                <div className="pt-2">
                  <div className="relative flex items-center justify-between">
                    {/* Connecting line */}
                    <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-1 bg-stone-200 -z-0">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-emerald-600 transition-all duration-300"
                        style={{
                          width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%`,
                        }}
                      />
                    </div>

                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted
                                ? 'bg-amber-700 text-white ring-4 ring-amber-700/20 shadow-xs'
                                : 'bg-stone-100 text-stone-400 border border-stone-300'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] mt-1.5 font-medium whitespace-nowrap hidden sm:block ${
                              isCurrent ? 'text-amber-900 font-bold' : isCompleted ? 'text-stone-700' : 'text-stone-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    <span>
                      Estimated Delivery by: <strong className="text-stone-800">{order.estimatedDelivery}</strong>
                    </span>
                  </div>

                  {order.status === 'Booked' && (
                    <button
                      onClick={() => setCancellingOrderId(order.id)}
                      className="text-stone-400 hover:text-rose-600 text-xs transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel confirmation modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-stone-900">Cancel Booking?</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to cancel this booking? The artisan cooperative will be notified immediately.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancellingOrderId(null)}
                className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  onCancelOrder(cancellingOrderId);
                  setCancellingOrderId(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GI Certificate & Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-amber-50 text-stone-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border-4 border-amber-600/40">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-amber-800 text-amber-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-bold text-base tracking-wide">
                    Certificate of Geographical Indication (GI) Authenticity
                  </h3>
                  <p className="text-[11px] text-amber-200">
                    Government of India GI Act 1999 • Artisan Cooperative Verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-1.5 text-amber-200 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Certificate Content */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto font-serif">
              {/* Seal and Registry Info */}
              <div className="text-center space-y-1.5 border-b-2 border-dashed border-amber-800/30 pb-5">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 text-xs font-bold uppercase tracking-widest">
                  Official Heritage Document
                </div>
                <h2 className="text-2xl font-extrabold text-amber-950 font-sans">
                  HANDS2HAVEN ARTISAN COOPERATIVE FEDERATION
                </h2>
                <p className="text-xs text-stone-600 font-sans">
                  Certified Indian Heritage Clusters • Ref No:{' '}
                  <strong>{selectedInvoiceOrder.orderNumber}</strong>
                </p>
              </div>

              {/* Certificate Body */}
              <div className="text-xs sm:text-sm text-stone-800 leading-relaxed space-y-3">
                <p>
                  This is to certify that the handcrafted artifact titled{' '}
                  <strong className="text-amber-950 text-base">{selectedInvoiceOrder.productName}</strong>,
                  originating from the historical artisan cluster of{' '}
                  <strong className="text-amber-950">{selectedInvoiceOrder.village}</strong>, has been verified
                  by the Regional Hub Cooperative{' '}
                  <strong className="text-amber-950">{selectedInvoiceOrder.hub}</strong>.
                </p>

                <p>
                  The piece was hand-created by accredited master craftsman{' '}
                  <strong className="text-amber-950">{selectedInvoiceOrder.artisanName}</strong> conforming to
                  traditional specifications:
                </p>

                <div className="bg-amber-100/70 p-4 rounded-xl border border-amber-300/80 space-y-1.5 font-sans text-xs">
                  <div>
                    <strong>Material Integrity:</strong> {selectedInvoiceOrder.material}
                  </div>
                  <div>
                    <strong>Verification Stamp:</strong> 100% Lead-Free Natural Pigments & Lathe/Chisel Handcrafting
                  </div>
                  <div>
                    <strong>Specification:</strong> {selectedInvoiceOrder.orderType}
                  </div>
                </div>
              </div>

              {/* Invoice Breakdown */}
              <div className="space-y-2 pt-2 border-t border-stone-300 font-sans text-xs">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  Consignment & Payment Summary
                </h4>
                <div className="grid grid-cols-2 gap-2 text-stone-700">
                  <div>
                    <span>Consignee:</span> <strong>{selectedInvoiceOrder.customerName}</strong>
                  </div>
                  <div>
                    <span>Payment Mode:</span> <strong>{selectedInvoiceOrder.paymentMethod}</strong>
                  </div>
                  <div>
                    <span>Destination:</span> {selectedInvoiceOrder.city}, {selectedInvoiceOrder.state} ({selectedInvoiceOrder.pincode})
                  </div>
                  <div>
                    <span>Total Amount Paid:</span>{' '}
                    <strong className="text-amber-900 text-sm">₹{selectedInvoiceOrder.totalAmount}</strong> (Qty:{' '}
                    {selectedInvoiceOrder.quantity})
                  </div>
                </div>
              </div>

              {/* Seal Signatures */}
              <div className="pt-6 border-t-2 border-amber-800/30 flex items-end justify-between font-sans text-xs">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full border-2 border-amber-800 flex items-center justify-center p-1 text-[9px] font-bold text-amber-900 uppercase">
                    Cooperative Verified Seal
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">Village Cluster Stamp</div>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-base text-amber-950 font-bold">
                    {selectedInvoiceOrder.artisanName}
                  </div>
                  <div className="text-[10px] text-stone-600 font-medium border-t border-stone-400 pt-0.5">
                    Master Artisan Signature
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-3.5 bg-amber-100 border-t border-amber-300/80 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </button>

              <button
                onClick={() => setSelectedInvoiceOrder(null)}
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
