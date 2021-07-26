import "./App.css";
import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import Header from "./components/Header/Header";
import Service from "./components/Service/Service";
import Chart from "./components/Chart/Chart";
import Loader from "./components/Loader/Loader";

const STATUS_ENUM = {
  ALL_OPERATIONAL: 0,
  ALL_DEGRADED: 1,
  ALL_OFFLINE: 2,
  SOME_DEGRADED: 3,
  SOME_OFFLINE: 4,
};

const App = () => {
  let [services, setServices] = useState(null);
  let [selectedService, setSelectedService] = useState(null);
  let [lastUpdate, setLastUpdate] = useState(null);
  let [globalStatus, setGlobalStatus] = useState(null);

  const setFavicon = (icon) => {
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }
    link.href = "/" + icon + ".svg";
  };

  useEffect(() => {
    if (!services) return;

    let status = {
      online: 0,
      degraded: 0,
      offline: 0,
    };

    for (let service of services) {
      status[service.status] += 1;
    }

    let servicesCount = services.length;
    if (status.online === servicesCount) {
      setFavicon("online");
      setGlobalStatus(STATUS_ENUM.ALL_OPERATIONAL);
    } else if (status.degraded === servicesCount) {
      setFavicon("degraded");
      setGlobalStatus(STATUS_ENUM.ALL_DEGRADED);
    } else if (status.offline === servicesCount) {
      setFavicon("offline");
      setGlobalStatus(STATUS_ENUM.ALL_OFFLINE);
    } else if (status.offline > 0) {
      setFavicon("offline");
      setGlobalStatus(STATUS_ENUM.SOME_OFFLINE);
    } else if (status.degraded > 0) {
      setFavicon("degraded");
      setGlobalStatus(STATUS_ENUM.SOME_DEGRADED);
    }

    ReactTooltip.rebuild();
  }, [services]);

  useEffect(() => {
    const fetchStatus = () => {
      fetch("/services")
        .then((response) => response.json())
        .then((response) => {
          if (response.lastUpdate !== lastUpdate) {
            setLastUpdate(response.lastUpdate);
            setServices(response.services);
          }
        });
    };
    fetchStatus();
    let interval = setInterval(
      fetchStatus,
      process.env.REACT_APP_INTERVAL || 5000
    );

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, []);

  const selectService = (service) => {
    if (selectedService && service.name === selectedService.name) {
      setSelectedService(null);
    } else {
      setSelectedService(service);
    }
  };

  return services ? (
    <div className="app">
      <Header status={globalStatus} lastUpdate={lastUpdate}></Header>
      {selectedService && <Chart service={selectedService}></Chart>}
      <div className="services">
        {services.map((service) => {
          return (
            <Service
              key={service.name}
              onClick={(service) => {
                selectService(service);
              }}
              service={service}
              selectedService={selectedService}
            ></Service>
          );
        })}
      </div>
      <ReactTooltip multiline={true} />
    </div>
  ) : (
    <Loader></Loader>
  );
};

export default App;
