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