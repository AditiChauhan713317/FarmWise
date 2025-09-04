// app/components/MarketCard.tsx
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import React from "react";
import { useMarket } from "../app/hooks/useMarket";
import { MarketRecord } from "../app/api/market";

interface Props {
  commodity?: string; // default Wheat
}

const MarketCard: React.FC<Props> = ({ commodity = "Wheat" }) => {
  const { market, loading, error } = useMarket(commodity);

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="small" color="#000" />
        <Text>Loading market data...</Text>
      </View>
    );
  }

  if (error || !market) {
    return (
      <View style={styles.card}>
        <Text>Error loading market data: {error || "Unknown error"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{commodity} Market Rates</Text>
      <FlatList
        scrollEnabled={false}
        data={market.records}
        keyExtractor={(item, idx) => `${item.market}-${idx}`}
        renderItem={({ item }: { item: MarketRecord }) => (
          <View style={styles.marketBox}>
            <Text style={styles.marketName}>
              {item.market}, {item.district}, {item.state}
            </Text>
            <Text style={styles.date}>📅 Arrives on: {item.arrival_date}</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Commodity:</Text>
              <Text style={styles.value}>{item.commodity}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Variety:</Text>
              <Text style={styles.value}>{item.variety}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Grade:</Text>
              <Text style={styles.value}>{item.grade}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Min Price:</Text>
              <Text style={styles.value}>₹{item.min_price}/quintal</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Max Price:</Text>
              <Text style={styles.value}>₹{item.max_price}/quintal</Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.label, { fontWeight: "700" }]}>
                Modal Price:
              </Text>
              <Text style={[styles.value, { color: "#2E8B57" }]}>
                ₹{item.modal_price}/quintal
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    margin: 16,
    backgroundColor: "#fefefe",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  marketBox: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  marketName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    color: "#444",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
  },
});

export default MarketCard;
