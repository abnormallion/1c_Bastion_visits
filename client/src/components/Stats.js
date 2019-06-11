import React, { Component } from "react";
import { Segment, Statistic, Header, Label } from "semantic-ui-react";

import { subscribeToStatsData, subscribeToStatsDataOnce } from "./api";

class Stats extends Component {
  state = {
    breakfast: {
      planVisit: 0,
      factVisit: 0,
      start: "",
      end: ""
    },
    dinner: {
      planVisit: 0,
      factVisit: 0,
      start: "",
      end: ""
    },
    supper: {
      planVisit: 0,
      factVisit: 0,
      start: "",
      end: ""
    }
  };

  componentDidMount() {
    subscribeToStatsDataOnce((err, result) => {
      // console.log(result);

      this.setState({
        breakfast: result.breakfast,
        dinner: result.dinner,
        supper: result.supper
      });
    });
    subscribeToStatsData((err, result) => {
      // console.log(result);

      this.setState({
        breakfast: result.breakfast,
        dinner: result.dinner,
        supper: result.supper
      });
    });
  }

  render() {
    return (
      <div>
        <Segment size="massive">
          <Header as="h2">Завтрак</Header>

          <Label attached="top right" size="large">
            {this.state.breakfast.start}-{this.state.breakfast.end}
          </Label>
          <Statistic.Group widths="two">
            <Statistic size="huge">
              <Statistic.Label>Факт</Statistic.Label>
              <Statistic.Value>
                {this.state.breakfast.factVisit}
              </Statistic.Value>
            </Statistic>
            <Statistic>
              <Statistic.Label>План</Statistic.Label>
              <Statistic.Value>
                {this.state.breakfast.planVisit}
              </Statistic.Value>
            </Statistic>
          </Statistic.Group>
        </Segment>
        <Segment secondary size="massive">
          <Header as="h2">Обед</Header>
          <Label attached="top right" size="large">
            {this.state.dinner.start}-{this.state.dinner.end}
          </Label>
          <Statistic.Group widths="two">
            <Statistic size="huge">
              <Statistic.Label>Факт</Statistic.Label>
              <Statistic.Value>{this.state.dinner.factVisit}</Statistic.Value>
            </Statistic>
            <Statistic>
              <Statistic.Label>План</Statistic.Label>
              <Statistic.Value>{this.state.dinner.planVisit}</Statistic.Value>
            </Statistic>
          </Statistic.Group>
        </Segment>
        <Segment tertiary size="massive">
          <Header as="h2">Ужин</Header>
          <Label attached="top right" size="large">
            {this.state.supper.start}-{this.state.supper.end}
          </Label>
          <Statistic.Group widths="two">
            <Statistic size="huge">
              <Statistic.Label>Факт</Statistic.Label>
              <Statistic.Value>{this.state.supper.factVisit}</Statistic.Value>
            </Statistic>
            <Statistic>
              <Statistic.Label>План</Statistic.Label>
              <Statistic.Value>{this.state.supper.planVisit}</Statistic.Value>
            </Statistic>
          </Statistic.Group>
        </Segment>
      </div>
    );
  }
}

export default Stats;
