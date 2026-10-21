# Reliable Luxury Car & Limousine — sitio web

Landing estática (HTML + CSS + un poco de JS, sin frameworks) para **https://1reliablelimo.com**.
Carga rápido y es fácil de indexar, que es lo que más ayuda al SEO.

## Link de reservas (lo más importante)
Todos los botones "Reserve" llevan a la plataforma real de reservas y pagos (Limo Anywhere):

    https://book.mylimobiz.com/v4/vztravelcorp

- Hay 20 botones y enlaces de reserva en la página, todos con `data-book`, y apuntan a ese mismo link.
- La URL vieja `/booking/` redirige ahí (con `.htaccess`, `_redirects` y `booking/index.html`), así no se rompen los links viejos.
- Si algún día cambia el link: busca y reemplaza `book.mylimobiz.com/v4/vztravelcorp` en todos los archivos.

## Diseño
- **Logo:** se usa el logo original sin modificar (`assets/img/logo-*.png/webp`). Trae fondo transparente y la "R" calada, así que siempre va sobre blanco (header, tarjetas y footer).
- **Colores:** solo los del logo. Azules del círculo y de la palabra RELIABLE (`#3270a4` → `#154677`, con tonos más claros y oscuros del mismo azul), blanco y el gris carbón del texto curvo. El rojo de la bandera solo aparece en el punto "en vivo".
- **Tipografía:** Montserrat, que es geométrica como la palabra RELIABLE, para los títulos, e Inter para el texto.
- **Animaciones:** reloj de Nueva York en vivo, zoom lento sobre las fotos del skyline, rotador de destinos (JFK, Wall Street, Fifth Avenue…), cinta de destinos en movimiento, contadores, mapa de rutas animado a los 6 aeropuertos, revelado de secciones al hacer scroll, parallax y brillo en los botones. Todo se desactiva si el usuario tiene "reducir movimiento" activado en su dispositivo.

## Fotos
Todas son de Unsplash (licencia gratuita para uso comercial). En todas las fotos donde aparece un vehículo, el vehículo es negro.
- Hero (carrusel): `nyc-skyline-night` (TlswXan_O_8), `hero-sedan-night` (MllJgoAFTcE), `hero-sedan-doors` (jdceFCCyML4)
- Intro: `chauffeur-opening-door` (CfoHjmOlkBk)
- Servicios: `svc-airport-terminal` (0XV65AZ1hmY, JFK), `svc-corporate` (kDxqYhuPugk), `svc-hourly-broadway` (0dXewZttOB4), `svc-wedding-limo` (5mTpOy3w1IE), `svc-city-suv` (9AgLJ8ejV_c), `svc-long-distance` (r73ofIPEfag)
- Flota: `fleet-sedan` (y3neNkE6efI), `fleet-suv` (8kAmGDOg_xI), `fleet-sprinter` (PNW4oeltJGo), `fleet-minibus` (c4TB4MDaRIs)
- Experiencia: `exp-black-tie` (PXvbdAT6j_I), `exp-champagne-limo` (BJele2evRl4), `exp-interior` (pjnnuhNIX9Y), `exp-mercedes` (PNNOi6VDu1g), `exp-wedding-st-patricks` (yI2ab0f7Yu0), `exp-night-out` (eiJfBem7cPw)
- Otras: `nyc-midtown-night` (cWV-4eHPCXQ), `manhattan-aerial-dusk` (qBhhrtIQk5E)

Cada foto está en https://unsplash.com/photos/ID. Lo ideal es reemplazarlas por fotos reales de la flota y los chóferes cuando las haya.

## Flota
La flota del sitio sale del formulario de reservas (Limo Anywhere, revisado el 20-oct-2026):
- **Sedanes:** Mercedes-Benz, Mercedes EQS 450+, Lexus, Cadillac XTS, Volvo S90, Tesla, Lincoln Town Car
- **SUV:** Cadillac Escalade, Chevrolet Suburban, BMW X5, Cadillac XT6
- **Vans:** Mercedes-Benz Sprinter (13 pasajeros) y Sprinter de carga
- **Buses:** de 16 a 56 pasajeros

El formulario **no tiene limusina tipo stretch**. Si la ofrecen, hay que agregarla en Limo Anywhere y en el sitio.

