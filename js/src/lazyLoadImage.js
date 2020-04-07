export default (walletName, imgName, img) => {
  import(
    /* webpackMode: "lazy-once" */
    `./img/paper/${walletName}/${imgName}.png`
  )
  .then(src => img.src = src.default)
  .catch(err => console.error(err));
}
