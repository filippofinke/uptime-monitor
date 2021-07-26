import "./Chart.css";
import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import Loader from "../Loader/Loader";

const Chart = (props) => {
  let [history, setHistory] = useState(null);

  useEffect(() => {
    const fetchStatus = () => {
      let width = document.getElementsByClassName("chart")[0].offsetWidth;
      let count = Math.floor(width / 11);

      fetch("/service/" + props.service.name + "?count=" + count)
        .then((response) => response.json())
        .then((response) => {
          setHistory(response);
        });
    };

    fetchStatus();
    let interval = setInterval(
      fetchStatus,
      process.env.REACT_APP_INTERVAL || 5000
    );

    return () => {
      clearInterval(interval);
      setHistory(null);
    };
  }, [props.service.name]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [history]);

  return (
    <div className="chart-container">
      {!history && <Loader></Loader>}
      <h4>History of {props.service.name}</h4>
      <div className="chart">
        {history &&
          history.map(({ timestamp, ms, statusText, status }) => {
            let max = Math.max.apply(
              Math,
              history.map((h) => Number(h.ms))
            );
            let height = (100 / max) * ms + "%";

            let date = new Date(timestamp).toLocaleString();

            let tipText = date + "<br />" + statusText;
            if (ms) {
              tipText += "<br />" + ms + " ms";
            }

            return (
              <span
                key={timestamp}
                style={{ height }}
                data-place="top"
                data-effect="solid"
                data-tip={tipText}
                className={"bar " + status}
              ></span>
            );
          })}
      </div>
    </div>
  );
};

export default Chart;
