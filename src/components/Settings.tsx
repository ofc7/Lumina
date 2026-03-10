import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  Smartphone
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { cn } from '../lib/utils';

const SettingItem = ({ icon: Icon, label, description, value, type = 'toggle', onClick }: any) => (
  <div 
    className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-white/5 text-slate-400 group-hover:text-brand-primary transition-colors">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-white font-medium">{label}</p>
        <p className="text-slate-500 text-xs">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {type === 'toggle' && (
        <div className={cn(
          "w-10 h-6 rounded-full p-1 transition-colors",
          value ? "bg-brand-primary" : "bg-slate-700"
        )}>
          <div className={cn(
            "w-4 h-4 rounded-full bg-white transition-transform",
            value ? "translate-x-4" : "translate-x-0"
          )} />
        </div>
      )}
      {type === 'select' && (
        <span className="text-slate-400 text-sm">{value}</span>
      )}
      {type === 'link' && (
        <ChevronRight size={18} className="text-slate-600" />
      )}
    </div>
  </div>
);

export const Settings = () => {
  const { settings, updateSettings } = usePlanner();

  const toggleSetting = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key as keyof typeof settings] });
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto scrollbar-hide pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-white tracking-tight">Ayarlar</h1>
          <p className="text-slate-400 mt-1">Uygulama tercihlerini ve hesabını yönet</p>
        </header>

        <div className="grid gap-6 md:gap-8">
          {/* Profile Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Profil</h2>
            <div className="glass p-4 md:p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-xl md:text-2xl font-bold shrink-0">
                  K
                </div>
                <div className="truncate">
                  <h3 className="text-lg md:text-xl font-bold text-white truncate">Kullanıcı Adı</h3>
                  <p className="text-slate-400 text-xs md:text-sm truncate">kullanici@example.com</p>
                </div>
              </div>
              <button className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors">
                Profili Düzenle
              </button>
            </div>
          </section>

          {/* General Settings */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Genel</h2>
            <div className="glass p-2 rounded-3xl space-y-1">
              <SettingItem 
                icon={Palette} 
                label="Karanlık Tema" 
                description="Uygulama görünümünü değiştir" 
                value={settings.darkMode}
                onClick={() => toggleSetting('darkMode')}
              />
              <SettingItem 
                icon={Globe} 
                label="Dil" 
                description="Uygulama dilini seç" 
                value={settings.language}
                type="select"
              />
              <SettingItem 
                icon={Smartphone} 
                label="Cihazlar Arası Senkronizasyon" 
                description="Verilerini tüm cihazlarında paylaş" 
                value={settings.sync}
                onClick={() => toggleSetting('sync')}
              />
            </div>
          </section>

          {/* Notifications & Sound */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Bildirimler ve Ses</h2>
            <div className="glass p-2 rounded-3xl space-y-1">
              <SettingItem 
                icon={Bell} 
                label="Anlık Bildirimler" 
                description="Önemli güncellemelerden haberdar ol" 
                value={settings.notifications}
                onClick={() => toggleSetting('notifications')}
              />
              <SettingItem 
                icon={Volume2} 
                label="Ses Efektleri" 
                description="Uygulama içi etkileşim sesleri" 
                value={settings.soundEffects}
                onClick={() => toggleSetting('soundEffects')}
              />
            </div>
          </section>

          {/* Security & Support */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Destek</h2>
            <div className="glass p-2 rounded-3xl space-y-1">
              <SettingItem 
                icon={Shield} 
                label="Gizlilik ve Güvenlik" 
                description="Hesap güvenliğini yönet" 
                type="link"
              />
              <SettingItem 
                icon={HelpCircle} 
                label="Yardım Merkezi" 
                description="Sıkça sorulan sorular ve destek" 
                type="link"
              />
            </div>
          </section>

          <button className="w-full p-4 rounded-2xl bg-red-500/10 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors">
            <LogOut size={20} />
            Oturumu Kapat
          </button>
          
          <p className="text-center text-slate-600 text-xs pb-8">
            Lumina Planner v1.0.0 • 2024 Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
};
