import Hls, { ErrorData } from 'hls.js';
import { logger } from '@/utils/logger.util';

export const HLSErrorHandlerPlugin = (maxRetries = 3) => {
  let retryCount = 0;
  const pluginName = 'HLSErrorHandlerPlugin';

  return {
    name: 'hls-error-handler',
    version: '2.0.0',

    init(_ctx: any, hls?: Hls) {
      if (!hls) {
        logger.warn(pluginName, 'No HLS instance found to attach error listeners.');
        return;
      }

      hls.on(Hls.Events.ERROR, (_event, data: ErrorData) => {
        if (!data.fatal) return;

        logger.error(pluginName, `Fatal HLS Error: ${data.details}`);

        if (retryCount >= maxRetries) {
          logger.error(pluginName, "Maximum retry limit reached. Stopping playback.");
          hls.destroy();
          return;
        }

        retryCount++;

        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            logger.info(pluginName, `Network error, retrying load... (${retryCount}/${maxRetries})`);
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            logger.info(pluginName, `Media error, attempting recovery... (${retryCount}/${maxRetries})`);
            hls.recoverMediaError();
            break;
          default:
            logger.error(pluginName, "Unrecoverable error, destroying HLS instance.");
            hls.destroy();
            break;
        }
      });
    },

    destroy() {
      retryCount = 0;
      logger.info(pluginName, "Error handler reset.");
    }
  };
};