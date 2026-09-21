"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { submitProjectInquiryAction } from "@/app/contact/actions";

interface FormData {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  existingWebsite: string;
  serviceInterest: string;
  industry: string;
  budgetRange: string;
  timeline: string;
  description: string;
}

const initialFormData: FormData = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  existingWebsite: "",
  serviceInterest: "full-stack-partnership",
  industry: "e-commerce",
  budgetRange: "$3,000 - $5,000",
  timeline: "within-2-weeks",
  description: "",
};

export function ProjectInquiryForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business / company name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Work email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone or WhatsApp number is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please share a brief description of your project.";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Please provide a bit more detail (min 20 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const result = await submitProjectInquiryAction(formData);

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error || "Something went wrong. Please try again.");
      return;
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E5E5E2] text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#858585] block mb-2">
            INQUIRY SUBMITTED SUCCESSFULLY
          </span>
          <h3 className="text-2xl sm:text-3xl font-semibold text-[#111111] mb-2">
            Thank you, {formData.name}.
          </h3>
          <p className="text-sm text-[#555555] max-w-md mx-auto leading-relaxed">
            We have received your qualification inquiry for <strong className="text-[#111111]">{formData.businessName}</strong>.
            Founder Dhrubo Duti Biswas will review your requirements and reply within 24 hours.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#F7F7F5] border border-[#E5E5E2] max-w-sm mx-auto text-left text-xs space-y-1.5 font-mono text-[#555555]">
          <div><strong>Service:</strong> {formData.serviceInterest}</div>
          <div><strong>Budget:</strong> {formData.budgetRange}</div>
          <div><strong>Timeline:</strong> {formData.timeline}</div>
          <div><strong>Direct Contact:</strong> {formData.email}</div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFormData(initialFormData);
            setIsSubmitted(false);
          }}
        >
          Submit Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="p-8 sm:p-12 rounded-3xl bg-white border border-[#D8D8D4] space-y-8"
    >
      <div className="border-b border-[#E5E5E2] pb-6">
        <h3 className="text-2xl font-semibold text-[#111111] mb-1">
          Project Qualification Form
        </h3>
        <p className="text-xs text-[#555555]">
          Fill in your project details below to receive a personalized scope assessment.
        </p>
      </div>

      {/* Row 1: Name & Business Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold mb-2">
            Your Full Name *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Dhrubo Biswas"
            className={`w-full px-4 py-3 text-sm bg-[#F7F7F5] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1400FF] transition-all text-[#111111] ${
              errors.name ? "border-rose-500 bg-rose-50/20" : "border-[#E5E5E2]"
            }`}
          />
          {errors.name && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="businessName" className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold mb-2">
            Business / Company Name *
          </label>
          <input
            id="businessName"
            type="text"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            placeholder="Acme Commerce Ltd."
            className={`w-full px-4 py-3 text-sm bg-[#F7F7F5] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1400FF] transition-all text-[#111111] ${
              errors.businessName ? "border-rose-500 bg-rose-50/20" : "border-[#E5E5E2]"
            }`}
          />
          {errors.businessName && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.businessName}</span>
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold mb-2">
            Work Email Address *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@company.com"
            className={`w-full px-4 py-3 text-sm bg-[#F7F7F5] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1400FF] transition-all text-[#111111] ${
              errors.email ? "border-rose-500 bg-rose-50/20" : "border-[#E5E5E2]"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold mb-2">
            Phone / WhatsApp Number *
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+880 1XXX-XXXXXX"
            className={`w-full px-4 py-3 text-sm bg-[#F7F7F5] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1400FF] transition-all text-[#111111] ${
              errors.phone ? "border-rose-500 bg-rose-50/20" : "border-[#E5E5E2]"
            }`}
          />
          {errors.phone && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>
      </div>

      {/* Row 3: Existing Website & Industry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="existingWebsite" className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold mb-2">
            Existing Website / Social URL (Optional)
          </label>
          <input
            id="existingWebsite"
            type="url"
            value={formData.existingWebsite}
            onChange={(e) => setFormData({ ...formData, existingWebsite: e.target.value })}
            placeholder="https://yourbrand.com"
            className="w-full px-4 py-3 text-sm bg-[#F7F7F5] border border-[#E5E5E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1400FF] transition-all text-[#111111]"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold mb-2">
            Industry Domain
          </label>
          <select
            id="industry"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full px-4 py-3 text-sm bg-[#F7F7F5] border border-[#E5E5E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1400FF] transition-all text-[#111111]"
          >
            <option value="e-commerce">E-Commerce & Retail</option>
            <option value="education">Education & Online Courses</option>
            <option value="technology">Technology & SaaS</option>
            <option value="automotive">Automotive & Hardware</option>
            <option value="professional-services">Professional Services & Consulting</option>
            <option value="travel-hospitality">Travel & Hospitality</option>
            <option value="other">Other Domain</option>
          </select>
        </div>
      </div>

      {/* Row 4: Required Service & Budget Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="serviceInterest" className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold mb-2">
            Required Service / Capability
          </label>
          <select
            id="serviceInterest"
            value={formData.serviceInterest}
            onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
            className="w-full px-4 py-3 text-sm bg-[#F7F7F5] border border-[#E5E5E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1400FF] transition-all text-[#111111]"
          >
            <option value="full-stack-partnership">Full-Stack Partnership (Marketing + Web)</option>
            <option value="meta-ads">Meta & Facebook Ads Management</option>
            <option value="google-ads">Google Ads & PPC Search</option>
            <option value="lead-generation">Lead Generation & Funnels</option>
            <option value="business-website">Custom Business Website (Next.js)</option>
            <option value="custom-ecommerce">Custom E-Commerce Platform</option>
            <option value="web-application">Custom Web Application / ERP / Portal</option>
          </select>
        </div>

        <div>
          <label htmlFor="budgetRange" className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold mb-2">
            Estimated Project Budget
          </label>
          <select
            id="budgetRange"
            value={formData.budgetRange}
            onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
            className="w-full px-4 py-3 text-sm bg-[#F7F7F5] border border-[#E5E5E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1400FF] transition-all text-[#111111]"
          >
            <option value="under-1000">Under $1,000 / ৳100K</option>
            <option value="$1,000 - $3,000">$1,000 – $3,000 / ৳100K – ৳300K</option>
            <option value="$3,000 - $5,000">$3,000 – $5,000 / ৳300K – ৳500K</option>
            <option value="$5,000 - $10,000">$5,000 – $10,000 / ৳500K – ৳1M</option>
            <option value="$10,000+">$10,000+ / ৳1M+</option>
          </select>
        </div>
      </div>

      {/* Row 5: Timeline */}
      <div>
        <label htmlFor="timeline" className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold mb-2">
          Target Launch Timeline
        </label>
        <select
          id="timeline"
          value={formData.timeline}
          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
          className="w-full px-4 py-3 text-sm bg-[#F7F7F5] border border-[#E5E5E2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1400FF] transition-all text-[#111111]"
        >
          <option value="immediate">Immediate Kickoff (Within 1 week)</option>
          <option value="within-2-weeks">Within 2–4 weeks</option>
          <option value="within-a-month">1–2 Months</option>
          <option value="exploring">Exploring options / Planning stage</option>
        </select>
      </div>

      {/* Row 6: Project Description */}
      <div>
        <label htmlFor="description" className="block text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold mb-2">
          Project Goals & Current Challenges *
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Tell us about your product or service, target customer, what you've tried so far, and what commercial outcome you want to achieve..."
          className={`w-full px-4 py-3 text-sm bg-[#F7F7F5] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1400FF] transition-all text-[#111111] ${
            errors.description ? "border-rose-500 bg-rose-50/20" : "border-[#E5E5E2]"
          }`}
        />
        {errors.description && (
          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.description}</span>
          </p>
        )}
      </div>

      {/* Submit Button & SLA note */}
      <div className="pt-4 border-t border-[#E5E5E2] space-y-4">
        {submitError && (
          <p className="text-sm text-rose-600 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{submitError}</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#555555] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1400FF]" />
            <span>Guaranteed response within 24 hours.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            loading={isSubmitting}
            withArrow
            arrowType="diagonal"
            className="w-full sm:w-auto"
          >
            Submit Qualification Inquiry
          </Button>
        </div>
      </div>
    </form>
  );
}
