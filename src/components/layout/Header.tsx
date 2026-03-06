import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  User, 
  Phone,
  FileText,
  Settings,
  HelpCircle,
  LayoutList,
  Bell,
  Home,
  LogOut,
  ChevronDown,
  Gavel,
  UserCircle,
  Heart,
  Trophy
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useNotifications } from "@/hooks/useNotifications";
import logo from "@/assets/logo.png";

const navigation = [
  { name: "Início", href: "/", icon: Home },
  { name: "Categorias", href: "/leiloes", icon: LayoutList },
  { name: "Edital do Leilão", href: "/edital", icon: FileText },
  { name: "Outros Serviços", href: "/servicos", icon: Settings },
  { name: "Ajuda", href: "/como-funciona", icon: HelpCircle },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuthContext();
  const { siteSettings } = useData();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const phone = siteSettings?.phone || "(21) 97965-4426";

  const handleLogout = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const isLoggedIn = !!user;
  const userName = profile?.name || user?.email?.split('@')[0] || 'Usuário';

  return (
    <header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-border">
      <nav className="container mx-auto flex items-center justify-between py-3 px-4 lg:px-8">
        {/* Mobile Menu Button - Left */}
        <button
          type="button"
          className="lg:hidden p-2 text-white/70 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img 
            src={logo} 
            alt="arremate24h" 
            className="h-10 md:h-12 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "text-accent"
                  : "text-white/70 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white/90 hover:text-white gap-2">
                  <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                  <span className="max-w-[120px] truncate">
                    Olá, {userName.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex flex-col items-start gap-0.5">
                  <span className="font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/meu-perfil" className="flex items-center">
                    <UserCircle className="w-4 h-4 mr-2" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/meus-favoritos" className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Meus Favoritos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/meus-arremates" className="flex items-center">
                    <Gavel className="w-4 h-4 mr-2" />
                    Meus Arremates
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white gap-2" asChild>
              <Link to="/entrar">
                <User className="w-4 h-4" />
                Entre ou cadastre-se
              </Link>
            </Button>
          )}
          <a 
            href={`tel:${phone.replace(/\D/g, '')}`}
            className="flex items-center gap-2 text-sm font-medium text-white hover:text-accent transition-colors"
          >
            <Phone className="w-4 h-4" />
            {phone}
          </a>
          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-white/70 hover:text-white">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-lg flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <div className="px-3 py-2 flex items-center justify-between border-b border-border">
                  <span className="font-medium text-sm">Notificações</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-muted-foreground hover:text-foreground">
                      Marcar como lidas
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    Nenhuma notificação
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <DropdownMenuItem key={notif.id} asChild>
                      <Link to={notif.link || '#'} className="flex items-start gap-3 p-3">
                        <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Trophy className="w-4 h-4 text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{notif.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{notif.message}</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))
                )}
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/meus-arremates" className="justify-center text-sm text-accent">
                        Ver todos os arremates
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile User Button - Right */}
        <Link
          to={isLoggedIn ? "/meu-perfil" : "/entrar"}
          className="lg:hidden p-2 text-white/70 hover:text-white"
        >
          <User className="w-6 h-6" />
        </Link>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1a1a1a] border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  location.pathname === item.href
                    ? "text-accent bg-accent/10"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10 mt-4">
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{userName}</p>
                      <p className="text-white/50 text-xs">{user?.email}</p>
                    </div>
                  </div>
                  <Link 
                    to="/meu-perfil"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserCircle className="w-4 h-4" />
                    Meu Perfil
                  </Link>
                  <Link 
                    to="/meus-favoritos"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4" />
                    Meus Favoritos
                  </Link>
                  <Link 
                    to="/meus-arremates"
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Gavel className="w-4 h-4" />
                    Meus Arremates
                  </Link>
                  <Button 
                    variant="outline" 
                    className="justify-start text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair da conta
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="justify-start text-white border-white/20 hover:bg-white/10" asChild>
                  <Link to="/entrar" onClick={() => setMobileMenuOpen(false)}>
                    <User className="w-4 h-4 mr-2" />
                    Entre ou cadastre-se
                  </Link>
                </Button>
              )}
              <a 
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white"
              >
                <Phone className="w-4 h-4" />
                {phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