## Archivos
| Archivo | Para qué |
|---|---|
| `index.html` | Landing con meta tags SEO, Open Graph y JSON-LD (LocalBusiness, WebSite, FAQPage, ReserveAction) |
| `assets/css/styles.css` | Estilos |
| `assets/js/main.js` | Animaciones, menú móvil, header fijo y medición de clics en reservar (GA4/GTM) |
| `assets/img/` | Logo original, fotos de NYC, íconos, imagen para compartir en redes (OG) |
| `robots.txt`, `sitemap.xml` | Indexación |
| `.htaccess` | Para hosting Apache/cPanel: HTTPS, sin www, redirecciones, caché, compresión, headers de seguridad |
| `_redirects`, `_headers` | Lo mismo si se publica en Netlify o Cloudflare Pages |
| `tools/` | `inline_css.py` (pone el CSS dentro del HTML) y `serve.py` (servidor local tipo producción) |
| `404.html` | Página de error que lleva a reservar |

## Cómo publicar
**Opción A, mismo hosting del WordPress (cPanel):** respalda el WordPress y sube todo el contenido de esta carpeta a `public_html/`, incluido `.htaccess`. Hay que sacar `index.php` y el `.htaccess` de WordPress, si no siguen teniendo prioridad.

**Opción B, Netlify o Cloudflare Pages (gratis y muy rápido):** arrastra la carpeta y apunta el dominio `1reliablelimo.com` al nuevo sitio.

Para probar en tu computador (servidor con compresión y caché, igual que producción):

    python3 tools/serve.py
    # abrir http://localhost:8765

## Rendimiento (Lighthouse)
- **CSS en línea:** el CSS va dentro de `index.html`, así no bloquea el render. Se edita `assets/css/styles.css` y después se corre `python3 tools/inline_css.py`.
- **Fuentes en el propio sitio:** Montserrat e Inter están en `assets/fonts/` y se precargan. Tienen fuentes de respaldo ajustadas a sus métricas, para que el texto no salte al cargar.
- **Imágenes:** AVIF con respaldo WebP, en varios tamaños (640/720/900+). Las fotos 2 y 3 del carrusel se cargan después de la página.
- **JS:** se edita `assets/js/main.js` y se publica minificado como `assets/js/main.min.js` (`pip install rjsmin` y luego `python3 -m rjsmin < assets/js/main.js > assets/js/main.min.js`). Hay que subirle la versión en `index.html`.
- **Logos:** `logo-w120/240/400/600` (AVIF y WebP, nombrados por su ancho) se sirven con `sizes` según el tamaño en pantalla. Los PNG quedan como respaldo y para el JSON-LD.
- **Animaciones en bucle:** `main.js` las pausa cuando están fuera de pantalla (clase `anim-paused`).
- **Medir con Lighthouse en una ventana de incógnito**, para que las extensiones de Chrome no sumen JavaScript ni trabajo del hilo principal.
- **Caché:** todo lo que está en `/assets/` se guarda un año sin revalidar (`immutable`). **Si cambian una imagen o el JS, hay que cambiarle el nombre o subirle la versión** (por ejemplo `main.js?v=4`); si no, los visitantes siguen viendo la versión vieja.

## Después de publicar (SEO)
1. **Google Search Console:** verificar el dominio, enviar `https://1reliablelimo.com/sitemap.xml` y pedir la indexación de la home.
2. **Google Business Profile:** es lo que más pesa para salir en "limo service NYC" o "car service near me". Usar el mismo nombre, el mismo teléfono `(212) 204-8589` y la misma web. Pedir reseñas reales a los clientes.
3. Validar los datos estructurados en https://search.google.com/test/rich-results
4. (Opcional) Instalar GA4 o GTM: los clics en reservar ya se envían como el evento `begin_reservation`.

## ⚠️ Pendiente de confirmar con el cliente
- **Dirección física:** el schema solo dice "New York, NY". Si hay una dirección (aunque sea como negocio de área de servicio), agregarla en el JSON-LD y en el footer: mejora mucho el SEO local.
- **Email** de contacto: no se encontró ninguno.
- **Servicio 24/7, monitoreo de vuelos, meet & greet, chóferes con verificación de antecedentes, confirmación por email en minutos y aeropuerto ISP:** confirmar que se ofrecen. Si no, quitarlos del texto y del JSON-LD.
- **Testimonios:** no los incluí. Los del sitio viejo parecen del template (Ivan Smith, Tim Smith…), y publicar reseñas falsas puede traer penalizaciones de Google. Cuando haya reseñas reales en Google, se pueden mostrar.
- **Redes sociales:** si existen, agregarlas al footer y como `sameAs` en el JSON-LD.
