import React from "react";
import ArrowDropDown from "assets/images/arrow_drop_down.svg";
import ArrowDropUp from "assets/images/arrow_drop_up.svg";
import "./styles/year-dropdown.scss";

export interface YearDropdownItem {
  id: number;
  key?: string;
  name?: string;
}

interface Props {
  options: YearDropdownItem[];
  selectedIndex: number;
  title: string;
  onChange: (index: number, option: YearDropdownItem) => void;
}

interface State {
  isExpand: boolean;
}

class YearDropdown extends React.Component<Props, State> {
  myRef = React.createRef<HTMLDivElement>();

  static defaultProps = {
    selectedIndex: 0,
    className: "",
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event: MouseEvent) => {
    if (this.myRef && !this.myRef.current?.contains(event.target as Node)) {
      this.setState({ isExpand: false });
    }
  };

  state: State = {
    isExpand: false,
  };

  handleClickOption = (index: number, option: YearDropdownItem) => {
    this.setState({ isExpand: false });
    this.props.onChange(index, option);
  };

  onExpand = () => {
    const { isExpand } = this.state;

    this.setState({
      isExpand: !isExpand,
    });
  };

  chunkOptions = (options: YearDropdownItem[]) => {
    const chunks = [];
    let i = 0;

    while (i < options.length) {
      chunks.push(options.slice(i, (i += 3)));
    }
    return chunks;
  };

  render() {
    const { options, title, selectedIndex } = this.props;
    const { isExpand } = this.state;

    const optionsHtml = this.chunkOptions(options).map(
      (chunk: YearDropdownItem[], index: number) => (
        <div className="dropdown-option-row" key={index}>
          {chunk.map((option: YearDropdownItem, _chunkIdx: number) => (
            <div
              className={`dropdown-option-item ${
                option.id === selectedIndex ? "selected" : ""
              } `}
              key={option.id}
              onClick={() => this.handleClickOption(option.id, option)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )
    );

    return (
      <div className="dropdown" ref={this.myRef}>
        <div className="dropdown-button" onClick={this.onExpand}>
          <span className="dropdown-title">{title}</span>
          <span className="dropdown-icon">
            {isExpand ? (
              <img src={ArrowDropUp} alt="icon-up" />
            ) : (
              <img src={ArrowDropDown} alt="icon-down" />
            )}
          </span>
        </div>

        {isExpand ? (
          <div className={`dropdown-content`}>{optionsHtml}</div>
        ) : null}
      </div>
    );
  }
}

export { YearDropdown };
