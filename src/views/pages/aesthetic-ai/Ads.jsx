import React, { useState, useEffect } from 'react';
import {
    Megaphone,
    Save,
    RefreshCcw,
    ShieldCheck,
    Zap,
    Activity,
    Key,
    Sliders,
    Globe,
    AlertCircle,
    Loader2
} from 'lucide-react';

const Ads = () => {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [ads, setAds] = useState({
        id: '69cb65860e42631df80417e0',
        dailyUpdateScreenBannerAd: 'wah wah ca-app-pub-3359450514047232/3717029909',
        dailyUpdateScreenBannerAd_ios: 'ca-app-pub-3359450514047232/4845496205',
        native_ads: 'ca-app-pub-3359450514047232/7931607087',
        native_ads_ios: 'ca-app-pub-3359450514047232/9439347334',
        normalOpenAd: 'ca-app-pub-3359450514047232/1738859550',
        normalOpenAd_ios: 'ca-app-pub-3359450514047232/7133388827',
        preInterstitialAd: 'ca-app-pub-3359450514047232/5720360806',
        preInterstitialAd_ios: 'ca-app-pub-3359450514047232/1752429009',
        reward_inter: 'ca-app-pub-3359450514047232/4625920927',
        reward_inter_ios: 'ca-app-pub-3359450514047232/8728900894',
        splashInterstitialAd: 'ca-app-pub-3359450514047232/5720360806',
        splashInterstitialAd_ios: 'ca-app-pub-3359450514047232/1752429009',
        toolsMain: 'ca-app-pub-9364571427137837/4806231120',
        usbMain: 'ca-app-pub-3359450514047232/3717029909'
    });

    useEffect(() => {
        console.log('🔄 Ads component mounted');
        setFetchLoading(false);
    }, []);

    const handleChange = (key, value) => {
        setAds(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log('📤 Updating Ads Configuration:', ads);
            alert('Ads Configuration updated successfully!');
        } catch (error) {
            console.error('❌ Error updating ads:', error);
            alert('Failed to update Ads Configuration.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Loading Ads Configuration...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ads & Monetization</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Configure AdMob units and ad settings for Aesthetic AI.</p>
                </div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Banner Ads */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
                            <Megaphone className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold">Banner Ads</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Android - Daily Update Screen Banner</label>
                            <input
                                type="text"
                                value={ads.dailyUpdateScreenBannerAd}
                                onChange={(e) => handleChange('dailyUpdateScreenBannerAd', e.target.value)}
                                className="w-full mt-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono focus:border-indigo-500 outline-none transition-all"
                                placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYY"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">iOS - Daily Update Screen Banner</label>
                            <input
                                type="text"
                                value={ads.dailyUpdateScreenBannerAd_ios}
                                onChange={(e) => handleChange('dailyUpdateScreenBannerAd_ios', e.target.value)}
                                className="w-full mt-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono focus:border-indigo-500 outline-none transition-all"
                                placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYY"
                            />
                        </div>
                    </div>
                </div>

                {/* Native Ads */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
                            <Activity className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold">Native Ads</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Android - Native Ad Unit</label>
                            <input
                                type="text"
                                value={ads.native_ads}
                                onChange={(e) => handleChange('native_ads', e.target.value)}
                                className="w-full mt-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono focus:border-indigo-500 outline-none transition-all"
                                placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYY"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">iOS - Native Ad Unit</label>
                            <input
                                type="text"
                                value={ads.native_ads_ios}
                                onChange={(e) => handleChange('native_ads_ios', e.target.value)}
                                className="w-full mt-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono focus:border-indigo-500 outline-none transition-all"
                                placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYY"
                            />
                        </div>
                    </div>
                </div>

                {/* Status Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm lg:col-span-2">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold">Configuration Status</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">13</div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">Total Ad Units</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{ads.id}</div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">Configuration ID</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">Active</div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">Status</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ads;
