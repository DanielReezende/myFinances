import React, { useState } from "react";
import { Modal, Keyboard, Alert } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputForm } from "../../components/Form/InputForm";
import { Button } from "../../components/Form/Button";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from "./styles";

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('O campo Nome é obrigatório.'),
  amount: Yup.number()
    .typeError('Informe um valor númerico')
    .required('O campo Nome é obrigatório.')
    .positive('O valor informado deve ser positivo')
})

export function Register () {
  const [transactionType, setTransactionType] = useState<"income" | "outcome" | null>(null);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  })
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });


  function handleTransactionTypeSelect(type: 'income' | 'outcome'){
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }
  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  function handleRegister(form: FormData) {
    if(!transactionType) return Alert.alert('Selecione o Tipo da Transação');

    if(category.key === 'category') return Alert.alert('Selecione a Categoria')

    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key
    }

    console.log(data)
  }

  return (
    <TouchableWithoutFeedback 
      onPress={Keyboard.dismiss}
      containerStyle={{ flex: 1 }} 
      style={{ flex: 1 }}
    >
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

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

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}