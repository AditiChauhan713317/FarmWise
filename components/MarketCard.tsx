// app/components/MarketCard.tsx
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { MarketRecord } from "../app/api/market";
import { useMarket } from "../app/hooks/useMarket";
import { AppText } from "./AppText";

interface Props {
  commodity?: string; // default Wheat
}

const MarketCard: React.FC<Props> = ({ commodity = "Wheat" }) => {
  const { market, loading, error } = useMarket(commodity);

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="small" color="#000" />
        <AppText>Loading market data...</AppText>
      </View>
    );
  }

  if (error || !market) {
    return (
      <View style={styles.card}>
        <AppText colorClassName="text-red-600">Error loading market data: {error || "Unknown error"}</AppText>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <AppText weight="bold" sizeClassName="text-xl" colorClassName="text-foreground" className="text-center mb-3">
        {commodity} Market Rates
      </AppText>
      <FlatList
        scrollEnabled={false}
        data={market.records}
        keyExtractor={(item, idx) => `${item.market}-${idx}`}
        renderItem={({ item }: { item: MarketRecord }) => (
          <View style={styles.marketBox}>
            <AppText weight="bold" sizeClassName="text-base" colorClassName="text-foreground" className="mb-1">
              {item.market}, {item.district}, {item.state}
            </AppText>
            <AppText sizeClassName="text-sm" colorClassName="text-muted-foreground" className="mb-2">
              📅 Arrives on: {item.arrival_date}
            </AppText>

            <View style={styles.row}>
              <AppText colorClassName="text-muted-foreground" sizeClassName="text-sm">Commodity:</AppText>
              <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-sm">{item.commodity}</AppText>
            </View>

            <View style={styles.row}>
              <AppText colorClassName="text-muted-foreground" sizeClassName="text-sm">Variety:</AppText>
              <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-sm">{item.variety}</AppText>
            </View>

            <View style={styles.row}>
              <AppText colorClassName="text-muted-foreground" sizeClassName="text-sm">Grade:</AppText>
              <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-sm">{item.grade}</AppText>
            </View>

            <View style={styles.row}>
              <AppText colorClassName="text-muted-foreground" sizeClassName="text-sm">Min Price:</AppText>
              <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-sm">₹{item.min_price}/quintal</AppText>
            </View>

            <View style={styles.row}>
              <AppText colorClassName="text-muted-foreground" sizeClassName="text-sm">Max Price:</AppText>
              <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-sm">₹{item.max_price}/quintal</AppText>
            </View>

            <View style={styles.row}>
              <AppText weight="bold" colorClassName="text-muted-foreground" sizeClassName="text-sm">
                Modal Price:
              </AppText>
              <AppText weight="bold" colorClassName="text-primary" sizeClassName="text-sm">
                ₹{item.modal_price}/quintal
              </AppText>
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
  marketBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

});

export default MarketCard;
