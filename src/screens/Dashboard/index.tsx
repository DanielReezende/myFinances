import React from "react";

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
  const data: DataTransactionListProps[] = [
    {
      id: "1",
      type: "income",
      title: "Desenvolvimento de Site",
      amount: "R$ 12.000,00",
      category: {
        name: "Vendas",
        icon: "dollar-sign",
      },
      date: "12/02/2022",
    },
    {
      id: "2",
      type: "outcome",
      title: "Hamburgueria Pizzy",
      amount: "R$ 59,00",
      category: {
        name: "Alimentação",
        icon: "coffee",
      },
      date: "12/02/2022",
    },
    {
      id: "3",
      type: "outcome",
      title: "Aluguel da Casa",
      amount: "R$ 1.200,00",
      category: {
        name: "Aluguel",
        icon: "home",
      },
      date: "12/02/2022",
    },
  ];

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
          <Icon name="power" />
        </UserWrapper>
      </Header>

      <HighlightCardsContainer>
        <HighlightCard
          type="up"
          title="Entradas"
          amount="R$ 3.000,00"
          lastTransition="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="down"
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
