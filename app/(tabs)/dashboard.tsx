// import { View, Text } from "react-native"

// export default function Dashboard() {
//     return (
//         <View>
//             <Text className="text-5xl text-red-600">Ist es in DASHBOARD!!!</Text>
//         </View>
//     )
// }

// app/tabs/dashboard.tsx
import { AppText } from "@/components/AppText";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useAuth } from "../context/Authcontext";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const [city, setCity] = useState<string>("Loading...");
  const [stateName, setStateName] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setCity("Location off");
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        const res = await fetch(url, { headers: { "User-Agent": "sih-frontend/1.0" } });
        const data = await res.json();
        const address = data?.address || {};
        const cityName = address.city || address.town || address.village || address.county || "Unknown";
        const stateVal = address.state || address.region || "";
        setCity(String(cityName).toUpperCase());
        setStateName(String(stateVal));
      } catch {
        setCity("Unknown");
        setStateName("");
      }
    };
    run();
  }, []);

  const month = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const days: number[] = [];
    for (let d = 1; d <= end.getDate(); d++) days.push(d);
    const startWeekday = start.getDay() === 0 ? 7 : start.getDay();
    return {
      days,
      startOffset: startWeekday - 1,
      label: `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`,
    };
  }, []);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const todayDate = useMemo(() => new Date().getDate(), []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Greeting */}
      <AppText weight="bold" sizeClassName="text-2xl" colorClassName="text-foreground" style={{ marginBottom: 6, color: "#9AF300", fontWeight: "700" }}>
        Hi, {user?.name ? user.name.split(" ")[0] : "Farmer"}!
      </AppText>
      <AppText sizeClassName="text-sm" colorClassName="text-muted-foreground" style={{ marginBottom: 12 }}>
        What do you want to do today?
      </AppText>

      {/* Shortcuts */}
      <View style={styles.shortcutRow}>
        {shortcuts.map((s) => (
          <Pressable key={s.label} onPress={() => s.onPress?.(router)} style={styles.shortcut}>
            <Image source={s.icon} style={styles.shortcutIcon} resizeMode="contain" />
            <AppText sizeClassName="text-xs" style={{ textAlign: "center", marginTop: 6 }}>{s.label}</AppText>
          </Pressable>
        ))}
      </View>

      {/* Location + Alerts */}
      <View style={styles.cardsRow}>
        <View style={[styles.cardBox, styles.locationCard]}>
          <AppText weight="bold" sizeClassName="text-base" style={{ marginBottom: 4 }}>📍 Live Location</AppText>
          <AppText weight="bold" sizeClassName="text-lg" style={{ marginBottom: 8 }}>{city}{stateName ? `, ${stateName}` : ""}</AppText>
          <AppText sizeClassName="text-sm">30°C</AppText>
          <AppText sizeClassName="text-sm">Humidity 65%</AppText>
          <AppText sizeClassName="text-sm">Rain 40%</AppText>
        </View>
        <View style={[styles.cardBox, styles.alertCard]}>
          <AppText weight="bold" sizeClassName="text-base" style={{ marginBottom: 4 }}>⚠️ ALERTS</AppText>
          <AppText sizeClassName="text-sm">• Flood warning in your area</AppText>
          <AppText sizeClassName="text-sm" style={{ marginBottom: 8 }}>• Tomato price surge in Noida Mandi</AppText>
          <Pressable style={styles.readMoreBtn}><AppText weight="bold" sizeClassName="text-xs" style={{ color: "#fff" }}>Read more</AppText></Pressable>
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.calendarBox}>
        <View style={styles.calendarHeader}>
          <AppText weight="bold" sizeClassName="text-base">{month.label}</AppText>
          <View style={{ flexDirection: "row" }}>
            <Pressable style={styles.navPill}><AppText weight="bold">‹</AppText></Pressable>
            <Pressable style={styles.navPill}><AppText weight="bold">›</AppText></Pressable>
          </View>
        </View>
        <View style={styles.weekRow}>
          {["Mo","Tu","We","Th","Fr","Sa","Su"].map((d) => (
            <AppText key={d} sizeClassName="text-xs" style={styles.weekCell}>{d}</AppText>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {Array.from({ length: month.startOffset }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.dayCell} />
          ))}
          {month.days.map((d) => {
            const selected = selectedDay === d;
            const isToday = d === todayDate;
            return (
              <Pressable
                key={d}
                onPress={() => setSelectedDay(d)}
                style={[
                  styles.dayCell,
                  selected && styles.daySelected,
                  isToday && styles.dayToday,
                ]}
              >
                <AppText
                  weight={selected || isToday ? "bold" : "regular"}
                  style={{ color: isToday ? "#ffffff" : selected ? "#0EA5E9" : undefined }}
                >
                  {d}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Floating help button */}
      <Pressable style={styles.fab} onPress={() => {}}>
        <AppText weight="bold" style={{ color: "#fff" }}>💬</AppText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  shortcutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  shortcut: {
    width: "19%",
    alignItems: "center",
  },
  shortcutIcon: {
    width: 48,
    height: 48,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  cardBox: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    backgroundColor: "#fff",
  },
  locationCard: {
    borderWidth: 1,
    borderColor: "#9AF300",
  },
  alertCard: {
    borderWidth: 1,
    borderColor: "#9AF300",
  },
  readMoreBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#22C55E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  calendarBox: {
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#9AF300",
    padding: 12,
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  navPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  weekCell: {
    width: `${100 / 7}%`,
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    marginVertical: 2,
  },
  daySelected: {
    backgroundColor: "#E0F2FE",
    borderWidth: 1,
    borderColor: "#0EA5E9",
  },
  dayToday: {
    backgroundColor: "#60E7FF",
    borderWidth: 0,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
});

const shortcuts = [
  {
    label: "Check Weather",
    icon: require("../../assets/check_weather_feature_icon.png"),
    onPress: (router: any) => router.push("/(tabs)/weather"),
  },
  {
    label: "Check Market Prices",
    icon: require("../../assets/check_market_prices_icon.png"),
    onPress: undefined,
  },
  {
    label: "Get Fertilizer Tips",
    icon: require("../../assets/get_fertilizer_tips_icon.png"),
    onPress: (router: any) => router.push("/(tabs)/cropRecommendation"),
  },
  {
    label: "Detect Pests/ Diseases",
    icon: require("../../assets/detect_pests_diseases_icon.png"),
    onPress: (router: any) => router.push("/(tabs)/pestDetection"),
  },
  {
    label: "AI Farming Advice",
    icon: require("../../assets/ai_farming_advice_icon.png"),
    onPress: undefined,
  },
] as const;
