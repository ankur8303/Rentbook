import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PropertyCardProps {
  title: string;
  address: string;
  role: string;
  status: string;
  onPress: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ title, address, role, status, onPress }) => {
  // Better color coding for tags
  const roleColor = role === 'LANDLORD' ? '#D1E8D1' : '#FCE8D1';
  const statusColor = status === 'ACTIVE' ? '#D1E8D1' : '#F8D1D1';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.address}>{address}</Text>

      <View style={styles.tagsContainer}>
        <View style={[styles.tag, { backgroundColor: roleColor }]}>
          <Text style={styles.tagText}>{role}</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: statusColor }]}>
          <Text style={styles.tagText}>{status}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>View Property</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#111',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D2D2D',
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default PropertyCard;
