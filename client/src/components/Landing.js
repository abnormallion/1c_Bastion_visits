import React from "react";
import { Segment, Statistic, Header } from "semantic-ui-react";

const Landing = () => {
  return (
    <div>
      <Segment size="massive" padded="very">
        <Header as="h2">Завтрак</Header>
        <Statistic.Group widths="two">
          <Statistic size="huge">
            <Statistic.Label>Факт</Statistic.Label>
            <Statistic.Value>305</Statistic.Value>
          </Statistic>
          <Statistic>
            <Statistic.Label>План</Statistic.Label>
            <Statistic.Value>350</Statistic.Value>
          </Statistic>
        </Statistic.Group>
      </Segment>
      <Segment secondary size="massive" padded="very">
        <Header as="h2">Обед</Header>
        <Statistic.Group widths="two">
          <Statistic size="huge">
            <Statistic.Label>Факт</Statistic.Label>
            <Statistic.Value>305</Statistic.Value>
          </Statistic>
          <Statistic>
            <Statistic.Label>План</Statistic.Label>
            <Statistic.Value>350</Statistic.Value>
          </Statistic>
        </Statistic.Group>
      </Segment>
      <Segment tertiary size="massive" padded="very">
        <Header as="h2">Ужин</Header>
        <Statistic.Group widths="two">
          <Statistic size="huge">
            <Statistic.Label>Факт</Statistic.Label>
            <Statistic.Value>305</Statistic.Value>
          </Statistic>
          <Statistic>
            <Statistic.Label>План</Statistic.Label>
            <Statistic.Value>350</Statistic.Value>
          </Statistic>
        </Statistic.Group>
      </Segment>
    </div>
  );
};

export default Landing;
