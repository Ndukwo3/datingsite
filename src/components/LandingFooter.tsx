
import Link from 'next/link';
import { Instagram, Twitter, Youtube } from 'lucide-react';
import { Logo } from './Logo';

const footerLinks = {
  legal: [
    { href: '/about', text: 'About Us' },
    { href: '/privacy', text: 'Privacy' },
    { href: '/terms', text: 'Terms' },
    { href: '/cookies', text: 'Cookie Policy' },
    { href: '/ip', text: 'Intellectual Property' },
  ],
  careers: [
    { href: '/careers', text: 'Careers Portal' },
    { href: '/tech-blog', text: 'Tech Blog' },
  ],
  social: [
    { href: '/#', icon: Instagram },
    { href: '/#', icon: TikTokIcon },
    { href: '/#', icon: Youtube },
    { href: '/#', icon: Twitter },
    { href: '/#', icon: FacebookIcon },
  ],
  faq: [
    { href: '/destinations', text: 'Destinations' },
    { href: '/press', text: 'Press Room' },
    { href: '/contact', text: 'Contact' },
    { href: '/promo', text: 'Promo Code' },
  ],
};

const bottomLinks = [
    { href: '/faq', text: 'FAQ' },
    { href: '/safety', text: 'Safety Tips' },
    { href: '/terms', text: 'Terms' },
    { href: '/cookies', text: 'Cookie Policy' },
    { href: '/privacy-settings', text: 'Privacy Settings' },
]

export function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
            <div className="mb-8 md:mb-0">
                <Logo className="text-white" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <FooterLinkColumn title="Legal" links={footerLinks.legal} />
              <FooterLinkColumn title="Careers" links={footerLinks.careers} />
              <div>
                <h3 className="text-lg font-bold mb-4">Social</h3>
                <div className="flex items-center gap-4">
                  {footerLinks.social.map((link, index) => (
                    <Link href={link.href} key={index} className="text-gray-400 hover:text-white transition-colors">
                      <link.icon className="h-6 w-6" />
                    </Link>
                  ))}
                </div>
              </div>
              <FooterLinkColumn title="FAQ" links={footerLinks.faq} />
            </div>
        </div>
        
        <hr className="border-gray-700 my-8" />

        <div className="text-gray-400 text-sm">
            <p className="mb-4">
            Single people, listen up: If you're looking for love, want to start dating, or just keep it casual, you need to be on LinkUp9ja. With thousands of matches made, it's the place to be to meet your next best match. Let's be real, the dating landscape looks very different today, as most people are meeting online. With LinkUp9ja, Nigeria's most popular free dating app, you have millions of other single people at your fingertips and they're all ready to meet someone like you. LinkUp9ja is here to bring you all the sparks.
            </p>
            <p>
            There really is something for everyone on LinkUp9ja. Want to get into a relationship? You got it. Trying to find some new friends? Say no more. New to the city and looking to make the most of your experience? LinkUp9ja has you covered. LinkUp9ja isn't your average dating site — it's the most diverse dating app, where adults of all backgrounds and experiences are invited to make connections, memories, and everything in between.
            </p>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4 md:mb-0">
             {bottomLinks.map(link => (
                <Link key={link.text} href={link.href} className="hover:text-white transition-colors">{link.text}</Link>
             ))}
          </div>
          <p>&copy; {new Date().getFullYear()} LinkUp9ja LLC, All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({ title, links }: { title: string; links: { href: string; text: string }[] }) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.text}>
            <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
      >
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.43-2.8-1.59-1.87-2.32-4.2-2.09-6.63.23-2.43 1.12-4.74 2.73-6.51 1.64-1.79 3.8-2.84 6.07-3.02.02 1.52-.03 3.04.01 4.56-.45.05-.9.1-1.36.14-1.43.13-2.83.53-4.11 1.15-1.29.61-2.39 1.56-3.11 2.78-.54.91-.84 1.94-.84 3.03 0 1.05.28 2.06.77 2.94.49.88 1.19 1.62 2.05 2.18.86.56 1.84.88 2.87.91 1.05.03 2.09-.19 3.05-.63.96-.44 1.82-1.11 2.49-1.98.65-.85 1.12-1.85 1.38-2.92.03-1.53.01-3.07.01-4.6 0-1.88-.01-3.76-.01-5.64z" />
      </svg>
    );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12z" />
        </svg>
    );
}
