# V-Player

V-Player, web tabanlı medya oynatıcı ihtiyaçları için tasarlanmış, modüler ve genişletilebilir bir player altyapısıdır. React, Vite ve Web Audio API üzerine inşa edilen yapı; iframe tabanlı medya akışlarını destekler, yüksek performans, düşük gecikme ve hassas kontrol sunar.

V-Player; modern uygulama geliştiricileri, ileri seviye web projeleri, video platformları, interaktif medya uygulamaları, ders platformları ve medya odaklı SaaS ürünleri geliştiren ekipler için tasarlanmıştır.

---

## Özellikler

### Çekirdek Özellikler

* **Iframe Media Core**: Medya içeriği iframe üzerinden yüklenir, güvenlik ve izolasyon sağlanır.
* **Custom Handler Architecture**: Oynatma, zaman çizelgesi, ses, kısayollar, mini-plugins ve diğer kontrol katmanları için handler tabanlı modüler yapı.
* **Web Audio Processing**: Volume, gain, compressor, normalizer, EQ gibi gelişmiş ses işleme bileşenleri.
* **Redux State Integration**: Player configuration, tema, kullanıcı tercihleri ve global metadata yönetimi.
* **Tailwind UI Layer**: Tema tabanlı, ölçeklenebilir ve kolayca özelleştirilebilir kullanıcı arayüzü.

### Gelişmiş Özellikler

* **HLS/DASH desteği (hls.js / dash.js)**
* **Plugin API**: Harici geliştiricilerin ekstra özellikler ekleyebilmesi için açık ve dokümante edilmiş plugin arayüzü.
* **Event Bus**: Handler ve UI arasında düşük gecikmeli iletişim.
* **Custom Shortcuts (Hotkeys)**
* **Overlay Components**: Altyazı, thumbnail preview, kalite menüsü, hız kontrolü.
* **Theme Engine**: Karanlık aydınlık tema ve opsiyonel custom theme tanımları.

## Kurulum

### Gereksinimler

* Node.js 18+
* Vite 5+
* React 18+
* TailwindCSS

### Yükleme

```bash
git clone https://github.com/v-player/v-player.git
cd v-player
yarn install
yarn dev
```

---

## Kullanım

## Plugin API

V-Player, üçüncü taraf geliştiricilerin yerleşik özellikleri genişletebilmesi için plugin altyapısı sağlar.

```ts
VPlayer.use(MyThumbnailPlugin);
```

---
---

## Katkıda Bulunma

Pull request’ler ve issue’lar kabul edilir. Kod stili ESLint + Prettier ile enforced edilir.

---

## Lisans

MIT License

---

V-Player, iframe tabanlı medya altyapısını geliştiriciler için daha erişilebilir, genişletilebilir ve kontrol edilebilir hale getirmeyi amaçlar.
