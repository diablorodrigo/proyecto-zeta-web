# Zeta Finance

Sitio web en español para **Zeta Finance** (asesoría financiera y de inversiones), alineado al diseño de referencia multipágina:

- `/` Inicio · `/servicios` · `/simulador` · `/planillas` · `/sobre-mi` · `/contacto`

Stack: **Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui**.

## Requisitos

- Node.js 20+
- npm

## Configuración

```bash
cp .env.example .env.local
```

| Variable | Descripción |
| --- | --- |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Webhook Apps Script. Vacío = modo demo. |
| `NEXT_PUBLIC_WHATSAPP_URL` | Link WhatsApp (default `https://wa.me/5493496462977`). |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email público (default `zeta_finance@yahoo.com`). |
| `NEXT_PUBLIC_MP_PLANILLA_PERSONALES` | Link de Mercado Pago de Finanzas personales. Si no está, se usa la constante en `src/lib/planillas.ts`. |
| `NEXT_PUBLIC_MP_PLANILLA_INDEPENDIENTES` | Link de Mercado Pago de Ingresos para profesionales independientes. |
| `NEXT_PUBLIC_MP_PLANILLA_COMBO` | Link de Mercado Pago del combo. |

Los tres links de pago se pegan en `src/lib/planillas.ts` (`MERCADO_PAGO_PLANILLA_PERSONALES`, `MERCADO_PAGO_PLANILLA_INDEPENDIENTES`, `MERCADO_PAGO_PLANILLA_COMBO`). Mientras la URL contenga `PLACEHOLDER`, el botón Comprar abre WhatsApp.

## Desarrollo

Puerto **4327**:

```bash
npm install
npm run dev
```

Abrí [http://127.0.0.1:4327](http://127.0.0.1:4327).

```bash
npm run build && npm start
```

## APIs

- `POST /api/leads` — `tipo`: `contacto` \| `simulacion` \| `reunion` \| `cartera`
- `GET /api/market/sp500` y `GET /api/market/quote` — datos de mercado (disponibles para extensiones)

## Google Sheets

Columnas: `timestamp`, `tipo`, `nombre`, `telefono`, `email`, `activos_json`, `mensaje`.

Ver script `doPost` de ejemplo en commits anteriores / README histórico; el payload JSON usa esas claves.

## Contacto

- WhatsApp: +54 9 3496-462977 (`https://wa.me/5493496462977`)
- Instagram: [@cristianbernaldez.ok](https://www.instagram.com/cristianbernaldez.ok)
- Email: zeta_finance@yahoo.com
- Ubicación: Salta, Argentina

## Licencia

Uso privado — Zeta Finance.
