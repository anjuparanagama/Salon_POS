import {
  Calendar,
  CreditCard,
  Package,
  Users,
} from "lucide-react";
import { Input } from "../../../../../components/input";
import type { RolePermissions } from "../../../types";

export interface PermissionsMatrixProps {
  currentRolePerms: RolePermissions;
  handleTogglePermission: (key: keyof RolePermissions) => void;
}

export function PermissionsMatrix({
  currentRolePerms,
  handleTogglePermission,
}: PermissionsMatrixProps) {
  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      {/* Group 1: Appointments & Calendar */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-xs">
          <Calendar className="size-3.5 text-primary" />
          <span>Appointments & Calendar</span>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">View Appointments Schedule</span>
              <p className="text-[11px] text-slate-400">Can view the salon calendar and bookings list.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.viewAppointments)}
              onChange={() => handleTogglePermission("viewAppointments")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Create New Bookings</span>
              <p className="text-[11px] text-slate-400">Can book new client appointments for specialists.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.createAppointments)}
              onChange={() => handleTogglePermission("createAppointments")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Edit & Cancel Appointments</span>
              <p className="text-[11px] text-slate-400">Can modify service times or cancel bookings.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.editCancelAppointments)}
              onChange={() => handleTogglePermission("editCancelAppointments")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Complete & Checkout Appointments</span>
              <p className="text-[11px] text-slate-400">Can mark treatments as done and create customer bills.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.checkoutAppointments)}
              onChange={() => handleTogglePermission("checkoutAppointments")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Group 2: POS Billing & Cashiering */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-xs">
          <CreditCard className="size-3.5 text-blue-600" />
          <span>POS Billing & Cashiering</span>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Access POS Counter Terminal</span>
              <p className="text-[11px] text-slate-400">Can take cash, card, and digital client payments.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.accessPosCheckout)}
              onChange={() => handleTogglePermission("accessPosCheckout")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Apply Custom Discounts</span>
              <p className="text-[11px] text-slate-400">Can apply percentage or fixed discounts at checkout.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.applyDiscounts)}
              onChange={() => handleTogglePermission("applyDiscounts")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Issue Refunds & Void Invoices</span>
              <p className="text-[11px] text-slate-400">Can reverse payments or issue customer refunds.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.processRefunds)}
              onChange={() => handleTogglePermission("processRefunds")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Reprint Customer Receipts</span>
              <p className="text-[11px] text-slate-400">Can reprint past invoices and thermal receipts.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.reprintReceipts)}
              onChange={() => handleTogglePermission("reprintReceipts")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Group 3: Inventory & Catalog Services */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-xs">
          <Package className="size-3.5 text-purple-600" />
          <span>Inventory & Catalog Services</span>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">View Products & Stock Quantities</span>
              <p className="text-[11px] text-slate-400">Can look up retail hair/skin product availability.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.viewProducts)}
              onChange={() => handleTogglePermission("viewProducts")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Stock-in & Adjust Inventory</span>
              <p className="text-[11px] text-slate-400">Can receive new stock or mark items damaged/lost.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.manageInventory)}
              onChange={() => handleTogglePermission("manageInventory")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Add & Edit Salon Services</span>
              <p className="text-[11px] text-slate-400">Can create treatments, modify pricing or durations.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.manageServices)}
              onChange={() => handleTogglePermission("manageServices")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Group 4: Customers & Administration */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 mb-3 text-xs">
          <Users className="size-3.5 text-rose-600" />
          <span>Customers & Administration</span>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">View Customer Contact Details</span>
              <p className="text-[11px] text-slate-400">Can view phone numbers and customer profiles.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.viewCustomers)}
              onChange={() => handleTogglePermission("viewCustomers")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Create & Edit Customer Profiles</span>
              <p className="text-[11px] text-slate-400">Can register new clients and edit medical/hair notes.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.manageCustomers)}
              onChange={() => handleTogglePermission("manageCustomers")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">View Financial Ledger & Cash Flow</span>
              <p className="text-[11px] text-slate-400">Can inspect salon total sales, expenses, and profit.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.viewFinancialLedger)}
              onChange={() => handleTogglePermission("viewFinancialLedger")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Manage Staff Accounts</span>
              <p className="text-[11px] text-slate-400">Can add stylists, edit roles, or deactivate staff.</p>
            </div>
            <Input
              type="checkbox"
              checked={Boolean(currentRolePerms.manageStaff)}
              onChange={() => handleTogglePermission("manageStaff")}
              className="size-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PermissionsMatrix;
