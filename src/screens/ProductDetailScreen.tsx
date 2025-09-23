// ProductDetail.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';

type Media = {
  id: number;
  file: string;
  media_type: string;
  disabled?: boolean;
};

type FreeProduct = {
  buy_qty: number;
  end_date: string;
  free_qty: number;
  free_sku: string;
  id: number;
  image_url: string;
  is_multiply: boolean;
  name: string;
  price: number;
  start_date: string;
  url_key: string;
};

type ProductResponse = {
  name: string;
  brand?: { id?: number; name?: string; path?: string };
  media?: Media[];
  pricing?: {
    currency_symbol?: string;
    price?: number;
    selling_price?: number;
    discount?: { label?: string; value?: string };
    is_price_request?: boolean;
  };
  inventory?: { available_qty?: number; is_in_stock?: boolean };
  free_product?: FreeProduct[];
  rating?: number;
  reviews_count?: number;
  product_id?: number;
  sku?: string;
  action_btn?: { action?: string; text?: string } | null;
  attributes?: any;
  // ... add more fields if needed
};

const API_URL = 'https://apis.dentalkart.com/node_svlss/api/v1/products/32233/';

/**
 * Helper to produce an absolute image URL from the CMS 'file' fields returned in JSON.
 * Strategy:
 *  - If `file` already starts with http/https -> return as-is
 *  - If it starts with `/` -> try known public base paths:
 *      1) https://dentalkart-catalog-products.s3.ap-south-1.amazonaws.com/media/catalog/product
 *      2) https://www.dentalkart.com
 *    (This is a heuristic — adapt to your actual CDN base if different.)
 */
function resolveImageUrl(file?: string) {
  if (!file) return '';
  const trimmed = file.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://'))
    return trimmed;
  if (trimmed.startsWith('/')) {
    // try S3-based CDN path (common on Dentalkart). If your project uses a different base, change here.
    const s3Base =
      'https://dentalkart-catalog-products.s3.ap-south-1.amazonaws.com/media/catalog/product';
    const siteBase = 'https://www.dentalkart.com';
    // If file already contains "/media/catalog/product", avoid double prefix.
    if (trimmed.includes('/media/catalog/product'))
      return `https://dentalkart-catalog-products.s3.ap-south-1.amazonaws.com${trimmed}`;
    // prefer s3 base:
    return `${s3Base}${trimmed}`;
    // fallback: return `${siteBase}${trimmed}`;
  }
  // otherwise treat as relative: append to site
  return `https://www.dentalkart.com/${trimmed}`;
}

