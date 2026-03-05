export class VolumeCalculator {
  static calculate(volume: number, maxBoost: number = 2.0) {
    // 0.0 - 1.0 arası: Normal ses, GainNode etkisiz (1.0)
    // 1.0 - 2.0 arası: Native ses 1.0'da sabit, GainNode sesi katlar
    return {
      native: Math.min(volume, 1.0),
      boost: volume > 1.0 ? Math.min(volume, maxBoost) : 1.0
    };
  }
}