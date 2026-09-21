import { TestimonialItem, Testimonial } from '@/types';

/**
 * Verified testimonials from real client engagements.
 * Strictly aligned with documented portfolio evidence.
 */
export const TESTIMONIALS_DATA: (TestimonialItem & Testimonial)[] = [
  {
    id: 'testimonial-rafi-ahmed',
    clientName: 'Rafi Ahmed',
    author: 'Rafi Ahmed',
    role: 'CEO',
    company: 'TechStart BD',
    projectType: 'Paid Media & Acquisition',
    service: 'Meta Ads & Lead Generation',
    quote:
      'Dhrubo completely transformed our customer acquisition. We went from spending $5k/month with mediocre results to a 7.2x ROAS system that consistently generates 150+ leads per month. He doesn’t just run ads — he architects growth.',
    verifiedResult: '7.2x ROAS acquisition system',
    rating: 5,
    verified: true,
    featured: true,
  },
  {
    id: 'testimonial-arif-rahman',
    clientName: 'Arif Rahman',
    author: 'Arif Rahman',
    role: 'CEO',
    company: 'TechStart BD',
    projectType: 'E-Commerce Growth',
    service: 'E-Commerce Meta Ads',
    quote:
      'The new acquisition system gave us much more predictable growth and made our ad spend easier to scale.',
    verifiedResult: 'Predictable scaling & ad spend efficiency',
    rating: 5,
    verified: true,
    featured: true,
  },
  {
    id: 'testimonial-nadia-karim',
    clientName: 'Nadia Karim',
    author: 'Nadia Karim',
    role: 'Marketing Lead',
    company: 'UrbanNest Living',
    projectType: 'Paid Ads & CRO',
    service: 'Meta Ads & CRO',
    quote:
      'We stopped guessing which products and creatives were working. The reporting and testing process changed the way we market.',
    verifiedResult: 'Actionable creative testing framework',
    rating: 5,
    verified: true,
    featured: true,
  },
  {
    id: 'testimonial-marhaba-dmc',
    clientName: 'Marhaba DMC Team',
    author: 'Marhaba DMC Team',
    role: 'Business Development',
    company: 'Marhaba DMC',
    projectType: 'Travel & Lead Gen',
    service: 'Travel Marketing & Lead Generation',
    quote:
      'Dhrubo brought structure and strategic clarity to our marketing direction. The planning process helped us move from random promotion toward a scalable digital growth system.',
    verifiedResult: 'Structured lead generation infrastructure',
    rating: 5,
    verified: true,
    featured: true,
  },
  {
    id: 'testimonial-tania-ahmed',
    clientName: 'Tania Ahmed',
    author: 'Tania Ahmed',
    role: 'Co-Founder',
    company: 'Brew & Bean Co.',
    projectType: 'Brand & Social Acquisition',
    service: 'Branding & Social Acquisition',
    quote:
      'Our online presence finally looks like the quality of the product. Orders followed once the positioning became consistent.',
    verifiedResult: 'Consistent multi-channel brand conversion',
    rating: 5,
    verified: true,
    featured: false,
  },
  {
    id: 'testimonial-farzana-islam',
    clientName: 'Farzana Islam',
    author: 'Farzana Islam',
    role: 'Brand Manager',
    company: 'NovaSkin Beauty',
    projectType: 'Creative Performance',
    service: 'Performance Creatives & Meta Ads',
    quote:
      'The creative testing system gave us a repeatable way to find winners instead of relying on one-off ad ideas.',
    verifiedResult: 'Repeatable creative testing pipeline',
    rating: 5,
    verified: true,
    featured: false,
  },
  {
    id: 'testimonial-daniel-mercer',
    clientName: 'Daniel Mercer',
    author: 'Daniel Mercer',
    role: 'VP Marketing',
    company: 'OfficeFlow',
    projectType: 'B2B Funnel Architecture',
    service: 'B2B SaaS Google Ads',
    quote:
      'The marketing team and sales team finally started looking at the same funnel instead of separate numbers.',
    verifiedResult: 'Unified sales & marketing acquisition funnel',
    rating: 5,
    verified: true,
    featured: false,
  },
  {
    id: 'testimonial-sakib-rahman',
    clientName: 'Sakib Rahman',
    author: 'Sakib Rahman',
    role: 'Growth Lead',
    company: 'FreshCart Market',
    projectType: 'E-Commerce Strategy',
    service: 'E-Commerce Growth Strategy',
    quote:
      'The new system helped us think beyond the first order and build a healthier customer acquisition model.',
    verifiedResult: 'Sustainable retention & customer acquisition',
    rating: 5,
    verified: true,
    featured: false,
  },
];

export const testimonials = TESTIMONIALS_DATA;
