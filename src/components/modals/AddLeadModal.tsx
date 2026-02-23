import { useForm } from "react-hook-form";
import { useCreateLead } from "@hooks/useMutations";
import { leadsQueryKeys } from "@hooks/useQueries";
import type { CreateLeadPayload, LeadStatus } from "../../types";
import { Check, User, Building2, DollarSign, Flag } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export function AddLeadModal({ isOpen, onClose }: AddLeadModalProps) {
  const queryClient = useQueryClient();
  const createLead = useCreateLead();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      source: "",
      value: "",
      status: "NEW",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const payload: CreateLeadPayload = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email || undefined,
        phone: data.phone || undefined,
        company: data.company || undefined,
        source: data.source || undefined,
        value: data.value ? parseFloat(data.value) : undefined,
        notes: data.jobTitle ? `Job Title: ${data.jobTitle}` : undefined,
      };

      await createLead.mutateAsync(payload);

      // Invalidate queries to refresh the leads list
      queryClient.invalidateQueries({ queryKey: leadsQueryKeys.all });

      // Reset form and close modal
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create lead:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-hidden p-0 gap-0">
        <DialogHeader className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Add New Lead
          </DialogTitle>
          <DialogDescription className="text-xs mt-0.5">
            Create a new opportunity in your sales pipeline.
          </DialogDescription>
        </DialogHeader>

        {/* Modal Body (Scrollable) */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-4 modal-scrollbar">
          <form
            id="add-lead-form"
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

            {/* Section: Initial Status */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Flag className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Initial Status
                </h4>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Current Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["NEW", "CONTACTED", "PROPOSAL", "ON_HOLD"].map((status) => (
                    <label key={status} className="cursor-pointer">
                      <input
                        {...register("status")}
                        type="radio"
                        value={status}
                        className="sr-only peer"
                      />
                      <div className="px-3 py-2 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all text-xs font-bold uppercase">
                        {status.replace("_", " ")}
                      </div>
                    </label>
                  ))}
                </div>
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
            form="add-lead-form"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Add Lead
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
