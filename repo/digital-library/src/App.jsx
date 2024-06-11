import AppRoute from "routes/appRoute";
import { Promptalert } from "components";

const App = () => {
  return (
    <div className="App vh-100">
      <Promptalert />
      <AppRoute />
    </div>
  );
};

export default App;
