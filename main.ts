import MiniRouter from "./src/router";

const router = new MiniRouter();

router.on(
  (_, info) => info.isSearchChanged,
  (url) => {
    console.log("url-search", url);
  }
);

const navBtn = document.getElementById("nav-btn") as HTMLElement;
const navInput = document.getElementById("nav-input") as HTMLInputElement;

navBtn.addEventListener("click", () => {
  router.push(navInput.value);
  //router.navigate(navInput.value);
});
