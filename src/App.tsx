import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { Game, Results, Welcome } from './components';
import { useGameContext } from './context';

function App() {
  const { isGameStarted, isResultAvailable } = useGameContext();

  return (
    <SwitchTransition>
      <CSSTransition
        key={
          !isGameStarted ? 'welcome' : isResultAvailable ? 'results' : 'game'
        }
        in={true}
        timeout={200}
        classNames="fade"
      >
        <div className="App">
          {!isGameStarted ? <Welcome /> : null}
          {isResultAvailable ? <Results /> : null}
          {isGameStarted && !isResultAvailable ? <Game /> : null}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
}

export default App;
