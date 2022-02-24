import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import { Container, Button, Icon, Title } from "./styles";


const icons = {
  income: 'arrow-up-circle',
  outcome: 'arrow-down-circle',
}

interface Props extends RectButtonProps {
  title: string;
  type: "income" | "outcome";
  isActive: boolean;
}

export function TransactionTypeButton({ title, isActive, type, ...rest }: Props) {
  return (
    <Container isActive={isActive} type={type}>
      <Button {...rest}>
        <Icon name={icons[type]} type={type} />
        <Title>{title}</Title>
      </Button>
    </Container>
  );
}
