# Zeta Finance

Sitio web en español para **Zeta Finance** (asesoría financiera y de inversiones), alineado al diseño de referencia multipágina:

- `/` Inicio · `/servicios` · `/simulador` · `/planillas` · `/guias` · `/sobre-mi` · `/contacto`

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

Los tres links de pago están en `src/lib/planillas.ts` (`MERCADO_PAGO_PLANILLA_PERSONALES`, `MERCADO_PAGO_PLANILLA_INDEPENDIENTES`, `MERCADO_PAGO_PLANILLA_COMBO`). Si una URL de reemplazo contiene `PLACEHOLDER`, el botón Comprar abre WhatsApp con el pedido escrito. La página dice que la entrega es por mail.

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

- `POST /api/leads` — `tipo`: `contacto` \| `simulacion` \| `reunion` \| `cartera` \| `guia`
- `GET /api/market/sp500` y `GET /api/market/quote` — datos de mercado (disponibles para extensiones)

## Google Sheets

Los leads (contacto, simulador, reunión, cartera y **guías**) se agregan a una hoja de cálculo. No hay base de datos.

Columnas que manda el sitio: `timestamp`, `fecha` (horario de Salta), `tipo`, `nombre`, `telefono`, `email`, `profesion`, `activos_json`, `mensaje`.

El script para pegar en la hoja está en `scripts/google-sheets-leads.js`. Crea la pestaña `Leads` con estas columnas: `timestamp`, `fecha_salta`, `tipo`, `nombre`, `telefono`, `email`, `profesion`, `detalle`, `mensaje`.

### Cómo leer los leads de las guías

1. Abrí la hoja de Google donde pegaste el script.
2. Andá a la pestaña **Leads**.
3. Filtrá `tipo` = `guia`.
4. Cada fila es una descarga: **nombre**, **email**, **profesion** (Médicos, Abogados, Contadores, Ingenieros, RR.HH., Psicólogos o Emprendedores) y **fecha_salta**.

### Configuración, una sola vez

Hoy, si `GOOGLE_SHEETS_WEBHOOK_URL` está vacía, el visitante igual abre el PDF, pero **el lead no se guarda**. Hay que publicar el script y cargar la variable en Vercel (Production y Preview) antes de compartir los links por Instagram.

1. Entrá a [Google Sheets](https://sheets.google.com) con la cuenta donde vas a leer los contactos y creá una hoja en blanco. Nombre sugerido: `Zeta Finance — Leads`.
2. En esa hoja: **Extensiones → Apps Script**. Borrá el ejemplo y pegá `scripts/google-sheets-leads.js`. Guardá. Tiene que ser el script de esta hoja, no un proyecto suelto de script.google.com.
3. **Implementar → Implementación nueva → Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
4. Copiá la URL que termina en `/exec`.
5. En Vercel → el proyecto del sitio → **Settings → Environment Variables**:
   - Name: `GOOGLE_SHEETS_WEBHOOK_URL`
   - Value: esa URL
   - Environments: **Production** y **Preview**
6. **Redeploy** el último deployment para que tome la variable.
7. Probá en `/guias/medicos` con tu email y confirmá que aparece una fila nueva. Si el formulario dice que no pudo registrar los datos, la app web no quedó pública o la URL no es la que termina en `/exec`.

Abrir la URL `/exec` en el navegador tiene que mostrar `{"ok":true,"service":"zeta-leads"}`. Si Google pide login, el acceso no es «Cualquier persona».

## Guías gratis

Páginas para pegar en un mensaje de Instagram (el PDF no se puede adjuntar en el DM):

- https://zeta-finance.vercel.app/guias
- https://zeta-finance.vercel.app/guias/medicos
- https://zeta-finance.vercel.app/guias/abogados
- https://zeta-finance.vercel.app/guias/contadores
- https://zeta-finance.vercel.app/guias/ingenieros
- https://zeta-finance.vercel.app/guias/rrhh
- https://zeta-finance.vercel.app/guias/psicologos
- https://zeta-finance.vercel.app/guias/emprendedores

Los PDF están en `public/guias/` y el sitio los sirve en `/guias/<profesion>.pdf`. En la página, el botón para abrirlos aparece después de enviar nombre y email. El visitante elige la profesión (o entra por el link directo), completa el formulario y abre el PDF.

## Contacto

- WhatsApp: +54 9 3496-462977 (`https://wa.me/5493496462977`)
- Instagram: [@cristianbernaldez.ok](https://www.instagram.com/cristianbernaldez.ok)
- Email: zeta_finance@yahoo.com
- Ubicación: Salta, Argentina

## Licencia

Uso privado — Zeta Finance.
