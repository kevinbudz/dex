// src/renderer/components/ServerList.jsx
import React from 'react';
import { useTheme, themes } from '../context/ThemeContext';
import { useGameData } from '../hooks/useGameData';
import { Plus, ChevronRight } from 'lucide-react';

const FlashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M440.8,11.2H71.2C37.6,11.2,11.2,37.6,11.2,71.2v369.6c0,33.6,26.4,60,60,60h369.6c33.6,0,60-26.4,60-60V71.2
            C500.8,37.6,474.4,11.2,440.8,11.2z M380.4,270.8l-119.2,180c-4,6-10.4,9.2-16.8,9.2c-4,0-8.4-1.2-12-3.6c-9.2-6-12-18.4-6-27.6
            l91.2-137.6H220.4c-8.4,0-16-4.8-19.6-12.4c-3.6-7.6-2.4-16.4,2.8-22.8L322,74c6.4-8,18-9.2,26-2.8c8,6.4,9.2,18,2.8,26L266,208h114
            c7.6,0,14.8,4,18.8,10.8C402.8,225.2,402,235.2,396.8,242L380.4,270.8z"/>
    </svg>
);

const AirIcon = () => (
    <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M480,0H32C14.4,0,0,14.4,0,32v448c0,17.6,14.4,32,32,32h448c17.6,0,32-14.4,32-32V32C512,14.4,497.6,0,480,0z
            M364.8,294.4c-6.4,12.8-16,24-28.8,32c-12.8,8-27.2,12.8-44.8,12.8h-60.8l-19.2,60.8h-52.8l76.8-240h97.6
            c17.6,0,32,4.8,44.8,12.8c11.2,8,20.8,19.2,25.6,32c4.8,12.8,6.4,27.2,3.2,43.2C403.2,265.6,392,283.2,364.8,294.4z"/>
        <path d="M347.2,208c-1.6-6.4-4.8-11.2-9.6-14.4c-4.8-3.2-11.2-4.8-19.2-4.8h-44.8l-22.4,70.4h44.8c8,0,14.4-1.6,20.8-4.8
            c6.4-3.2,11.2-8,14.4-14.4c3.2-6.4,4.8-12.8,4.8-19.2C347.2,216,347.2,211.2,347.2,208z"/>
    </svg>
);

const ServerCard = ({ game }) => {
    const { currentTheme } = useTheme();
    const [playerCount, setPlayerCount] = React.useState("?");
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
        const fetchPlayerCount = async () => {
            if (!game.urls.playerCount) {
                setPlayerCount("?");
                return;
            }

            try {
                const response = await fetch(game.urls.playerCount);
                if (!response.ok) throw new Error('Failed to fetch');
                const count = await response.text();
                setPlayerCount(count);
            } catch (error) {
                setPlayerCount("?");
            }
        };

        fetchPlayerCount();
        const interval = setInterval(fetchPlayerCount, 60000);
        return () => clearInterval(interval);
    }, [game.urls.playerCount]);

    const handleImageError = () => {
        console.log("Image failed to load:", game.banner);
        setImageError(true);
    };

    return (
        <div className={`${themes[currentTheme].card} rounded-xl shadow overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group`}>
            <div className="relative w-full pt-[56.25%] bg-gray-200">
                {!imageError ? (
                    <img 
                        src={game.banner}
                        alt={game.title}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={handleImageError}
                        crossOrigin="anonymous"
                    />
                ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200">
                        <span className={`text-sm ${themes[currentTheme].textSecondary}`}>
                            Banner unavailable
                        </span>
                    </div>
                )}
                
                {/* Top badge */}
                <div className="absolute top-2 right-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200
                        ${game.urls.air 
                            ? 'bg-purple-500/90 hover:bg-purple-500 text-white' 
                            : 'bg-blue-500/90 hover:bg-blue-500 text-white'}`}
                    >
                        {game.urls.air ? 'AIR + SWF' : 'SWF Only'}
                    </span>
                </div>

                {/* Bottom stats with gradient backdrop */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-2 px-3">
                    <div className="flex justify-end gap-2">
                        <span className="text-white/90 text-sm px-2 py-1 rounded bg-black/30 backdrop-blur-sm">
                            v{game.version}
                        </span>
                        <span className="text-white/90 text-sm px-2 py-1 rounded bg-black/30 backdrop-blur-sm">
                            {playerCount} playing
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <h3 className={`text-lg font-bold truncate ${themes[currentTheme].text} group-hover:text-blue-500 transition-colors duration-200`}>
                    {game.title}
                </h3>
                <p className={`text-sm mt-1 mb-3 line-clamp-2 ${themes[currentTheme].textSecondary}`}>
                    {game.description}
                </p>
                <div className="flex gap-2 mt-auto">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg 
                                     flex items-center justify-center gap-2 transition-all duration-200 group/button">
                        <FlashIcon />
                        <span className="font-medium">.swf</span>
                        <ChevronRight size={16} className="opacity-0 -ml-4 group-hover/button:opacity-100 group-hover/button:ml-0 transition-all duration-200" />
                    </button>
                    {game.urls.air && (
                        <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg 
                                         flex items-center justify-center gap-2 transition-all duration-200 group/button">
                            <AirIcon />
                            <span className="font-medium">AIR</span>
                            <ChevronRight size={16} className="opacity-0 -ml-4 group-hover/button:opacity-100 group-hover/button:ml-0 transition-all duration-200" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const AddServerCard = ({ onOpenDownloads }) => {
    const { currentTheme } = useTheme();
    return (
        <div 
            onClick={onOpenDownloads}
            className={`${themes[currentTheme].card} rounded-lg shadow overflow-hidden cursor-pointer 
                       transition-all duration-200 hover:shadow-lg ${themes[currentTheme].cardHover}`}
        >
            <div className={`relative w-full pt-[56.25%] ${themes[currentTheme].card} flex items-center justify-center`}>
                <div className={`absolute inset-0 flex flex-col items-center justify-center ${themes[currentTheme].textSecondary}`}>
                    <Plus size={48} />
                    <span className="mt-2 font-medium">Browse Games</span>
                </div>
            </div>
        </div>
    );
};

const LoadingState = () => {
    const { currentTheme } = useTheme();
    return (
        <div className={`flex-1 ${themes[currentTheme].bg} p-4 flex items-center justify-center`}>
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className={`${themes[currentTheme].text}`}>Loading games...</p>
            </div>
        </div>
    );
};

const ServerList = ({ setActiveTab }) => {
    const { currentTheme } = useTheme();
    const { games, isLoading } = useGameData();

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <div className={`flex-1 ${themes[currentTheme].bg} p-4 overflow-auto`}>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {games.map((game) => (
                    <ServerCard key={game.id} game={game} />
                ))}
                <AddServerCard onOpenDownloads={() => setActiveTab('downloads')} />
            </div>
        </div>
    );
};

export default ServerList;