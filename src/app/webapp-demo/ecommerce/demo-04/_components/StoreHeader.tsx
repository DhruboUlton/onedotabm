'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  HelpCircle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../_context/StoreContext';
import { WonderSproutLogo, SunDoodle } from './Doodles';

export function StoreHeader({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const pathname = usePathname();
  const { settings, cartCount, wishlist, openCart, openEnquiry, categories } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopMegaOpen, setShopMegaOpen] = useState(false);
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);

  const base = '/webapp-demo/ecommerce/demo-04';

  return (
    <header className="relative z-40 bg-white border-b border-slate-100">
      {/* 1. Announcement Bar */}
      {settings.announcementEnabled && settings.announcementText && (
        <div className="bg-[#FFEFE4] text-[#0A6375] py-2 px-4 text-xs sm:text-sm font-semibold text-center border-b border-[#F7941E]/20 overflow-hidden relative">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block animate-bounce text-xs">✨</span>
            <span className="font-nunito">{settings.announcementText}</span>
            <Link
              href={`${base}/collection`}
              className="hidden md:inline-flex items-center gap-1 text-[#EB1551] underline font-bold hover:text-[#0A6375] ml-2"
            >
              Shop Sale <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* 2. Top Bar (Desktop) */}
      <div className="hidden lg:block bg-[#EB1551] text-white py-2 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${settings.supportPhone}`}
              className="flex items-center gap-2 hover:text-[#FFEFE4] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#FFEFE4]" />
              <span>{settings.supportPhone}</span>
            </a>
            <a
              href={`mailto:${settings.supportEmail}`}
              className="flex items-center gap-2 hover:text-[#FFEFE4] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#FFEFE4]" />
              <span>{settings.supportEmail}</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/80 font-normal">Connect With Us:</span>
            <div className="flex items-center gap-1.5">
              {['Facebook', 'Instagram', 'Pinterest', 'YouTube'].map((social) => (
                <span
                  key={social}
                  title={social}
                  className="w-6 h-6 rounded-full bg-white/20 hover:bg-white hover:text-[#EB1551] text-white flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors"
                >
                  {social[0]}
                </span>
              ))}
            </div>
            <div className="h-3 w-px bg-white/30 mx-1" />
            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold">
              🇺🇸 {settings.currency} ({settings.currencySymbol})
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        {/* Mobile Hamburger */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-[#0F172A] hover:text-[#EB1551] rounded-xl focus:outline-none"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Brand Logo */}
        <Link href={base} className="flex-shrink-0 group">
          <WonderSproutLogo />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 font-nunito text-[15px] font-bold text-[#0F172A]">
          <Link
            href={base}
            className={`transition-colors hover:text-[#EB1551] ${
              pathname === base ? 'text-[#EB1551]' : ''
            }`}
          >
            Home
          </Link>

          {/* Shop Mega Menu Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setShopMegaOpen(true)}
            onMouseLeave={() => setShopMegaOpen(false)}
          >
            <Link
              href={`${base}/collection`}
              className={`flex items-center gap-1 transition-colors hover:text-[#EB1551] py-2 ${
                pathname?.includes('/collection') ? 'text-[#EB1551]' : ''
              }`}
            >
              <span>Shop</span>
              <span className="bg-[#008000] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full tracking-wider">
                Sale
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
            </Link>

            {/* Mega Dropdown Panel */}
            {shopMegaOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[620px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#F7941E] pb-1 border-b border-slate-100">
                    Explore Categories
                  </h4>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`${base}/collection?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FFEFE4]/60 text-sm text-[#0F172A] hover:text-[#EB1551] transition-all group/item"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-slate-400 group-hover/item:text-[#EB1551]">
                        {cat.productCount} toys
                      </span>
                    </Link>
                  ))}
                  <Link
                    href={`${base}/collection`}
                    className="block text-xs font-bold text-[#1CBBB4] hover:underline pt-2"
                  >
                    View All Categories &rarr;
                  </Link>
                </div>

                <div className="bg-[#FFEFE4] rounded-2xl p-4 flex flex-col justify-between border border-[#F7941E]/20">
                  <div>
                    <span className="inline-block bg-[#EB1551] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mb-2">
                      Featured Kit
                    </span>
                    <h5 className="font-bubblegum text-xl text-[#0A6375] leading-tight">
                      Montessori Wooden Busy Board
                    </h5>
                    <p className="text-xs text-[#6B6B84] mt-1">
                      Promotes independent problem-solving and motor coordination.
                    </p>
                  </div>
                  <Link
                    href={`${base}/products/montessori-busy-board-house`}
                    className="ws-btn-primary px-4 py-2 text-xs font-bold mt-3 text-center"
                  >
                    Shop Featured $78.50
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href={`${base}/about`}
            className={`flex items-center gap-1 transition-colors hover:text-[#EB1551] ${
              pathname === `${base}/about` ? 'text-[#EB1551]' : ''
            }`}
          >
            <span>About</span>
            <span className="bg-[#EB1551] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full tracking-wider">
              Hot
            </span>
          </Link>

          {/* Pages Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setPagesDropdownOpen(true)}
            onMouseLeave={() => setPagesDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 transition-colors hover:text-[#EB1551] py-2 focus:outline-none">
              <span>Pages</span>
              <span className="bg-[#F7941E] text-white text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full tracking-wider">
                New
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {pagesDropdownOpen && (
              <div className="absolute top-full left-0 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in duration-150">
                <Link
                  href={`${base}/faq`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#0F172A] hover:bg-[#FFEFE4] hover:text-[#EB1551] transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-[#1CBBB4]" />
                  <span>FAQs & Help</span>
                </Link>
                <Link
                  href={`${base}/blog`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#0F172A] hover:bg-[#FFEFE4] hover:text-[#EB1551] transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-[#F7941E]" />
                  <span>Parenting Blog</span>
                </Link>
                <Link
                  href={`${base}/contact`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#0F172A] hover:bg-[#FFEFE4] hover:text-[#EB1551] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#EB1551]" />
                  <span>Contact School</span>
                </Link>
              </div>
            )}
          </div>

          <Link
            href={`${base}/contact`}
            className={`transition-colors hover:text-[#EB1551] ${
              pathname === `${base}/contact` ? 'text-[#EB1551]' : ''
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-full bg-[#FFEFE4]/60 hover:bg-[#FFEFE4] text-[#0A6375] hover:text-[#EB1551] flex items-center justify-center transition-colors"
            aria-label="Search toys and kits"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist Indicator */}
          <Link
            href={`${base}/collection?wishlist=true`}
            className="relative w-10 h-10 rounded-full bg-[#FFEFE4]/60 hover:bg-[#FFEFE4] text-[#0A6375] hover:text-[#EB1551] flex items-center justify-center transition-colors"
            title="Your Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EB1551] text-white text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="relative w-10 h-10 rounded-full bg-[#FFEFE4]/60 hover:bg-[#FFEFE4] text-[#0A6375] hover:text-[#EB1551] flex items-center justify-center transition-colors"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EB1551] text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Enquire Now Button */}
          <button
            onClick={() => openEnquiry()}
            className="hidden sm:inline-flex ws-btn-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            Enquire Now
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <WonderSproutLogo />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-900"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-4 space-y-1 font-nunito">
                <Link
                  href={base}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-bold text-base text-[#0F172A] hover:bg-[#FFEFE4]"
                >
                  Home
                </Link>
                <Link
                  href={`${base}/collection`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-bold text-base text-[#0F172A] hover:bg-[#FFEFE4]"
                >
                  Shop All Toys
                </Link>
                <div className="pl-4 space-y-1 border-l-2 border-[#1CBBB4]/40 my-1">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`${base}/collection?category=${encodeURIComponent(c.name)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 text-sm text-[#6B6B84] hover:text-[#EB1551]"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href={`${base}/about`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-bold text-base text-[#0F172A] hover:bg-[#FFEFE4]"
                >
                  About WonderSprout
                </Link>
                <Link
                  href={`${base}/faq`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-bold text-base text-[#0F172A] hover:bg-[#FFEFE4]"
                >
                  FAQs & Help
                </Link>
                <Link
                  href={`${base}/blog`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-bold text-base text-[#0F172A] hover:bg-[#FFEFE4]"
                >
                  Parenting Blog
                </Link>
                <Link
                  href={`${base}/contact`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-bold text-base text-[#0F172A] hover:bg-[#FFEFE4]"
                >
                  Contact & Support
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openEnquiry();
                }}
                className="w-full ws-btn-primary py-3 text-sm font-bold uppercase tracking-wider"
              >
                Enquire For Schools
              </button>
              <div className="text-center text-xs text-[#6B6B84]">
                Call: <a href={`tel:${settings.supportPhone}`} className="text-[#EB1551] font-bold">{settings.supportPhone}</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
