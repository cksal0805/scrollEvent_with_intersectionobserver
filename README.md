# intersectionobserver 활용하여 scroll Event 최적화 하기

동적으로 Element를 불러오는건 굉장히 중요합니다.

단순 Text일 경우 당장 성능상 불러오는 큰 이슈는 없을지 몰라도 이미지나 용량이 큰 페이지를 불러올 경우 쓸데 없는 네트워크 비용이 증가할 뿐더러 속도상 성능저하를 일으킬 확률이 굉장히 높습니다.

기존의 동적으로 Element를 불러오는 경우 해당 앨리먼트가 화면에 보이는지 알아내기 위해

**Element.getBoundingClientRect** 함수를 사용하는 경우가 많았습니다.

아래와 같은 경우 앨리먼트가 화면내에 보이는지를 알아내기 위한 코드입니다.

```js
function isInViewport(element) {
    const viewportHeight = document.documentElement.clientHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const rect = element.getBoundingClientRect();

    if (!rect.width || !rect.height) {
        return false;
    }

    var top = rect.top >= 0 && rect.top < viewportHeight;
    var bottom = rect.bottom >= 0 && rect.bottom < viewportHeight;
    var left = rect.left >= 0 && rect.left < viewportWidth;
    var right = rect.right >= 0 && rect.right < viewportWidth;

    return (top || bottom) && (left || right);
}

```

하지만 getBoundingClientRect는 치명적인 단점이 있습니다. 이 함수를 호출할때마다 브라우저는 엘리먼트는 크기와 위치값을 최신 정보로 받아오기 위해 문서를 전체 혹은 일부를 다시 그리는  Reflow가 발생합니다.

그럼 스크롤링의 경우는 어떨까요?

스크롤이벤트의 경우 현재의 높이 값을 알기 위해 **offsetTop** 을 사용하는데 이 offsetTop이 매번 정확한 값을 가져오기 위해 Reflow가 발생합니다.

### IntersectionObserver는 Reflow를 하지 않는다

✔️ 비동기적으로 실행되기 때문에 메인 스레드에 영향을 주지 않으면서 변경 사항을 관찰할 수 있습니다.

✔️ IntersectionObserverEntry의 속성을 활용하면 getBoundingClientRect()를 호출한 것과 같은 결과를 알 수 있기 때문에 따로 getBoundingClientRect() 함수를 호출할 필요가 없어 리플로우 현상을 방지할 수 있습니다.

### 그래서 어떻게 사용하는건데?

MDN에서는 IntersectionObserver를 아래와 같이 정의하고 있습니다.

> The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document’s viewport.

Intersection Observer API는 타겟 엘리먼트가 조상 엘리먼트, 또는 최상위 문서의 뷰포트(브라우저에서는 보통 브라우저의 viewport)의 교차영역에서 발생하는 변화를 비동기로 관찰하는 방법을 제공합니다.

```js
// 기본구조는 콜백함수와 옵션을 받는다.
const io = new IntersectionObserver(callback[, options])
```
Parameters
- callback
  - callback: 타겟 엘리먼트가 교차되었을 때 실행할 함수
    - entries: IntersectionObserverEntry 객체의 리스트. 배열 형식으로 반환하기 때문에 forEach를 사용해서 처리를 하거나, 단일 타겟의 경우 배열인 점을 고려해서 코드를 작성해야 합니다.
    - observer: 콜백함수가 호출되는 IntersectionObserver
- options
   - root
    - default: null, 브라우저의 viewport
    - 교차 영역의 기준이 될 root 엘리먼트. observe의 대상으로 등록할 엘리먼트는 반드시 root의 하위 엘리먼트여야 합니다.
- rootMargin
  - default: '0px 0px 0px 0px'
  - root 엘리먼트의 마진값. css에서 margin을 사용하는 방법으로 선언할 수 있고, 축약도 가능하다. px과 %로 표현할 수 있습니다. rootMargin 값에 따라 교차 영역이 확장 또는 축소된다.
- threshold
  - default: 0
  - 0.0부터 1.0 사이의 숫자 혹은 이 숫자들로 이루어진 배열로, 타겟 엘리먼트에 대한 교차 영역 비율을 의미합니다. 0.0의 경우 타겟 엘리먼트가 교차영역에 진입했을 시점에 observer를 실행하는 것을 의미하고, 1.0의 경우 타켓 엘리먼트 전체가 교차영역에 들어왔을 때 observer를 실행하는 것을 의미합니다.

### Lazy Load 에 활용하기

```js
export function lazyLoad($element) {
  const options = {
    root: null,
    rootMargin: '0px 0px 30px 0px',
    threshold: 0
  }
  document.addEventListener("DOMContentLoaded", () => {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.src = entry.target.dataset.src;
          observer.unobserve(entry.target);
        }
      })
    }, options)
    const targets = document.querySelectorAll($element);
    targets.forEach((element) => {
      io.observe(element);
    })
  })
}
```

이를 활용한 코드는 깃헙에 올려둔 코드를 참고하시길 바랍니다.

코드를 클론 하신 후 자신의 경로에서 아래 명령어로 실행시키시면 됩니다.

```python
npx serve -l 8001 
```
