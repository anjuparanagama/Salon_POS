import { ArrowLeft, RotateCcw, AlertCircle } from "lucide-react";
import Header from "../../components/header";
import { formatAppointmentId } from "../../helpers/format-id.helper";
import { ROUTES } from "../../routes/sidebar.routes";
import { useCheckout } from "../../hooks/checkout";
import {
  CheckoutSuccessView,
  CheckoutAppointmentModeCard,
  CheckoutCatalogExplorer,
  CheckoutCartTable,
  CheckoutCustomerCard,
  CheckoutBillingCard,
  CheckoutPaymentsCard,
} from "./components";

export function CheckoutPage() {
  const {
    navigate,
    isLoadingData,
    selectedAppointment,
    bindAppointment,
    handleClearAppointment,
    recentAppointments,
    appointmentServices,
    includeApptServices,
    setIncludeApptServices,
    catalogTab,
    setCatalogTab,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    catalogProducts,
    catalogServices,
    filteredProducts,
    filteredServices,
    productCategories,
    additionalServices,
    setAdditionalServices,
    cartProducts,
    setCartProducts,
    handleAddServiceToCart,
    handleAddProductToCart,
    clientName,
    setClientName,
    clientPhone,
    setClientPhone,
    discountAmount,
    setDiscountAmount,
    payments,
    setPayments,
    subtotal,
    grandTotal,
    totalPaid,
    balanceDue,
    changeDue,
    handlePayFull,
    isSubmitting,
    errorMsg,
    setErrorMsg,
    completedInvoice,
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    handleCompleteCheckout,
    handleStartNewSale,
    waPhone,
    setWaPhone,
    copiedMessage,
    waNotice,
    handleOpenWhatsAppWeb,
    handleCopyReceiptText,
  } = useCheckout();

  return (
    <div className="flex flex-col gap-6 text-slate-900 pb-12">
      {/* 1. TOP HEADER SECTION */}
      <Header
        title="Salon POS Checkout"
        description={
          selectedAppointment
            ? `Billing & Completing Appointment ${formatAppointmentId(selectedAppointment)}`
            : "Cashier Terminal for walk-in retail sales and salon services"
        }
        isLoading={isLoadingData}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.APPOINTMENTS)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Appointments</span>
            </button>
            <button
              type="button"
              onClick={handleStartNewSale}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset POS</span>
            </button>
          </div>
        }
      />

      {/* 2. SUCCESS RECEIPT VIEW (AFTER CHECKOUT) */}
      {completedInvoice ? (
        <CheckoutSuccessView
          completedInvoice={completedInvoice}
          isReceiptModalOpen={isReceiptModalOpen}
          setIsReceiptModalOpen={setIsReceiptModalOpen}
          waPhone={waPhone}
          setWaPhone={setWaPhone}
          copiedMessage={copiedMessage}
          waNotice={waNotice}
          handleOpenWhatsAppWeb={handleOpenWhatsAppWeb}
          handleCopyReceiptText={handleCopyReceiptText}
          handleStartNewSale={handleStartNewSale}
          clientName={clientName}
          clientPhone={clientPhone}
          payments={payments}
        />
      ) : (
        /* 3. FULL PAGE POS CASHIER WORKSPACE (2 COLUMNS) */
        <div className="flex flex-col gap-5">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-medium text-rose-700 shadow-2xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT / CENTER PANEL: CATALOG & CART ITEMS (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-5 min-w-0">
              <CheckoutAppointmentModeCard
                selectedAppointment={selectedAppointment}
                recentAppointments={recentAppointments}
                bindAppointment={bindAppointment}
                handleClearAppointment={handleClearAppointment}
                includeApptServices={includeApptServices}
                setIncludeApptServices={setIncludeApptServices}
                appointmentServices={appointmentServices}
              />

              <CheckoutCatalogExplorer
                catalogTab={catalogTab}
                setCatalogTab={setCatalogTab}
                catalogProducts={catalogProducts}
                catalogServices={catalogServices}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                productCategories={productCategories}
                filteredProducts={filteredProducts}
                filteredServices={filteredServices}
                cartProducts={cartProducts}
                additionalServices={additionalServices}
                handleAddProductToCart={handleAddProductToCart}
                handleAddServiceToCart={handleAddServiceToCart}
              />

              <CheckoutCartTable
                additionalServices={additionalServices}
                setAdditionalServices={setAdditionalServices}
                cartProducts={cartProducts}
                setCartProducts={setCartProducts}
                includeApptServices={includeApptServices}
                selectedAppointment={selectedAppointment}
                appointmentServices={appointmentServices}
                setErrorMsg={setErrorMsg}
              />
            </div>

            {/* RIGHT PANEL: BILLING SUMMARY, CUSTOMER & PAYMENTS (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-5 min-w-0">
              <CheckoutCustomerCard
                clientName={clientName}
                setClientName={setClientName}
                clientPhone={clientPhone}
                setClientPhone={setClientPhone}
                setWaPhone={setWaPhone}
              />

              <CheckoutBillingCard
                subtotal={subtotal}
                discountAmount={discountAmount}
                setDiscountAmount={setDiscountAmount}
                grandTotal={grandTotal}
              />

              <CheckoutPaymentsCard
                payments={payments}
                setPayments={setPayments}
                handlePayFull={handlePayFull}
                totalPaid={totalPaid}
                balanceDue={balanceDue}
                changeDue={changeDue}
                grandTotal={grandTotal}
                subtotal={subtotal}
                isSubmitting={isSubmitting}
                handleCompleteCheckout={handleCompleteCheckout}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
