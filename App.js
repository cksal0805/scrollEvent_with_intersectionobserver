import SimpleElement from "./SimpleElement.js";
import { lazyLoad } from "./utils/lazyLoad.js";

class App {
  constructor($App) {
    console.log($App);
    this.SimpleElement = new SimpleElement($App,'image');
    lazyLoad('.image');
  }
}

export default App;