import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#111827] py-8">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-text-primary font-bold">Kit</span>
              <span className="text-[#4ADE80] font-bold">Mint</span>
            </Link>
            <span className="text-text-muted text-sm">© 2026</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link 
              href="/gallery" 
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Gallery
            </Link>
            <p className="text-xs text-text-muted">
              Built for HackIndia Vibe Coding Hackathon
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
