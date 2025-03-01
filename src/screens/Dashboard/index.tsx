import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components";

import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";
import { useAuth } from "../../hooks/useAuth";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighlightCardsContainer,
  Transactions,
  Title,
  TransactionsList,
  LoadingContainer,
} from "./styles";

export interface DataTransactionListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransition: string;
}

interface HighlightData {
  incomes: HighlightProps;
  outcomes: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataTransactionListProps[]>(
    []
  );
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );

  const theme = useTheme();
  const { signOut, user } = useAuth();

  function getLastTransactionDate(
    collection: DataTransactionListProps[],
    type: "income" | "outcome"
  ) {
    const collectionFilttered = collection.filter(
      (transaction) => transaction.type === type
    );

    console.log(type, collectionFilttered);

    if (collectionFilttered.length === 0) return 0;

    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collectionFilttered.map((transaction) =>
          new Date(transaction.date).getTime()
        )
      )
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      "pt-BR",
      { month: "long" }
    )}`;
  }

  async function loadTransactions() {
    const collectionKey = `@myfinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(collectionKey);

    const transactions = response ? JSON.parse(response) : [];

    let incomesTotal = 0;
    let outcomesTotal = 0;

    const transactionsFormatted: DataTransactionListProps[] = transactions.map(
      (item: DataTransactionListProps) => {
        if (item.type === "income") {
          incomesTotal += Number(item.amount);
        } else {
          outcomesTotal += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          category: item.category,
          amount,
          type: item.type,
          date,
        };
      }
    );

    const lastTransitionIncome = getLastTransactionDate(transactions, "income");
    const lastTransitionOutcome = getLastTransactionDate(
      transactions,
      "outcome"
    );
    const totalInterval = `01 a ${lastTransitionOutcome}`;

    const total = incomesTotal - outcomesTotal;

    setHighlightData({
      incomes: {
        amount: incomesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransition: `Última entrada dia ${lastTransitionIncome}`,
      },
      outcomes: {
        amount: outcomesTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransition: `Última saída dia ${lastTransitionOutcome}`,
      },
      total: {
        amount: total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransition: totalInterval,
      },
    });
    setTransactions(transactionsFormatted);

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.secondary} size="large" />
        </LoadingContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user.photo,
                  }}
                />
                <User>
                  <UserGreeting>Olá, </UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCardsContainer>
            <HighlightCard
              type="income"
              title="Entradas"
              amount={highlightData.incomes.amount}
              lastTransition={highlightData.incomes.lastTransition}
            />
            <HighlightCard
              type="outcome"
              title="Saídas"
              amount={highlightData.outcomes.amount}
              lastTransition={highlightData.outcomes.lastTransition}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransition={highlightData.total.lastTransition}
            />
          </HighlightCardsContainer>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
