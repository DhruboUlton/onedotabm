'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Play,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Sparkles,
  BookOpen,
  Compass,
  Smile,
  Shield,
  Send,
} from 'lucide-react';
import { useStore } from '../_context/StoreContext';
import { StoreHeader } from '../_components/StoreHeader';
import { StoreFooter } from '../_components/StoreFooter';
import { ProductCard } from '../_components/ProductCard';
import { CartDrawer } from '../_components/CartDrawer';
import { QuickAddModal } from '../_components/QuickAddModal';
import { EnquiryModal } from '../_components/EnquiryModal';
import { SearchModal } from '../_components/SearchModal';
import { PromoPopup } from '../_components/PromoPopup';
import {
  RocketDoodle,
  SunDoodle,
  StarDoodle,
  CloudShape,
  WavyDivider,
} from '../_components/Doodles';

export default function WonderSproutHomepage() {
  const { products, banners, reviews, addToast } = useStore();
  const base = '/webapp-demo/ecommerce/demo-04';

  // Search Modal State
  const [searchOpen, setSearchOpen] = useState(false);

  // Hero Slider State
  const activeBanners = banners.filter((b) => b.isActive);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  // Video Tab State
  const [activeAgeTab, setActiveAgeTab] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Testimonial Slider State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Newsletter Email State
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    addToast('success', 'Subscribed! 💌', 'Welcome to WonderSprout family. Check your inbox for your 20% gift!');
    setNewsletterEmail('');
  };

  // Age Tab Data
  const ageTabs = [
    {
      age: '2–5',
      unit: 'Years',
      subtitle: 'Early Explorers',
      title: 'Sensory Wonder & Tactile Montessori',
      description:
        'Self-correcting wooden activity boards, abacus counters, and graduated stacking rings designed to nurture tactile intuition and fine motor mechanics.',
      image: '/demo-assets/ecommerce/demo-04/about-kids.jpg',
      color: '#EB1551',
    },
    {
      age: '6–10',
      unit: 'Years',
      subtitle: 'Junior Builders',
      title: 'STEM Kinematics & Applied Mechanics',
      description:
        'Hands-on gear builders, articulating wooden robotics, and architectural building systems that demystify physics through tangible creative play.',
      image: '/demo-assets/ecommerce/demo-04/classroom.jpg',
      color: '#F7941E',
    },
    {
      age: '11–13',
      unit: 'Years',
      subtitle: 'Young Scientists',
      title: 'Astrophysics & Solar System Exploration',
      description:
        'Clockwork planetary orrery models, celestial star charts, and mechanical logic puzzles that inspire inquisitive scientific reasoning.',
      image: '/demo-assets/ecommerce/demo-04/solar-orrery.jpg',
      color: '#1CBBB4',
    },
    {
      age: '14–16',
      unit: 'Years',
      subtitle: 'Creative Minds',
      title: 'Architectural Woodcraft & Advanced Geometry',
      description:
        'Complex 3D puzzle tangrams, precision balancing structures, and organic sculpting kits designed for advanced spatial and artistic mastery.',
      image: '/demo-assets/ecommerce/demo-04/stem-robot.jpg',
      color: '#0A6375',
    },
  ];

  // Testimonial Data
  const testimonials = [
    {
      name: 'Clara Jenkins',
      role: 'Montessori Guide & Mother of Two',
      city: 'Austin, TX',
      quote:
        'WonderSprout has completely transformed how my children engage with play. The wooden abacus and busy cottage cultivate hours of quiet, focused concentration without a single screen or flashing battery.',
      rating: 5,
      avatar: '/demo-assets/ecommerce/demo-04/about-kids.jpg',
    },
    {
      name: 'Dr. Evelyn Howard',
      role: 'Astrophysicist & Educator',
      city: 'Boston, MA',
      quote:
        'The Solar System Orrery is a breathtaking work of mechanical art. My 8-year-old daughter wakes up every morning fascinated by how Earth and Mars orbit proportionally. Superb craftsmanship!',
      rating: 5,
      avatar: '/demo-assets/ecommerce/demo-04/classroom.jpg',
    },
    {
      name: 'Marcus & Rachel Vance',
      role: 'Homeschooling Parents',
      city: 'Seattle, WA',
      quote:
        'From the tactile organic dough to the rainbow stacking tower, every piece feels heirloom-quality. These are toys that will be lovingly passed down through generations.',
      rating: 5,
      avatar: '/demo-assets/ecommerce/demo-04/about-kids.jpg',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Global Navigation Header */}
      <StoreHeader onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1">
        {/* ============================================================== */}
        {/* S1: HERO SLIDESHOW                                             */}
        {/* ============================================================== */}
        <section className="relative bg-[#0A6375] overflow-hidden min-h-[640px] sm:min-h-[720px] lg:min-h-[800px] flex items-center">
          {activeBanners.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image */}
              <Image
                src={slide.imageDesktop}
                alt={slide.title}
                fill
                priority={idx === 0}
                className="object-cover object-center brightness-90 sm:brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />

              {/* Decorative SVG Doodles Floating */}
              <div className="absolute top-12 left-10 hidden md:block animate-rocket-shake pointer-events-none">
                <RocketDoodle className="w-20 h-20" />
              </div>
              <div className="absolute top-16 right-16 hidden md:block animate-cloud-drift pointer-events-none">
                <SunDoodle className="w-16 h-16" />
              </div>
              <div className="absolute bottom-36 left-1/4 hidden lg:block opacity-60 pointer-events-none">
                <StarDoodle className="w-8 h-8 text-[#FFDA43]" />
              </div>

              {/* Slide Content Box */}
              <div className="relative max-w-7xl mx-auto h-full flex items-center px-6 sm:px-12 z-20">
                <div className="max-w-2xl text-white space-y-4 pt-12 pb-24">
                  {slide.accentBadge && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EB1551] text-white text-xs font-black uppercase tracking-wider shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{slide.accentBadge}</span>
                    </span>
                  )}
                  <h1 className="font-bubblegum text-5xl sm:text-7xl lg:text-8xl text-white leading-none tracking-wide animate-text-shadow">
                    {slide.title}
                  </h1>
                  <p className="font-nunito font-extrabold text-2xl sm:text-3xl text-[#FFEFE4] drop-shadow">
                    {slide.subtitle}
                  </p>
                  <p className="font-nunito text-base sm:text-lg text-white/90 max-w-xl leading-relaxed drop-shadow-sm">
                    {slide.tagline}
                  </p>
                  <div className="pt-4 flex flex-wrap gap-4">
                    <Link
                      href={slide.ctaLink}
                      className="ws-btn-hero px-8 py-4 text-sm uppercase tracking-wider font-extrabold shadow-xl"
                    >
                      {slide.ctaText} &rarr;
                    </Link>
                    <Link
                      href={`${base}/about`}
                      className="inline-flex items-center justify-center px-6 py-4 rounded-full border-2 border-white/60 hover:bg-white hover:text-[#0A6375] text-white text-sm font-bold transition-all backdrop-blur-sm"
                    >
                      Our Philosophy
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Prev / Next Controls (Rocket Styled) */}
          {activeBanners.length > 1 && (
            <div className="absolute bottom-28 right-6 sm:right-12 z-30 flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
                }
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-[#EB1551] text-white backdrop-blur-md flex items-center justify-center transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % activeBanners.length)}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-[#EB1551] text-white backdrop-blur-md flex items-center justify-center transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Cloud Mask at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-30 overflow-hidden leading-none pointer-events-none text-white">
            <CloudShape className="w-full h-12 sm:h-20 text-white" />
          </div>
        </section>

        {/* ============================================================== */}
        {/* S2: IMAGE WITH TEXT ("About Us")                                */}
        {/* ============================================================== */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-[#FFEFE4] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Media (Masked Blob) */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/demo-assets/ecommerce/demo-04/about-kids.jpg"
                  alt="Children playing with Montessori wooden toys"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Decorative Floating Blobs & Star */}
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-[#F7941E]/20 -z-10 animate-blob-float" />
              <div className="absolute -bottom-8 -right-6 w-32 h-32 rounded-full bg-[#1CBBB4]/20 -z-10 animate-blob-float" />
              <div className="absolute -top-4 right-8 text-[#FFDA43] animate-pulse">
                <StarDoodle className="w-10 h-10" />
              </div>
            </div>

            {/* Right Text */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-[#EB1551] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>About WonderSprout</span>
              </div>
              <h2 className="font-bubblegum text-4xl sm:text-5xl text-[#0F172A] leading-tight">
                Open The Doors To Your Children’s Knowledge
              </h2>
              <p className="text-sm sm:text-base text-[#6B6B84] leading-relaxed font-nunito">
                Children are born curious explorers. At WonderSprout, we reject loud flashing screens in favor of tactile organic materials that invite self-paced discovery. Every wooden motor skill board, sensory sorting cube, and STEM robot is sustainably handcrafted to satisfy Maria Montessori’s timeless principles.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[#1CBBB4] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                    100% Solid Certified Beechwood
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[#1CBBB4] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                    Non-Toxic Food Grade Dyes
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[#1CBBB4] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                    Designed with Child Psychologists
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[#1CBBB4] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                    Lifetime Durability Warranty
                  </span>
                </div>
              </div>
              <div className="pt-4">
                <Link href={`${base}/about`} className="ws-btn-primary px-8 py-3.5 text-xs uppercase tracking-wider font-extrabold shadow-md">
                  Read Our Full Story
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* S3: SUPPORT BLOCK ("Special Programs")                          */}
        {/* ============================================================== */}
        <section className="py-20 bg-[#FFEFE4] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#EB1551]">
                Holistic Growth
              </span>
              <h2 className="font-bubblegum text-4xl sm:text-5xl text-[#0F172A]">
                Special Learning Programs
              </h2>
              <p className="text-sm text-[#6B6B84] font-nunito">
                Tailored multi-sensory kits crafted for daycare facilities, preschool classrooms, and Montessori home environments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Winter Camp Discovery',
                  desc: 'Tactile sensory boards and cold-weather story blocks designed for cozy indoor discovery.',
                  icon: '❄️',
                  link: `${base}/collection`,
                },
                {
                  title: 'Creative Intelligence',
                  desc: 'Geometric tangrams and color-wheel nesting cubes that foster spatial intuition.',
                  icon: '🎨',
                  link: `${base}/collection`,
                },
                {
                  title: 'Motor & Sensory Pods',
                  desc: 'Pounding pegs, bead mazes, and abacus counters for foundational dexterity training.',
                  icon: '🖐️',
                  link: `${base}/collection`,
                },
                {
                  title: 'Preschool STEM Club',
                  desc: 'Clockwork planetary models, mechanical gears, and junior robotic construction sets.',
                  icon: '🚀',
                  link: `${base}/collection`,
                },
              ].map((prog, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[40px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-[#FFEFE4] text-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {prog.icon}
                    </div>
                    <h3 className="font-bubblegum text-2xl text-[#0A6375] group-hover:text-[#EB1551] transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-[#6B6B84] leading-relaxed font-nunito">
                      {prog.desc}
                    </p>
                  </div>
                  <div className="pt-6">
                    <Link
                      href={prog.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F7941E] ws-wavy-underline hover:text-[#EB1551] transition-colors"
                    >
                      <span>Explore Kits</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* S4: CUSTOM FEATURE SECTION ("Compatible Learning")              */}
        {/* ============================================================== */}
        <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-black uppercase tracking-wider text-[#F7941E]">
                Active Exploration
              </span>
              <h2 className="font-bubblegum text-4xl sm:text-5xl text-[#0F172A] leading-tight">
                The Perfect Place For Kids To Open Their Creative Wings
              </h2>
              <p className="text-sm text-[#6B6B84] leading-relaxed font-nunito">
                When children touch smooth beechwood, hear the soft clink of counting beads, and solve mechanical latch puzzles, neural pathways strengthen naturally. Our certified activity toys encourage perseverance, self-reliance, and joyous laughter.
              </p>
              <div className="pt-2">
                <Link href={`${base}/collection`} className="ws-btn-primary px-8 py-3.5 text-xs uppercase tracking-wider font-extrabold shadow-md">
                  View Catalogue &rarr;
                </Link>
              </div>
            </div>

            {/* Right Curved Gallery Pair */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative aspect-[4/5] rounded-bl-[100px] rounded-tr-[40px] overflow-hidden shadow-xl border-4 border-[#FFEFE4]">
                <Image
                  src="/demo-assets/ecommerce/demo-04/classroom.jpg"
                  alt="Montessori classroom"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative aspect-[4/5] rounded-tr-[100px] rounded-bl-[40px] overflow-hidden shadow-xl border-4 border-[#FFEFE4] mt-6 sm:mt-12">
                <Image
                  src="/demo-assets/ecommerce/demo-04/about-kids.jpg"
                  alt="Kids working together"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* S5: FEATURED PRODUCTS CAROUSEL ("Hand Picked Products")         */}
        {/* ============================================================== */}
        <section className="py-20 bg-gradient-to-b from-white via-[#FFEFE4]/40 to-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#EB1551] flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-[#EB1551]" />
                  <span>Curated Picks</span>
                </span>
                <h2 className="font-bubblegum text-4xl sm:text-5xl text-[#0F172A] mt-1">
                  Hand Picked Products For Your Kids
                </h2>
              </div>
              <Link
                href={`${base}/collection`}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0A6375] hover:text-[#EB1551] transition-colors"
              >
                <span>View All 12 Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Product Grid (Responsive 4 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter((p) => p.status === 'Active')
                .slice(0, 8)
                .map((product, idx) => (
                  <ProductCard key={product.id} product={product} priority={idx < 4} />
                ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* S6: MULTICOLUMN FACILITIES ("What Facilities We Provide")       */}
        {/* ============================================================== */}
        <section className="py-20 lg:py-28 bg-[#FFEFE4] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#0A6375]">
                Campus & Curriculum
              </span>
              <h2 className="font-bubblegum text-4xl sm:text-5xl text-[#0F172A]">
                Know What Facilities We Provide
              </h2>
              <p className="text-sm text-[#6B6B84] font-nunito">
                Designed to nurture independent thinking and physical wellbeing within safe, inspiring spaces.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Smart Classes',
                  desc: 'Interactive multisensory wooden learning pods equipped with physical arithmetic counters.',
                  image: '/demo-assets/ecommerce/demo-04/classroom.jpg',
                },
                {
                  title: 'Safe Play Ground',
                  desc: 'All-weather certified cedar wood climbing frames and soft impact-absorbing cork tiles.',
                  image: '/demo-assets/ecommerce/demo-04/about-kids.jpg',
                },
                {
                  title: 'Eco Shuttle Bus',
                  desc: 'State-certified electric transport vans with toddler booster seating and GPS tracking.',
                  image: '/demo-assets/ecommerce/demo-04/classroom.jpg',
                },
                {
                  title: 'Healthy Nutrition',
                  desc: '100% organic locally sourced seasonal fruit platters, seeds, and allergen-free snacks.',
                  image: '/demo-assets/ecommerce/demo-04/about-kids.jpg',
                },
              ].map((fac, idx) => (
                <div
                  key={idx}
                  className="bg-[#0A6375] text-white rounded-[32px] p-6 flex flex-col justify-between relative group hover:bg-[#EB1551] transition-colors duration-300 overflow-hidden shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/20">
                      <Image
                        src={fac.image}
                        alt={fac.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-bubblegum text-2xl text-white ws-wavy-underline">
                      {fac.title}
                    </h3>
                    <p className="text-xs text-white/80 leading-relaxed font-nunito">
                      {fac.desc}
                    </p>
                  </div>

                  <div className="pt-6">
                    <Link
                      href={`${base}/about`}
                      className="inline-block w-full py-2.5 rounded-full bg-white text-[#0A6375] group-hover:text-[#EB1551] text-xs font-bold text-center transition-colors shadow-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* S7: NUMBER COUNTER BAND                                         */}
        {/* ============================================================== */}
        <section className="relative bg-[#F7941E] text-white py-16 sm:py-20 overflow-hidden">
          {/* Subtle playful pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center z-10">
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center text-3xl">
                🎒
              </div>
              <h3 className="font-nunito font-extrabold text-4xl sm:text-5xl text-white">
                3,564+
              </h3>
              <p className="font-bubblegum text-xl text-[#FFEFE4]">Happy Little Explorers</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center text-3xl">
                🏫
              </div>
              <h3 className="font-nunito font-extrabold text-4xl sm:text-5xl text-white">
                156+
              </h3>
              <p className="font-bubblegum text-xl text-[#FFEFE4]">Facilitated Classrooms</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center text-3xl">
                👩‍🏫
              </div>
              <h3 className="font-nunito font-extrabold text-4xl sm:text-5xl text-white">
                76+
              </h3>
              <p className="font-bubblegum text-xl text-[#FFEFE4]">Certified Educators</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center text-3xl">
                ⭐
              </div>
              <h3 className="font-nunito font-extrabold text-4xl sm:text-5xl text-white">
                18+
              </h3>
              <p className="font-bubblegum text-xl text-[#FFEFE4]">Years Pedagogic Craft</p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* S8: MASONRY GALLERY ("Shine With Education")                    */}
        {/* ============================================================== */}
        <section className="py-20 lg:py-28 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#EB1551]">
                Visual Gallery
              </span>
              <h2 className="font-bubblegum text-4xl sm:text-5xl text-[#0F172A]">
                Take The Right Step To Achieve Your Child’s Dream
              </h2>
              <p className="text-sm text-[#6B6B84] font-nunito">
                Moments of breakthrough problem-solving and joyful collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Feature Large Tile (Left 6 cols) */}
              <div className="md:col-span-6 relative aspect-[4/3] md:aspect-auto rounded-3xl overflow-hidden border-4 border-[#F7941E] group">
                <Image
                  src="/demo-assets/ecommerce/demo-04/hero-banner.jpg"
                  alt="Montessori learning in action"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                  <div className="text-white space-y-1">
                    <span className="text-xs font-bold text-[#FFDA43] uppercase tracking-wider">
                      Special Feature
                    </span>
                    <h4 className="font-bubblegum text-3xl">Collaborative Playtime</h4>
                    <p className="text-xs text-white/80 max-w-md">
                      Children working together with wooden motor blocks and sensory shapes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right 6 cols Grid */}
              <div className="md:col-span-6 grid grid-cols-2 gap-4">
                {[
                  { title: 'Counting Abacus', img: '/demo-assets/ecommerce/demo-04/abacus-board.jpg' },
                  { title: 'Stacking Pyramid', img: '/demo-assets/ecommerce/demo-04/rainbow-tower.jpg' },
                  { title: 'STEM Robot', img: '/demo-assets/ecommerce/demo-04/stem-robot.jpg' },
                  { title: 'Solar Orrery', img: '/demo-assets/ecommerce/demo-04/solar-orrery.jpg' },
                ].map((tile, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group shadow-sm"
                  >
                    <Image
                      src={tile.img}
                      alt={tile.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                      <span className="font-bubblegum text-lg text-white drop-shadow">
                        {tile.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* S9: IMAGE STRIP                                                 */}
        {/* ============================================================== */}
        <section className="py-12 bg-[#FFEFE4]/60 border-y border-[#F7941E]/20 text-center relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🌱</span>
              <div className="text-left">
                <h4 className="font-bubblegum text-2xl text-[#0A6375]">
                  Eco-Certified Sustainably Sourced Wood
                </h4>
                <p className="text-xs text-[#6B6B84] font-nunito">
                  For every toy handcrafted, WonderSprout plants a sapling in community educational orchards.
                </p>
              </div>
            </div>
            <Link
              href={`${base}/about`}
              className="ws-btn-primary px-6 py-2.5 text-xs uppercase tracking-wider font-extrabold whitespace-nowrap shadow-sm"
            >
              Learn About Our Woods
            </Link>
          </div>
        </section>

        {/* ============================================================== */}
        {/* S10: TEAM / EDUCATORS ("Meet Our Best Teachers")                */}
        {/* ============================================================== */}
        <section className="py-20 lg:py-28 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#1CBBB4]">
                Our Guides
              </span>
              <h2 className="font-bubblegum text-4xl sm:text-5xl text-[#0F172A]">
                Meet Our Best Teachers
              </h2>
              <p className="text-sm text-[#6B6B84] font-nunito">
                AMI-certified Montessori specialists passionate about child-led exploration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: 'Sarah Michelle',
                  role: 'AMI Montessori Lead',
                  bio: '14 years guiding early motor sensory development.',
                  avatar: '👩‍🏫',
                },
                {
                  name: 'Mary Grace',
                  role: 'Sensory Therapy Specialist',
                  bio: 'Specialist in tactile regulation and kinesthetic learning.',
                  avatar: '👩‍⚕️',
                },
                {
                  name: 'Emma Watson',
                  role: 'Early STEM Curriculum Director',
                  bio: 'Pioneer of tangible mechanical engineering for kindergarteners.',
                  avatar: '👩‍🔬',
                },
                {
                  name: 'Bellie Beth',
                  role: 'Creative Arts & Music Mentor',
                  bio: 'Fosters open-ended artistic storytelling and organic clay play.',
                  avatar: '👩‍🎨',
                },
              ].map((teacher, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-6 text-center border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#1CBBB4] transition-all group"
                >
                  <div className="w-28 h-28 mx-auto rounded-full bg-[#FFEFE4] flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {teacher.avatar}
                  </div>
                  <h4 className="font-bubblegum text-2xl text-[#0F172A] group-hover:text-[#EB1551] transition-colors">
                    {teacher.name}
                  </h4>
                  <span className="text-xs font-bold text-[#1CBBB4] uppercase tracking-wide block mt-0.5">
                    {teacher.role}
                  </span>
                  <p className="text-xs text-[#6B6B84] mt-2 font-nunito leading-relaxed">
                    {teacher.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* S11: MULTICOLUMN 2 ("Sports and Creative Activity")             */}
        {/* ============================================================== */}
        <section className="py-20 bg-[#FFEFE4] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#F7941E]">
                Discover • Improve • Achieve
              </span>
              <h2 className="font-bubblegum text-4xl sm:text-5xl text-[#0F172A]">
                Playful Activity Domains
              </h2>
              <p className="text-sm text-[#6B6B84] font-nunito">
                Encouraging balanced growth through physical, creative, and mental activities.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: 'Water & Nature Play', icon: '🌊', color: '#1CBBB4' },
                { name: 'Creative Woodcraft', icon: '🪵', color: '#F7941E' },
                { name: 'Balance & Agility', icon: '🚲', color: '#EB1551' },
                { name: 'Tactile Modeling', icon: '🏺', color: '#0A6375' },
                { name: 'Logic & Puzzles', icon: '🧩', color: '#FFDA43' },
              ].map((domain, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-3xl text-center border border-slate-100 shadow-sm hover:-translate-y-1.5 transition-transform flex flex-col items-center justify-center space-y-2"
                >
                  <span className="text-4xl">{domain.icon}</span>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] font-nunito">
                    {domain.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* S12: FEATURED BLOG ("Our Recent Updation")                      */}
        {/* ============================================================== */}
        <section className="py-20 lg:py-28 bg-[#0A6375] text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 3 Article List */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#FFDA43]">
                  Parenting & Learning Journal
                </span>
                <h2 className="font-bubblegum text-4xl sm:text-5xl text-white mt-1">
                  Our Recent Pedagogic Articles
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    date: 'Sep 22, 2026',
                    title: 'Why Toddlers Thrive with Natural Wooden Toys Over Plastic Lights',
                    excerpt:
                      'Exploring sensory sensory calm, non-overstimulating materials, and how physical weight builds balance intuition.',
                  },
                  {
                    date: 'Sep 15, 2026',
                    title: '5 Maria Montessori Principles You Can Apply at Home This Weekend',
                    excerpt:
                      'Simple adjustments to low shelves, child-height hooks, and open-ended puzzle stations that empower autonomy.',
                  },
                  {
                    date: 'Sep 08, 2026',
                    title: 'Teaching Pre-K Arithmetic Visually: The Magic of the Counting Abacus',
                    excerpt:
                      'How physically sliding colored beads translates abstract numbers into concrete, joyous understanding.',
                  },
                ].map((article, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors group cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-[#FFDA43] uppercase tracking-wide">
                      {article.date}
                    </span>
                    <h4 className="font-bubblegum text-xl text-white group-hover:text-[#FFDA43] transition-colors mt-0.5">
                      {article.title}
                    </h4>
                    <p className="text-xs text-white/70 font-nunito mt-1 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href={`${base}/blog`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#FFDA43] hover:underline"
                >
                  <span>Explore All Parenting Articles</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Collage Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                <Image
                  src="/demo-assets/ecommerce/demo-04/classroom.jpg"
                  alt="Montessori learning atmosphere"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* S13: VIDEO + AGE TABS ("Visual Teaching Methodology!")           */}
        {/* ============================================================== */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-[#FFEFE4] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#EB1551]">
                Active Guidance
              </span>
              <h2 className="font-bubblegum text-4xl sm:text-5xl text-[#0F172A]">
                Visual Teaching Methodology!
              </h2>
              <p className="text-sm text-[#6B6B84] font-nunito">
                Explore our age-by-age developmental guide tailored for each stage of childhood curiosity.
              </p>
            </div>

            {/* 4 Age Tabs */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
              {ageTabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveAgeTab(idx)}
                  className={`px-5 py-3 rounded-2xl font-bubblegum text-lg sm:text-xl transition-all shadow-sm ${
                    activeAgeTab === idx
                      ? 'bg-[#EB1551] text-white scale-105 shadow-md'
                      : 'bg-white text-[#0A6375] hover:bg-[#FFEFE4]'
                  }`}
                >
                  <span className="font-bold">{tab.age}</span>{' '}
                  <span className="text-sm font-normal">{tab.unit}</span>
                </button>
              ))}
            </div>

            {/* Active Tab Panel */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Media Half with Play Button */}
              <div className="lg:col-span-7 relative aspect-video rounded-2xl overflow-hidden border-4 border-[#F7941E]/40 group cursor-pointer"
                onClick={() => setIsVideoModalOpen(true)}
              >
                <Image
                  src={ageTabs[activeAgeTab].image}
                  alt={ageTabs[activeAgeTab].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-[#EB1551] flex items-center justify-center shadow-2xl animate-play-ripple group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
              </div>

              {/* Text Half */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold text-[#F7941E] uppercase tracking-wider">
                  {ageTabs[activeAgeTab].subtitle} Stage
                </span>
                <h3 className="font-bubblegum text-3xl text-[#0A6375] leading-snug">
                  {ageTabs[activeAgeTab].title}
                </h3>
                <p className="text-sm text-[#6B6B84] font-nunito leading-relaxed">
                  {ageTabs[activeAgeTab].description}
                </p>
                <div className="pt-2">
                  <Link
                    href={`${base}/collection`}
                    className="ws-btn-primary px-6 py-3 text-xs uppercase tracking-wider font-extrabold shadow-sm"
                  >
                    View Toys for {ageTabs[activeAgeTab].age} Years &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Lightbox Modal */}
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-3xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-[#EB1551] text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="WonderSprout Early Learning Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* S14: TESTIMONIALS ("What Our Parents Say")                       */}
        {/* ============================================================== */}
        <section className="py-20 bg-[#FFEFE4] relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="text-xs font-black uppercase tracking-wider text-[#EB1551]">
              Real Parent Stories
            </span>
            <h2 className="font-bubblegum text-4xl sm:text-5xl text-[#0F172A] mt-1 mb-10">
              What Our Parents Say
            </h2>

            {/* Testimonial Ribbon Card */}
            <div className="relative bg-[#EB1551] text-white rounded-[36px] p-8 sm:p-12 shadow-2xl text-left border-4 border-white/20">
              <div className="flex items-center gap-1 text-[#FFDA43] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              <blockquote className="font-nunito text-base sm:text-lg lg:text-xl text-white leading-relaxed italic mb-6">
                &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
              </blockquote>

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div>
                  <h4 className="font-bubblegum text-2xl text-white">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-xs text-white/80 font-nunito">
                    {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].city}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentTestimonial(
                        (prev) => (prev - 1 + testimonials.length) % testimonials.length
                      )
                    }
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white hover:text-[#EB1551] text-white flex items-center justify-center transition-colors"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
                    }
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white hover:text-[#EB1551] text-white flex items-center justify-center transition-colors"
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* S15: NEWSLETTER                                                 */}
        {/* ============================================================== */}
        <section className="py-16 sm:py-20 bg-white relative">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#F7941E]">
              Stay Connected
            </span>
            <h2 className="font-bubblegum text-4xl sm:text-5xl text-[#0F172A]">
              Subscribe To Our Mailbox & Get Exclusive Play Guides
            </h2>
            <p className="text-sm text-[#6B6B84] max-w-xl mx-auto font-nunito">
              Receive Montessori at-home activity guides, printable alphabet flashcards, and member discounts on every release.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 pt-4"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 rounded-full border-2 border-slate-200 text-sm focus:outline-none focus:border-[#1CBBB4]"
              />
              <button
                type="submit"
                className="ws-btn-primary px-8 py-3.5 text-xs uppercase tracking-wider font-extrabold shadow-md flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Global Shared Modals & Drawers */}
      <CartDrawer />
      <QuickAddModal />
      <EnquiryModal />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <PromoPopup />

      {/* Global Footer */}
      <StoreFooter />
    </div>
  );
}
