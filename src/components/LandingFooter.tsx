import Link from 'next/link';
import { Instagram, Twitter, Youtube, Facebook, Linkedin } from 'lucide-react';
import { Logo } from './Logo';

const footerLinks = {
  legal: [
    { href: '#', text: 'Privacy' },
    { href: '#', text: 'Terms' },
    { href: '#', text: 'Cookie Policy' },
    { href: '#', text: 'Intellectual Property' },
  ],
  careers: [
    { href: '#', text: 'Careers Portal' },
    { href: '#', text: 'Tech Blog' },
  ],
  social: [
    { href: '#', icon: Instagram },
    { href: '#', icon: TikTokIcon },
    { href: '#', icon: Youtube },
    { href: '#', icon: Twitter },
    { href: '#', icon: Facebook },
  ],
  faq: [
    { href: '#', text: 'Destinations' },
    { href: '#', text: 'Press Room' },
    { href: '#', text: 'Contact' },
    { href: '#', text: 'Promo Code' },
  ],
};

const bottomLinks = [
    { href: '#', text: 'FAQ' },
    { href: '#', text: 'Safety Tips' },
    { href: '#', text: 'Terms' },
    { href: '#', text: 'Cookie Policy' },
    { href: '#', text: 'Privacy Settings' },
]

export function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <h3 className="text-lg font-bold mb-4">Get the app!</h3>
            <div className="flex flex-col sm:flex-row gap-4">
                <AppStoreButton />
                <GooglePlayButton />
            </div>
          </div>
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
        
        <hr className="border-gray-700 my-8" />

        <div className="text-gray-400 text-sm">
            <p className="mb-4">
              Single people, listen up: If you're looking for love, want to start dating, or just keep it casual, you need to be on LinkUp9ja. With over 55 billion matches made, it's the place to be to meet your next best match. Let's be real, the dating landscape looks very different today, as most people are meeting online. With LinkUp9ja, the world's most popular free dating app, you have millions of other single people at your fingertips and they're all ready to meet someone like you. Whether you're straight or in the LGBTQIA community, LinkUp9ja is here to bring you all the sparks.
            </p>
            <p>
              There really is something for everyone on LinkUp9ja. Want to get into a relationship? You got it. Trying to find some new friends? Say no more. New kid on campus and looking to make the most of your college experience? LinkUp9ja has you covered. LinkUp9ja isn't your average dating site — it's the most diverse dating app, where adults of all backgrounds and experiences are invited to make connections, memories, and everything in between.
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

function AppStoreButton() {
    return (
        <a href="#" className="inline-block">
            <svg viewBox="0 0 120 40" width="120" height="40" alt="Download on the App Store">
                <rect width="120" height="40" rx="5" fill="black" />
                <path d="M26.2,20.4c0-2.2,1.8-4,4-4c2.2,0,4,1.8,4,4s-1.8,4-4,4C28,24.4,26.2,22.6,26.2,20.4z M36.3,10.6c-0.8-0.9-2-1.4-3.5-1.4 c-2.3,0-4.3,1.3-5.5,1.3c-1.2,0-3-1.2-4.8-1.2c-2.4,0-4.6,1.4-5.8,3.5c-2.4,4.1-0.6,10.1,1.7,13.4c1.1,1.6,2.5,3.3,4.2,3.3 s2.2-0.8,3.2-0.8s1.2,0.8,3.2,0.8c1.8,0,3.1-1.7,4.1-3.2c1.3-1.9,1.9-3.9,1.9-4c0,0-0.1-0.1-0.1-0.1c-2.1,0.8-4.4,0.5-5.9-0.8 c-1.5-1.3-2.2-3.3-1.8-5.2C27.5,12.7,30.5,10.8,33,10.8c0.8,0,1.5,0.2,2.1,0.6C35.6,11.1,35.9,10.9,36.3,10.6z" fill="white"/>
                <text x="48" y="16" fill="white" fontSize="10" fontWeight="bold">Download on the</text>
                <text x="48" y="30" fill="white" fontSize="14" fontWeight="bold">App Store</text>
            </svg>
        </a>
    );
}

function GooglePlayButton() {
    return (
        <a href="#" className="inline-block">
            <svg viewBox="0 0 135 40" width="135" height="40" alt="Get it on Google Play">
                <rect width="135" height="40" rx="5" fill="black" />
                <path d="M52.3,20l-4.2-4.2v8.3L52.3,20z M53,20.9l4.3,2.5l-2.6,1.5L53,20.9z M48.1,11.7l4.2,4.2l-4.2,4.2l-4.2-4.2L48.1,11.7z M53,19.1l-1.7-1l1.7-1l2.6,1.5L53,19.1z" fill="#4CAF50"/>
                <text x="65" y="15" fill="white" fontSize="8" fontWeight="bold">GET IT ON</text>
                <text x="65" y="29" fill="white" fontSize="14" fontWeight="bold">Google Play</text>
            </svg>
        </a>
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
