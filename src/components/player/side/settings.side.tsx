import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Gauge, Languages } from "lucide-react";
import SideMenuLayer from "../layers/side-menu.layer";
import { usePlayer } from "@/context/PlayerContext";
import { PLAYER_EVENTS } from "@/core/constants";

const SettingsMenu: React.FC = () => {
    const engine = usePlayer();
    const [isOpen, setIsOpen] = useState(false);
    const [activePanelId, setActivePanelId] = useState<string | null>(null);
    const [, setTick] = useState(0);

    const dynamicPlugins = engine.getUIPlugins().filter(p => p.ui?.settings);

    useEffect(() => {
        const unsubsToggle = engine.on(PLAYER_EVENTS.SIDE_MENU_TOGGLE, (type) => {
            if (type === 'settings') setIsOpen(prev => !prev);
        });
        const unsubsClose = engine.on(PLAYER_EVENTS.SIDE_MENU_CLOSE, () => {
            setIsOpen(false);
            setActivePanelId(null);
        });

        const unsubsUpdate = engine.on('SLEEP_TIMER_UPDATE' as any, () => setTick(t => t + 1));

        return () => { unsubsToggle(); unsubsClose(); unsubsUpdate(); };
    }, [engine]);

    const SettingItem = ({ icon: Icon, label, value, onClick }: any) => (
        <button onClick={onClick} className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-white/10 active:bg-white/5 transition-all group outline-none">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-sky-500/20 group-hover:text-sky-400 transition-colors">
                    <Icon size={18} />
                </div>
                <span className="text-sm font-medium text-gray-200">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {value && <span className="text-xs text-gray-400 font-medium">{value}</span>}
                <ChevronRight size={16} className="text-gray-500 group-hover:text-white transition-colors" />
            </div>
        </button>
    );

    const ActivePanel = dynamicPlugins.find(p => p.ui?.settings?.id === activePanelId)?.ui?.settings?.panel;

    return (
        <SideMenuLayer
            isOpen={isOpen}
            title={
                <div className="flex items-center gap-2">
                    {activePanelId && (
                        <button onClick={() => setActivePanelId(null)} className="p-1 -ml-1 hover:bg-white/10 rounded-full transition-colors">
                            <ChevronLeft size={20} className="text-gray-400" />
                        </button>
                    )}
                    <span className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <span className="text-base tracking-wide uppercase font-bold text-gray-100">
                        {activePanelId ? dynamicPlugins.find(p => p.ui?.settings?.id === activePanelId)?.ui?.settings?.label : 'Ayarlar'}
                    </span>
                </div>
            }
            onClose={() => engine.ui.closeSideMenu()}
            width="w-80"
            bodyClassName="p-2 overflow-hidden"
        >
            {!activePanelId ? (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="px-2 pb-4 pt-2">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2 mb-2">Video Tercihleri</p>
                        <SettingItem icon={Gauge} label="Hız" value="Normal" onClick={() => { }} />
                        <SettingItem icon={Languages} label="Dil" value="Türkçe" onClick={() => { }} />
                    </div>

                    {dynamicPlugins.length > 0 && (
                        <div className="mx-4 border-t border-white/5 pt-4">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2 mb-2">Eklentiler</p>
                            {dynamicPlugins.map(plugin => {
                                const s = plugin.ui!.settings!;
                                return (
                                    <SettingItem
                                        key={s.id}
                                        icon={s.icon}
                                        label={s.label}
                                        value={s.status?.()}
                                        onClick={() => setActivePanelId(s.id)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full">
                    {ActivePanel && <ActivePanel onBack={() => setActivePanelId(null)} />}
                </div>
            )}
        </SideMenuLayer>
    );
};

export default SettingsMenu;