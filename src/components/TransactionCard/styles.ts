import styled from 'styled-components/native';
import {  RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";


interface TransactionProps {
  type: "income" | "outcome";
}

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 5px;

  padding: 17px 24px;
  margin-bottom: 18px;
`;


export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};

  color: ${({ theme }) => theme.colors.title};
`;

export const Amount = styled.Text<TransactionProps>`
  font-size: ${RFValue(20)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme, type }) => type === 'income' ? theme.colors.success : theme.colors.attention};

  margin-top: 2px;
`;

export const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-top: 18px;
`;

export const Category = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CategoryIcon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const CategoryName = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};

  margin-left: 17px;

  color: ${({ theme }) => theme.colors.text};
`;

export const Date = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text};
`;
