import "./Service.css";
import React from "react";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillExclamationCircle,
} from "react-icons/ai";

const Service = (props) => {
  let service = props.service;
  let selectedService = props.selectedService;

  let icon;
  switch (service.status) {
    case "online":
      icon = <AiFillCheckCircle></AiFillCheckCircle>;
      break;
    case "offline":
      icon = <AiFillCloseCircle></AiFillCloseCircle>;
      break;
    default:
      icon = <AiFillExclamationCircle></AiFillExclamationCircle>;
  }

  let tipText = service.statusText;
  if (service.ms) {
    tipText += "<br />" + service.ms + " ms";
  }

  let selected = "";
  if (selectedService && service.name === selectedService.name) {
    selected = "selected";
  }

  return (
    <div
      style={props.style}
      onClick={() => {
        props.onClick(service);
      }}
      data-tip={tipText}
      className={`service ${selected}`}
    >
      <div className={`status ${service.status} pulse`}>{icon}</div>
      <h3>{service.name}</h3>
    </div>
  );
};

export default Service;
