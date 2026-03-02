import { useForm, useWatch } from "react-hook-form";
import { useUpdateLead } from "@hooks/useMutations";
import { leadsQueryKeys } from "@hooks/useQueries";
import type { UpdateLeadPayload, LeadStatus, Lead } from "../../types";
import { leadStatusColors } from "../../types";
import {
  Check,
  User,
  Building2,
  DollarSign,
  Flag,
  AlertCircle,
  Calendar,
  FileText,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  source: string;
  value: string;
  status: LeadStatus;
  notes: string;
  lostReason: string;
  nextFollowUpAt: string;
}

// Helper to parse name into first and last name
function parseName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(" ");
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };

  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
}

// Helper to convert ISO date to datetime-local format
function toDatetimeLocal(isoString: string | null): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function EditLeadModal({ isOpen, onClose, lead }: EditLeadModalProps) {
  const queryClient = useQueryClient();
  const updateLead = useUpdateLead();

  const { firstName, lastName } = parseName(lead.name);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      email: lead.email || "",
      phone: lead.phone || "",
      company: lead.company || "",
      jobTitle: "",
      source: lead.source || "",
      value: lead.value ? String(lead.value) : "",
      status: lead.status,
      notes: lead.notes || "",
      lostReason: lead.lostReason || "",
      nextFollowUpAt: toDatetimeLocal(lead.nextFollowUpAt),
    },
  });

  // Watch the status field to conditionally show lost reason
  const watchedStatus = useWatch({ control, name: "status" });

  const onSubmit = async (data: FormData) => {
    try {
      const payload: UpdateLeadPayload = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email || undefined,
        phone: data.phone || undefined,
        company: data.company || undefined,
        source: data.source || undefined,
        value: data.value ? parseFloat(data.value) : undefined,
        status: data.status,
        notes: data.notes || undefined,
        lostReason: data.status === "LOST" ? data.lostReason : undefined,
        nextFollowUpAt: data.nextFollowUpAt
          ? new Date(data.nextFollowUpAt).toISOString()
          : undefined,
      };

      await updateLead.mutateAsync({ id: lead.id, payload });

      // Invalidate queries to refresh the leads list
      queryClient.invalidateQueries({ queryKey: leadsQueryKeys.all });

      // Reset form and close modal
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update lead:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const allStatuses: LeadStatus[] = [
    "NEW",
    "CONTACTED",
    "PROPOSAL",
    "ON_HOLD",
    "WON",
    "LOST",
  ];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-hidden p-0 gap-0 max-w-2xl">
        <DialogHeader className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Edit Lead
          </DialogTitle>
          <DialogDescription className="text-xs mt-0.5">
            Update lead information and track progress through your sales
            pipeline.
          </DialogDescription>
        </DialogHeader>

        {/* Modal Body (Scrollable) */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-4 modal-scrollbar">
          <form
            id="edit-lead-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Section: Personal Information */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Personal Information
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters",
                      },
                    })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                    placeholder="e.g. John"
                    type="text"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters",
                      },
                    })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                    placeholder="e.g. Doe"
                    type="text"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    {...register("email", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                    placeholder="john.doe@company.com"
                    type="email"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    {...register("phone", {
                      pattern: {
                        value: /^[\d\s+()-]+$/,
                        message: "Invalid phone number",
                      },
                    })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Section: Lead Status (PROMINENT) */}
            <section className="bg-slate-50 dark:bg-slate-800/50 -mx-6 px-6 py-6 border-y border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Flag className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Lead Status
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Click to change the current status of this lead
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allStatuses.map((status) => (
                  <label key={status} className="cursor-pointer">
                    <input
                      {...register("status")}
                      type="radio"
                      value={status}
                      className="sr-only peer"
                    />
                    <div
                      className={`relative px-4 py-3 rounded-lg transition-all text-center ${leadStatusColors[status]} peer-checked:ring-4 peer-checked:ring-primary/30 peer-checked:scale-105 hover:scale-105`}
                    >
                      <div className="font-bold text-sm uppercase tracking-wide">
                        {status.replace("_", " ")}
                      </div>
                      {/* Checkmark indicator */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full items-center justify-center hidden peer-checked:flex">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Conditional: Lost Reason Field */}
            {watchedStatus === "LOST" && (
              <section className="bg-red-50 dark:bg-red-900/10 -mx-6 px-6 py-6 border-y border-red-100 dark:border-red-900/30">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                    Reason for Loss
                  </h4>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Please explain why this lead was lost{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("lostReason", {
                      required:
                        watchedStatus === "LOST"
                          ? "Lost reason is required when marking as lost"
                          : false,
                      minLength: {
                        value: 3,
                        message: "Please provide at least 3 characters",
                      },
                    })}
                    className="w-full px-4 py-2.5 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm outline-none resize-none"
                    placeholder="e.g. Budget constraints, went with competitor, timing not right..."
                    rows={3}
                  />
                  {errors.lostReason && (
                    <p className="text-xs text-red-500">
                      {errors.lostReason.message}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Section: Company Details */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Company Details
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Company Name
                  </label>
                  <input
                    {...register("company")}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                    placeholder="Acme Corp"
                    type="text"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Job Title
                  </label>
                  <input
                    {...register("jobTitle")}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                    placeholder="Marketing Director"
                    type="text"
                  />
                </div>
              </div>
            </section>

            {/* Section: Notes */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Notes
                </h4>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Additional Notes
                </label>
                <textarea
                  {...register("notes")}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none resize-none"
                  placeholder="Add any additional information about this lead..."
                  rows={4}
                />
              </div>
            </section>

            {/* Section: Lead Source & Value */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Lead Source &amp; Value
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Lead Source
                  </label>
                  <select
                    {...register("source")}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none appearance-none"
                  >
                    <option value="">Select source</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Direct">Direct</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Marketing Campaign">
                      Marketing Campaign
                    </option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Estimated Value
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                      $
                    </span>
                    <input
                      {...register("value", {
                        min: {
                          value: 0,
                          message: "Value must be positive",
                        },
                      })}
                      className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  {errors.value && (
                    <p className="text-xs text-red-500">
                      {errors.value.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Section: Next Follow-up */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Follow-up Schedule
                </h4>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Next Follow-Up Date
                </label>
                <input
                  {...register("nextFollowUpAt")}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                  type="datetime-local"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Set a reminder for when to follow up with this lead
                </p>
              </div>
            </section>
          </form>
        </div>

        {/* Modal Footer */}
        <DialogFooter className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-lead-form"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Update Lead
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