export default function ProductDetail() {
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const myHeaders = new Headers();
    // NOTE: trimmed values to avoid leading spaces in your pasted snippet
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('x-api-key', 'ZFobrRyccnTyXyXHPUVO4eyyKEKoSjWB');
    myHeaders.append('user-agent', 'ios');
    myHeaders.append('platform', 'ios');
    myHeaders.append('version', '13.0.2');
    myHeaders.append('app_version', '12.4.9');
    myHeaders.append('device_id', '3058D2C5-A13A-4B85-B131-CC6E83BDD302');
    myHeaders.append(
      'Authorization',
      // trimmed token from your message; keep tokens secret in production!
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjE2OTUxLCJ0eXBlIjoiY3VzdG9tZXIiLCJpYXQiOjE3NTEyODcyMTEsImlzcyI6ImRlbnRhbGthcnQifQ.6bZkWE46QkTKRYMh-oVne39SQR2-OGixxhNxl5yIJGc',
    );

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    setLoading(true);
    fetch(API_URL, requestOptions)
      .then(async resp => {
        if (!resp.ok) {
          const text = await resp.text().catch(() => '');
          throw new Error(`API error ${resp.status}: ${text}`);
        }
        return resp.json();
      })
      .then((json: ProductResponse) => {
        setProduct(json);
        // set a primary image if exists
        const firstImage =
          json.media && json.media.length > 0
            ? resolveImageUrl(json.media[0].file)
            : null;
        setSelectedImage(firstImage);
        setError(null);
      })
      .catch(err => {
        console.error('fetch error:', err);
        setError(err.message || 'Unknown error');
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading product...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', marginBottom: 8 }}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => {
            // quick refresh by re-mounting effect: simplest approach is to reload the app or you can implement re-fetch logic
            // here we simply alert (you can trigger fetch with a state toggle if you'd like)
            Alert.alert('Retry', 'Reload the screen to retry the API call.');
          }}
        >
          <Text style={{ color: '#fff' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>No product data</Text>
      </View>
    );
  }

  const media = product.media?.filter(m => !m.disabled) ?? [];
  const thumbnails = media.length > 0 ? media : [];

  const currency = product.pricing?.currency_symbol ?? '₹';
  const selling = product.pricing?.selling_price ?? product.pricing?.price ?? 0;
  const mrp = product.pricing?.price ?? 0;
  const discountLabel = product.pricing?.discount?.label ?? '';

  return (
    <ScrollView style={styles.container}>
      {/* IMAGE */}
      <View style={{ alignItems: 'center' }}>
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.mainImage, styles.center]}>
            <Text>No Image</Text>
          </View>
        )}
      </View>

      {/* THUMBNAILS */}
      {thumbnails.length > 0 && (
        <FlatList
          style={{ marginTop: 8 }}
          horizontal
          data={thumbnails}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => {
            const url = resolveImageUrl(item.file);
            return (
              <TouchableOpacity onPress={() => setSelectedImage(url)}>
                <Image
                  source={{ uri: url }}
                  style={[
                    styles.thumb,
                    selectedImage === url
                      ? { borderColor: '#007AFF', borderWidth: 2 }
                      : undefined,
                  ]}
                />
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* TITLE, BRAND */}
      <View style={{ paddingHorizontal: 12, paddingTop: 12 }}>
        <Text style={styles.title}>{product.name}</Text>
        {product.brand?.name ? (
          <Text style={styles.brand}>by {product.brand.name}</Text>
        ) : null}

        {/* PRICE ROW */}
        <View style={styles.priceRow}>
          <Text style={styles.sellingPrice}>
            {currency}
            {selling.toLocaleString()}
          </Text>
          {mrp > 0 && (
            <Text style={styles.mrp}>
              {currency}
              {mrp.toLocaleString()}
            </Text>
          )}
          {discountLabel ? (
            <Text style={styles.discount}>{discountLabel}</Text>
          ) : null}
        </View>

        {/* RATING */}
        <Text style={styles.rating}>
          {product.rating ? `⭐ ${product.rating}` : '⭐ -'}{' '}
          {product.reviews_count ?? 0} reviews
        </Text>

        {/* FREE PRODUCT */}
        {product.free_product && product.free_product.length > 0 && (
          <View style={styles.freeBlock}>
            <Text style={{ fontWeight: '700', marginBottom: 6 }}>
              Free Product
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{
                  uri: resolveImageUrl(product.free_product[0].image_url),
                }}
                style={styles.freeImage}
              />
              <View style={{ flex: 1 }}>
                <Text numberOfLines={2}>{product.free_product[0].name}</Text>
                <Text style={{ color: 'green', marginTop: 4 }}>
                  Worth {currency}
                  {product.free_product[0].price}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* STOCK */}
        <Text
          style={{
            marginTop: 8,
            color:
              (product.inventory?.available_qty ?? 0) > 0 ? 'green' : 'red',
          }}
        >
          {(product.inventory?.available_qty ?? 0) > 0
            ? `In stock (${product.inventory?.available_qty})`
            : 'Out of stock'}
        </Text>

        {/* ATTRIBUTE / Short description */}
        {product.attributes?.short_description ||
        (product as any).attributes?.short_description ? (
          <Text style={{ marginTop: 8 }}>
            {product.attributes?.short_description}
          </Text>
        ) : null}

        {/* BUTTONS */}
        <View style={{ flexDirection: 'row', marginTop: 14 }}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#007AFF', marginRight: 8 }]}
            onPress={() => Alert.alert('Add to cart', 'Add to Cart pressed')}
          >
            <Text style={styles.btnText}>
              {(product as any).action_btn?.text ?? 'Add To Cart'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#FF5722' }]}
            onPress={() => Alert.alert('Buy now', 'Buy Now pressed')}
          >
            <Text style={styles.btnText}>Buy Now</Text>
          </TouchableOpacity>
        </View>

        {/* KEY SPECS / MORE */}
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontWeight: '700', marginBottom: 6 }}>
            Product Details
          </Text>
          <Text>SKU: {product.sku ?? '-'}</Text>
          <Text>Product ID: {product.product_id ?? '-'}</Text>
          <Text style={{ marginTop: 8 }}>
            {(product as any).seo?.meta_description ?? ''}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mainImage: { width: '100%', height: 300, backgroundColor: '#fff' },
  thumb: { width: 64, height: 64, marginHorizontal: 6, borderRadius: 8 },
  freeImage: { width: 60, height: 60, marginRight: 10, borderRadius: 6 },
  title: { fontSize: 18, fontWeight: '700' },
  brand: { color: '#666', marginTop: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  sellingPrice: { fontSize: 22, fontWeight: '800', color: '#2E7D32' },
  mrp: { marginLeft: 8, textDecorationLine: 'line-through', color: '#777' },
  discount: { marginLeft: 8, color: '#E53935', fontWeight: '700' },
  rating: { marginTop: 6, color: '#555' },
  freeBlock: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  retryBtn: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8 },
});
