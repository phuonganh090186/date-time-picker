import React from "react";
import "./style.scss";
import TimeImage from "assets/images/access_time.svg";

interface Props {
  title: string;
  value?: string;
  placeholder?: string;
  type?: "date" | "time";
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const PickerDock = ({ title, value, type, onClick }: Props) => {
  return (
    <div className="docked-button" onClick={onClick}>
      <fieldset className="docked-field">
        <legend className="docked-label">{title}</legend>
        <div className="docked-value">
          <span>{value}</span>
          {type === "time" && <img src={TimeImage} alt="icon" />}
        </div>
      </fieldset>
    </div>
  );
};

export { PickerDock };
