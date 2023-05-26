import "./App.scss";
import DatePicker from "./components/DatePicker";
import TimePicker from "./components/TimePicker";

function App() {

  return (
    <div className="App">
      <div className="Layout">
        <DatePicker />
        <br/><br/>
        <TimePicker />
      </div>
    </div>
  );
}

export default App;
