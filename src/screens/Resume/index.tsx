import React, { useCallback, useEffect, useState } from "react";
import { Alert, ActivityIndicator } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from "victory-native";
import { subMonths, addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { HistoryCard } from "../../components/HistoryCard";

import { useFocusEffect } from "@react-navigation/native";
import { categories } from "../../utils/categories";

import {
  Container,
  LoadingContainer,
  Content,
  Header,
  MonthSelect,
  MonthSelectButton,
  Month,
  MonthSelectIcon,
  Title,
  ChartContainer,
} from "./styles";

interface TransactionData {
  id: string;
  type: "income" | "outcome";
  name: string;
  amount: string;
  category: String;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );

  const theme = useTheme();

  async function loadData() {
    try {
      setIsLoading(true);
      const collectionKey = "@myfinances:transactions";
      const response = await AsyncStorage.getItem(collectionKey);
      const responseFormatted = response ? JSON.parse(response) : [];

      const outcomes = responseFormatted.filter(
        (transaciton: TransactionData) =>
          transaciton.type === "outcome" &&
          new Date(transaciton.date).getMonth() === selectedDate.getMonth() &&
          new Date(transaciton.date).getFullYear() ===
            selectedDate.getFullYear()
      );

      const outcomesTotal = outcomes.reduce(
        (total: number, outcome: TransactionData) => {
          return total + Number(outcome.amount);
        },
        0
      );

      const totalByCategory: CategoryData[] = [];

      categories.forEach((category) => {
        let categorySum = 0;

        outcomes.forEach((item: TransactionData) => {
          if (item.category === category.key) {
            categorySum += Number(item.amount);
          }
        });

        const totalFormatted = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        if (categorySum > 0) {
          const percent = `${((categorySum / outcomesTotal) * 100).toFixed(
            0
          )}%`;

          totalByCategory.push({
            key: category.key,
            name: category.name,
            total: categorySum,
            totalFormatted,
            color: category.color,
            percent,
          });
        }
      });

      setTotalByCategories(totalByCategory);
      setIsLoading(false);
      console.log(totalByCategory);
    } catch (error) {
      console.log("Error: ", error);

      Alert.alert("Não foi possível recuperar os dados");
    }
  }

  function handleDateChange(action: "next" | "previous") {
    

    if (action === "next") {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por Categoria</Title>
      </Header>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.secondary} size="large" />
        </LoadingContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange("previous")}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
              {format(selectedDate, "MMMM, yyyy", { locale: ptBR })}
            </Month>

            <MonthSelectButton onPress={() => handleDateChange("next")}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              x="percent"
              y="total"
              style={{
                labels: {
                  fontSize: RFValue(20),
                  fontWeight: "bold",
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={50}
              colorScale={totalByCategories.map((category) => category.color)}
            />
          </ChartContainer>

          {totalByCategories.map((item) => (
            <HistoryCard
              key={item.key}
              title={item.name}
              amount={item.totalFormatted}
              color={item.color}
            />
          ))}
        </Content>
      )}
    </Container>
  );
}
