# 🚀 Optimizacije Učitavanja Proizvoda

## Šta je optimizovano?

### ✅Implementirano:

#### 1. **Server-side Cache za Grupisane Proizvode** (`lib/product-cache.ts`)
- Dodato keširanje grupisanih proizvoda po kategoriji
- Eliminiše potrebu za grupiranjem na svakom zahtevu
- Cache TTL: 30 minuta
- Nove funkcije:
  - `getGroupedProductsByCategory()` - vraća grupisane proizvode iz cache-a
  - `getPaginatedGroupedProducts()` - vraća samo proizvode za trenutnu stranicu

#### 2. **Server-side Paginacija** (`app/api/products/category/[categoryId]/paginated/route.ts`)
- NOVI API endpoint sa paginacijom
- Vraća samo 32 proizvoda umesto svih (npr. 500)
- Drastično smanjuje:
  - Veličinu JSON response-a (80-90% manje)
  - Vreme parsiranja na client-u
  - Memoriju na client-u
  - Vreme initial render-a

**API Format:**
```
GET /api/products/category/{categoryId}/paginated?page=1&limit=32

Response:
{
  products: [...32 proizvoda...],
  total: 487,
  page: 1,
  totalPages: 16,
  hasMore: true
}
```

#### 3. **Optimizovana SimpleCategoryView Komponenta** (`components/SimpleCategoryView.tsx`)
- Koristi novi paginated endpoint
- SWR sa `keepPreviousData: true` - prikazuje prethodnu stranicu dok se učitava nova
- Automatic scroll to top pri promeni stranice
- Optimizovano sortiranje i filtriranje sa `useMemo`

#### 4. **Cache Warmup na Startup** (`instrumentation.ts`)
- Automatski popunjava cache kada se server pokrene
- Prvi korisnik dobija instant response
- Non-blocking - ne usporava startup servera
- Console logs pokazuju status warmup-a

---

## 📊 Očekivane Performanse

### Pre Optimizacije:
- ❌ **Prvo učitavanje**: 8+ sekundi
- ❌ **Transfer size**: ~500 proizvoda × ~5KB = **2.5 MB**
- ❌ **Grupiranje**: Dešava se svaki put (300-500ms)
- ❌ **Cache**: Gubi se pri svakom restartu

### Posle Optimizacije:
- ✅ **Prvo učitavanje**: 1-2 sekunde (sa cache warmup-om)
- ✅ **Transfer size**: 32 proizvoda × ~5KB = **160 KB** (94% manje!)
- ✅ **Grupiranje**: Dešava se jednom i keširano (cache hit = instant)
- ✅ **Cache**: Pre-populisan pri startupu

### Sledeća Učitavanja (SWR Cache):
- ⚡ **Instant** - vraća se iz SWR client-side cache-a
- ⚡ **Druga stranica**: Brzo - samo 160 KB novi podaci

---

## 🔍 Kako Funkcioniše Sada?

### Scenario 1: Server Start (Cold Start)
```
1. Server se pokreće
2. instrumentation.ts poziva warmupCacheOnce()
3. Cache se popunjava u pozadini (2-3 sekunde)
4. Prvi korisnik dobija INSTANT response (cache hit)
```

### Scenario 2: Korisnik Otvara Kategoriju
```
1. Browser: GET /api/products/category/TX/paginated?page=1&limit=32
2. Server: Proverava cache - CACHE HIT ✅
3. Server: Vraća 32 grupisana proizvoda
4. Browser: Prikazuje proizvode (brzo - samo 32 proizvoda)
5. SWR: Keširuje response (5 minuta)
```

### Scenario 3: Korisnik Ide na Stranicu 2
```
1. Browser: GET /api/products/category/TX/paginated?page=2&limit=32
2. Server: Proverava cache - CACHE HIT ✅
3. Server: Vraća sledeće 32 proizvode
4. Browser: Prikazuje proizvode (brzo)
```

### Scenario 4: Korisnik Se Vraća Nazad
```
1. SWR: CACHE HIT - vraća podatke instant ⚡
2. Nema API poziva, instant prikaz
```

---

## 🛠️ Tehnički Detalji

