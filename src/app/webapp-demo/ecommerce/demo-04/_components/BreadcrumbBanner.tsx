import React from 'react';
import Link from 'next/link';
import { CloudShape, RocketDoodle, StarDoodle } from './Doodles';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function BreadcrumbBanner({
  title,
  breadcrumbs,
}: {
  title: string;
  breadcrumbs: BreadcrumbItem[];
}) {
  const base = '/webapp-demo/ecommerce/demo-04';

  return (
    <div className="relative bg-[#0F172A] text-white pt-16 sm:pt-20 pb-20 sm:pb-24 overflow-hidden">
      {/* Background Stars & Atmospheric Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A6375]/40 via-[#0F172A] to-[#0F172A] opacity-90 pointer-events-none" />

      {/* Floating Animated Stars & Rocket */}
      <div className="absolute top-8 left-12 opacity-80 animate-pulse pointer-events-none">
        <StarDoodle className="w-6 h-6 text-[#FFDA43]" />
      </div>
      <div className="absolute top-16 right-16 opacity-70 animate-bounce pointer-events-none">
        <StarDoodle className="w-5 h-5 text-[#FFEFE4]" />
      </div>
      <div className="absolute -top-4 right-1/4 opacity-40 pointer-events-none hidden md:block animate-rocket-shake">
        <RocketDoodle className="w-24 h-24" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-3">
        <h1 className="font-bubblegum text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide drop-shadow-md">
          {title}
        </h1>

        <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold font-nunito text-[#FFEFE4]/80">
          <Link href={base} className="hover:text-white transition-colors">
            Home
          </Link>
          {breadcrumbs.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="text-[#EB1551] text-xs">◆</span>
              {item.href ? (
                <Link href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-white font-extrabold truncate max-w-xs">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Cloud-shaped white bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none text-white">
        <CloudShape className="w-full h-10 sm:h-16 text-white" />
      </div>
    </div>
  );
}
