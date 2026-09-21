'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Megaphone,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { SiteBannerRecord } from '@/types/database';
import { saveSiteBannerAction, createSiteBannerAction, deleteSiteBannerAction } from './actions';

interface SiteBannerClientViewProps {
  initialBanner: SiteBannerRecord | null;
  allBanners: SiteBannerRecord[];
}

export function SiteBannerClientView({
  initialBanner,
  allBanners: initialAllBanners,
}: SiteBannerClientViewProps) {
  const router = useRouter();
  const [activeBanner, setActiveBanner] = useState<SiteBannerRecord | null>(initialBanner);
  const [banners, setBanners] = useState<SiteBannerRecord[]>(initialAllBanners);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: activeBanner?.id || 'primary',
    message:
      activeBanner?.message ||
      'Now accepting new B2B client applications for Q4 high-performance growth sprints.',
    link_text: activeBanner?.link_text || 'Start a Project',
    link_url: activeBanner?.link_url || '/start-a-project',
    enabled: activeBanner?.enabled ?? false,
    start_date: activeBanner?.start_date ? activeBanner.start_date.split('T')[0] : '',
    end_date: activeBanner?.end_date ? activeBanner.end_date.split('T')[0] : '',
    priority: activeBanner?.priority || 1,
  });

  const handleSelectBanner = (banner: SiteBannerRecord) => {
    setActiveBanner(banner);
    setFormData({
      id: banner.id,
      message: banner.message,
      link_text: banner.link_text || '',
      link_url: banner.link_url || '',
      enabled: banner.enabled,
      start_date: banner.start_date ? banner.start_date.split('T')[0] : '',
      end_date: banner.end_date ? banner.end_date.split('T')[0] : '',
      priority: banner.priority,
    });
  };

  const handleNewBannerTemplate = () => {
    setFormData({
      id: 'new',
      message: 'Exclusive Announcement: New marketing engineering framework live.',
      link_text: 'Explore Framework',
      link_url: '/services',
      enabled: false,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      priority: (banners[0]?.priority || 0) + 1,
    });
    setActiveBanner(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      setErrorMessage('Announcement message cannot be blank.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    if (formData.id === 'new') {
      const res = await createSiteBannerAction({
        message: formData.message.trim(),
        link_text: formData.link_text?.trim() || null,
        link_url: formData.link_url?.trim() || null,
        enabled: formData.enabled,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        priority: Number(formData.priority) || 1,
      });

      setIsSaving(false);

      if (res.success && res.data) {
        setBanners([res.data, ...banners]);
        setActiveBanner(res.data);
        setFormData((prev) => ({ ...prev, id: res.data!.id }));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Failed to create banner');
      }
    } else {
      const res = await saveSiteBannerAction(formData.id, {
        message: formData.message.trim(),
        link_text: formData.link_text?.trim() || null,
        link_url: formData.link_url?.trim() || null,
        enabled: formData.enabled,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        priority: Number(formData.priority) || 1,
      });

      setIsSaving(false);

      if (res.success && res.data) {
        setBanners(
          banners.map((b) => (b.id === res.data!.id ? res.data! : b))
        );
        setActiveBanner(res.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Failed to update banner');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement banner?')) return;

    const res = await deleteSiteBannerAction(id);
    if (res.success) {
      const remaining = banners.filter((b) => b.id !== id);
      setBanners(remaining);
      if (activeBanner?.id === id) {
        if (remaining[0]) {
          handleSelectBanner(remaining[0]);
        } else {
          handleNewBannerTemplate();
        }
      }
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete banner');
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">
            Site Banner Announcement
          </h1>
          <p className="text-sm text-[#858585] mt-1">
            Broadcast strategic announcements, seasonal cohort launches, and urgent notices across the header of OneDot ABM.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleNewBannerTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#E5E5E2] bg-white text-[#555555] hover:text-[#111111] hover:bg-[#F0F0ED] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Announcement</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1400FF] text-white text-sm font-medium hover:bg-[#0F00CC] disabled:opacity-50 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Banner'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Site banner configuration updated and broadcasted!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* LIVE PREVIEW HERO CARD */}
      <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1400FF]" />
            <span className="text-xs font-mono uppercase text-[#858585] tracking-wider font-semibold">
              Live Preview in Browser Context
            </span>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              formData.enabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-zinc-100 text-zinc-600 border-zinc-200'
            }`}
          >
            {formData.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{formData.enabled ? 'Live on Site' : 'Currently Hidden'}</span>
          </span>
        </div>

        {/* Mock Browser Top Banner Bar */}
        <div className="rounded-xl border border-[#E5E5E2] overflow-hidden bg-white shadow-xs">
          {formData.enabled ? (
            <div className="bg-[#111111] text-white px-4 py-2.5 flex items-center justify-center text-xs font-medium gap-2 sm:gap-3 text-center transition-all">
              <span className="text-white/90">{formData.message}</span>
              {formData.link_text && (
                <span className="inline-flex items-center gap-1 font-semibold text-[#1400FF] bg-white px-2 py-0.5 rounded text-[11px] hover:underline shrink-0">
                  <span>{formData.link_text}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              )}
            </div>
          ) : (
            <div className="p-4 text-center bg-[#F7F7F5] text-xs text-[#858585] italic">
              Banner is disabled. Turn on &ldquo;Enable Live Announcement&rdquo; below to activate.
            </div>
          )}

          {/* Mock Public Navbar Skeleton */}
          <div className="px-6 py-3 border-t border-[#E5E5E2] bg-white flex items-center justify-between opacity-60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#1400FF] text-white flex items-center justify-center font-bold text-xs">
                1.
              </div>
              <span className="font-bold text-xs text-[#111111]">OneDot ABM</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs text-[#858585]">
              <span>Services</span>
              <span>Work</span>
              <span>Case Studies</span>
              <span>Pricing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Content Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-5">
            <h2 className="text-base font-bold text-[#111111] flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#1400FF]" />
              <span>Announcement Message & Call to Action</span>
            </h2>

            {/* Enable Switch */}
            <label className="flex items-center justify-between p-4 rounded-xl border border-[#E5E5E2] bg-[#F7F7F5] cursor-pointer transition-colors hover:bg-[#F0F0ED]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    formData.enabled
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-zinc-200 text-zinc-600'
                  }`}
                >
                  {formData.enabled ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="text-sm font-bold text-[#111111] block">
                    Enable Live Announcement
                  </span>
                  <span className="text-xs text-[#858585]">
                    When checked, this message will display at the top of every public page.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-5 h-5 rounded text-[#1400FF] focus:ring-[#1400FF]"
              />
            </label>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-1">
                Announcement Message *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. 🚀 Now Onboarding Q4 ABM Growth Cohorts — Book a 20-Minute Fit Call"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Button / Link Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule Fit Call"
                  value={formData.link_text}
                  onChange={(e) => setFormData({ ...formData, link_text: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. /start-a-project or https://..."
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Priority Weight
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white font-mono"
                />
                <span className="text-[10px] text-[#858585] mt-1 block">
                  Higher number overrides other banners.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F7F5] rounded-lg border border-[#E5E5E2] focus:outline-none focus:border-[#1400FF] focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Saved Banners History */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E5E5E2] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111111]">Announcement Campaigns</h3>
            <p className="text-xs text-[#858585]">
              Select a banner campaign to view, edit, or set active.
            </p>

            <div className="space-y-2.5">
              {banners.length === 0 ? (
                <p className="text-xs text-[#858585] text-center py-4">No saved banners yet.</p>
              ) : (
                banners.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => handleSelectBanner(b)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      b.id === formData.id
                        ? 'border-[#1400FF] bg-blue-50/40 shadow-xs'
                        : 'border-[#E5E5E2] bg-white hover:bg-[#F9F9F8]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-[#111111] line-clamp-2">
                        {b.message}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(b.id);
                        }}
                        className="p-1 text-[#858585] hover:text-rose-600 rounded transition-colors shrink-0"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#858585]">
                      <span
                        className={`px-1.5 py-0.5 rounded font-medium ${
                          b.enabled
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {b.enabled ? 'Active' : 'Inactive'}
                      </span>
                      <span className="font-mono">Priority: {b.priority}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
