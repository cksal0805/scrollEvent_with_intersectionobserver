import dummyData from "./dummyData.js";

class SimpleElement {
  constructor($target, name) {
    this.$divElement = document.createElement('div');
    this.$divElement.className = 'div_wrapper';
    this.name = name;
    $target.appendChild(this.$divElement);
    this.render();
  }
  render() {
    console.log(this.name);
    this.$divElement.innerHTML = dummyData.map((v, i) => 
      `<img class="${this.name}" key="${v.id}" data-src="${v.src}" />`).join('')
  }
}

export default SimpleElement;