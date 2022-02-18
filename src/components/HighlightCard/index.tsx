import React from 'react';

import { 
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransition
} from './styles';

interface HighlightCardProps {
  type: 'income' | 'outcome' | 'total';
  title: string;
  amount: string;
  lastTransition: string;
}

const icon = {
  income: 'arrow-up-circle',
  outcome: 'arrow-down-circle',
  total: 'dollar-sign'
}

export function HighlightCard({ type, title, amount, lastTransition }: HighlightCardProps) {
  return (
    <Container type={type}>
      <Header>
        <Title type={type}>{ title }</Title>
        <Icon name={icon[type]} type={type}/>
      </Header>
      <Footer>
        <Amount type={type}>{amount}</Amount>
        <LastTransition type={type}>{lastTransition}</LastTransition>
      </Footer>
    </Container>
  );
}

