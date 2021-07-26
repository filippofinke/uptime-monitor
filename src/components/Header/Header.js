import "./Header.css";
import React from "react";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillExclamationCircle,
} from "react-icons/ai";

const STATUS_ENUM = {
  ALL_OPERATIONAL: 0,
  ALL_DEGRADED: 1,
  ALL_OFFLINE: 2,
  SOME_DEGRADED: 3,
  SOME_OFFLINE: 4,
};

const Header = (props) => {
  let status;
  let icon;
  let text;

  switch (props.status) {
    case STATUS_ENUM.ALL_OPERATIONAL:
      status = "online";
      text = "All services are operational";
      icon = <AiFillCheckCircle></AiFillCheckCircle>;
      break;

    case STATUS_ENUM.ALL_DEGRADED:
      text = "All services have degraded performance";
      status = "degraded";
      icon = <AiFillExclamationCircle></AiFillExclamationCircle>;
      break;

    case STATUS_ENUM.SOME_DEGRADED:
      status = "degraded";
      icon = <AiFillExclamationCircle></AiFillExclamationCircle>;
      text = "Some services have degraded performance";
      break;

    case STATUS_ENUM.ALL_OFFLINE:
      status = "offline";
      icon = <AiFillCloseCircle></AiFillCloseCircle>;
      text = "All services are offline";
      break;

    case STATUS_ENUM.SOME_OFFLINE:
      status = "offline";
      icon = <AiFillCloseCircle></AiFillCloseCircle>;
      text = "Some services are offline";
      break;
    default:
  }

  const getTimeLabel = (date) => {
    var seconds = Math.floor((Date.now() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return "Updated a few years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return "Updated a few months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return "Updated a few days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return "Updated a few hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return "Updated a few minutes ago";
    }
    return "Updated a few seconds ago";
  };

  return (
    <div className={`header ` + status}>
      <div className="title">
        {icon}
        <h2>{text}</h2>
      </div>
      <span className="updated">{getTimeLabel(props.lastUpdate)}</span>
    </div>
  );
};

export default Header;
