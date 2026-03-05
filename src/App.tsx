/*
    Developed by Hakan Kaygusuz For Xristal Technologies INC.
    Github: @vorlaxen
*/

import './assets/styles/style.scss';
import { useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import PlayerDOM from './components/common/player-dom.app';
import { MetadataPlugin } from './plugins/MetadataPlugin';
import { HLSPlugin } from './plugins/HLSPlugin';
import { AudioPlugin } from './plugins/AudioPlugin';
import { MP4Plugin } from './plugins/MP4Plugin';
import { SleepTimerPlugin } from './plugins/SleepTimerPlugin';

const App = () => {
    const playerPlugins = useMemo(() => [
        new MetadataPlugin(),
        new MP4Plugin(),
        new HLSPlugin(),
        new AudioPlugin({
            maxBoost: 1.2,
            smoothness: 0.05,
            enableLimiter: false
        }),
        new SleepTimerPlugin()
    ], []);

    return (
        <ThemeProvider>
            <PlayerDOM plugins={playerPlugins} />
        </ThemeProvider>
    );
};

export default App;