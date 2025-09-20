import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../../components/AppText";
import { getMarketData, MarketRecord } from "../api/market";

const LIME = "#9AF300";
const { width: screenWidth } = Dimensions.get('window');
const CHART_WIDTH = screenWidth - 32;
const CHART_HEIGHT = 120;

const COMMODITIES = [
  "Mustard",
  "Wheat",
  "Rice",
  "Maize",
  "Cotton",
  "Potato",
  "Sugarcane",
];

// Simple price chart component using basic React Native components
const PriceChart: React.FC<{ prices: number[] }> = ({ prices }) => {
  if (prices.length < 2) return null;

  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const priceRange = maxPrice - minPrice || 1;
  
  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartBackground}>
        {prices.map((price, index) => {
          const height = ((price - minPrice) / priceRange) * (CHART_HEIGHT - 20);
          const width = (CHART_WIDTH - 40) / prices.length;
          const left = index * width + 20;
          
          return (
            <View
              key={index}
              style={[
                styles.chartBar,
                {
                  height: Math.max(height, 2),
                  left: left,
                  width: Math.max(width - 2, 1),
                }
              ]}
            />
          );
        })}
        
        {/* Price trend line using dots */}
        {prices.map((price, index) => {
          const y = CHART_HEIGHT - 10 - ((price - minPrice) / priceRange) * (CHART_HEIGHT - 20);
          const x = (index / (prices.length - 1)) * (CHART_WIDTH - 40) + 20;
          
          return (
            <View
              key={`dot-${index}`}
              style={[
                styles.chartDot,
                {
                  left: x - 3,
                  top: y - 3,
                }
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default function MarketScreen() {
  const [commodity, setCommodity] = useState<string>("Mustard");
  const [records, setRecords] = useState<MarketRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [where, setWhere] = useState<{ state: string; district: string } | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        // Resolve location → state + district
        let state = "Uttar Pradesh";
        let district = "Sambhal";
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const pos = await Location.getCurrentPositionAsync({});
            const list = await Location.reverseGeocodeAsync({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
            if (list.length > 0) {
              const p = list[0];
              state = p.region || state;
              district = (p.subregion || p.city || district);
            }
          }
        } catch (_) {
          // fall back to defaults above
        }

        let cleanDistrict = district.replace(/ (Division|District)$/i, "").trim();
        setWhere({ state, district: cleanDistrict });

        // Fetch market data
        let res = await getMarketData(state, cleanDistrict, commodity, 12);
        if ((!res.records || res.records.length === 0) && cleanDistrict) {
          // retry without district filter
          res = await getMarketData(state, "", commodity, 12);
        }
        if ((!res.records || res.records.length === 0) && state) {
          // final retry: nationwide for commodity
          res = await getMarketData("", "", commodity, 12);
        }
        setRecords(res.records || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load market data");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [commodity]);

  const current = records[0];
  const previous = records[1];
  const currentPrice = current ? Number(current.modal_price) : undefined;
  const previousPrice = previous ? Number(previous.modal_price) : undefined;
  const delta = currentPrice !== undefined && previousPrice !== undefined ? currentPrice - previousPrice : undefined;
  const deltaText = delta !== undefined ? `${delta >= 0 ? "+" : ""}₹${Math.abs(delta)}` : "-";
  const deltaColor = delta !== undefined && delta >= 0 ? styles.deltaUp : styles.deltaDown;

  const locationText = useMemo(() => {
    if (!where) return "Fetching location...";
    return `${where.district}, ${where.state}`;
  }, [where]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.hero}>
          <AppText weight="bold" sizeClassName="text-2xl" style={{ color: "#fff" }}>
            Market Prices
          </AppText>
          <AppText sizeClassName="text-sm" style={{ color: "#ebffe3", marginTop: 4 }}>
            {locationText}
          </AppText>

          <View style={styles.picker}>
            <Picker
              selectedValue={commodity}
              onValueChange={(v) => setCommodity(String(v))}
              dropdownIconColor="#0f3d00"
            >
              {COMMODITIES.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#0f3d00" />
            <AppText style={{ marginTop: 8 }}>Loading prices…</AppText>
          </View>
        ) : error ? (
          <View style={styles.loadingBox}>
            <AppText colorClassName="text-red-600">{error}</AppText>
          </View>
        ) : records.length === 0 ? (
          <View style={styles.loadingBox}>
            <AppText>No records found for {commodity} in this location.</AppText>
          </View>
        ) : (
          <>
            <View style={styles.currentCard}>
              <AppText weight="bold" sizeClassName="text-xl">{commodity}</AppText>
              <View style={{ height: 8 }} />
              
              {/* Price Chart */}
              <PriceChart prices={records.slice(0, 6).map(r => Number(r.modal_price))} />
              <View style={{ height: 12 }} />
              
              <AppText sizeClassName="text-sm" colorClassName="text-muted-foreground">Current Price</AppText>
              <View style={styles.currentRow}>
                <AppText weight="bold" sizeClassName="text-3xl">₹{currentPrice ?? "--"}</AppText>
                <AppText style={[styles.delta, deltaColor]}>{deltaText}</AppText>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <AppText weight="bold" sizeClassName="text-lg">Price Trends</AppText>
            </View>

            <View style={{ paddingHorizontal: 16 }}>
              {records.slice(0, 6).map((r, idx) => {
                const price = Number(r.modal_price);
                const prev = idx < records.length - 1 ? Number(records[idx + 1].modal_price) : price;
                const chg = price - prev;
                const chgText = `${chg >= 0 ? "+" : ""}₹${Math.abs(chg)}`;
                const isUp = chg >= 0;
                return (
                  <View key={`${r.market}-${idx}`} style={styles.trendItem}>
                    <View>
                      <AppText weight="bold" sizeClassName="text-base">₹{price}</AppText>
                      <AppText sizeClassName="text-xs" colorClassName="text-muted-foreground">{r.arrival_date}</AppText>
                    </View>
                    <AppText style={[styles.trendDelta, isUp ? styles.deltaUp : styles.deltaDown]}>{chgText}</AppText>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  hero: {
    backgroundColor: LIME,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 16,
    paddingBottom: 20,
  },
  picker: {
    marginTop: 12,
    backgroundColor: "#f7ffe9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#b8ff57",
    overflow: "hidden",
  },
  loadingBox: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  currentCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingVertical: 8,
  },
  chartBackground: {
    width: CHART_WIDTH,
    height: CHART_HEIGHT,
    position: "relative",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chartBar: {
    position: "absolute",
    bottom: 10,
    backgroundColor: LIME,
    opacity: 0.3,
    borderRadius: 1,
  },
  chartDot: {
    position: "absolute",
    width: 6,
    height: 6,
    backgroundColor: LIME,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  currentRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  delta: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  deltaUp: {
    backgroundColor: "#e8ffe1",
    color: "#0a7a00",
  },
  deltaDown: {
    backgroundColor: "#ffe8e8",
    color: "#b00000",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  trendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  trendDelta: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
});

