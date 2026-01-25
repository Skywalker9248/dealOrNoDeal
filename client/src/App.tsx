import GameProvider from "../provider/gameProvider";
import GameContainer from "./components/gameContainer";

function App() {
  // useEffect(() => {
  //   axios.get("http://localhost:3000/");
  // }, []);

  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
}

export default App;
