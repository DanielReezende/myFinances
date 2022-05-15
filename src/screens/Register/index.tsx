import React, { useState } from "react";
import { Modal, Keyboard, Alert } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'

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
import { useAuth } from "../../hooks/useAuth";

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('O campo Nome é obrigatório.'),
  amount: Yup.number()
    .typeError('Informe um valor númerico')
    .required('O campo Preço é obrigatório.')
    .positive('O valor informado deve ser positivo')
})

export function Register () {
  const [transactionType, setTransactionType] = useState<"income" | "outcome" | null>(null);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  })
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  

  const { control, reset, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const navigation = useNavigation()

  const { user } = useAuth();


  function handleTransactionTypeSelect(type: 'income' | 'outcome'){
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }
  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  async function handleRegister(form: FormData) {
    if(!transactionType) return Alert.alert('Selecione o Tipo da Transação');

    if(category.key === 'category') return Alert.alert('Selecione a Categoria')

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    }

    try {
      const collectionKey = `@myfinances:transactions_user:${user.id}`;
      const data = await AsyncStorage.getItem(collectionKey);
      const currentData = data ? JSON.parse(data) : []

      const dataFormatted = [
        ...currentData,
        newTransaction,
      ];

      await AsyncStorage.setItem(collectionKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType(null);
      setCategory({
        key: "category",
        name: "Categoria",
      });

      navigation.navigate('Listagem')

    } catch (error) {
      console.log('Error: ', error);

      Alert.alert("Não foi possível salvar");
    }
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
                title="Entrada"
                isActive={transactionType === "income"}
                onPress={() => handleTransactionTypeSelect("income")}
              />
              <TransactionTypeButton
                type="outcome"
                title="Saída"
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