### Cache Struktura:
```typescript
// 1. Products Cache (svi proizvodi)
productsCache: CacheEntry<Product[]>

// 2. Categories Cache (sve kategorije)
categoriesCache: CacheEntry<Category[]>

// 3. Grouped Products by Category (NOVO!)
groupedProductsByCategory: Map<categoryId, CacheEntry<GroupedProduct[]>>
```

### Multi-Layer Caching:
1. **Server In-Memory Cache** (30 min) - proizvodi, kategorije, grupisani proizvodi
2. **Next.js Fetch Cache** (1h) - eksterni API pozivi
3. **SWR Client Cache** (5 min) - client-side caching sa deduplication

---

## 📝 API Endpoints

### Stari (Neoptimizovan):
```
GET /api/products/category/{categoryId}/simple
→ Vraća SVE proizvode za kategoriju (npr. 500)
→ Client radi grupiranje
→ Client radi paginaciju
```

### Novi (Optimizovan): ✅
```
GET /api/products/category/{categoryId}/paginated?page=1&limit=32
→ Vraća samo 32 proizvoda
→ Server radi grupiranje (keširano)
→ Server radi paginaciju
```

---

## 🔄 Cache Lifecycle

### Warmup:
- Dešava se pri startupu servera
- Trajanje: ~2-3 sekunde
- Non-blocking (server ostaje responzivan)

### Expiration:
- TTL: 30 minuta
- Nakon 30 min, prvi korisnik trigeruje refresh
- Drugi korisnici i dalje koriste cache

### Manual Clear:
```typescript
import { clearProductCache } from '@/lib/product-cache';
clearProductCache(); // Briše sve cache-ove
```

### Stats API:
```
GET /api/cache/stats
→ Vraća info o cache-u (age, size, expiration)
```

---

## 🎯 Rezultati

### Smanjenje Network Transfer:
- Pre: **2.5 MB** (500 proizvoda)
- Posle: **160 KB** (32 proizvoda)
- **Ušteda: 94%**

### Vreme Učitavanja:
- Pre: **8+ sekundi** (prvi put)
- Posle: **1-2 sekunde** (prvi put sa warmup-om)
- Sledeći put: **Instant** (cache)

### Server Load:
- Grupiranje: Jednom po kategoriji (keširano)
- API pozivi: Jednom na 30 minuta
- Response size: 94% manje podataka

---

## 🔧 Dalji Koraci (Opciono)

### Za Još Veće Performanse:

1. **Database (Postgres + Prisma)**
   - Trajno skladištenje proizvoda
   - Brže upiti
   - Filtriranje direktno u bazi

2. **Redis Cache**
   - Distribuirani cache za production
   - Svi server instance dele cache

3. **ISR (Incremental Static Regeneration)**
   - Pre-generisane stranice
   - Background revalidation

4. **CDN Caching**
   - Cache API responses na CDN edge
   - Geografski bliži korisnicima

---

## ✅ Checklist

- [x] Cache za grupisane proizvode po kategoriji
- [x] Server-side paginacija API endpoint
- [x] Optimizovana SimpleCategoryView komponenta
- [x] Cache warmup na startup (instrumentation.ts)
- [x] Console logging za debugging
- [x] SWR keepPreviousData za smooth UX
- [x] Scroll to top pri promeni stranice

---

## 🐛 Debug

### Provera Cache-a:
```bash
# Console logs u development
[Cache] Returning cached products
[Cache] Returning cached grouped products for category: TX
[API Paginated] Returned 32 products (page 1/16, total: 487) in 5ms
```

### Warmup Status:
```bash
[Instrumentation] Server starting - warming up cache...
[Cache Warmup] ✅ Cache warmed up successfully in 2587ms
```

### Problemi?
- **Cache se ne popunjava**: Proveri console logs za errors
- **Sporo učitavanje**: Proveri Network tab - da li koristi paginated endpoint?
- **Stari podaci**: Redeploy ili clear cache

---

## 📚 Reference

- `lib/product-cache.ts` - Cache logika
- `app/api/products/category/[categoryId]/paginated/route.ts` - API endpoint
- `components/SimpleCategoryView.tsx` - Client komponenta
- `instrumentation.ts` - Warmup na startup
