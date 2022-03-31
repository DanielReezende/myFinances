import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

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
} from "./styles";

export interface DataTransactionListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const [data, setData] = useState<DataTransactionListProps[]>([]);

    

  async function loadTransactions() {
    const collectionKey = "@myfinances:transactions";
    const response = await AsyncStorage.getItem(collectionKey);

    const transactions = response ? JSON.parse(response) : [];

    const transactionsFormatted: DataTransactionListProps[] =  transactions
      .map((item: DataTransactionListProps) => {
        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        const date =  Intl.DateTimeFormat("pt-BR", {
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
      })

    setData(transactionsFormatted);
  }

  useEffect(() => {

  }, [])

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{
                uri: "https://avatars.githubusercontent.com/u/38768631?v=4",
              }}
            />
            <User>
              <UserGreeting>Olá, </UserGreeting>
              <UserName>Daniel</UserName>
            </User>
          </UserInfo>

          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>

      <HighlightCardsContainer>
        <HighlightCard
          type="income"
          title="Entradas"
          amount="R$ 3.000,00"
          lastTransition="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="outcome"
          title="Saídas"
          amount="R$ 1.500,00"
          lastTransition="Última sáida dia 13 de abril"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount="R$ 1.500,00"
          lastTransition="01 à 16 de abril"
        />
      </HighlightCardsContainer>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionsList
          data={data}
          keyExtractor = {item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}
