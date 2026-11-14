import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import Modal from "../../../../components/modal";
import { formatAppointmentId } from "../../../../helpers/format-id.helper";
import { useAppointmentCheckout } from "../../../../hooks/appointments";
import type { AppointmentCheckoutModalProps } from "../../../../interface/appointment-checkout.types";
import {
  AppointmentCheckoutServicesCard,
  AppointmentCheckoutProductsCard,
  AppointmentCheckoutCustomerCard,
  AppointmentCheckoutBillingCard,
  AppointmentCheckoutPaymentsCard,
  AppointmentCheckoutSuccessView,
  AppointmentCheckoutFooter,
} from "./components";
import { Button } from "../../../../components/button";

export type { AppointmentCheckoutModalProps };

export function AppointmentCheckoutModal({
  isOpen,
  onClose,
  appointment,
  onCheckoutSuccess,
  onBookNextAppointment,
}: AppointmentCheckoutModalProps) {
  const {
    catalogServices,
    catalogProducts,
    isLoadingCatalog,
    includeApptServices,
    setIncludeApptServices,
    additionalServices,
    setAdditionalServices,
    selectedProducts,
    setSelectedProducts,
    selectedServiceId,
    setSelectedServiceId,
    selectedProductId,
    setSelectedProductId,
    clientName,
    setClientName,
    clientPhone,
    setClientPhone,
    waPhone,
    setWaPhone,
    discountAmount,
    setDiscountAmount,
    payments,
    setPayments,
    isSubmitting,
    errorMsg,
    setErrorMsg,
    completedInvoice,
    isSendingWa,
    waStatusMsg,
    copiedMessage,
    appointmentServices,
    subtotal,
    grandTotal,
    totalPaid,
    balanceDue,
    changeDue,
    handleAddService,
    handleAddProduct,
    handlePayFull,
    handleCompleteCheckout,
    handleOpenWhatsAppWeb,
    handleOpenWhatsAppApp,
    handleCopyReceiptText,
    handleSendWhatsAppApi,
    cleanRecipientPhone,
    handleBookNext,
  } = useAppointmentCheckout({
    isOpen,
    onClose,
    appointment,
    onCheckoutSuccess,
    onBookNextAppointment,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={completedInvoice ? "Invoice & Checkout Receipt" : "Unified POS Checkout"}
      description={
        completedInvoice
          ? `Invoice #${completedInvoice.invoice_number} successfully recorded.`
          : appointment
          ? `Completing Appointment ${formatAppointmentId(appointment)} & billing client`
          : "Direct walk-in POS sale without appointment"
      }
      size="2xl"
      className="max-w-5xl"
      footer={
        <AppointmentCheckoutFooter
          completedInvoice={completedInvoice}
          grandTotal={grandTotal}
          balanceDue={balanceDue}
          isSubmitting={isSubmitting}
          subtotal={subtotal}
          onClose={onClose}
          onCompleteCheckout={handleCompleteCheckout}
        />
      }
    >
      {/* 1. SUCCESS VIEW (POST-CHECKOUT RECEIPT & ACTIONS) */}
      {completedInvoice ? (
        <AppointmentCheckoutSuccessView
          completedInvoice={completedInvoice}
          waPhone={waPhone}
          setWaPhone={setWaPhone}
          cleanRecipientPhone={cleanRecipientPhone}
          copiedMessage={copiedMessage}
          isSendingWa={isSendingWa}
          waStatusMsg={waStatusMsg}
          onCopyReceiptText={handleCopyReceiptText}
          onOpenWhatsAppWeb={handleOpenWhatsAppWeb}
          onOpenWhatsAppApp={handleOpenWhatsAppApp}
          onSendWhatsAppApi={handleSendWhatsAppApi}
          onBookNext={handleBookNext}
        />
      ) : (
        /* 2. CHECKOUT INTERFACE (TWO COLUMN LAYOUT) */
        <div className="flex flex-col gap-4 text-slate-800">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-700">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: SERVICES & PRODUCTS (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4 min-w-0">
              <AppointmentCheckoutServicesCard
                appointment={appointment}
                includeApptServices={includeApptServices}
                setIncludeApptServices={setIncludeApptServices}
                appointmentServices={appointmentServices}
                selectedServiceId={selectedServiceId}
                setSelectedServiceId={setSelectedServiceId}
                catalogServices={catalogServices}
                isLoadingCatalog={isLoadingCatalog}
                additionalServices={additionalServices}
                setAdditionalServices={setAdditionalServices}
                onAddService={handleAddService}
              />

              <AppointmentCheckoutProductsCard
                catalogProducts={catalogProducts}
                isLoadingCatalog={isLoadingCatalog}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                onAddProduct={handleAddProduct}
                onError={setErrorMsg}
              />
            </div>

            {/* RIGHT COLUMN: CUSTOMER, SUMMARY & PAYMENTS (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4 min-w-0">
              <AppointmentCheckoutCustomerCard
                clientName={clientName}
                setClientName={setClientName}
                clientPhone={clientPhone}
                setClientPhone={setClientPhone}
                setWaPhone={setWaPhone}
              />

              <AppointmentCheckoutBillingCard
                subtotal={subtotal}
                discountAmount={discountAmount}
                setDiscountAmount={setDiscountAmount}
                grandTotal={grandTotal}
              />

              <AppointmentCheckoutPaymentsCard
                payments={payments}
                setPayments={setPayments}
                onPayFull={handlePayFull}
                totalPaid={totalPaid}
                balanceDue={balanceDue}
                changeDue={changeDue}
              />

              {/* Complete Checkout Action */}
              <Button
                type="button"
                onClick={handleCompleteCheckout}
                disabled={isSubmitting || subtotal <= 0}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md hover:bg-primary-dark transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Processing Checkout...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4.5" />
                    <span>Complete Checkout & Bill</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default AppointmentCheckoutModal;
