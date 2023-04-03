import React from "react";
import axios from "axios";

export default class InvestigationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      investigations: []
    };
  }

  componentDidMount() {
    axios({
      method: "get",
      baseURL: "http://localhost:8000/",
      url: "/investigations"
    }).then(res => {
      const inv = res.data;
      this.setState({ investigations: inv });
    }).catch(error => {
      console.log("Couldn't fetch: ", error.message)
    })
  }

  render() {
    return (
      <ul>
        {
          this.state.investigations
            .map(inv =>
              <li key={inv.id}>{inv.name}</li>
            )
        }
      </ul>
    )
  }
}
