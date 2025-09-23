import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';
import { API_CONFIG } from '../constants';
import { Product } from '../types';

type RootStackParamList = {
  Login: undefined;
  ProductDetail: undefined;
};

type ProductDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

interface Props {
  navigation: ProductDetailScreenNavigationProp;
  route: ProductDetailScreenRouteProp;
}

const ProductDetailScreen: React.FC<Props> = ({ navigation }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProductDetails();
  }, []);

  const loadProductDetails = async () => {
    const authState = await StorageService.getAuthState();
    
    if (!authState.isAuthenticated || !authState.token) {
      navigation.replace('Login');
      return;
    }

    try {
      setIsLoading(true);
      const response = await ApiService.getProductDetails(32233, authState.token);

      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        setError(response.error || 'Failed to load product details');
        setProduct({
          id: 32233,
          name: 'Waldent Smart Endopro 2',
          description: 'High-quality dental implant system with advanced features for optimal performance.',
          price: 299.99,
          image_url: 'w/a/waldent_smart_endopro_2.jpg',
          sku: 'DEN-32233',
          category: 'Dental Implants'
        });
      }
    } catch (err) {
      setError('Network error occurred');
      setProduct({
        id: 32233,
        name: 'Waldent Smart Endopro 2',
        description: 'High-quality dental implant system with advanced features for optimal performance.',
        price: 299.99,
        image_url: 'w/a/waldent_smart_endopro_2.jpg',
        sku: 'DEN-32233',
        category: 'Dental Implants'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await StorageService.clearAuthData();
    navigation.replace('Login');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (error && !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={loadProductDetails} />
        <Button title="Logout" onPress={handleLogout} variant="secondary" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Product Details</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {product && (
        <View style={styles.productContainer}>
          {/* {product.image_url && (
            <Image
              source={{ uri: `${API_CONFIG.IMAGE_BASE_URL}${product.image_url}` }}
              style={styles.productImage}
              resizeMode="contain"
              defaultSource={require('../assets/placeholder-image.png')} // Add a placeholder image
            />
          )} */}
          
          <Text style={styles.productName}>{product.name}</Text>
          
          {product.sku && (
            <Text style={styles.productSku}>SKU: {product.sku}</Text>
          )}
          
          {product.category && (
            <Text style={styles.productCategory}>Category: {product.category}</Text>
          )}
          
          {product.price && (
            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          )}
          
          {product.description && (
            <Text style={styles.productDescription}>{product.description}</Text>
          )}
        </View>
      )}

      {error && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            Using mock data: {error}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

// Add Button component for error screen
const Button: React.FC<{ title: string; onPress: () => void; variant?: 'primary' | 'secondary' }> = 
({ title, onPress, variant = 'primary' }) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === 'primary' ? styles.primaryButton : styles.secondaryButton
    ]}
    onPress={onPress}
  >
    <Text style={[
      styles.buttonText,
      variant === 'primary' ? styles.primaryText : styles.secondaryText
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const TouchableOpacity = ({ onPress, style, children }: any) => (
  <View onStartShouldSetResponder={() => true} onResponderRelease={onPress} style={style}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 10,
  },
  logoutText: {
    color: '#007AFF',
    fontSize: 16,
  },
  productContainer: {
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productSku: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
  },
  productDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  warningBanner: {
    backgroundColor: '#fff3cd',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#333',
  },
});

export default ProductDetailScreen;