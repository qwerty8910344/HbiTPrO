import { Home, Camera, MessageSquare, User, LayoutGrid, Zap, Brain } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: LayoutGrid, label: 'Habits', href: '/habits' },
    { icon: Camera, label: 'Scan', href: '/scan', isPrimary: true },
    { icon: MessageSquare, label: 'Coach', href: '/chat' },
    { icon: Zap, label: 'Focus', href: '/focus' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-8 px-6">
      <div className="bg-[#0f172a]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center justify-between w-full max-w-sm px-6 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className="bg-[var(--action)] p-4 rounded-full -mt-12 shadow-2xl shadow-orange-500/40 active:scale-90 transition-all border-4 border-[#020617] animate-pulse-orange"
              >
                <Icon size={28} className="text-white" />
              </Link>
            );
          }

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center gap-1.5 transition-all px-4 py-2 rounded-2xl ${isActive ? 'text-neon bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5px] drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'stroke-2'} />
              <span className="text-[8px] font-black uppercase tracking-[0.2em]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
