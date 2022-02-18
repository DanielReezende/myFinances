import React, { useState } from "react";

import { Input } from "../../components/Form/Input";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelect } from "../../components/Form/CategorySelect";

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from "./styles";

export function Register () {
  const [transactionType, setTransactionType] = useState<"income" | "outcome" | null>(null);

  function handleTransactionTypeSelect(type: 'income' | 'outcome'){
    setTransactionType(type);
  }

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <Input placeholder="Nome" />
          <Input placeholder="Preço" />
          <TransactionsTypes>
            <TransactionTypeButton
              type="income"
              title="Income"
              isActive={transactionType === "income"}
              onPress={() => handleTransactionTypeSelect("income")}
            />
            <TransactionTypeButton
              type="outcome"
              title="Outcome"
              isActive={transactionType === "outcome"}
              onPress={() => handleTransactionTypeSelect("outcome")}
            />
          </TransactionsTypes>
          <CategorySelect title="Categoria"/>
        </Fields>

        <Button title="Enviar" />
      </Form>
    </Container>
  );
}